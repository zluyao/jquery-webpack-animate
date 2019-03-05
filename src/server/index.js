var S = require('string');
var http = require('http');
var parse = require('url-parse');
var webpack = require('webpack');
var Express = require('express');
var bodyParser = require('body-parser');
var proxyMiddleware = require('http-proxy-middleware');
var webpackMiddleware = require('webpack-dev-middleware');

const app = new Express()
  , server = new http.Server(app)
  , defaultRouter = new Express.Router()
  , webpackConfig = require('../../config/webpack.config.dev');

require('./logic')(defaultRouter);

app.use((req, res, next) => {
  if (req.method === 'GET' && req.headers.accept && req.headers.accept.indexOf('text/html') !== -1) {
    var url = parse(req.url)
      , $pathname = S(url.pathname)
      , isHtmlNoExt = $pathname.endsWith('.html');

    const isResource = $pathname.endsWith('.js') ||
      $pathname.endsWith('.css') ||
      $pathname.endsWith('.gif') ||
      $pathname.endsWith('.png') ||
      $pathname.endsWith('.jpg');

    if (!isResource && !isHtmlNoExt) {
      if (url.pathname === '/') {
        url.pathname = '/index.html';
      } else {
        url.pathname = `${$pathname.chompRight('/')}/index.html`;
      }

      console.log('Request redirect to: %s => %s', req.url, url.toString());
      res.redirect(url.toString());

      return;
    }
  }

  console.log('Request URL:', req.url);
  next();
});

if (process.env.PROXY) {
  app.use(proxyMiddleware('/api', {
    target: 'http://10.20.0.56:8888',
    changeOrigin: true,
    pathRewrite(path, req) {
      return path.replace('/api', '');
    },
  }));
} else {
  app.use(bodyParser.urlencoded({ extended: false }))
    .use(bodyParser.json())
    .use(defaultRouter);
}

app.use(webpackMiddleware(webpack(webpackConfig), {
  quiet: true,
  stats: {
    colors: true,
    modules: false,
  },
}));

server.listen(3000, () => console.log('Listening on http://localhost:3000'));
