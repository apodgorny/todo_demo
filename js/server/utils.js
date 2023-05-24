"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
var qs = require('querystring');
const settings_1 = require("./settings");
exports.Utils = {
    MIME_TYPE: {
        'html': 'text/html',
        'js': 'text/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'plain': 'text/plain'
    },
    isPublic: (filename) => {
        return settings_1.Settings.PUBLIC_DIRS.includes(exports.Utils.getPath(filename));
    },
    getPath: (filename) => {
        return filename.split('/').slice(0, -1).join('/');
    },
    getExtension: (filename) => {
        return filename.split('.').filter(Boolean).slice(1).join('.');
    },
    getMimeType: (filename) => {
        let ext = exports.Utils.getExtension(filename);
        ext = (ext in exports.Utils.MIME_TYPE) ? ext : 'plain';
        return exports.Utils.MIME_TYPE[ext];
    },
    receivePostData: (req, callback) => {
        if (req.method == 'POST') {
            var body = '';
            req.on('data', (data) => {
                body += data;
                if (body.length > 1e6) {
                    req.connection.destroy();
                    console.log('bad data');
                }
            });
            req.on('end', () => {
                var post = qs.parse(body);
                callback(post);
            });
        }
        else {
            callback(null);
        }
    }
};
