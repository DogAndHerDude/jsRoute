"use strict";

import { Router } from "./router/router";

let jsRoute = Router;

(<any>window).JSRoute = (<any>window).JSRoute || jsRoute;
