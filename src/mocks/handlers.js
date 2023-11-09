// import { rest } from 'msw';
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
  http.get('/api/records', () => {
    mockDelay(500);
    console.log('in the handlerrrrr')
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
  }),
  // http.get('/api/records/:recordName', (req, res, ctx) => {
  //   mockDelay(500);
  //   const { recordExercise } = req.params;
  //   return res(
  //     ctx.status(200),
  //     ctx.json(
  //       recordsData.find((record) => record.exercise.includes(recordExercise))
  //     )
  //   );
  // })
];
