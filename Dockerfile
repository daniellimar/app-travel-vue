FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --silent

COPY . .

RUN [ -f .env ] || cp .env-example .env

RUN npm run build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
