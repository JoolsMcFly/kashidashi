FROM node:8

RUN apt-get update && apt-get install -y \
    vim \
    sudo \
    && apt-get clean

RUN useradd -ms /bin/bash -p ovVXwfXAVb9Yg nodeuser
RUN adduser nodeuser sudo

RUN echo "fs.inotify.max_user_watches=524288" > /etc/sysctl.conf

RUN chown -R nodeuser:nodeuser /usr/local/lib/node_modules /usr/local/bin /usr/local/share

RUN npm completion >> ~/.bashrc

USER nodeuser
ENV HOME /home/nodeuser/app
WORKDIR /home/nodeuser/app
