FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only=prod

COPY . .

ENV NODE_ENV=production

RUN npx  prisma migrate deploy

RUN npx  prisma generate

CMD ["npm", "start"]   