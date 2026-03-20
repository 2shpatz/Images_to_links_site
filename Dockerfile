FROM nginx:alpine

# Copy site files
COPY site/ /usr/share/nginx/html/

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
