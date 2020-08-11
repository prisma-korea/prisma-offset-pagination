
interface Props<T> {
  page: number;
  pageInfo: {
    currentPage: number;
    size: number;
    totalCount: number;
    totalPages: number;
  };
  model: T;
  findManyArgs: any;
  prisma: any;
}

export interface PageCursorType {
  cursor: string;
  page: number;
  isCurrent: boolean;
}

// Returns an opaque cursor for a page.
export async function pageToCursorObject({
  page,
  pageInfo,
  model,
  findManyArgs,
  prisma,
}: Props<typeof model>): Promise<PageCursorType> {
  const { currentPage, size, totalCount, totalPages } = pageInfo;
  let cursorId: number | string;
  const prismaModel = prisma[model.name.toLowerCase()];

  // first
  if (page === 1) {
    let findManyArgsForFirst;
    if (findManyArgs?.orderBy) {
      const { orderBy } = findManyArgs;
      findManyArgsForFirst = { ...findManyArgsForFirst, orderBy: { ...orderBy } };
    }
    if (findManyArgs?.where) {
      const { where } = findManyArgs;
      findManyArgsForFirst = { ...findManyArgsForFirst, where: { ...where } };
    }
    const result = await prismaModel.findMany({
      ...findManyArgsForFirst,
      take: 1,
    });
    cursorId = result[0].id;

    // last
  } else if (page === totalPages) {
    let findManyArgsForLast;
    if (findManyArgs?.orderBy) {
      const orderByKey = Object.keys(findManyArgs.orderBy)[0];
      const orderDirection = findManyArgs.orderBy[orderByKey] === 'asc' ? 'desc' : 'asc';
      findManyArgsForLast = {
        ...findManyArgsForLast,
        orderBy: {
          [orderByKey]: orderDirection,
        },
      };
    } else {
      findManyArgsForLast = {
        ...findManyArgsForLast,
        orderBy: {
          id: 'desc',
        },
      };
    }
    if (findManyArgs?.where) {
      const { where } = findManyArgs;
      findManyArgsForLast = { ...findManyArgsForLast, where: { ...where } };
    }
    const itemsOnTheLastPage =
    totalCount % size !== 0
      ? totalCount % size
      : size;
    const result = await prismaModel.findMany({
      ...findManyArgsForLast,
      skip: itemsOnTheLastPage - 1,
      take: 1,
    });
    cursorId = result[0].id;

    // around & previous
  } else {
    const distance = (page - currentPage) * size;
    const takeSkipArgs = {
      take: distance < 0 ? -1 : 1,
      skip: distance < 0 ? distance * -1 : distance,
    };
    const result = await prismaModel.findMany({
      ...findManyArgs,
      ...takeSkipArgs,
    });
    cursorId = result[0].id;
  }

  return {
    cursor: Buffer.from('saltysalt'.concat(String(cursorId))).toString('base64'),
    page,
    isCurrent: currentPage === page,
  };
}
