declare function require(name:string): any;
const fs = require('fs')

import {Utils}               from './utils'
import {TodoItem, TodoModel} from './models'


export const BaseView = {
	serve404: (req: any, res: any) => {
		res.writeHead(404, { 'content-type': 'text/html' })
		res.end(`Page not found: ${req.url}`);
	},
	serve403: (req: any, res: any) => {
		res.writeHead(403, { 'content-type': 'text/html' })
		res.end(`Resource forbidden: ${req.url}`);
	},
	serve500: (req: any, res: any) => {
		res.writeHead(500, { 'content-type': 'text/html' })
		res.end(`Internal server error: ${req.url}`);
	},
	serveStatic: (req: any, res: any) => {
		let filename = req.url.substring(1)
		if (fs.existsSync(filename)) {
			res.writeHead(200, { 'content-type': Utils.getMimeType(filename) })
			fs.createReadStream(filename).pipe(res)
		} else {
			BaseView.serve404(req, res)
		}
	}
}

export const TodoView = {
	index: (req: any, res: any): void => {
		res.writeHead(200, { 'content-type': 'text/html' })
		fs.createReadStream('html/index.html').pipe(res)
	},
	all:  (req: any, res: any): void => {
		TodoModel.all((data: Array<TodoItem>) => {
			res.writeHead(200)
			res.end(JSON.stringify(data))
		})
	},
	create: (req: any, res: any): void => {
		Utils.receivePostData(req, (data: any) => { // TODO what benefits do we get by processing this request here in TodoView instead of directly in the route?
			TodoModel.create(data.text, (item: TodoItem) => {
				res.writeHead(200)
				res.end(JSON.stringify(item))
			})
		})
	},
	complete: (req: any, res: any): void => {
		Utils.receivePostData(req, (data: any) => {
			TodoModel.complete(data.id, (item: TodoItem) => {
				res.writeHead(200)
				res.end(JSON.stringify(item))
			})
		})
	},
	delete: (req: any, res: any): void => {
		Utils.receivePostData(req, (data: any) => {
			TodoModel.delete(data.id, () => {
				res.writeHead(200)
				res.end('{}')
			})
		})
	}
}