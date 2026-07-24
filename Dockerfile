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

# Start
ENV NODE_ENV=production
CMD ["npm", "run", "preview", "--", "--port", "5173", "--host", "0.0.0.0"]
