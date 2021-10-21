"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaOffsetPagination = void 0;
const pageCursor_1 = require("./pageCursor");
async function prismaOffsetPagination({ model, cursor, size, buttonNum, orderBy, orderDirection, include, where, prisma, }) {
    // totalCount
    const prismaModel = prisma[model.name.toLowerCase()];
    const totalCount = await prismaModel.count({
        where: Object.assign({}, where),
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
            totalCount: 0,
        };
    }
    // findManyArgs
    let findManyArgs;
    if (where) {
        findManyArgs = Object.assign(Object.assign({}, findManyArgs), { where: Object.assign({}, where) });
    }
    if (size) {
        findManyArgs = Object.assign(Object.assign({}, findManyArgs), { take: size });
    }
    if (orderBy) {
        findManyArgs = Object.assign(Object.assign({}, findManyArgs), { orderBy: { [orderBy]: orderDirection } });
    }
    if (include) {
        findManyArgs = Object.assign(Object.assign({}, findManyArgs), { include: include });
    }
    // cursor & currentPage
    let currentPage;
    if (cursor) {
        const prismaModel = prisma[model.name.toLowerCase()];
        const decryptedCursor = Buffer.from(cursor, 'base64').toString('ascii').slice(9);
        let idOrigin = isNaN(parseInt(decryptedCursor)) ? decryptedCursor : Number(decryptedCursor);
        // findManyArgsForCursorCount -> cursorCount -> currentPage
        let findManyArgsForCursorCount;
        if (findManyArgs === null || findManyArgs === void 0 ? void 0 : findManyArgs.orderBy) {
            const cursorObject = await prismaModel.findMany({
                orderBy: {
                    [orderBy]: orderDirection,
                },
                where: Object.assign({}, where),
                cursor: {
                    id: idOrigin,
                },
                take: 1,
            });
            const whereArgs = orderDirection === 'desc' ? {
                [orderBy]: {
                    gte: cursorObject[0][orderBy],
                },
            } : {
                [orderBy]: {
                    lte: cursorObject[0][orderBy],
                },
            };
            findManyArgsForCursorCount = {
                orderBy: {
                    [orderBy]: orderDirection,
                },
                where: Object.assign(Object.assign({}, where), whereArgs),
            };
        }
        else {
            findManyArgsForCursorCount = {
                where: Object.assign(Object.assign({}, where), { id: {
                        lte: idOrigin,
                    } }),
            };
        }
        const cursorCount = await prismaModel.count(Object.assign({}, findManyArgsForCursorCount));
        currentPage = Math.ceil(cursorCount / size);
        // Reset idOrigin when it is not exact pageCursor
        if (cursorCount % size !== 1) {
            const newCursorObject = await prismaModel.findMany({
                orderBy: {
                    [orderBy]: orderDirection,
                },
                where: Object.assign({}, where),
                cursor: {
                    id: idOrigin,
                },
                skip: cursorCount % size !== 0 ? cursorCount % size - 1 : size - 1,
                take: -1,
            });
            idOrigin = newCursorObject[0].id;
        }
        findManyArgs = Object.assign(Object.assign({}, findManyArgs), { cursor: { id: idOrigin } });
    }
    else {
        const resultsForCursor = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgs), { take: 1 }));
        currentPage = 1;
        findManyArgs = Object.assign(Object.assign({}, findManyArgs), { cursor: { id: resultsForCursor[0].id } });
    }
    const resultsForEdges = await prismaModel.findMany(Object.assign({}, findManyArgs));
    const pageEdges = resultsForEdges.map((result) => ({
        cursor: Buffer.from('saltysalt'.concat(String(result.id))).toString('base64'),
        node: result,
    }));
    const pageCursors = await pageCursor_1.createPageCursors({
        pageInfo: {
            currentPage,
            size,
            buttonNum,
            totalCount,
        },
        model,
        findManyArgs,
        prisma,
    });
    return {
        pageEdges,
        pageCursors,
        totalCount: totalCount,
    };
}
exports.prismaOffsetPagination = prismaOffsetPagination;
//# sourceMappingURL=pageEdge.js.map