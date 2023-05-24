declare function require(name:string): any;

const sqlite3    = require('sqlite3')

import {Migrations} from './migrations'

const noop = () => {}

export class Sqlite {
	private static instance: Sqlite

	public static getInstance(): Sqlite {
        if (!Sqlite.instance) {
            Sqlite.instance = new Sqlite();
        }

        return Sqlite.instance;
    }

	db   : any
	name : string
	v    : number
	
	private constructor() {
		this.name = null
		this.v    = -1
		this.db   = null
	}

	create_migration_table(callback: Function): void {
		this.run('CREATE TABLE IF NOT EXISTS migrations (text CHAR, created INTEGER)', [], callback)
	}

	migrate(query: string, callback: Function): void {
		console.log('------------------------------')
		console.log('Applying migration #' + (this.v+1))
		console.log('--->', query)
		let key = query.split(' ').join('_')
		this.get('SELECT text FROM migrations WHERE rowid=$1', [this.v+1], (data: any) => {
			if (data) {
				if (data.text === key) {
					console.log('Already in place')
					this.next_migration()
				} else {
					console.log(data.text, key)
					throw `Lost in migration #${this.v+1}`
				}
			} else {
				this.run(query, [], () => {
					this.run('INSERT INTO migrations (text, created) VALUES ($1, $2)', [key, Date.now()], ()=>{
						console.log('Success!')
						this.next_migration()
					})
				})
			}
			
		})
	}

	next_migration(): void {
		this.v ++
		if (this.v < Migrations.length) {
			Migrations[this.v](this, noop)
		} else {
			console.log('------------------------------')
			console.log('All migrations applied successfully. Now at version ' + this.v + '\n')
		}
	}

	connect(name: string): void {
		this.name = name
		this.db = new sqlite3.Database(this.name, (error: Error) => {
			if (error) {
				throw `${error}, while connecting to ${this.name}`;
			}
			this.create_migration_table(() => {
				console.log(`Connected to database ${this.name}`)
				this.next_migration()
			})
		})
	}

	disconnect(callback: Function = noop): void {
		this.db.close((error: Error) => {
			if (error) {
				throw `${error}, while disconnecting from ${this.name}`;
			}
			console.log('Disconnected the database.');
			callback()
		})
	}

	getAll(query: string, params: Array<any>, callback: Function = noop): void {
		this.db.all(query, params, (error: string, rows: Array<any>) => {
			if (error) {
				throw `${error}, while executing query ${query}`;
			}
			callback(rows)
		})
	}

	get(query: string, params: Array<any>, callback: Function = noop): void {
		this.db.get(query, params, (error: string, row: any) => {
			if (error) {
				throw `${error}, while executing query ${query}`;
			}
			callback(row)
		})
	}

	run(query: string, params: Array<any>, callback: Function = noop): void {
		this.db.run(query, params, (error: string, result: any) => {
			if (error) {
				throw `${error}, while executing query ${query}`;
			}
			callback(result)
		})
	}

	insert(query: string, params: Array<any>, callback: Function = noop): void {
		this.db.run(query, params, (error: string, result: any) => {
			if (error) {
				throw `${error}, while executing query ${query}`;
			}
			this.get('SELECT last_insert_rowid() AS rowid', [], (data: any) => {
				let rowid = data ? data.rowid : null
				callback(rowid)
			})			
		})
	}
}