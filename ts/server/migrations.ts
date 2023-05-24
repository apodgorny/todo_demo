
export const Migrations = [
	(sqlite: any, callback: Function) => {
		sqlite.migrate('CREATE TABLE tasks (text CHAR, created INTEGER, completed INTEGER)', callback)
	},

	(sqlite: any, callback: Function) => {
		sqlite.migrate('ALTER TABLE tasks ADD COLUMN is_done INTEGER', callback)
	},

	(sqlite: any, callback: Function) => {
		sqlite.migrate('ALTER TABLE tasks ADD COLUMN test INTEGER', callback)
	},

	(sqlite: any, callback: Function) => {
		sqlite.migrate('ALTER TABLE tasks DROP COLUMN test', callback)
	}
]