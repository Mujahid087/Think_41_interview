# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose port (e.g., 5000)
EXPOSE 5000

# Start the server
CMD ["npm", "run", "dev"]
