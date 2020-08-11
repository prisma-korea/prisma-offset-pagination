import { PageCursorType, pageToCursorObject } from './cursorObject';

interface Props<T> {
  start: number;
  end: number;
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

// Returns an array of PageCursor objects
// from start to end (page numbers).
export async function pageCursorsToArray({
  start,
  end,
  pageInfo,
  model,
  findManyArgs,
  prisma,
}: Props<typeof model>): Promise<PageCursorType[]> {
  const cursors = [];
  for (let page = start; page <= end; page++) {
    const cursorResult = await pageToCursorObject({
      page,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    cursors.push(cursorResult);
  }
  return cursors;
}

export async function pageCursorsToArrayNearTheBeginning({
  start,
  end,
  pageInfo,
  model,
  findManyArgs,
  prisma,
}: Props<typeof model>): Promise<PageCursorType[]> {
  const cursors = [];
  const { currentPage, size } = pageInfo;
  const prismaModel = prisma[model.name.toLowerCase()];

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
    skip: 0,
    take: 1 + (end - start) * size,
  });

  for (let page = start; page <= end; page++) {
    const cursorId = result[(page - start) * size].id;
    const cursorObject = {
      cursor: Buffer.from('saltysalt'.concat(String(cursorId))).toString('base64'),
      page: page,
      isCurrent: currentPage === page,
    };
    cursors.push(cursorObject);
  }

  return cursors;
}

export async function pageCursorsToArrayNearTheEnd({
  start,
  end,
  pageInfo,
  model,
  findManyArgs,
  prisma,
}: Props<typeof model>): Promise<PageCursorType[]> {
  const cursors = [];
  const { currentPage, size, totalCount } = pageInfo;
  const prismaModel = prisma[model.name.toLowerCase()];

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
    take: 1 + (end - start) * size,
  });

  for (let page = start; page <= end; page++) {
    const cursorId = result[(end - page) * size].id;
    const cursorObject = {
      cursor: Buffer.from('saltysalt'.concat(String(cursorId))).toString('base64'),
      page: page,
      isCurrent: currentPage === page,
    };
    cursors.push(cursorObject);
  }

  return cursors;
}

export async function pageCursorsToArrayInTheMiddle({
  start,
  end,
  pageInfo,
  model,
  findManyArgs,
  prisma,
}: Props<typeof model>): Promise<PageCursorType[]> {
  const cursors = [];
  const { currentPage, size } = pageInfo;
  const prismaModel = prisma[model.name.toLowerCase()];

  // First half except the currentPage
  const resultOfFirstHalf = await prismaModel.findMany({
    ...findManyArgs,
    skip: 1,
    take: ((currentPage - start) * size) * -1,
  });
  for (let page = start; page < currentPage; page++) {
    const cursorId = resultOfFirstHalf[(page - start) * size].id;
    const cursorObject = {
      cursor: Buffer.from('saltysalt'.concat(String(cursorId))).toString('base64'),
      page: page,
      isCurrent: currentPage === page,
    };
    cursors.push(cursorObject);
  }

  // Last half including the currentPage
  const resultOfLastHalf = await prismaModel.findMany({
    ...findManyArgs,
    skip: 0,
    take: 1 + (end - currentPage) * size,
  });
  for (let page = currentPage; page <= end; page++) {
    const cursorId = resultOfLastHalf[(page - currentPage) * size].id;
    const cursorObject = {
      cursor: Buffer.from('saltysalt'.concat(String(cursorId))).toString('base64'),
      page: page,
      isCurrent: currentPage === page,
    };
    cursors.push(cursorObject);
  }

  return cursors;
}
