FROM node:20-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --silent

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
