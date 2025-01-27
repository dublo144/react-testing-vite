import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/categories', () => {
    return HttpResponse.json([
      { id: 1, name: 'Books' },
      { id: 2, name: 'Electronics' },
      { id: 3, name: 'Home' },
    ]);
  }),
]