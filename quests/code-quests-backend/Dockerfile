# Use node image as base
FROM node:21.6.1-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Compile TypeScript files
RUN npm run compile

# # Run database migration
# RUN npm run migrate

# Expose port 3000
EXPOSE 3000

# Command to start the backend
CMD ["sh","entrypoint.sh"]

