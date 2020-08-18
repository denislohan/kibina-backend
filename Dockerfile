FROM node:latest
ARG PORT
WORKDIR /app
COPY package.json .
RUN yarn install
RUN yarn remove bcrypt
RUN yarn add bcrypt
COPY . .
EXPOSE $PORT
CMD [ "yarn", "local"]
