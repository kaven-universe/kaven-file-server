# [kaven-file-server](https://github.com/kaven-universe/kaven-file-server)

A simple http(s) server for file upload.

> **Note:** Since `v1.2.2`, the default port has changed from `80` to `3014` to support running as a non-root user in Docker. The official image maps `-p 80:3014` so external access on port 80 still works.

## [Docker](https://hub.docker.com/r/kavenzero/kaven-file-server)

```sh
# copy `.config.example.json` file
docker run --name temp -d kavenzero/kaven-file-server:latest
docker cp temp:/app/.config.example.json $(pwd)/.config.json
docker rm -f temp

# run
docker run -d \
    -it \
    --name kaven-file-server \
    -p 80:3014 \
    -v $(pwd)/uploads:/app/uploads \
    -v $(pwd)/.config.json:/app/.config.json \
    kavenzero/kaven-file-server:latest

# Powershell
docker run -d -it --name kaven-file-server -p 80:3014 -v ${PWD}/uploads:/app/uploads -v ${PWD}/.config.json:/app/.config.json kavenzero/kaven-file-server:latest
```

## Config

```json
{
    "NODE_ENV": "production",
    "PORT": 3014,

    "ENABLE_HTTPS": false,
    "SSL_KEY_PATH": "",
    "SSL_CERT_PATH": "",

    "ENABLE_LOG": true,
    "LOG_FILE_PATH": "./logs/logs.txt",
    "ANSI_LOG_FILE_PATH": "./logs/ansi_logs.txt",

    "Servers": [
        {
            "PATH": "/file",
            "UPLOAD_ROOT": "./uploads/public",

            "ENABLE_AUTHENTICATION": false,
            "AUTH_USER": "Kaven",
            "AUTH_PASS": "kaven@wuwenkai.com",

            "ALLOW_UPLOAD_TO_SUB_DIR": true,
            "ALLOW_OVERRIDE_EXISTING_FILE": true,

            "FORM_DATA_FIELD_FILE": "",
            "FORM_DATA_FIELD_DIR": "dir"
        },
        {
            "PATH": "/private",
            "UPLOAD_ROOT": "./uploads/private",

            "ENABLE_AUTHENTICATION": true,
            "AUTH_USER": "Kaven",
            "AUTH_PASS": "kaven@wuwenkai.com",

            "ALLOW_UPLOAD_TO_SUB_DIR": true,
            "ALLOW_OVERRIDE_EXISTING_FILE": false,

            "FORM_DATA_FIELD_FILE": "",
            "FORM_DATA_FIELD_DIR": "dir"
        }
    ]
}
```

## API

POST `PATH`

```sh
POST /file
POST /private
...
```

### [KCmd](https://www.nuget.org/packages/KCmd)

```sh
kcmd upload ./file.txt http://127.0.0.1/file
kcmd upload ./ http://127.0.0.1/file Destination:sub/dir -r -keep

kcmd upload ./build/app-release.apk http://127.0.0.1/file dest:"My App {{Version}}.apk"

kcmd upload ./file.txt http://127.0.0.1/private auth:Digest u:username p:password
kcmd upload ./ https://my-server.com/private auth:Digest u:username p:password dns:8.8.8.8
```

### curl

```sh
curl -F "file=@/path/to/file" http://127.0.0.1/file

curl \
    -F "file_name=new name" \
    -F "dir=sub/dir/" \
    -F "file=@/path/to/file" \
    http://127.0.0.1/file
```

## FormData

Upload one file:

```js
formData.append("file", file);

// upload to a subdirectory, defined by FORM_DATA_FIELD_DIR
formData.append("dir", "sub/dir");
formData.append("file", file);

// change the file name
formData.append("file_name", "new name");
formData.append("file", file);
```

Upload multiple files:

```js
formData.append("file", file1);
formData.append("file", file2);
// file3, file4, ...

formData.append("dir", "sub/dir");
formData.append("file", file1);
formData.append("file", file2);
// file3, file4, ...

// change the file name of each file
formData.append("file1_name", "name1");
formData.append("file2_name", "name2");
formData.append("file1", file1);
formData.append("file2", file2);
// file3, file4, ...

// change the dir of each file
formData.append("file1_dir", "sub/dir1");
formData.append("file2_dir", "sub/dir2");
formData.append("file1", file1);
formData.append("file2", file2);
// file3, file4, ...
```

Note: **Please make sure file fields are append after other fields.**
