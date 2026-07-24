FROM node:20-alpine

WORKDIR /app

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
ENV PORT=3000
CMD ["npm", "run", "preview", "--", "--port", "3000"]
