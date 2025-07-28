FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS production-stage
WORKDIR /app
COPY --from=build-stage /app/dist ./dist
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]