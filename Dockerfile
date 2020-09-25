FROM node:10-stretch-slim

WORKDIR /usr/src/filter-engine-poerates
COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY src src

RUN npm install -g typescript && \
    npm install && \
    npm run build

CMD ["npm", "start"]
