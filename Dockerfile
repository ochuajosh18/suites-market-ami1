FROM node:12.21.0-alpine
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY .env.development ./
COPY . ./
RUN yarn
RUN yarn global add react-scripts@3.4.1 --silent
RUN yarn run build-staging
COPY public ./
EXPOSE 80
CMD ["npm", "run", "start"]
