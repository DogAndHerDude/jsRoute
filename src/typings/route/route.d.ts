
declare namespace RouteInterface {
  export interface RouteOptions {
    templateUrl: string;
    template: string;
    cache: boolean;
    onLoad(callback: (location: Object) => void): void;
    matchRoute(route: Object): void;
  }

  export interface RouteProvider {
    when(path: string, options: RouteOptions): RouteProvider;
    otherwise(path: string): RouteProvider;
  }
}

export default RouteInterface;
