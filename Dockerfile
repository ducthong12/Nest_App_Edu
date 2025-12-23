# --- Stage 1: Base & Dependencies ---
FROM node:20-alpine AS base

# Cài thư viện hệ thống cần thiết để build (python, make, g++ có thể cần cho một số thư viện npm)
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package*.json ./

# Cài đặt dependencies
RUN npm ci

# --- Stage 2: Builder (QUAN TRỌNG: Chuyển generate xuống đây) ---
FROM base AS builder

WORKDIR /app

# 1. Copy toàn bộ source code vào trước (Lúc này mới có folder apps/user/prisma)
COPY . .

# 2. Copy node_modules từ stage base
COPY --from=base /app/node_modules ./node_modules

ARG APP_NAME

# 3. Generate Prisma Client TẠI ĐÂY (Vì source code đã có)
# Kiểm tra file schema, nếu có thì generate
RUN if [ -f "apps/${APP_NAME}/prisma/schema.prisma" ]; then \
      echo "🟢 Found Prisma schema for ${APP_NAME}, generating client..."; \
      npx prisma generate --schema=apps/${APP_NAME}/prisma/schema.prisma; \
    else \
      echo "🟡 No Prisma schema found for ${APP_NAME}, skipping..."; \
    fi

# 4. Build App
RUN npm run build ${APP_NAME}

# --- Stage 3: Production Runner ---
FROM node:20-alpine AS runner

WORKDIR /app

# Thiết lập biến môi trường
ENV NODE_ENV production

# Copy package.json
COPY --from=base /app/package*.json ./

# Copy node_modules TỪ BUILDER (Vì ở builder mình đã chạy prisma generate, nó sửa đổi node_modules)
COPY --from=builder /app/node_modules ./node_modules

ARG APP_NAME

# Copy folder dist
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

# Command chạy app
CMD ["node", "dist/main"]