/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /index.js
 * @create:      2021-11-18 15:55:12.122
 * @modify:      2025-08-21 20:11:19.548
 * @version:     1.2.1
 * @times:       40
 * @lines:       46
 * @copyright:   Copyright © 2021-2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import express from "express";
import { CreateExpress404Handler, CreateExpressLogger, StartServer } from "kaven-utils";
import { join } from "node:path";
import favicon from "serve-favicon";
import Config from "./config.js";
import { KavenFileServer } from "./server.js";

const app = express();

app.set("trust proxy", "loopback, linklocal, uniquelocal");

app.use(CreateExpressLogger());
app.use(favicon(join(Config.RootDir, "favicon.ico")));

app.get("/", (_req, res) => {
    res.send("<a href='https://github.com/Kaven-Universe/kaven-file-server'>Kaven File Server</a>");
});

for (const server of Config.Servers) {
    app.use(server.PATH, KavenFileServer(server));
}

app.use(CreateExpress404Handler());

StartServer(app, Config.PORT, {
    mode: Config.NODE_ENV,
    enableHttps: Config.ENABLE_HTTPS,
    sslCertFile: Config.SSL_CERT_PATH,
    sslKeyFile: Config.SSL_KEY_PATH,
});
