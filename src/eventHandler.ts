"use strict";

import * as tools from "./util";

function broadcastEvent(eventElement: any, eventName: string, eventData: any): void {
  var _event = new Event(eventName, eventData);
  var element = eventElement;

  element.dispatchEvent(_event);
}

function onEvent(eventName: string, eventElement: any, callback): void {
  var cb = callback || tools.noop;

  eventElement.addEventListener(eventName, cb, false);
}

export { broadcastEvent };
export { onEvent };
