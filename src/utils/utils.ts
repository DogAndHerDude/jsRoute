"use strict";

var urlRegex: any = "";
var rootElement: Object;

function noop() {}

function setRoot(selector) {
  rootElement = document.querySelector(selector);
}

export { noop };
export { rootElement };
export { setRoot };
