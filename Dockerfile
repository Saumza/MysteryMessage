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


COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/public ./public

RUN npm ci --only=production

EXPOSE 3000

CMD npm start
