# Dockerfile

# --- Stage 1: Builder ---
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy file package để cài dependency trước (tận dụng cache layer)
COPY package*.json ./
COPY prisma ./prisma/ 

# Cài đặt dependencies
RUN npm ci

# Copy toàn bộ source code
COPY . .

# Generate Prisma Client (Rất quan trọng vì bạn dùng Prisma)
RUN npx prisma generate

# Build toàn bộ project (tạo ra dist/apps/app1, dist/apps/app2...)
RUN npm run build

# --- Stage 2: Runner ---
FROM node:18-alpine AS runner

WORKDIR /usr/src/app

# Copy dependency từ builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Thiết lập biến môi trường cơ bản
ENV NODE_ENV=production

# Lệnh CMD sẽ được ghi đè trong docker-compose
CMD ["node", "dist/apps/app-1/main"]