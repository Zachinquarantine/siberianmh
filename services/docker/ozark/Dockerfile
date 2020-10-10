FROM node:14

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/ozark/server/package.json ./packages/ozark/server/
COPY ./packages/types/web/package.json ./packages/ozark/web/
COPY ./packages/ozark/web/package.json ./packages/ozark/web/

RUN yarn --frozen-lockfile

COPY ./packages/ozark/server/ ./packages/ozark/server/
COPY ./packages/ozark/types/ ./packages/ozark/server/
COPY ./packages/ozark/web/ ./packages/ozark/web/

RUN cd ./packages/ozark/web/ && yarn build

EXPOSE 5000

CMD [ "yarn", "ts-node ./packages/ozark/server/index.ts" ]
