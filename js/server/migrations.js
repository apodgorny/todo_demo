"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migrations = void 0;
exports.Migrations = [
    (sqlite, callback) => {
        sqlite.migrate('CREATE TABLE tasks (text CHAR, created INTEGER, completed INTEGER)', callback);
    },
    (sqlite, callback) => {
        sqlite.migrate('ALTER TABLE tasks ADD COLUMN is_done INTEGER', callback);
    },
    (sqlite, callback) => {
        sqlite.migrate('ALTER TABLE tasks ADD COLUMN test INTEGER', callback);
    },
    (sqlite, callback) => {
        sqlite.migrate('ALTER TABLE tasks DROP COLUMN test', callback);
    }
];
