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


# ---------- Production stage ----------
FROM nginx:alpine

# remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy build files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
