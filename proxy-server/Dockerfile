# 🐳 DOCKERFILE CHATGPT PROXY SERVER V2.0
# Optimizado para producción Google Play & App Store

FROM node:18-alpine AS base

# Instalar dependencias necesarias
RUN apk add --no-cache \
    curl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs
RUN adduser -S chatgpt -u 1001

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Copiar código fuente
COPY . .

# Build TypeScript
RUN npm run build

# Cambiar ownership a usuario nodejs
RUN chown -R chatgpt:nodejs /app
USER chatgpt

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000
ENV CHATGPT_RATE_LIMIT=20
ENV CHATGPT_RATE_WINDOW=60000

# Comando por defecto
CMD ["npm", "start"]

# Metadata
LABEL maintainer="tu-email@ejemplo.com"
LABEL version="2.0.0"
LABEL description="ChatGPT Proxy Server for Medical AI - Production Ready"
LABEL chatgpt.plus.optimized="true"
LABEL medical.compliance="HIPAA-ready"
LABEL app.store.ready="Google Play & App Store"
