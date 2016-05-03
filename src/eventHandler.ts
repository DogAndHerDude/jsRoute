"use strict";

function broadcastEvent(eventName: string, eventData: any): void {
  var _event = new Event(eventName, eventData);

  window.dispatchEvent(_event);
}

function onEvent(eventName: string, callback: () => void): void {

}

export { broadcastEvent };
export { onEvent };
