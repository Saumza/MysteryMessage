# Base Stage
FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache g++ make py3-pip libc6-compat
COPY package*.json ./
RUN npm install


# Build Stage
FROM base AS builder
WORKDIR /app
COPY . .
COPY .env.production.sample .env.production
RUN npm run build

#Production Stage
FROM node:22-alpine AS production
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public


EXPOSE 3000

CMD node server.js
