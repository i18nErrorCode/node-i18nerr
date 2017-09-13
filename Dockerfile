FROM keymetrics/pm2-docker-alpine:latest

# Bundle APP files
COPY build src/
COPY package.json ./
COPY pm2.json ./

# I need python

RUN apk update && apk add ca-certificates && update-ca-certificates

RUN wget http://mirrors.sohu.com/python/2.7.11/Python-2.7.11.tgz

RUN ls -al -R /home

RUN tar -xzf Python-2.7.11.tgz
RUN cd Python-2.7.11

RUN ./configure
RUN make
RUN sudo make install

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm config set registry https://registry.npm.taobao.org/
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn --production

# Show current folder structure in logs
RUN ls -al -R

CMD [ "pm2-docker", "start", "pm2.json" ]