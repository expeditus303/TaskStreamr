import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if(route) {
        return route.handler(req, res)
    }
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}...`);
});
