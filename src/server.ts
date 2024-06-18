import express from 'express';

import Voting from './models/voting';

const app = express();

const PORT = 80;

const votingCode = 'N36dlr';

const votings = new Map<string, Voting>();
votings.set(votingCode, {
  name: 'Class president',
  code: votingCode,
  candidates: [
    'Brandt',
    'Adrianna',
    'Avis',
    'Jones',
    'Rochelle',
    'Carmella',
  ]
});

app.get('/:code', (req, res) => {
  const voting = votings.get(req.params.code);
  if (!voting) {
    return res.status(404).json({error: 'No such voting'});
  }
  res.json(voting);
});

app.listen(PORT, () => {
  console.log(`Listening port ${PORT}`);
});
