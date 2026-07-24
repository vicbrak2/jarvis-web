FROM node:20-alpine

WORKDIR /app

# Invalidate cache - force fresh rebuild
ARG BUILD_DATE
ENV BUILD_DATE=$BUILD_DATE

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app
COPY . .

# Build
RUN npm run build

# Start - use PORT env var from Railway, default to 5173
ENV NODE_ENV=production
CMD sh -c "npm run preview -- --port ${PORT:-5173} --host 0.0.0.0"
