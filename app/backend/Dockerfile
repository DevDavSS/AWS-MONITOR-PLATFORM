FROM node:22-alpine 

WORKDIR /app

# first build dependencies
COPY package*.json ./  

# execute npm install for dependencies
RUN npm ci
# installing curl for healthchecks
RUN apk add --no-cache curl

# copy source code
COPY . .

EXPOSE  3000

CMD ["npm","run","docker"]