'use strict';

function broadcastEvent(eventName: string, element, eventData): void {
  var _event;

  eventData.cancelable = true;

  _event = new CustomEvent(eventName, eventData);

  element.dispatchEvent(_event);
}

export default broadcastEvent;
