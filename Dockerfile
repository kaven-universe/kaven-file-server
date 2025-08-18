FROM node:lts-alpine as build

WORKDIR /app

COPY . .

RUN npm install --production && npm i -g @vercel/ncc
RUN ncc build index.js -o dist --minify

FROM node:lts-alpine

WORKDIR /app

# COPY --from=build /app/dist .
COPY --from=build /app/dist/index.js .
COPY .config.example.json ./
COPY favicon.ico ./
COPY LICENSE ./

LABEL name="kaven-file-server" \
    author="Kaven" \
    email="kaven@wuwenkai.com" \
    version="1.1.0" \
    description="A simple http(s) server for file upload."

EXPOSE 80
CMD [ "node", "index.js" ]
