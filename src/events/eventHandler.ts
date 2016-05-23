"use strict";

import * as utils from "../utils/utils";

function broadcastEvent(eventName: string, eventData): void {
  var args = [].slice.call(arguments);
  var _event;

  eventData.cancelable = true;

  _event = new CustomEvent(eventName, eventData);

  this.dispatchEvent(_event);
}

function extendRoot(): void {
  Object.prototype['broadcastEvent'] = broadcastEvent;
}

export { extendRoot };
