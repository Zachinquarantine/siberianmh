FROM node:14

ARG COMMIT_SHA
LABEL commit ${COMMIT_SHA}

WORKDIR /usr/src/app

ENV COMMIT_SHA ${COMMIT_SHA}

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/the-board-discord-bot/package.json ./packages/the-board-discord-bot/

RUN yarn

COPY ./packages/the-board-discord-bot/ ./packages/the-board-discord-bot/

RUN yarn workspace @siberianmh/the-board build

CMD [ "node", "packages/the-board-discord-bot/dist/index.js" ]
