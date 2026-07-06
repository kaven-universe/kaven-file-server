FROM node:lts-alpine

WORKDIR /app

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install pnpm and only production dependencies
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod

# Copy source files directly into /app
COPY src/ ./

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

# Label
LABEL name="kaven-file-server" \
    author="Kaven" \
    email="kaven@wuwenkai.com" \
    version="1.2.2" \
    description="A simple http(s) server for file upload."

# Expose port
EXPOSE 3014

# Use dumb-init as entrypoint
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Start the server
CMD ["node", "index.js"]