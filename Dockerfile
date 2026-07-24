FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first for Docker layer caching.
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production

CMD sh -c "npm run preview -- --port ${PORT:-5173} --host 0.0.0.0"
