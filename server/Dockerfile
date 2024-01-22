FROM  --platform=linux/amd64 node:latest

WORKDIR /server

COPY entrypoint.sh .

COPY package*.json ./

RUN npm install

RUN npm install bcrypt

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 8080

RUN sleep 2

CMD ["./entrypoint.sh"]