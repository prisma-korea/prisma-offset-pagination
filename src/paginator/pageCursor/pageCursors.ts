import { PageCursorType, pageToCursorObject } from './cursorObject';
import {
  pageCursorsToArray,
  pageCursorsToArrayInTheMiddle,
  pageCursorsToArrayNearTheBeginning,
  pageCursorsToArrayNearTheEnd,
} from './cursorArray';

// Returns the total number of pagination results capped to PAGE_NUMBER_CAP.
export function computeTotalPages(totalCount: number, size: number): number {
  return Math.ceil(totalCount / size);
}

export interface PageCursorsType {
  first: PageCursorType;
  previous: PageCursorType;
  around: [PageCursorType];
  next: PageCursorType;
  last: PageCursorType;
}

interface Props<T> {
  pageInfo: {
    currentPage: number;
    size: number;
    buttonNum: number;
    totalCount: number;
  };
  model: T;
  findManyArgs: any;
  prisma: any;
}

export async function createPageCursors({
  pageInfo: { currentPage, size, buttonNum, totalCount },
  model,
  findManyArgs,
  prisma,
}: Props<typeof model>): Promise<PageCursorsType> {
  // If buttonNum is even, bump it up by 1, and log out a warning.
  if (buttonNum % 2 === 0) {
    // eslint-disable-next-line
    console.log(
      `buttonNum of ${buttonNum} passed to page cursors, but using ${
        buttonNum + 1
      } instead for the pagination logic`,
    );
    buttonNum = buttonNum + 1;
  }

  let pageCursors;
  const totalPages = computeTotalPages(totalCount, size);
  const pageInfo = { currentPage, size, totalCount, totalPages };

  // Degenerate case of no records found. 1 / 1 / 1
  if (totalPages === 0) {
    pageCursors = {
      around: [],
    };
  } else if (totalPages <= buttonNum) {
    // Collection is short, and `around` includes page 1 and the last page. 1 / 1 2 3 / 7
    const around = await pageCursorsToArrayNearTheBeginning({
      start: 1,
      end: totalPages,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    pageCursors = {
      around,
    };
  } else if (currentPage <= Math.floor(buttonNum / 2) + 1) {
    // We are near the beginning, and `around` will include page 1. 1 / 1 2 3 / 7
    const last = await pageToCursorObject({
      page: totalPages,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    const around = await pageCursorsToArrayNearTheBeginning({
      start: 1,
      end: buttonNum - 1,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });

    pageCursors = {
      last,
      around,
    };
  } else if (currentPage >= totalPages - Math.floor(buttonNum / 2)) {
    // We are near the end, and `around` will include the last page. 1 / 5 6 7 / 7
    const first = await pageToCursorObject({
      page: 1,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    const around = await pageCursorsToArrayNearTheEnd({
      start: totalPages - buttonNum + 2,
      end: totalPages,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    pageCursors = {
      first,
      around,
    };
  } else {
    // We are in the middle, and `around` doesn't include the first or last page. 1 / 4 5 6 / 7
    const first = await pageToCursorObject({
      page: 1,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    const last = await pageToCursorObject({
      page: totalPages,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    const offset = Math.floor((buttonNum - 3) / 2);
    const around = await pageCursorsToArrayInTheMiddle({
      start: currentPage - offset,
      end: currentPage + offset,
      pageInfo,
      model,
      findManyArgs,
      prisma,
    });
    pageCursors = {
      first,
      around,
      last,
    };
  }

  // previous
  if (currentPage > 1 && totalPages > 1) {
    pageCursors.around.map((item, index) => {
      if (item.isCurrent) {
        pageCursors.previous = pageCursors.around[index - 1];
      }
    });
  }
  // next
  if (totalPages > currentPage) {
    pageCursors.around.map((item, index) => {
      if (item.isCurrent) {
        pageCursors.next = pageCursors.around[index + 1];
      }
    });
  }
  return pageCursors;
}
