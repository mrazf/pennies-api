FROM node:boron

# Get cron
RUN apt-get update && apt-get install -y cron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Cron
ADD crontab /etc/cron.d/pennies
RUN chmod 0644 /etc/cron.d/pennies
RUN touch /var/log/cron.log

# Bundle app source
COPY ./build /usr/src/app

CMD cron && tail -f /var/log/cron.log