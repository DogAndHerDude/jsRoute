'use strict';

/*
 * This whole file should possibly be merged with the route.observer.ts file
 * As both of them monitor event activity
 * Observer file could be split into a template compiler of some sorts
 * as it currently contains a lot of variety of functions in one module
 */

import broadcastEvent from '../events/eventHandler';
import { createRouteList } from '../location/location.factory';
import * as utils from '../utils/utils';
// import { endChange, failChange } from '../route/route.observer'

/*
 * Initiate route change start even
 */

function startRouteChange(url: string): void {
  let root = utils.getRoot();
  let routeList = createRouteList(url);

  broadcastEvent('routeChangeStart', root, { detail: routeList });
}

/*
 * As the name implies, event fired upon route change success
 * However, currently, this event fires without anything to listen to this event
 * Instead of changing everything on routeChangeStart, I should listen to Success event
 * And only change the route within the routeChangeSuccess listen block
 */

function completeRouteChange(routeList): void {
  let root = utils.getRoot();

  broadcastEvent('routeChangeSuccess', root, { detail: routeList });
}

/*
 * In the case that no route was matched, this is the event that is broadcast
 * Instead of currently being an "un-listened" event, it should redirect to
 * default fallback route OR do nothing
 */

function routeChangeFail(routeList): void {
  let root = utils.getRoot();

  broadcastEvent('routeChangeError', root, { detail: routeList });
}

function monitorRouteChange(): void {
  let root = utils.getRoot();

  root.addEventListener('routeChangeStart', startChange, false);
}

function routeChangeSuccess(match): void {

}

/*function endRouteChange(): void {
  let root = utils.getRoot();

  root.addEventListener('routeChangeStart', endChange, false);
}*/

/*
 * Start monitoring whether any link within the app view block has been clicked
 * In the case that it has been, intercept it and determine whether it is changing
 * route within its own domain
 */

function interceptLinkClicks(): void {
  let root = utils.getRoot();

  root.addEventListener('click', (ev) => {
    if (ev.target.nodeName === 'A') {
      ev.preventDefault();

      startRouteChange(ev.target.href);
    }
  });
}

/*
 * Check whether the current view is clear on the initial router init
 * If it isn't, consider it as an init load template and do not replace it
 * If it the view has no content, start route change and load content into view
 */

function onRun() {
  let view = utils.getView();

  interceptLinkClicks();
  monitorRouteChange();

  if (view.children.length) { return; }
  startRouteChange(window.location.pathname);
}

export { startRouteChange, completeRouteChange, routeChangeFail, onRun };
