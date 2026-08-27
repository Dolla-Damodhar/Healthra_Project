# Stage 1: Build stage
FROM node:20-alpine as builder

ARG VITE_HEALTHRA_BASEURL
ENV VITE_HEALTHRA_BASEURL=$VITE_HEALTHRA_BASEURL

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy code and build
COPY . .
RUN npm run build

# Stage 2: Production server (Nginx)
FROM nginx:1.25-alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration to handle React Router client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
