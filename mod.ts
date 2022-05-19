/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.130.0/http/server.ts";
import { Status } from "https://deno.land/std@0.130.0/http/http_status.ts";

import { render } from "https://x.lcas.dev/preact@10.5.12/ssr.js";
import type { VNode } from "https://x.lcas.dev/preact@10.5.12/mod.d.ts";
export * from "https://x.lcas.dev/preact@10.5.12/mod.js";

const getRoutes: any = {};

function get(path: string, func: (params: URLSearchParams) => VNode): void {
  getRoutes[path] = func;
}

function start() {
  serve((req) => {
    const url = new URL(req.url);

    let routes;
    if (req.method == "GET") {
      routes = getRoutes;
    } else {
      return new Response(null, {
        status: Status.MethodNotAllowed,
      });
    }

    if (!(url.pathname in routes)) {
      return new Response(null, {
        status: Status.NotFound,
      });
    }

    const params = url.searchParams;
    const func = routes[url.pathname](params);
    const body = render(func);

    return new Response(body, {
      status: Status.OK,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  });
}

export { get, start };
