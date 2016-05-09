"use strict";

const protocolRegex = /\w+:\/\//;
const hostRegex = /\w+\.\w{1,3}\//;
const pathRegex = /\/w+|d+$|\//;

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

export { protocolRegex };
export { hostRegex };
export { pathRegex };
