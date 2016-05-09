"use strict";

var urlRegex: string = "";
var rootElement: Object;

function noop() {}

function setRoot(selector) {
  rootElement = document.querySelector(selector);
}

function getRoot() {
  return rootElement;
}

export { noop };
export { setRoot };
export { getRoot };
