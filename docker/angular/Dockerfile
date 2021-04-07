FROM node:12.7-alpine
RUN npm install -g @ionic/cli
RUN npm install -g @angular/cli@latest
RUN apk update && apk add bash
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
EXPOSE 8100
