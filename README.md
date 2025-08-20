# [kaven-file-server](https://github.com/kaven-universe/kaven-file-server)

A simple http(s) server for file upload.

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
    -p 3000:80 \
    -v $(pwd)/uploads:/app/uploads \
    -v $(pwd)/.config.json:/app/.config.json \
    kavenzero/kaven-file-server:latest

# Powershell
docker run -d -it --name kaven-file-server -p 3000:80 -v ${PWD}/uploads:/app/uploads -v ${PWD}/.config.json:/app/.config.json kavenzero/kaven-file-server:latest
```

## API

POST `/file`

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
