const Promise = require('bluebird');

class PostRequestBase {

  constructor(req,res) {
    this.req = req;
    this.res = res;
  }

  run(afunction) {
    console.log("PostApiBase");
    let body = "";
    this.req.on('data', function (chunk) {
      body += chunk;
    });
    this.req.on('end', function () {
      console.log(body);
      let postPara = JSON.parse(body);
      afunction(postPara);
    });
  }

} module.exports = PostRequestBase;
