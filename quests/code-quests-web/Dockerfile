# Stage 1: Build the application
FROM node:20.9.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy the build artifacts from the builder stage to the nginx server
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

