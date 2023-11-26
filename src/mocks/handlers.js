import { http, HttpResponse } from 'msw'

import recordsData from './records.json'

function mockDelay(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

export const handlers = [
  http.get(import.meta.env.VITE_API_URL + '/api/records', () => {
    mockDelay(500);
    return HttpResponse.json(
        recordsData.map((record) => ({
          datetime: record.datetime,
          exercise: record.exercise,
          equipment: record.equipment,
          reps: record.reps,
          special: record.special,
          weight: record.weight,
          difficulty: record.difficulty
        })
        )
    );
  })
];
