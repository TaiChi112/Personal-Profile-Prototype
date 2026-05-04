# Stage 1: Build stage
FROM oven/bun:1 AS builder

WORKDIR /app

# คัดลอกเฉพาะไฟล์ที่จำเป็นสำหรับการติดตั้ง dependencies ก่อน (เพื่อทำ Caching)
COPY package.json bun.lock ./
COPY prisma ./prisma

# ติดตั้ง Dependencies ด้วย Bun
RUN bun install --frozen-lockfile

# คัดลอก Source Code ทั้งหมด
COPY . .

# สร้าง Prisma Client
RUN bunx prisma generate

# ---------------------------------------------------------
# *** เพิ่มบรรทัดนี้: ใส่ตัวแปรหลอกๆ ให้ Next.js เช็คผ่านตอน Build ***
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy_db"
# (ถ้าโค้ดของคุณมีการเช็คตัวแปรอื่นตอน Build เช่น NEXTAUTH_SECRET ก็เติมต่อตรงนี้ได้เลย)
# ---------------------------------------------------------

# Build Next.js application
RUN bun run build

# Stage 2: Production stage
FROM oven/bun:1-slim AS runner

WORKDIR /app

# กำหนด Environment 
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# คัดลอกไฟล์ที่ Build เสร็จแล้วจาก Stage 1 มาใช้งาน
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.source ./.source
COPY --from=builder /app/docs ./docs

# ใช้ user 'bun' ที่แถมมากับ image เพื่อความปลอดภัย (ไม่ใช้ root)
USER bun

# เปิด Port 3000
EXPOSE 3000

# รันแอปพลิเคชัน
CMD ["bun", "run", "start"]