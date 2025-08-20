/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /config.js
 * @create:      2021-11-23 17:30:37.304
 * @modify:      2025-08-20 23:06:45.105
 * @version:     1.1.1
 * @times:       23
 * @lines:       51
 * @copyright:   Copyright © 2021-2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { ConsoleLogger, Logger, Strings_Development } from "kaven-basic";
import { EnableInternalLogger, FileLogger, LoadJsonConfig, StdLogger } from "kaven-utils";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

EnableInternalLogger();

/**
 * @type { import("./global").AppConfig }
 */
const config = await LoadJsonConfig(__dirname);

if (config === undefined) {
    throw new Error("Config load failed!!!");
}

const Config = {
    ...config,
    RootDir: __dirname,
    IsDevelopment: config.NODE_ENV === Strings_Development,
};

if (Config.IsDevelopment) {
    Logger.Handlers.add(new ConsoleLogger());
} else if (Config.ENABLE_LOG) {
    Logger.Handlers.add(new StdLogger());

    Logger.Handlers.add(FileLogger.StartNew(Config.LOG_FILE_PATH, { StripAnsi: true }));
    Logger.Handlers.add(FileLogger.StartNew(Config.ANSI_LOG_FILE_PATH));
}

export default Config;
