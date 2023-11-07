FROM node:20-alpine as builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm ci
RUN npm run prisma:generate

COPY . .

RUN npm run build

FROM node:20-alpine

RUN apk update
RUN apk add busybox-extras nano procps net-tools curl

# COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./
# COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/dist ./dist

EXPOSE 3000
