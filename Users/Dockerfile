# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# install deps first (better cache)
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# build args (API URL)
ARG VITE_API_AUTH_URL
ENV VITE_API_AUTH_URL=$VITE_API_AUTH_URL

# build react
RUN npm run build

