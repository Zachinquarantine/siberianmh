FROM node:14

ARG COMMIT_SHA
LABEL commit ${COMMIT_SHA}

WORKDIR /usr/src/app

ENV COMMIT_SHA ${COMMIT_SHA}

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/electron-discord/the-board/package.json ./packages/electron-discord/the-board/
COPY ./packages/electron-discord/constants/package.json ./packages/electron-discord/constants/

RUN yarn --frozen-lockfile

COPY ./packages/electron-discord/the-board/ ./packages/electron-discord/the-board/
COPY ./packages/electron-discord/constants/ ./packages/electron-discord/constants/

RUN yarn workspace @edis/common build
RUN yarn workspace @siberianmh/the-board build

CMD [ "node", "packages/electron-discord/the-board/dist/index.js" ]
