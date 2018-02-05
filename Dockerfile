FROM node:alpine

ENV PORT 3000

EXPOSE 3000

COPY package*.json ./
RUN npm install --production

COPY tsconfig.json ./
COPY src ./src 
RUN npm run-script tsc

CMD ["node", "dist/"]
