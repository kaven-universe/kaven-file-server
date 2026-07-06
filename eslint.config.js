/********************************************************************
 * @author:      Kaven
 * @email:       kaven@wuwenkai.com
 * @website:     http://blog.kaven.xyz
 * @file:        [kaven-file-server] /eslint.config.js
 * @create:      2025-08-18 10:55:19.029
 * @modify:      2026-07-02 15:17:03.740
 * @version:     1.2.2
 * @times:       2
 * @lines:       28
 * @copyright:   Copyright © 2025-2026 Kaven. All Rights Reserved.
 * @description: [description]
 * @license:     [license]
 ********************************************************************/

import configs, { globals } from "@wenkai.wu/eslint-config";

export default [
    ...configs,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
];
