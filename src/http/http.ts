'use strict';

import { noop } from '../utils/utils';

const $http = {
  get(url, callback) {
    var cb = callback || noop;
    var req = new XMLHttpRequest();

    req.onreadystatechange = xhrCb;
    req.open('GET', url);
    req.send();

    function xhrCb() {
      if (req.readyState === XMLHttpRequest.DONE) {
        if (req.status === 200) {
          cb(null, req.responseText);
        } else {
          cb(req.status);
        }
      }
    }
  }
};

export default $http;
