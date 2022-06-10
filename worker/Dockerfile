FROM node:16-alpine
WORKDIR /usr/local/worker
COPY ./package*.json .
RUN npm ci
COPY . . 
CMD ["npm", "run" , "start"]