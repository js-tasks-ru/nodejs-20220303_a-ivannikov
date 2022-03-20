const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const stream = require('stream');
const LimitSizeStream = require('../01-limit-size-stream/LimitSizeStream');

const server = new http.Server();

const unlinkFile = (filename) => {
  fs.unlink(filename, (error) => {
    if (error) {
      console.error(`Unlink error: ${error.message}`);
      throw error;
    }
  });
}

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Wrong request');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const limiter = new LimitSizeStream({limit: 1024*1024});

      limiter.on('error', error => {
        if (error.code === 'LIMIT_EXCEEDED') {
          unlinkFile(filepath);
          res.statusCode = 413;
          res.end(error.message);
        }
      });

      const fstream = fs.createWriteStream(filepath, {flags: 'wx'});

      fstream.on('error', error => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
        } else {
          res.statusCode = 500;
          res.end('Internal server error');
        }
      });

      fstream.on('close', () => {
        if (!res.writableEnded) {
          res.statusCode = 201;
          res.end(`File '${pathname}' saved`);
        }
      });

      req.on('aborted', () => {
        unlinkFile(filepath);
      });

      req
        .pipe(limiter)
        .pipe(fstream);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
