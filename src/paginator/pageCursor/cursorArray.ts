import { PageCursorType, pageToCursorObject } from './cursorObject';

interface Props<T> {
  start: number;
  end: number;
  pageInfo: {
    currentPage: number;
    size: number;
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
  let page;
  const cursors = [];
  for (page = start; page <= end; page++) {
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
