const qs = require('querystring');
const url = require('url');

let util = {
  checkMpLogin : (html) => {
    return !((/id="loginBt"/).test(html)||(/class="icon_page_error"/).test(html))
  },
  handleRedirectMessage : (origin) => {
    return qs.parse(url.parse(origin).query).requrl || origin;
  }
}

 module.exports = util
