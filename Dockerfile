FROM node:20-alpine AS builder
WORKDIR /vlp

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

FROM nginx:1.27.3-alpine

COPY  nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /vlp/dist/vlp-frontend-angular/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]