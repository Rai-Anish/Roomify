# server/Dockerfile

# -----------------
# Stage 1: build
# -----------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy app code
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build the server
RUN npm run build

# -----------------
# Stage 2: production
# -----------------
FROM node:20-alpine
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built code and prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/node_modules ./node_modules

# Regenerate prisma client (optional if needed)
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 5000
CMD ["npm", "run", "start"]