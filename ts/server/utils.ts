declare function require(name:string): any;

var qs = require('querystring')

import {Settings} from './settings'

export const Utils = {
	MIME_TYPE: {
		'html'  : 'text/html',
		'js'    : 'text/javascript',
		'css'   : 'text/css',
		'json'  : 'application/json',
		'plain' : 'text/plain'
	},
	isPublic: (filename: string): boolean => {
		return Settings.PUBLIC_DIRS.includes(Utils.getPath(filename))
	},
	getPath: (filename: string): string => {
		return filename.split('/').slice(0,-1).join('/')
	},
	getExtension: (filename: string): string => {
		return filename.split('.').filter(Boolean).slice(1).join('.')
	},
	getMimeType: (filename: string): string => {
		let ext = Utils.getExtension(filename)
		ext = (ext in Utils.MIME_TYPE) ? ext : 'plain'
		return Utils.MIME_TYPE[ext as keyof typeof Utils.MIME_TYPE]
	},
	receivePostData: (req: any, callback: Function): void => {
		if (req.method == 'POST') {
	        var body = '';

	        req.on('data', (data: any) => {
	            body += data;
	            if (body.length > 1e6) {
	                req.connection.destroy()
	                console.log('bad data')
	            }
	        })

	        req.on('end', () => {
	            var post = qs.parse(body)
	            callback(post)
	        })
	    } else {
	    	callback(null)
	    }
	}
}