/** @jsx h */
import { h, get, start } from "./mod.ts";

get("/", (params) => {
  const list = [];
  for (const key of params.keys()) {
    list.push(<li>{key} = {params.get(key)}</li>);
  }
  return (
    <div>
      Hello World
      <ul>{list}</ul>
    </div>
  );
});

start();
