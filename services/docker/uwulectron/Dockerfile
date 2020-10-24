ARG COMMIT_SHA
FROM node:14
LABEL commit-git ${COMMIT_SHA}

WORKDIR /usr/src/app

ENV COMMIT_SHA ${COMMIT_SHA}

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/uwulectron-discord-bot/package.json ./packages/uwulectron-discord-bot/

RUN yarn

COPY ./packages/uwulectron-discord-bot/ ./packages/uwulectron-discord-bot/

RUN yarn workspace @siberianmh/uwulectron build

CMD [ "node", "packages/uwulectron-discord-bot/dist/index.js" ]
