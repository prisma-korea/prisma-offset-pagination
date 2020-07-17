# prisma-offset-pagination

> Offset Pagination based on cursor system to enhance the paginating speed to the point of Cursor Pagination

[![Npm Version](https://img.shields.io/badge/npm%20package-0.1.3-brightgreen)](https://npmjs.com/package/prisma-offset-pagination)
![License](https://img.shields.io/badge/license-MIT-blue)

<br />

## Installation

`npm`
```
npm install prisma-offset-pagination
```

`yarn`
```
npm add prisma-offset-pagination
```

## Usage

### # use module

```typescript
import { PaginationType, prismaOffsetPagination } from 'prisma-offset-pagination';

const result = prismaOffsetPagination({
	  model: User,
	  currentPage,
	  cursor,
	  size,
	  buttonNum,
	  orderBy,
	  orderDirection,
	  where,
});
```

### # GraphQL Query

```graphql
query {
  users(
      currentPage: 3
      cursor: "c2FsdHlzYWx0Y2tjYTJxOGZqMDA2MGI5cnc1bTYyaHVveg=="
      size: 2
      buttonNum: 5
      orderBy: "createdAt"
      orderDirection: "asc"
      where: "{ 'email': { 'contains': 'smallbee' } }"
  ) {
    pageEdges {
      cursor
      node {
        id
        email
        createdAt
      }
    }
    pageCursors {
      first {
        cursor
        page
        isCurrent
      }
      previous {
        cursor
        page
        isCurrent
      }
      around {
        cursor
        page
        isCurrent
      }
      next {
        cursor
        page
        isCurrent
      }
      last {
        cursor
        page
        isCurrent
      }
    }
  }
}
```

### # Query Result

```graphql
{
    "data": {
        "users": {
            "pageEdges": [
                {
                    "cursor": "c2FsdHlzYWx0Y2tjYTJxOGZqMDA2MGI5cnc1bTYyaHVveg==",
                    "node": {
                        "id": "ckca2q8fj0060b9rw5m62huoz",
                        "email": "smallbee6@gmail.com",
                        "createdAt": "2020-07-06T05:38:34.927Z"
                    }
                },
                {
                    "cursor": "c2FsdHlzYWx0Y2tjYTJxOWZxMDA2NWI5cnd4eHU2b3V6bg==",
                    "node": {
                        "id": "ckca2q9fq0065b9rwxxu6ouzn",
                        "email": "smallbee7@gmail.com",
                        "createdAt": "2020-07-06T05:38:36.230Z"
                    }
                }
            ],
            "pageCursors": {
                "first": null,
                "previous": {
                    "cursor": "c2FsdHlzYWx0Y2tjYTJxNnVpMDA1MGI5cndreGEydHY4Mw==",
                    "page": 2,
                    "isCurrent": false
                },
                "around": [
                    {
                        "cursor": "c2FsdHlzYWx0Y2tjOXNtYTFoMDAwNDY2cnduZW15Zzlrbg==",
                        "page": 1,
                        "isCurrent": false
                    },
                    {
                        "cursor": "c2FsdHlzYWx0Y2tjYTJxNnVpMDA1MGI5cndreGEydHY4Mw==",
                        "page": 2,
                        "isCurrent": false
                    },
                    {
                        "cursor": "c2FsdHlzYWx0Y2tjYTJxOGZqMDA2MGI5cnc1bTYyaHVveg==",
                        "page": 3,
                        "isCurrent": true
                    },
                    {
                        "cursor": "c2FsdHlzYWx0Y2tjYTJxYW5wMDA3MGI5cnczeTI3dHA4OQ==",
                        "page": 4,
                        "isCurrent": false
                    }
                ],
                "next": {
                    "cursor": "c2FsdHlzYWx0Y2tjYTJxYW5wMDA3MGI5cnczeTI3dHA4OQ==",
                    "page": 4,
                    "isCurrent": false
                },
                "last": {
                    "cursor": "c2FsdHlzYWx0Y2tjYnBjODZ4MDAzMHltcndjNHE1cXJ5bw==",
                    "page": 7,
                    "isCurrent": false
                }
            }
        }
    }
}
```

### # Parameters

`model: User` \
: Receive model object that you want to implement pagination

`currentPage` (optional) \
: Receive page that you want to move \
(* currentPage should be given with cursor parameter )

`cursor` (optional) \
: Receive cursor of the page that you want to move \
(* cursor should be given with currentPage parameter )

`size` \
: Receive the number of row in the page

`buttonNum` \
: Receive the number of button in the bottom for pagination

<img width="562" alt="Screen Shot 2020-07-07 at 5 42 52 PM" src="https://user-images.githubusercontent.com/35122143/86780316-9627b200-c097-11ea-8652-ad460d3ea0bd.png">

`orderBy` (optional) \
: Receive one of model field

`orderDirection` (optional) \
: Receive one of 'asc' | 'desc'

`prisma` \
: Receive prisma object

ex)

```
import { PrismaClient } from '@prisma/client';

const prismaObject = new PrismaClient();

const result = prismaOffsetPagination({
  ...
  prisma: prismaObject,
});

```

`isWhereString` (optional) \
: Receive boolean value to decide whether to parse string type `where` parameter or not.

`where` (optional) \
: Receive Prisma2-style where options
For the more information, look up Prisma2's documentation about filtering
https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/filtering

The value could be either string of JSON type or javascript object. \
When the value is string type, it has to be valid JSON type. For instance, where: "{ posts: { some: { published: true }, }, };" is not valid JSON type because of comma(,) and semicolon(;).

ex)

```javascript
a) javascript object type

const where = {
    posts: {
      some: {
        published: true,
      }
    }
  }


b) string type

where: "{ 'posts': { 'some': { published: true } } }"
```

```javascript
a) javascript object type

const where = {
    gender: {
      in: ['female', 'male'],
    }
  }


b) string type

where: "{ 'gender': { 'in': ['female', 'male'] } }"
```

```javascript
a) javascript object type

where: {
    createdAt: {
      gte: '2020-07-07T08:58:57.001Z',
    }
  }


b) string type

const where = "{ 'createdAt' : { 'gte' : '2020-07-07T08:58:57.001Z' } }"
```

( * When you filter time date, should use 'ISO 8601' type as above. Otherwise, Prisma2 doesn't understand the DateTime value. You can make 'ISO 8601' type date using ["Date.prototype.toISOString()"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) )

```javascript
a) javascript object type

const where = {
  OR: [
    {
      email: {
        contains: "smallbee",
      }
    },
    {
      createdAt: {
        gt: "2020-07-07T03:40:00.000Z"
      }
    }
  ]
}

b) string type

const where = "{ 'OR': [{ 'email': { 'contains': 'smallbee' }}, {'createdAt' : { 'gt' : '2020-07-07T03:40:00.000Z' } }] }"
```

<br />

## Description

### 1. Overcoming the problem of Offset Pagination

When implementing offset pagination, normally use `offset` to get the data. \
`offset` is the terminology of SQL, and use like this:

```sql
SELECT *
FROM
    users
WHERE
    createdAt < {targetTime}
    AND ...
LIMIT {pageSize}
OFFSET {offsetSize}
```

which could be written with Prisma2 as this:

```typescript
prisma.user.findMany({
  where: {
    createdAt : {
      lt: {targetTime}
    }
    ...
  },
  skip: {offsetSize},
  take: {pageSize},
})
```

But, the usage of `offset`(skip) brings a bad result when paginating large data as shown in the below graph.

![optimize-pagination-sql-by-join-instead-of-limit](https://user-images.githubusercontent.com/35122143/86562599-ea4e6b80-bf9d-11ea-8522-c2d113d8e6ca.png)

The common solution for this offset issue is using the clustering index.
But, the problem is that Prisma2 does not support clustering index at the moment.

And another solution is using table joining with subquery as below:

```
SELECT id, name, email, ...
FROM (
    SELECT id
    FROM {targetTable}
    LIMIT 2000000, 1000
) q
JOIN {targetTable} p
ON p.id = q.id
```

This is quite tricky to implement with Prisma2 and the code is more complicated. This leads to imperative programming rather than declarative, which is one of our coding principles.

<br />

### 2. Using the advantage of Cursor pagination

Cursor pagination doesn't have the problems Offset Pagination has. It is because Cursor pagination is using the cursor value to get data, instead of offset, which makes a big difference in performance. Cursor should be unique and sequential value for good performance.
However, with Cursor Pagination, the user cannot jump to a specific page but only jump to the previous or next page.
As we want to make a Offset style pagination, Cursor pagination is not a possible option for us.

<br />

### 3. Mixing the merits of both Offset and Cursor pagination

So, what comes out in this situation is Cursor-based Offset Pagination that mixed the strength of two paginations.
So, Cursor-based Offset Pagination is using a cursor to navigate pages as fas as Cursor pagination.
At the same time, it gives certain pages where user can jump.
This is possible thanks to Prisma Client's cursor system.

With Prism client, we can easily move to certain page like this:

```typescript
const secondQuery = prisma.post.findMany({
  take: 4,
  cursor: {
    id: myCursor,
  },
  ...
})
```

With this, we can figure out two pages away from the cursor as below:

```typescript
    const result = await prisma.post.findMany({
      cursor: {
        id: {targetObjectId},
      },
      skip: 2 * {pageSize},
      take: 1,
    });
```


And also Prisma Client offers the way to fetch data backward, which allows jumping to two pages backward.

```typescript
    const result = await prisma.post.findMany({
      cursor: {
        id: {targetObjectId},
      },
      skip: 2 * {pageSize},
      take: -1,
    });
```

With this strategy, we could know cursors of each around page of the current page's cursor like this:

```javascript
{
    "cursor": "c2FsdHlzYWx0Y2tjOXNtYTFoMDAwNDY2cnduZW15Zzlrbg==",
    "page": 1,
    "isCurrent": false
},
{
    "cursor": "c2FsdHlzYWx0Y2tjYnBibmkzMDAwMHltcndhNTRoeGxjOQ==",
    "page": 2,
    "isCurrent": false
},
{
    "cursor": "c2FsdHlzYWx0Y2tjYnBicHVwMDAxMHltcnd0aDhtcjR4ag==",
    "page": 3,
    "isCurrent": true
},
{
    "cursor": "c2FsdHlzYWx0Y2tjYnBjNm8xMDAyMHltcnc5OG10aTdiNQ==",
    "page": 4,
    "isCurrent": false
}
```

<br />

## Features

### 1. Performance

This paginator is as fast as Cursor pagination if you follow this guide well.
It is approximately O(1).

### 2. No duplicated data in the page

As paginating using cursor, there will be no duplicated data showed up on the list.

### 3. Work with ordering and complex where options

As Prisma client is still fast with complex where filtering options and ordering, this paginator is fast too with those conditions.

<br />

## Limitations

### 1. Parameter 'currentPage' and 'cursor' should be given together

This is because the paginator can only work with those two data.
But, when you paginate with the first page, just don't give both 'currentPage' and 'cursor', then the pagination result for the first page will be returned.

### 2. 'currentPage' should be correct

If you pass the wrong 'currentPage' data with correct 'cursor' data, paginator still works supposing the 'currrentPage' data is valid data. But, the page information of result data is incorrect.
'currentPage' data is not validated by paginator intentionally for the performance issue.

### 3. The way the first and the last page work could be a bit different from other pages do

When new data inserted to the list and you are paginating from the midst of the page to the first page or last page, the result of the first or last page could be not what you expect. This happens because the cursor system of the first page is different from the second and the other pages to sync the first page cursor.

<br />
