FROM node:16 as builder

WORKDIR /usr/src/app

COPY . .

RUN yarn install

RUN yarn build

FROM node:slim

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
CMD [ "yarn", "start" ]