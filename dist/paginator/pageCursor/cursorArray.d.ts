import { PageCursorType } from './cursorObject';
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
export declare function pageCursorsToArray({ start, end, pageInfo, model, findManyArgs, prisma, }: Props<typeof model>): Promise<PageCursorType[]>;
export declare function pageCursorsToArrayNearTheBeginning({ start, end, pageInfo, model, findManyArgs, prisma, }: Props<typeof model>): Promise<PageCursorType[]>;
export declare function pageCursorsToArrayNearTheEnd({ start, end, pageInfo, model, findManyArgs, prisma, }: Props<typeof model>): Promise<PageCursorType[]>;
export declare function pageCursorsToArrayInTheMiddle({ start, end, pageInfo, model, findManyArgs, prisma, }: Props<typeof model>): Promise<PageCursorType[]>;
export {};
