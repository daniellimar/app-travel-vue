FROM node:20-slim AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm ci --production=false --silent

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]