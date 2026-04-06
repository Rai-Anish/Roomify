# Stage 1: Install all dependencies
FROM node:20-alpine AS development-dependencies-env
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Install production dependencies
FROM node:20-alpine AS production-dependencies-env
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 3: Build the app
FROM node:20-alpine AS build-env
WORKDIR /app
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN npm run build

# Stage 4: Execution
FROM node:20-alpine
WORKDIR /app

# Copy production node_modules and the build folder
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build
COPY package.json ./

# IMPORTANT: React Router v7 needs the server to listen on 0.0.0.0
ENV HOST=0.0.0.0
ENV PORT=5173
ENV NODE_ENV=production

EXPOSE 5173

# Using the script from your package.json
CMD ["npm", "run", "start"]