"use strict";

const originRegex = /\w+:\/\//;
const hostRegex = /\w+\.\w{1,3}\//;
const pathRegex = /\/w+|d+$|\//;

var rootElement: Object;
var rootView: Object;

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

export { originRegex };
export { hostRegex };
export { pathRegex };
