FROM node:alpine
ARG NODE_ENV
ARG DB_HOST
ARG DB_PORT
ARG PORT

ARG PUBSUB_REDIS_PORT
ARG PUBSUB_REDIS_URL

ENV NODE_ENV=$NODE_ENV
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT

ENV PUBSUB_REDIS_PORT=$PUBSUB_REDIS_PORT
ENV PUBSUB_REDIS_URL=$PUBSUB_REDIS_URL

ENV PORT=$PORT

EXPOSE 3000

RUN npm set registry https://npm-registry.dukfaar.com

COPY package*.json ./
RUN npm install --production

COPY tsconfig.json ./
COPY src ./src 
RUN npm run-script tsc

CMD ["node", "dist/"]