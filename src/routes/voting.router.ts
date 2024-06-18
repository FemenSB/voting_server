import { getVoting, postVote, postVoting } from '../controllers/voting.controller';

import express from 'express';

const votingRouter = express.Router();

votingRouter.use(express.json());

votingRouter.post('/', postVoting);
votingRouter.get('/:code', getVoting);
votingRouter.post('/:code', postVote);

export default votingRouter;
