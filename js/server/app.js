"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const settings_1 = require("./settings");
const utils_1 = require("./utils");
const views_1 = require("./views");
const models_1 = require("./models");
(0, models_1.InitDatabase)();
const server = http.createServer((req, res) => {
    let path = utils_1.Utils.getPath(req.url);
    console.log('REQUEST:', req.url);
    try {
        if (req.url === '/') {
            views_1.TodoView.index(req, res);
        }
        else if (req.url.startsWith('/all')) {
            views_1.TodoView.all(req, res);
        }
        else if (req.url.startsWith('/create')) {
            views_1.TodoView.create(req, res);
        }
        else if (req.url.startsWith('/complete')) {
            views_1.TodoView.complete(req, res);
        }
        else if (req.url.startsWith('/delete')) {
            views_1.TodoView.delete(req, res);
        }
        else if (utils_1.Utils.isPublic(req.url)) {
            views_1.BaseView.serveStatic(req, res);
        }
        else {
            views_1.BaseView.serve404(req, res);
        }
    }
    catch (e) {
        views_1.BaseView.serve500(req, res);
    }
});
server.listen(settings_1.Settings.PORT, settings_1.Settings.HOST, () => {
    console.log(`Server running at http://${settings_1.Settings.HOST}:${settings_1.Settings.PORT}/`);
});
