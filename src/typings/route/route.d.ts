import LocationInterface from '../location/location.d';

declare namespace RouteInterface {
  export interface RouteOptions {
    templateUrl: string | void;
    template: string | void;
    cache: boolean;
    partial: string | void;
    onLoad: (rootElement: Object, location: LocationInterface.NewLocation) => void;
  }

  export interface RouteProvider {
    when(path: string, options: RouteOptions): RouteProvider;
    otherwise(path: string): RouteProvider;
  }
}

export default RouteInterface;
