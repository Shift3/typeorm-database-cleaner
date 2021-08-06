# TypeORM Database Cleaner

This is a database cleaner for TypeORM. It can use different cleaning
strategies (and be extended with any of your own.)

It is primarily useful for testing code where you want to make sure
that the database set it reset quickly and completely between each
test.

For this purpose it provides `FastTruncateStrategy` which is a quick
and effective way of removing all entity data in the database, and is
much *quicker* then doing a full sync, or going through the ORM.

> Warning: Currently this library only works on PostgreSQL!!

## Setup

In order to use database cleaner in your project simple:

```bash
npm install --save typeorm-database-cleaner
```

Then in the relavent testing files you can setup DatabaseCleaner to
use a particular cleaning strategy.

```typescript
DatabaseCleaner.useStrategy(FastTruncateStrategy); // this is default already
```

And then clean your database whenever you like.

```typescript
DatabaseCleaner.clean(connection); // connection is a typeorm Connection object
```

## Development Setup

In order to develop on the library itself, do the following things.

1. `cp sample-env .env`
1. Customize environment variables for your database.
1. `createdb typeorm-database-cleaner-test`
1. Run the tests: `npm test`
