"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = exports.InitDatabase = void 0;
const sqlite_1 = require("./sqlite");
const InitDatabase = () => {
    let sqlite = sqlite_1.Sqlite.getInstance();
    sqlite.connect('todo.db');
};
exports.InitDatabase = InitDatabase;
exports.TodoModel = {
    all: (callback) => {
        let sqlite = sqlite_1.Sqlite.getInstance();
        sqlite.getAll('SELECT rowid as id, * FROM tasks WHERE 1', [], (records) => {
            callback(records);
        });
    },
    create: (text, callback) => {
        let sqlite = sqlite_1.Sqlite.getInstance();
        sqlite.insert('INSERT INTO tasks (text, created, completed, is_done) VALUES ($1, $2, $3, $4)', [text, Date.now(), null, 0], (rowid) => {
            sqlite.get('SELECT rowid as id, * FROM tasks WHERE rowid=$1', [rowid], (record) => {
                callback(record);
            });
        });
    },
    complete: (id, callback) => {
        let sqlite = sqlite_1.Sqlite.getInstance();
        sqlite.run('UPDATE OR IGNORE tasks SET completed=$1, is_done=1 WHERE rowid=$2', [Date.now(), id], () => {
            sqlite.get('SELECT rowid as id, * FROM tasks WHERE rowid=$1', [id], (record) => {
                callback(record);
            });
        });
    },
    delete: (id, callback) => {
        let sqlite = sqlite_1.Sqlite.getInstance();
        sqlite.run('DELETE FROM tasks WHERE rowid=$1', [id], callback);
    }
};
