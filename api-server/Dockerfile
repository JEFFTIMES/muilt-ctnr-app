FROM node:16-alpine
WORKDIR /usr/local/api-server
COPY ./package*.json .
RUN npm ci
COPY . . 
CMD ["npm", "run" , "start"]