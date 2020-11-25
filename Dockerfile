FROM node:15
WORKDIR /var/www/app
COPY . .
# Install dependencies
RUN yarn install
RUN yarn build
WORKDIR /var/www/app/packages/app
CMD ["yarn", "dev:server"]