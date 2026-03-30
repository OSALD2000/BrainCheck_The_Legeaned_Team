FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (not just production for now)
RUN npm ci

# Copy application files
COPY . .

# Expose port
EXPOSE 8888

# Start the application
CMD ["node", "index.js"]
