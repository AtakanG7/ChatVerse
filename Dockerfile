FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
RUN npx prisma generate
CMD ["node", "--loader", "ts-node/esm", "./server.ts"]
