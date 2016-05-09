"use strict";

import * as utils from "../utils/utils";

function broadcastEvent(eventName: string, eventElement, eventData): void {
  var args = [].slice.call(arguments);
  var _event = new CustomEvent(eventName, eventData);

  eventElement.dispatchEvent(_event);
}

function onEvent(eventName: string, eventElement, callback): void {
  var args = [].slice.call(arguments);
  let cb = callback || utils.noop;
  let el;

  eventElement.addEventListener(eventName, cb, false);
}

export { broadcastEvent };
export { onEvent };
