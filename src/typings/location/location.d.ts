
declare namespace LocationInterface{
    interface NewLocationConstructor {
      new(url: string);
    }

    export interface NewLocation {
      protocol: string;
      host: string;
      href: string;
      pathname: string;
      hash: string;
      origin: string;
      search: string;
      hostname: string;
      matchingPath: string;
      params: Object;
      path(pathString: string): void;
    }

    export interface LocationList {
      prev: Location;
      next: NewLocation;
    }
}

export default LocationInterface;
