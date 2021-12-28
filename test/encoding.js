"use strict";

var fs = require('fs');
var HTTP = require('http');

var Parser = require('../index.js');

var Expect = require('chai').expect;

var IN_DIR = __dirname + '/input';
var OUT_DIR = __dirname + '/output';

describe('Parser', function() {

   it('should use proper encoding', function(done) {
    var INPUT_FILE = __dirname + '/input/encoding.rss';
    var OUTPUT_FILE = __dirname + '/output/encoding.json';
    var ENCODING = 'latin1';
    var server = HTTP.createServer(function(req, res) {
      res.setHeader('Content-Type', 'text/xml; charset=' + ENCODING)
      var file = fs.readFileSync(INPUT_FILE, ENCODING);
      res.end(file, ENCODING);
    });
    server.listen(function() {
      var port = server.address().port;
      var url = 'http://localhost:' + port;
      var parser = new Parser();
      parser.parseURL(url, function(err, parsed) {
        Expect(err).to.equal(null);
        if (process.env.WRITE_GOLDEN) {
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify({feed: parsed}, null, 2), {encoding: ENCODING});
        } else {
          var expected = JSON.parse(fs.readFileSync(OUTPUT_FILE, ENCODING));
          Expect({feed: parsed}).to.deep.equal(expected);
        }
        server.close();
        done();
      })
    })
  });

  // it('should handle windows-1251 encoding', function(done) {
  //   var INPUT_FILE = __dirname + '/input/windows-encoded.rss';
  //   // var OUTPUT_FILE = __dirname + '/output/windows-encoded.json';
  //   var ENCODING = 'windows-1251';
  //   var server = HTTP.createServer(function(req, res) {
  //     res.setHeader('Content-Type', 'text/xml; charset=' + ENCODING)
  //     // In order for the test file with windows 1251 encoding to work, we need to
  //     // actuallly read it and send it in the test server, which is not supported it seems
  //     var file = fs.readFileSync(INPUT_FILE, ENCODING);
  //     res.end(file, ENCODING);
  //   });
  //   server.listen(function() {
  //     var port = server.address().port;
  //     var url = 'http://localhost:' + port;
  //     var parser = new Parser();
  //     parser.parseURL(url, function(err, parsed) {
  //       Expect(err).to.equal(null);
  //       server.close();
  //       done();
  //     })
  //   })
  // });

  it('should handle windows-1251 encoding', function(done) {
    var parser = new Parser();

    parser.parseURL('https://www.novinite.bg/rss.php', function(err, parsed) {
      Expect(err).to.equal(null);
      console.log(parsed);
      done();
    })
  });
})
