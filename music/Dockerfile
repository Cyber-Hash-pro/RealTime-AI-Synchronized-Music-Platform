# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose the port (default 3001)
EXPOSE 3000

# Set environment variables (these can be overridden at runtime)
ENV NODE_ENV=production
ENV PORT=3000

# Start the server
CMD ["node", "server.js"]
# Build the image




# docker build -t music-service .

# Run the container (pass environment variables)
# docker run -p 3001:3001 \
#   -e PORT=3001 \
#   -e MONGODB_URI=your_mongodb_uri \
#   -e JWT_SECRET=your_jwt_secret \
#   music-service