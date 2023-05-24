declare function require(name:string): any;

const http = require('http')

import {Settings}           from './settings'
import {Utils}              from './utils'
import {BaseView, TodoView} from './views'
import {InitDatabase}       from './models'

InitDatabase()

const server = http.createServer((req: any, res: any): void => {
	let path = Utils.getPath(req.url)
	console.log('REQUEST:', req.url)

	try {
		if (req.url === '/') {
			TodoView.index(req, res)
		} else if (req.url.startsWith('/all')) {
			TodoView.all(req, res)
		} else if (req.url.startsWith('/create')) {
			TodoView.create(req, res)
		} else if (req.url.startsWith('/complete')) {
			TodoView.complete(req, res)
		} else if (req.url.startsWith('/delete')) {
			TodoView.delete(req, res)
		} else if (Utils.isPublic(req.url)) {
			BaseView.serveStatic(req, res)
		} else {
			BaseView.serve404(req, res)
		}
	} catch (e) {
		BaseView.serve500(req, res)
	}
});

server.listen(Settings.PORT, Settings.HOST, () => {
	console.log(`Server running at http://${Settings.HOST}:${Settings.PORT}/`);
});