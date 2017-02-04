FROM phusion/baseimage:0.9.19
MAINTAINER bartwr <mail@bartroorda.nl>

# For nano to work
ENV TERM xterm

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get update
RUN apt-get install -y build-essential tcl curl wget python2.7 python2.7-dev python-pip nodejs sudo

# We prebuild our meteor app, so no need to install this inside docker...
# RUN curl https://install.meteor.com/ | sh

WORKDIR /var/www/app
ENV MONGO_URL mongodb://db:27017/commonbike
#ENV MONGO_OPLOG_URL mongodb://db:27017/local

EXPOSE 80
ENV PORT 80

ENV METEOR_SETTINGS=

ADD ./docker/bin/run-server.sh /etc/service/server/run
ADD ./mrt_build /var/www/app

WORKDIR /var/www/app/bundle/programs/server
RUN npm install

# Clean up
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
