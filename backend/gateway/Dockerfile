FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY gateway/package*.json ./gateway/
RUN cd gateway && npm ci --omit=dev

COPY gateway ./gateway
COPY shared ./shared

WORKDIR /app/gateway

ENV NODE_ENV=production
EXPOSE 10000

CMD ["npm", "start"]
