"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoView = exports.BaseView = void 0;
const fs = require('fs');
const utils_1 = require("./utils");
const models_1 = require("./models");
exports.BaseView = {
    serve404: (req, res) => {
        res.writeHead(404, { 'content-type': 'text/html' });
        res.end(`Page not found: ${req.url}`);
    },
    serve403: (req, res) => {
        res.writeHead(403, { 'content-type': 'text/html' });
        res.end(`Resource forbidden: ${req.url}`);
    },
    serve500: (req, res) => {
        res.writeHead(500, { 'content-type': 'text/html' });
        res.end(`Internal server error: ${req.url}`);
    },
    serveStatic: (req, res) => {
        let filename = req.url.substring(1);
        if (fs.existsSync(filename)) {
            res.writeHead(200, { 'content-type': utils_1.Utils.getMimeType(filename) });
            fs.createReadStream(filename).pipe(res);
        }
        else {
            exports.BaseView.serve404(req, res);
        }
    }
};
exports.TodoView = {
    index: (req, res) => {
        res.writeHead(200, { 'content-type': 'text/html' });
        fs.createReadStream('html/index.html').pipe(res);
    },
    all: (req, res) => {
        models_1.TodoModel.all((data) => {
            res.writeHead(200);
            res.end(JSON.stringify(data));
        });
    },
    create: (req, res) => {
        utils_1.Utils.receivePostData(req, (data) => {
            models_1.TodoModel.create(data.text, (item) => {
                res.writeHead(200);
                res.end(JSON.stringify(item));
            });
        });
    },
    complete: (req, res) => {
        utils_1.Utils.receivePostData(req, (data) => {
            models_1.TodoModel.complete(data.id, (item) => {
                res.writeHead(200);
                res.end(JSON.stringify(item));
            });
        });
    },
    delete: (req, res) => {
        utils_1.Utils.receivePostData(req, (data) => {
            models_1.TodoModel.delete(data.id, () => {
                res.writeHead(200);
                res.end('{}');
            });
        });
    }
};
