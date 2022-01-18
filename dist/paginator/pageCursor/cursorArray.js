"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageCursorsToArrayInTheMiddle = exports.pageCursorsToArrayNearTheEnd = exports.pageCursorsToArrayNearTheBeginning = exports.pageCursorsToArray = void 0;
const cursorObject_1 = require("./cursorObject");
// Returns an array of PageCursor objects
// from start to end (page numbers).
async function pageCursorsToArray({ start, end, pageInfo, model, findManyArgs, prisma, }) {
    const cursors = [];
    for (let page = start; page <= end; page++) {
        const cursorResult = await cursorObject_1.pageToCursorObject({
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
exports.pageCursorsToArray = pageCursorsToArray;
async function pageCursorsToArrayNearTheBeginning({ start, end, pageInfo, model, findManyArgs, prisma, }) {
    const cursors = [];
    const { currentPage, size } = pageInfo;
    const prismaModel = prisma[model.name.toLowerCase()];
    let findManyArgsForFirst;
    if (findManyArgs === null || findManyArgs === void 0 ? void 0 : findManyArgs.orderBy) {
        const { orderBy } = findManyArgs;
        findManyArgsForFirst = Object.assign(Object.assign({}, findManyArgsForFirst), { orderBy: Object.assign({}, orderBy) });
    }
    if (findManyArgs === null || findManyArgs === void 0 ? void 0 : findManyArgs.where) {
        const { where } = findManyArgs;
        findManyArgsForFirst = Object.assign(Object.assign({}, findManyArgsForFirst), { where: Object.assign({}, where) });
    }
    const result = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgsForFirst), { skip: 0, take: 1 + (end - start) * size }));
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
exports.pageCursorsToArrayNearTheBeginning = pageCursorsToArrayNearTheBeginning;
async function pageCursorsToArrayNearTheEnd({ start, end, pageInfo, model, findManyArgs, prisma, }) {
    const cursors = [];
    const { currentPage, size, totalCount } = pageInfo;
    const prismaModel = prisma[model.name.toLowerCase()];
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
    const result = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgsForLast), { skip: itemsOnTheLastPage - 1, take: 1 + (end - start) * size }));
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
exports.pageCursorsToArrayNearTheEnd = pageCursorsToArrayNearTheEnd;
async function pageCursorsToArrayInTheMiddle({ start, end, pageInfo, model, findManyArgs, prisma, }) {
    const cursors = [];
    const { currentPage, size } = pageInfo;
    const prismaModel = prisma[model.name.toLowerCase()];
    // First half except the currentPage
    const resultOfFirstHalf = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgs), { skip: 1, take: ((currentPage - start) * size) * -1 }));
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
    const resultOfLastHalf = await prismaModel.findMany(Object.assign(Object.assign({}, findManyArgs), { skip: 0, take: 1 + (end - currentPage) * size }));
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
exports.pageCursorsToArrayInTheMiddle = pageCursorsToArrayInTheMiddle;
//# sourceMappingURL=cursorArray.js.map