# Prisma Offset Pagination

<div>

[![Version](http://img.shields.io/npm/v/react-native-iap.svg?style=flat-square)](https://npmjs.org/package/prisma-offset-pagination)
[![Download](http://img.shields.io/npm/dm/react-native-iap.svg?style=flat-square)](https://npmjs.org/package/prisma-offset-pagination)
[![License](https://img.shields.io/npm/l/react-native-iap.svg)](https://npmjs.org/package/prisma-offset-pagination)

</div>

Offset Pagination based on cursor system to enhance the paginating speed to the point of Cursor Pagination.

More explanation about the package, you can read the medium article [here](https://medium.com/@smallbee/super-fast-offset-pagination-with-prisma2-21db93e5cc90).

- [Installation](#installation)
- [Usage](#usage)
  - [Use Module](#use-module)
  - [GraphQL Query](#graphql-query)
  - [Query Result](#query-result)
  - [Parameters](#parameters)
- [Description](#description)
- [Features](#features)


## Installation

### NPM

```
npm install prisma-offset-pagination
```

### Yarn

```
yarn add prisma-offset-pagination
```


## Usage

### Use Module
```typescript
import { prismaOffsetPagination } from 'prisma-offset-pagination';

...
const result = prismaOffsetPagination({
    model: User,
    cursor: <cursor>,
    size: 5,
    buttonNum: 7,
    orderBy: 'id',
    orderDirection: 'desc',
    where: {
      email: {
        contains: 'smallbee',
      },
    },
});
```

### GraphQL Query
```graphql
query {
  users(
      cursor: "c2FsdHlzYWx0Y2tjYTJxOGZqMDA2MGI5cnc1bTYyaHVveg=="
      size: 5
      buttonNum: 7
      orderBy: "createdAt"
      orderDirection: "asc"
      where: email: {
        contains: 'smallbee',
      }
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

### Query Result
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
            },
            totalCount
        }
    }
}
```

### Parameters

`model` \
: Receive model object that you want to implement pagination

`cursor` (optional) \
: Receive cursor of the page you want to navigate
(* If cursor is null, return the result of the first page)

`size` \
: Receive the number of row in the page

`buttonNum` \
: Receive the number of button in the bottom for pagination

<img width="562" alt="Screen Shot 2020-07-07 at 5 42 52 PM" src="https://user-images.githubusercontent.com/35122143/86780316-9627b200-c097-11ea-8652-ad460d3ea0bd.png">

`orderBy` (optional) \
: Receive one of model field

`orderDirection` (optional) \
: Receive 'asc' or 'desc'

`include` (optional) \
: Receive include option of Prisma

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

`where` (optional) \
: Receive Prisma2-style where options
For the more information, look up Prisma2's documentation about filtering
https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/filtering

The value should be a valid JSON object type.

ex)

```javascript
const where = {
    posts: {
      some: {
        published: true,
      }
    }
  }
```

```javascript
const where = {
    gender: {
      in: ['female', 'male'],
    }
  }
```

```javascript
where: {
    createdAt: {
      gte: '2020-07-07T08:58:57.001Z',
    }
  }
```

( * When you filter time date, should use 'ISO 8601' type as above. Otherwise, Prisma2 doesn't understand the DateTime value. You can make 'ISO 8601' type date using ["Date.prototype.toISOString()"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) )

```javascript
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
