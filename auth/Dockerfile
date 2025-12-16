FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (use npm install to be safe if no lockfile)
COPY package*.json ./
RUN npm install 

# Copy app source
COPY . .


# Default environment

ENV PORT=3000

# Expose port (override using --env or env file)
EXPOSE 3000

# Start the app (server.js exists at repo root)
CMD ["node", "server.js"]
