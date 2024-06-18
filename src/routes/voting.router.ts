import { getVoting, postVoting } from '../controllers/voting.controller';

import express from 'express';

const votingRouter = express.Router();

votingRouter.use(express.json());

votingRouter.get('/:code', getVoting);
votingRouter.post('/', postVoting);

export default votingRouter;
