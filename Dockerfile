FROM node:10-alpine as builder

RUN mkdir /app
WORKDIR /app

COPY chess/package.json chess/package-lock.json /app/chess/

RUN npm install --prefix chess

COPY . /app
RUN npm run ng build --prefix chess -- --output-path=./dist/out

FROM nginx:1.15.7-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/chess/dist/out /usr/share/nginx/html