FROM node:20-slim

WORKDIR /app

# Copy package files first (for layer caching)
COPY package.json .npmrc ./

# Install ALL dependencies (no lockfile = npm install works)
RUN npm install

# Copy rest of the code
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
