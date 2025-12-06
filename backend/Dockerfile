FROM node:22-alpine

WORKDIR /app

# Everything is mounted via docker-compose volumes
# Dependencies will be installed on first run via entrypoint

EXPOSE 3000

CMD ["sh", "-c", "npm install && npm run start:dev"]
