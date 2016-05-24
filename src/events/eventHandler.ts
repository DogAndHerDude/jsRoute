"use strict";

import * as utils from "../utils/utils";

function broadcastEvent(eventName: string, element, eventData): void {
  var args = [].slice.call(arguments);
  var _event;

  eventData.cancelable = true;

  _event = new CustomEvent(eventName, eventData);

  element.dispatchEvent(_event);
}

export { broadcastEvent };
