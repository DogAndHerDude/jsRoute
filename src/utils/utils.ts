"use strict";

const protocolRegex = /\w+\:\/\//;
const hostRegex = /\w+\.\w{1,4}\//;
const pathRegex = /\/w+|d+$|\//;

var rootElement;
var rootView;

function noop() {}

function setView(selector) {
  rootView = document.querySelector(selector);
}

function getView() {
  return rootView;
}

function setRoot() {
  rootElement = document.querySelector('.jsroute-app');
}

function getRoot() {
  return rootElement;
}

export { noop };
export { setView };
export { getView };
export { setRoot };
export { getRoot };

export { protocolRegex };
export { hostRegex };
export { pathRegex };
