import { parseLocationHash, removeHash } from "../utils/url.js";
import { FuncStore } from "../utils/func-store.js";

const routes = new FuncStore();

const onhashchange = (event) => {
  const result = parseLocationHash();
  if (!result) return
  console.log(result)
  const { key, query: kwargs, params: args = [] } = result;

  if (key) {
    if (!routes.get(result.key)) {
      console.log(`Invalid route key: ${key}`);
      return;
    }

    routes.run(key, kwargs, ...args);

    return key;
  }
};



export { onhashchange, routes };
