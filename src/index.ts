import { Connection } from "typeorm";

export interface IDatabaseCleanerStrategy {
    do: (connection: Connection) => void,
}

class FastTruncateStrategyImpl implements IDatabaseCleanerStrategy {
    async do (connection: Connection) {
        let entities = connection.entityMetadatas;

        if (entities.length == 0)
            return;

        try {
            await connection.query(
                entities
                    .map(e => `ALTER TABLE "${e.tableName}" DISABLE TRIGGER ALL;`)
                    .join(' ')
            );

            await connection.manager.query(
                'TRUNCATE ' + entities
                    .map(e => `"${e.tableName}"`)
                    .join(', ')
            );
        } finally {
            await connection.query(
                entities
                    .map(e => `ALTER TABLE "${e.tableName}" ENABLE TRIGGER ALL;`)
                    .join(' ')
            );
        }
    }
}

class FullSychronizeStrategyImpl implements IDatabaseCleanerStrategy {
    async do (connection: Connection) {
        const dropBeforeSync = true;
        await connection.synchronize(dropBeforeSync);
    }
}

class NullStrategyImpl implements IDatabaseCleanerStrategy {
    do (_: Connection) {}
}

export const FastTruncateStrategy   = new FastTruncateStrategyImpl();
export const FullSychronizeStrategy = new FullSychronizeStrategyImpl();
export const NullStrategy           = new NullStrategyImpl();

export class DatabaseCleaner {
    private static strategy: IDatabaseCleanerStrategy = FastTruncateStrategy;

    static useStrategy(strategy: IDatabaseCleanerStrategy) {
        this.strategy = strategy;
    }

    static async clean(connection: Connection) {
        await this.strategy.do(connection);
    }
}
