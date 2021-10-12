import { expect } from "chai";
import { Connection, createConnection } from "typeorm";
import { DatabaseCleaner, FastTruncateStrategy, FullSychronizeStrategy, NullStrategy } from "../src/index";
import { User } from "./entities/User";
import { Purchase } from "./entities/Purchase";

let connection: Connection;

describe("DatabaseCleaner", () => {
  before(async () => {
    connection = await createConnection();
  });

  after(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    // NOTE(justin): This is slow but we don't want to rely on
    // DatabaseCleaner to test DatabaseCleaner so we do a full sync
    // here before every test to ensure a fresh state.
    await connection.synchronize(true);
  });

  describe('FastTruncateStrategy', () => {
    beforeEach(() => {
      DatabaseCleaner.useStrategy(FastTruncateStrategy);
    });

    it('should clean all entity tables', async () => {
      await connection.getRepository(User).insert({
        firstName: 'Ham',
        lastName:  'Burger',
      });

      await DatabaseCleaner.clean(connection);

      const count = await connection.getRepository(User).count();
      expect(count).to.eq(0);
    });

    it('should restart sequences', async () => {
      await connection.getRepository(User).insert({
        firstName: 'Ham',
        lastName:  'Burger',
      });

      await DatabaseCleaner.clean(connection);

      const seq = (await connection.query("SELECT nextval('user_id_seq');"))[0].nextval;
      expect(seq).to.eq('1');
    })

    it('it can truncate through foreign key references', async () => {
      const user     = new User();
      user.firstName = 'Ham';
      user.lastName  = 'Burger';
      await connection.manager.save(user);

      const purchase  = new Purchase();
      purchase.amount = 42;
      purchase.user   = user;
      await connection.manager.save(purchase);

      await DatabaseCleaner.clean(connection);

      const userCount = await connection.getRepository(User).count();
      expect(userCount).to.eq(0);

      const purchaseCount = await connection.getRepository(Purchase).count();
      expect(purchaseCount).to.eq(0);
    });
  });

  describe('FullSychronizeStrategy', () => {
    beforeEach(() => {
      DatabaseCleaner.useStrategy(FullSychronizeStrategy);
    });

    it('should fully syncronize the database to the entity state', async () => {
      await connection.query('ALTER TABLE "user" ADD COLUMN not_in_entity_schema_column INT');

      await DatabaseCleaner.clean(connection);

      const column = await connection.query(`SELECT column_name FROM information_schema.columns WHERE table_name='user' AND column_name = 'not_in_entity_schema_column'`);
      expect(column).to.have.length(0);
    });
  });

  describe('NullStrategy', () => {
    beforeEach(() => {
      DatabaseCleaner.useStrategy(NullStrategy);
    });

    it('should not clean any tables', async () => {
      await connection.getRepository(User).insert({
        firstName: 'Ham',
        lastName:  'Burger',
      });

      await DatabaseCleaner.clean(connection);

      let count = await connection.getRepository(User).count();
      expect(count).to.eq(1);
    });
  });

});
