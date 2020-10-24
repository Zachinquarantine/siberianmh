FROM node:14

ARG GIT_COMMIT
ARG VERSION="master"

LABEL commit ${GIT_COMMIT}
LABEL version ${VERSION}

WORKDIR /usr/src/app

ENV GIT_COMMIT ${GIT_COMMIT}
ENV VERSION ${VERSION}

COPY package.json yarn.lock tsconfig.json ./
COPY ./packages/roads/server/package.json ./packages/roads/server/

RUN yarn --frozen-lockfile

COPY ./packages/roads/server/ ./packages/roads/server/

RUN yarn workspace @roads/server build

EXPOSE 5000

CMD [ "node", "packages/roads/server/dist/index.js" ]
