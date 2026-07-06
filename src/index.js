/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /src/index.js
 * @create:      2021-11-18 15:55:12.122
 * @modify:      2026-07-06 13:16:03.350
 * @version:     1.2.3
 * @times:       45
 * @lines:       48
 * @copyright:   Copyright © 2021-2026 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import express from "express";
import { CreateExpress404Handler, CreateExpressLogger, StartServer } from "kaven-utils";
import { join } from "node:path";
import favicon from "serve-favicon";
import Config from "./config.js";
import Logger from "./logger.js";
import { KavenFileServer } from "./server.js";

const app = express();

app.set("trust proxy", "loopback, linklocal, uniquelocal");

app.use(CreateExpressLogger(Logger));
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
    logger: Logger,
});
