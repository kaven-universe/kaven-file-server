/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /src/server.js
 * @create:      2021-11-18 15:22:36.251
 * @modify:      2026-07-06 13:15:15.505
 * @version:     1.2.3
 * @times:       58
 * @lines:       188
 * @copyright:   Copyright © 2021-2026 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import { Router } from "express";
import { Distinct, IsString, ToFileSize } from "kaven-basic";
import { AppendPathToDirectory, CreateExpressAuthentication, KavenAuthorizationRecords, KavenDigestAuthentication } from "kaven-utils";
import multer, { diskStorage } from "multer";
import { existsSync, mkdirSync } from "node:fs";
import { isAbsolute, join, normalize } from "node:path";
import Config from "./config.js";
import Logger from "./logger.js";

/**
 * 
 * @param { import("../global").Server } server 
 * @returns 
 */
export function KavenFileServer(server) {

    const form_data_field_file = server.FORM_DATA_FIELD_FILE;
    const form_data_field_dir = server.FORM_DATA_FIELD_DIR;
    const allow_upload_to_sub_dir = server.ALLOW_UPLOAD_TO_SUB_DIR;
    const allow_override_existing_file = server.ALLOW_OVERRIDE_EXISTING_FILE;

    const upload_root_dir = AppendPathToDirectory(Config.RootDir, server.UPLOAD_ROOT);

    if (!upload_root_dir) {
        throw new Error("dir is required.");
    }

    /**
     * @type { import("express").RequestHandler }
     */
    let authHandler = undefined;

    if (server.ENABLE_AUTHENTICATION) {
        const authentication = new KavenDigestAuthentication(server.AUTH_USER, server.AUTH_PASS);
        authentication.Records = new KavenAuthorizationRecords();

        const { handler } = CreateExpressAuthentication(authentication);
        authHandler = handler;
    }

    Logger.Info(`Initialize Server, root:${upload_root_dir}, path:${server.PATH}, auth:${server.ENABLE_AUTHENTICATION}, allowOverride:${allow_override_existing_file}`);

    const tryGetField = (from, name) => {
        if (!from || !name) {
            return undefined;
        }

        let result = from[name];
        if (result === undefined) {
            return result;
        }

        if (IsString(result)) {
            return result;
        }

        if (Array.isArray(result)) {
            result = Distinct(result);
            if (result.length === 1) {
                return result[0];
            }
        }

        return undefined;
    };

    const map = new Map();

    // https://github.com/expressjs/multer/issues/914#issuecomment-654084057
    // Note that req.body might not have been fully populated yet.
    // It depends on the order that the client transmits fields and files to the server.
    // Make sure that fields are sent before files.
    const storage = diskStorage({
        destination: function(req, file, cb) {
            try {
                let saveDir = upload_root_dir;

                if (allow_upload_to_sub_dir) {
                    const fieldName = `${file.fieldname}_dir`;
                    const subDir = tryGetField(req.body, fieldName) || tryGetField(req.body, form_data_field_dir);
                    if (subDir && !isAbsolute(subDir)) {
                        saveDir = join(upload_root_dir, subDir);
                    }
                }

                if (!existsSync(saveDir)) {
                    mkdirSync(saveDir, { recursive: true });
                    Logger.Info(`mkdir: ${saveDir}`);
                }

                map.set(file, saveDir);

                cb(null, saveDir);
            } catch (ex) {
                cb(ex);
            }
        },
        filename: function(req, file, cb) {
            try {
                let saveName = file.originalname;

                const fieldName = `${file.fieldname}_name`;
                const name = tryGetField(req.body, fieldName);
                if (name) {
                    saveName = name;
                }

                const saveDir = map.get(file);
                const filePath = join(saveDir, saveName);

                if (!normalize(filePath).startsWith(upload_root_dir)) {
                    cb(new Error("Cannot save the file outside the root directory."));
                    return;
                }

                if (!allow_override_existing_file) {
                    if (existsSync(filePath)) {
                        cb(new Error(`File already exists: ${saveName}`));
                        return;
                    }
                }

                cb(null, saveName);
            } catch (ex) {
                cb(ex);
            } finally {
                map.delete(file);
            }
        },
    });

    const m = multer({
        storage: storage,
    });

    const upload = form_data_field_file ? m.array(form_data_field_file) : m.any();

    const router = Router();

    if (authHandler) {
        router.use(authHandler);
    }

    router.post("/", (req, res) => {
        upload(req, res, async function(err) {
            try {
                if (err) {
                    Logger.Error(err);

                    // An error occurred when uploading
                    return res.status(400).send(err.message);
                }

                for (const file of req.files) {
                    let log = `file uploaded: ${file.path}, ${ToFileSize(file.size)}`;
                    if (file.originalname !== file.filename) {
                        log += `, originalname: ${file.originalname}`;
                    }

                    Logger.Info(log);
                }

                // Everything went fine
                return res.sendStatus(200);
            } catch (ex) {
                Logger.Error(ex);
                return res.sendStatus(400);
            }
        });
    });

    return router;
}