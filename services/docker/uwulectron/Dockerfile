FROM node:14

ARG COMMIT_SHA
LABEL commit ${COMMIT_SHA}

WORKDIR /usr/src/app

ENV COMMIT_SHA ${COMMIT_SHA}

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/electron-discord/constants/package.json ./packages/electron-discord/constants/
COPY ./packages/electron-discord/uwulectron/package.json ./packages/electron-discord/uwulectron/

RUN yarn

COPY ./packages/electron-discord/constants/ ./packages/electron-discord/constants/
COPY ./packages/electron-discord/uwulectron/ ./packages/electron-discord/uwulectron/

RUN yarn workspace @edis/common build
RUN yarn workspace @siberianmh/uwulectron build

CMD [ "node", "packages/electron-discord/uwulectron/dist/index.js" ]
