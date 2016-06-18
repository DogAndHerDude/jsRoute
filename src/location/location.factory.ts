'use strict';

import LocationInterface from '../typings/location/location.d';
import LocationModel from './location.model';

var currentLocation;

function createRouteList(url: string) {
  let prev = {
    path: currentLocation ? currentLocation.pathname : null,
    match: currentLocation ? currentLocation.matchingPath : null
  };
  let next = {
    path: url,
    match: null,
  };

  return { prev, next };
}

function locationFactory(url: string): LocationInterface.NewLocation {
  let nextLocation = new LocationModel(url);

  currentLocation = nextLocation;

  return nextLocation;
}

function getCurrentLocation() {
  return currentLocation;
}

function setCurrentLocation($location) {
  currentLocation = $location;
}

export { locationFactory, createRouteList, getCurrentLocation, setCurrentLocation };
