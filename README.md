# nodejs-express-koa2-blog
## http-server -p 8001
##npm start
'''
worker_processes 2;
events {
    worker_connections  1024;
}
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    server {
        listen       8080;
        server_name  localhost;
        error_page   500 502 503 504  /50x.html;
		#静态文件，客户端
		location /{
			proxy_pass http://localhost:8001;
		}
		#服务端
		location /api/{
			proxy_pass http://localhost:8000;
			proxy_set_header Host $host;
		}
    }
}
'''
