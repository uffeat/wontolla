import { APIORIGIN } from "../config.js";
import { genSearchParams } from "./url.js";


// TODO: DRY!!!!


class Server {
  constructor() {
    // TODO: Caching.
  }

  async get(path, kwargs = {}) {
    const [callback, pathParam, searchObj] = X.getArgs(
      kwargs,
      "callback",
      "pathParam",
      "searchObj"
    );

    const url = `${APIORIGIN}/${path}${pathParam ? "/" + pathParam : ""}${
      searchObj ? genSearchParams(searchObj) : ""
    }`;

    const request = {
      method: "GET",
    };

  

    // TODO: wrap in try-catch
    const response = await fetch(url, request);

    if (response.ok) {
      const data = await response.json();
      console.log(`Got data from server: ${JSON.stringify(data)}`);
      callback && callback(data);
      return data; // promise.
    }
  }


  async post(path, data, kwargs = {}) {
    const [callback, pathParam, searchObj] = X.getArgs(
      kwargs,
      "callback",
      "pathParam",
    );

    const url = `${APIORIGIN}/${path}${pathParam ? "/" + pathParam : ""}`;

    const request = {
      method: "POST",
      body: JSON.stringify(data),
    };

  
    // TODO: wrap in try-catch
    const response = await fetch(url, request);

    if (response.ok) {
      const data = await response.json();
      console.log(`Got data from server: ${JSON.stringify(data)}`);
      callback && callback(data);
      return data; // promise.
    }
  }



  
}

/*
    const r = await fetch(`https://ufferat.pythonanywhere.com/test`)
    if (r.ok) {
      const d = await r.json();
      console.log(`Got data from Flask server: ${JSON.stringify(d)}`)
    }
    */

/*
const getData = async (query, callback) => {
  const response = await fetch(`https://snubert.dev/_/api/get-data?${query}`)
    if (response.ok) {
      const data = await response.json();
      callback && callback(data);
      return data;
    }
     //TODO: Handle errors.
}
*/

const server = new Server();

export { server };

/*
How to use
----------

1. With callback:

snubert.getData('key=key-1', data => {
  console.log(`Data from getData with callback: ${data['data-key']}`);
});

2. With async:

const dataPromiseFromGetDataUtil = await snubert.getData('key=key-1');
console.log(`Data from getData util with await: ${dataPromiseFromGetDataUtil['data-key']}`);

*/
