import Voting from '../models/voting.model';
import { isString, isStringArray } from '../utils/type_guards';
import VotingService from './voting.service';

import { RequestHandler } from 'express';
import ShortUniqueId from 'short-unique-id';

interface GetVotingParams {
  'code': string,
}

const votingService = VotingService.instance;
const { randomUUID } = new ShortUniqueId({ length: 6 });

export const getVoting: RequestHandler<GetVotingParams> = (req, res) => {
  const voting = votingService.getVoting(req.params.code);
  if (!voting) {
    return res.status(404).json({
      error: 'No such voting'
    });
  }
  res.json(voting);
};

export const postVoting: RequestHandler = (req, res) => {
  if (!isRequestValid()) {
    return res.status(400).json({
      error: 'Malformed voting'
    });
  }
  const { name, candidates } = req.body;
  const voting: Voting = {
    name: name,
    code: randomUUID(),
    candidates: candidates,
  };
  votingService.startVoting(voting);
  res.json(voting);

  function isRequestValid(): boolean {
    return isString(req.body.name) && isStringArray(req.body.candidates);
  }
};
