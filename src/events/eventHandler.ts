"use strict";

import * as tools from "../utils/utils";

function broadcastEvent(eventName: string, eventElement: any, eventData: any): void {
  var args = [].slice.call(arguments);
  var _event;
  //var _event = new Event(eventName, eventData);

  eventName = args.shift();

  if(typeof args[args.length - 1] === 'object') {
    eventData = args.pop();
  } else {
    eventData = {};
  }

  if(args.length > 0) {
    eventElement = args.shift();
  } else {
    eventElement = window;
  }

  _event = new Event(eventName, eventData);

  eventElement.dispatchEvent(_event);
}

function onEvent(eventName: string, eventElement: any, callback): void {
  var args = [].slice.call(arguments);
  let cb;
  let el;

  eventName = args.shift();

  if(typeof args[args.length - 1] === "function") {
    cb = args.pop();
  } else {
    cb = tools.noop;
  }

  if(args.length > 0) {
    eventElement = args.shift();
  } else {
    eventElement = window;
  }

  eventElement.addEventListener(eventName, cb, false);
}

export { broadcastEvent };
export { onEvent };
