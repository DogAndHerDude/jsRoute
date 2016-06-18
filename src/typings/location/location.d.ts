
declare namespace LocationInterface {
    export interface LocationModel {
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
}

export default LocationInterface;
