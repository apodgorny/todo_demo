"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sqlite = void 0;
const sqlite3 = require('sqlite3');
const migrations_1 = require("./migrations");
const noop = () => { };
class Sqlite {
    static getInstance() {
        if (!Sqlite.instance) {
            Sqlite.instance = new Sqlite();
        }
        return Sqlite.instance;
    }
    constructor() {
        this.name = null;
        this.v = -1;
        this.db = null;
    }
    create_migration_table(callback) {
        this.run('CREATE TABLE IF NOT EXISTS migrations (text CHAR, created INTEGER)', [], callback);
    }
    migrate(query, callback) {
        console.log('------------------------------');
        console.log('Applying migration #' + (this.v + 1));
        console.log('--->', query);
        let key = query.split(' ').join('_');
        this.get('SELECT text FROM migrations WHERE rowid=$1', [this.v + 1], (data) => {
            if (data) {
                if (data.text === key) {
                    console.log('Already in place');
                    this.next_migration();
                }
                else {
                    console.log(data.text, key);
                    throw `Lost in migration #${this.v + 1}`;
                }
            }
            else {
                this.run(query, [], () => {
                    this.run('INSERT INTO migrations (text, created) VALUES ($1, $2)', [key, Date.now()], () => {
                        console.log('Success!');
                        this.next_migration();
                    });
                });
            }
        });
    }
    next_migration() {
        this.v++;
        if (this.v < migrations_1.Migrations.length) {
            migrations_1.Migrations[this.v](this, noop);
        }
        else {
            console.log('------------------------------');
            console.log('All migrations applied successfully. Now at version ' + this.v + '\n');
        }
    }
    connect(name) {
        this.name = name;
        this.db = new sqlite3.Database(this.name, (error) => {
            if (error) {
                throw `${error}, while connecting to ${this.name}`;
            }
            this.create_migration_table(() => {
                console.log(`Connected to database ${this.name}`);
                this.next_migration();
            });
        });
    }
    disconnect(callback = noop) {
        this.db.close((error) => {
            if (error) {
                throw `${error}, while disconnecting from ${this.name}`;
            }
            console.log('Disconnected the database.');
            callback();
        });
    }
    getAll(query, params, callback = noop) {
        this.db.all(query, params, (error, rows) => {
            if (error) {
                throw `${error}, while executing query ${query}`;
            }
            callback(rows);
        });
    }
    get(query, params, callback = noop) {
        this.db.get(query, params, (error, row) => {
            if (error) {
                throw `${error}, while executing query ${query}`;
            }
            callback(row);
        });
    }
    run(query, params, callback = noop) {
        this.db.run(query, params, (error, result) => {
            if (error) {
                throw `${error}, while executing query ${query}`;
            }
            callback(result);
        });
    }
    insert(query, params, callback = noop) {
        this.db.run(query, params, (error, result) => {
            if (error) {
                throw `${error}, while executing query ${query}`;
            }
            this.get('SELECT last_insert_rowid() AS rowid', [], (data) => {
                let rowid = data ? data.rowid : null;
                callback(rowid);
            });
        });
    }
}
exports.Sqlite = Sqlite;
