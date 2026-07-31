# Stage 1: Build static assets
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm for package management
RUN npm install -g pnpm

# Copy package descriptors first to leverage docker caching
COPY package*.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the source code and build
COPY . .
RUN pnpm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
