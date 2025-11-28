FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
expose 3000
CMD ["node", "server.js"]