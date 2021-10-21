import { PageCursorsType } from './pageCursor';
interface PageEdgeType {
    cursor: string;
    node: any;
}
export interface PaginationType {
    pageEdges: [PageEdgeType];
    pageCursors: PageCursorsType;
    totalCount: number;
}
interface Props<T> {
    model: T;
    cursor?: string;
    size: number;
    buttonNum: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    include?: any;
    where?: any;
    prisma: any;
}
export declare function prismaOffsetPagination({ model, cursor, size, buttonNum, orderBy, orderDirection, include, where, prisma, }: Props<typeof model>): Promise<PaginationType>;
export {};
