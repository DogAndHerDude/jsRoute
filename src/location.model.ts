"use strict";

interface LocationInterface {
  host: string;
  href: string;
  path(pathString: string): void;
}

class _Location implements LocationInterface {
  public host: string;
  public href: string;

  constructor(url: string) {
    //create new location object out of the given url
    this.href = url;
  }

  // Redirects to new path
  public path(): void {

  }
}

export { _Location };
