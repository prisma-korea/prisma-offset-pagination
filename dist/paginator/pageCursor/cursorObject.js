"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageToCursorObject = void 0;
// Returns an opaque cursor for a page.
async function pageToCursorObject({ page, pageInfo, model, findManyArgs, prisma, }) {
    const { currentPage, size, totalCount, totalPages } = pageInfo;
    let cursorId;
    const prismaModel = prisma[model.name.toLowerCase()];
    // first
    if (page === 1) {
        let findManyArgsForFirst;
        if (findManyArgs === null || findManyArgs === void 0 ? void 0 : findManyArgs.orderBy) {
            const { orderBy } = findManyArgs;
            findManyArgsForFirst = Object.assign(Object.assign({}, findManyArgsForFirst), { orderBy: Object.assign({}, orderBy) });
        }
        if (findManyArgs === null || findManyArgs === void 0 ? void 0 : findManyArgs.where) {
            const { where } = findManyArgs;
            findManyArgsForFirst = Object.assign(Object.assign({}, findManyArgsForFirst), { where: Object.assign({}, where) });
        }
        const result = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgsForFirst), { take: 1 }));
        cursorId = result[0].id;
        // last
    }
    else if (page === totalPages) {
        let findManyArgsForLast;
        if (findManyArgs === null || findManyArgs === void 0 ? void 0 : findManyArgs.orderBy) {
            const orderByKey = Object.keys(findManyArgs.orderBy)[0];
            const orderDirection = findManyArgs.orderBy[orderByKey] === 'asc' ? 'desc' : 'asc';
            findManyArgsForLast = Object.assign(Object.assign({}, findManyArgsForLast), { orderBy: {
                    [orderByKey]: orderDirection,
                } });
        }
        else {
            findManyArgsForLast = Object.assign(Object.assign({}, findManyArgsForLast), { orderBy: {
                    id: 'desc',
                } });
        }
        if (findManyArgs === null || findManyArgs === void 0 ? void 0 : findManyArgs.where) {
            const { where } = findManyArgs;
            findManyArgsForLast = Object.assign(Object.assign({}, findManyArgsForLast), { where: Object.assign({}, where) });
        }
        const itemsOnTheLastPage = totalCount % size !== 0
            ? totalCount % size
            : size;
        const result = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgsForLast), { skip: itemsOnTheLastPage - 1, take: 1 }));
        cursorId = result[0].id;
        // around & previous
    }
    else {
        const distance = (page - currentPage) * size;
        const takeSkipArgs = {
            take: distance < 0 ? -1 : 1,
            skip: distance < 0 ? distance * -1 : distance,
        };
        const result = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgs), takeSkipArgs));
        cursorId = result[0].id;
    }
    return {
        cursor: Buffer.from('saltysalt'.concat(String(cursorId))).toString('base64'),
        page,
        isCurrent: currentPage === page,
    };
}
exports.pageToCursorObject = pageToCursorObject;
//# sourceMappingURL=cursorObject.js.map