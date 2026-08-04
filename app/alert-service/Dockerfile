FROM node:22-alpine

WORKDIR /app

COPY package*.json ./  

RUN npm ci
# installing curl for healthchecks
RUN apk add --no-cache curl

COPY . .

EXPOSE 3001

CMD ["npm","run","docker"]