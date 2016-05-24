"use strict";

const protocolRegex = /\w+\:\/\//;
const hostRegex = /\w+\.\w{1,4}\//;
const pathRegex = /\/w+|d+$|\//;

var rootElement;
var rootView;

function noop() {}

function setView(selector): void {
  if(selector) {
    rootView = document.querySelector(selector);
  } else {
    rootView = document.querySelector('.jsroute-view');
  }
}

function getView() {
  return rootView;
}

function setRoot(selector): void {
  if(selector) {
    rootElement = document.querySelector(selector);
  } else {
    rootElement = document.querySelector('.jsroute-app');
  }
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
