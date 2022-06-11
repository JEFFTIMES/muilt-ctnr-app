FROM node:16-alpine
WORKDIR /usr/local/api-server
COPY ./package*.json ./
# for production build, use npm ci instead of npm install
RUN npm ci 
COPY . . 
CMD ["npm", "run" , "start"]