# Use an official Node runtime as a parent image
FROM node:20.13.1-alpine3.20 as builder

WORKDIR /usr/src/app

COPY . /app
WORKDIR /app
RUN npm install
RUN npx tsc    
RUN ls 


FROM node:20.13.1-alpine3.20
EXPOSE 3000
RUN mkdir /srv/code
WORKDIR /srv/code
COPY --from=builder /app .
RUN ls
ENTRYPOINT ["node" ,"dist/app.js"]





