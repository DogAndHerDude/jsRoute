'use strict';

const protocolRegex = /\w+\:\/\//;
const hostRegex = /\w+\.\w{1,4}\//;
const pathRegex = /\/w+|d+$|\//;

var rootElement;
var rootView;

function noop() { return; }

function setView(selector): void {
  selector = selector || '.jsroute-view';
  rootView = document.querySelector(selector);
}

function getView() {
  return rootView;
}

function setRoot(selector): void {
  selector = selector || '.jsroute-app';
  rootElement = document.querySelector(selector);
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
