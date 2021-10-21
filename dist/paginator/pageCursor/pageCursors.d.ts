import { PageCursorType } from './cursorObject';
export declare function computeTotalPages(totalCount: number, size: number): number;
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
export declare function createPageCursors({ pageInfo: { currentPage, size, buttonNum, totalCount }, model, findManyArgs, prisma, }: Props<typeof model>): Promise<PageCursorsType>;
export {};
