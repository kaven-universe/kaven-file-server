/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /src/config.js
 * @create:      2021-11-23 17:30:37.304
 * @modify:      2026-07-06 13:27:03.426
 * @version:     1.2.3
 * @times:       32
 * @lines:       57
 * @copyright:   Copyright © 2021-2026 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { ConsoleLogger, Strings_Development } from "kaven-basic";
import { FileLogger, LoadJsonConfig, StdLogger, AppendPathThenCreateParentDirectory } from "kaven-utils";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Logger from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @type { import("../global").AppConfig }
 */
const config = await LoadJsonConfig(__dirname);

if (config === undefined) {
    throw new Error("Config load failed!!!");
}

if (process.env.NODE_ENV) {
    config.NODE_ENV = process.env.NODE_ENV;
}

const Config = {
    ...config,
    RootDir: __dirname,
    IsDevelopment: config.NODE_ENV === Strings_Development,
};

Config.LOG_FILE_PATH = AppendPathThenCreateParentDirectory(__dirname, Config.LOG_FILE_PATH);
Config.ANSI_LOG_FILE_PATH = AppendPathThenCreateParentDirectory(__dirname, Config.ANSI_LOG_FILE_PATH);

if (Config.IsDevelopment) {
    Logger.Handlers.add(new ConsoleLogger());
} else if (Config.ENABLE_LOG) {
    Logger.Handlers.add(new StdLogger());

    Logger.Handlers.add(FileLogger.StartNew(Config.LOG_FILE_PATH, { StripAnsi: true }));
    Logger.Handlers.add(FileLogger.StartNew(Config.ANSI_LOG_FILE_PATH));
}

export default Config;
