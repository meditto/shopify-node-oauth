FROM node:14-alpine as base

WORKDIR /home/app
COPY package.json ./
ENV NODE_ENV development
RUN yarn install
COPY . .
RUN yarn compile

FROM base as production
WORKDIR /home/app
COPY package.json ./
ENV NODE_ENV production
RUN yarn install --production
COPY --from=base /home/app/dist ./dist
COPY --from=base /home/app/.env .env
