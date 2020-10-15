FROM node:14

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/roads/server/package.json ./packages/roads/server/

RUN yarn --frozen-lockfile

COPY ./packages/roads/server/ ./packages/roads/server/

RUN yarn workspace @roads/server build

EXPOSE 5000

CMD [ "node", "packages/roads/server/dist/index.js" ]
