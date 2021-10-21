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
export declare function pageToCursorObject({ page, pageInfo, model, findManyArgs, prisma, }: Props<typeof model>): Promise<PageCursorType>;
export {};
