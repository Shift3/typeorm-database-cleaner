# TypeORM Database Cleaner

This is a database cleaner for TypeORM. It can use different cleaning
strategies (and be extended with any of your own.)

It is primarily useful in testing code where you want to make sure
that the database is reset quickly and completely to a blank slate
between each test.

For this purpose it provides `FastTruncateStrategy` which is a quick
and effective way of removing all entity data in the
database. `FastTruncateStrategy` is much *quicker* then doing a full
sync, or going through the ORM repository and deleting entities
through there.

> Warning: Currently this library only works on PostgreSQL!!

## Setup

In order to use database cleaner in your project simply install it as
a `devDependency`.

```bash
npm install --save-dev typeorm-database-cleaner
```

Then in the relevant testing files you can setup DatabaseCleaner to
use a particular cleaning strategy.

```typescript
DatabaseCleaner.useStrategy(FastTruncateStrategy); // this is default already
```

Currently there are 3 cleaning strategies.

* `FastTruncateStrategy` - quickly cleans all entity data, this is the
fastest cleaner. Your schema should be correct before running this as
it does not touch that schema.

* `FullSychronizeStrategy` - Drops all tables and fully synchronizes
the schema to match your entity structure.

* `NullStrategy` - Does nothing.

And then clean your database whenever you like.

```typescript
DatabaseCleaner.clean(connection); // connection is a typeorm Connection object
```

## Extending

You can create your own cleaning strategy by inheriting from
`IDatabaseCleanerStrategy` and implementing the
`do(connection:Connection)` method. Given the typeorm connection you
may do anything needed to clean the database in your own custom
strategy.

## Development Setup

In order to develop on the library itself, do the following things.

1. `cp sample-env .env`
1. Customize environment variables for your database.
1. `createdb typeorm-database-cleaner-test`
1. Run the tests: `npm test`
