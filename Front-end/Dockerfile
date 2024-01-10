
FROM --platform=amd64 node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build


FROM --platform=amd64 nginx:1.25-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build /usr/share/nginx/html

# COPY ./build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]