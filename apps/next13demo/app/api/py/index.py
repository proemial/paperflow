from http.server import BaseHTTPRequestHandler

# - https://vercel.com/blog/vercel-dev
# - https://vercel.com/templates/python/python-hello-world
# - https://vercel.com/docs/concepts/functions/serverless-functions/runtimes/python

class handler(BaseHTTPRequestHandler):
 
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Hello, world!'.encode('utf-8'))
        return