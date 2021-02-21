FROM node:12.7-alpine
RUN npm install -g @ionic/cli
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend .
EXPOSE 8100