FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:20 AS serve
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "5173"]