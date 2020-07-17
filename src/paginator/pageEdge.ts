import { PageCursorsType, createPageCursors } from './pageCursor';
import { ErrorCursorOrCurrentPageArgNotGivenTogether } from './pageError';

interface PageEdgeType {
  cursor: string;
  node: any;
}

export interface PaginationType {
  pageEdges: [PageEdgeType];
  pageCursors: PageCursorsType;
}

interface Props<T> {
  model: T;
  currentPage: number;
  cursor: string;
  size: number;
  buttonNum: number;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
  where: any;
  IsWhereString: boolean;
  prisma: any,
}

export async function prismaOffsetPagination({
  model,
  currentPage,
  cursor,
  size,
  buttonNum,
  orderBy,
  orderDirection,
  where,
  IsWhereString = false,
  prisma,
}: Props<typeof model>): Promise<PaginationType> {
  if ((!cursor || !currentPage) && !(!cursor && !currentPage)) {
    throw ErrorCursorOrCurrentPageArgNotGivenTogether();
  }

  // IsWhereString
  if (IsWhereString && where) {
    where = JSON.parse(where.replace(/'/g, '"'));
  }

  // totalCount
  const prismaModel = prisma[model.name.toLowerCase()];
  const totalCount = await prismaModel.count({
    where: {
      ...where,
    },
  });

  if (!totalCount) {
    return {
      pageEdges: null,
      pageCursors: {
        first: null,
        previous: null,
        around: null,
        next: null,
        last: null,
      },
    };
  }

  // findManyArgs
  let findManyArgs;
  if (where) {
    findManyArgs = { ...findManyArgs, where: { ...where } };
  }
  if (size) {
    findManyArgs = { ...findManyArgs, take: size };
  }
  if (orderBy) {
    findManyArgs = { ...findManyArgs, orderBy: { [orderBy]: orderDirection } };
  }
  if (cursor) {
    const decryptedCursor = Buffer.from(cursor, 'base64').toString('ascii').slice(9);
    let idOrigin: number | string;
    if (isNaN(parseInt(decryptedCursor))) {
      idOrigin = decryptedCursor;
    } else {
      idOrigin = Number(decryptedCursor);
    }
    findManyArgs = { ...findManyArgs, cursor: { id: idOrigin } };
  } else {
    const resultsForCursor = await prismaModel.findMany({
      ...findManyArgs,
      take: 1,
    });
    const id = resultsForCursor[0].id;
    currentPage = 1;
    findManyArgs = { ...findManyArgs, cursor: { id: id } };
  }

  const resultsForEdges = await prismaModel.findMany({
    ...findManyArgs,
  });
  const pageEdges = resultsForEdges.map((result) => ({
    cursor: Buffer.from('saltysalt'.concat(String(result.id))).toString('base64'),
    node: result,
  }));

  const pageCursors = await createPageCursors({
    pageInfo: {
      currentPage,
      size,
      buttonNum,
    },
    model,
    findManyArgs,
    totalCount,
    prisma,
  });

  return {
    pageEdges,
    pageCursors,
  };
}
