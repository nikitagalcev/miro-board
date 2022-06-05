FROM node:16.15 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./