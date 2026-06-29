# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# Production stage — serve with a minimal static server
FROM node:20-alpine AS runner

RUN npm install -g serve@14

WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# VITE_API_BASE_URL can be injected at runtime via BACKEND_URL env var
ENV NODE_ENV=production
CMD ["serve", "-s", "dist", "-l", "3000"]
