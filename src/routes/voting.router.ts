import { getVoting, getVotingResults, postVote, postVoting } from '../controllers/voting.controller';

import express from 'express';

const votingRouter = express.Router();

votingRouter.use(express.json());

votingRouter.post('/', postVoting);
votingRouter.get('/:code', getVoting);
votingRouter.post('/:code', postVote);
votingRouter.get('/results/:code', getVotingResults);

export default votingRouter;
