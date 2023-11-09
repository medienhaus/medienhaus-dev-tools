# https://github.com/vercel/next.js/blob/canary/examples/with-docker-compose/next-app/dev.Dockerfile

FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

#COPY src ./src
#COPY public ./public
#COPY next.config.js .
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

CMD npm run dev
