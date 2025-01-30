import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";

export const simulateDelay = (url: string) => {
  server.use(http.get(url, async () => {
    await delay();
    return HttpResponse.json([]);
  }));
};

export const simulateError = (url: string) => {
  server.use(http.get(url, () => HttpResponse.error()));
};