FROM node:alpine
ARG DB_HOST
ARG DB_PORT

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT

ENV PORT 3000

EXPOSE 3000

COPY package*.json ./
RUN npm install --production

COPY tsconfig.json ./
COPY src ./src 
RUN npm run-script tsc

CMD ["node", "dist/"]
