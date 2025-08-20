/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /global.d.ts
 * @create:      2023-11-30 14:20:51.381
 * @modify:      2025-08-20 22:36:22.496
 * @version:     1.1.1
 * @times:       4
 * @lines:       39
 * @copyright:   Copyright © 2023-2025 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

export interface Server {
    PATH: string;
    UPLOAD_ROOT: string;
    ENABLE_AUTHENTICATION: boolean;
    AUTH_USER: string;
    AUTH_PASS: string;
    ALLOW_UPLOAD_TO_SUB_DIR: boolean;
    ALLOW_OVERRIDE_EXISTING_FILE: boolean;
    FORM_DATA_FIELD_FILE: string;
    FORM_DATA_FIELD_DIR: string;
}

export interface AppConfig {
    NODE_ENV: string;
    PORT: number;
    ENABLE_HTTPS: boolean;
    SSL_KEY_PATH: string;
    SSL_CERT_PATH: string;
    ENABLE_LOG: boolean;
    LOG_FILE_PATH: string;
    ANSI_LOG_FILE_PATH: string;
    Servers: Server[];
}
