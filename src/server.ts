import express from 'express';

import votingRouter from './routes/voting.router';

const app = express();

const PORT = 80;

app.use('/', votingRouter);

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
});
