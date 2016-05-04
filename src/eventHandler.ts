"use strict";

import * as tools from "./utils";

function broadcastEvent(eventName: string, eventElement: any, eventData: any): void {
  var _event = new Event(eventName, eventData);

  eventElement.dispatchEvent(_event);
}

function onEvent(eventName: string, eventElement: any, callback): void {
  var cb = callback || tools.noop;

  eventElement.addEventListener(eventName, cb, false);
}

export { broadcastEvent };
export { onEvent };
