FROM node:14

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/arcadia/server/package.json ./packages/arcadia/server/

RUN yarn --frozen-lockfile

COPY ./packages/arcadia/server/ ./packages/arcadia/server/

RUN yarn workspace @arcadia/server build

EXPOSE 5000

CMD [ "node", "packages/arcadia/server/dist/index.js" ]
