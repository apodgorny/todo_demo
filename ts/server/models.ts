import {Sqlite} from './sqlite'

export const InitDatabase = () => {
	let sqlite = Sqlite.getInstance()
	sqlite.connect('todo.db')
}

export type TodoItem = {
	id        : number,
	text      : string,
	created   : string,
	completed : string,
	is_done   : boolean
}

export const TodoModel = {
	all: (callback: Function) => {
		let sqlite = Sqlite.getInstance()
		sqlite.getAll('SELECT rowid as id, * FROM tasks WHERE 1', [], (records: any) => {
			callback(records)
		})
	},
	create: (text: string, callback: Function) => {
		let sqlite = Sqlite.getInstance()
		sqlite.insert(
			'INSERT INTO tasks (text, created, completed, is_done) VALUES ($1, $2, $3, $4)',
			[text, Date.now(), null, 0],
			(rowid: any) => {
				sqlite.get('SELECT rowid as id, * FROM tasks WHERE rowid=$1', [rowid], (record: any) => {
					callback(record)
				})
			}
		)
	},
	complete: (id: string, callback: Function) => {
		let sqlite = Sqlite.getInstance()
		sqlite.run(
			'UPDATE OR IGNORE tasks SET completed=$1, is_done=1 WHERE rowid=$2',
			[Date.now(), id],
			() => {
				sqlite.get('SELECT rowid as id, * FROM tasks WHERE rowid=$1', [id], (record: any) => {
					callback(record)
				})
			}
		)
	},
	delete: (id: string, callback: Function) => {
		let sqlite = Sqlite.getInstance()
		sqlite.run(
			'DELETE FROM tasks WHERE rowid=$1',
			[id],
			callback
		)
	}
}