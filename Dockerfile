# --- Stage 1: Base (Chỉ cài OS tools) ---
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# --- Stage 2: Dependencies (Cài toàn bộ để build) ---
FROM base AS deps
COPY package*.json ./
# Cài cả devDeps để có Nest CLI và các công cụ build
RUN npm ci

# --- Stage 3: Builder (Generate Prisma & Build code) ---
FROM deps AS builder
ARG APP_NAME
COPY . .

# 1. Generate Prisma Client (tạo ra các file engine cần thiết)
RUN if [ -f "apps/${APP_NAME}/prisma/schema.prisma" ]; then \
      npx prisma generate --schema=apps/${APP_NAME}/prisma/schema.prisma; \
    fi

# 2. Build App (biên dịch TS sang JS)
RUN npm run build ${APP_NAME}

# 3. Dọn dẹp node_modules: Chỉ giữ lại production dependencies
# Bước này cực kỳ quan trọng để giảm dung lượng
RUN npm prune --production && npm cache clean --force

# --- Stage 4: Production Runner (Image cuối cùng siêu nhẹ) ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ARG APP_NAME

# Copy node_modules ĐÃ ĐƯỢC TỐI ƯU (chỉ còn lại thư viện chạy)
COPY --from=builder /app/node_modules ./node_modules

# [QUAN TRỌNG] Copy folder Prisma đã generate (nếu bạn dùng output tùy chỉnh)
# Nếu bạn dùng mặc định trong node_modules thì bước trên đã bao gồm rồi
# Nếu dùng output ngoài, hãy bỏ comment dòng dưới:
# COPY --from=builder /app/apps/${APP_NAME}/generated ./apps/${APP_NAME}/generated

# Copy code đã build
COPY --from=builder /app/dist/apps/${APP_NAME} ./dist

# Lệnh chạy
CMD ["node", "dist/main"]