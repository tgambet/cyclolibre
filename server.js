const express = require('express');
const app = express();
const path = require('path');
const compression = require('compression');

const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
};

if (process.env.PRODUCTION === "true") {
  app.use(forceSSL());
  app.use(compression());
}

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 8080);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
