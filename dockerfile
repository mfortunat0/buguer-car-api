FROM node:22-alpine3.19
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 8000
RUN yarn prisma generate
CMD ["yarn","start"]