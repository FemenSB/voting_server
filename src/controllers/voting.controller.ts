import Voting, { VoteRequest } from '../models/voting.model';
import { MalformedError, NotFoundError } from '../utils/errors';
import { MinutesToMs } from '../utils/time';
import { isString, isStringArray } from '../utils/type_guards';
import VotingService from './voting.service';

import { RequestHandler, Response } from 'express';
import ShortUniqueId from 'short-unique-id';

interface GetVotingParams {
  'code': string,
}

const votingService = VotingService.instance;
const { randomUUID } = new ShortUniqueId({ length: 6 });

export const getVoting: RequestHandler<GetVotingParams> = (req, res) => {
  const voting = votingService.getVoting(req.params.code);
  if (!voting) {
    return respondNotFound(res);
  }
  res.json(voting);
};

export const getVotingResults: RequestHandler = (req, res) => {
  const results = votingService.getVotingResults(req.params.code);
  if (!results) {
    return respondNotFound(res, 'Voting has nos results available');
  }
  res.json(results);
};

export const postVoting: RequestHandler = (req, res) => {
  if (!isRequestValid()) {
    return respondMalformed(res, 'Malformed voting');
  }
  const { name, candidates } = req.body;
  const voting: Voting = {
    name: name,
    code: randomUUID(),
    candidates: candidates,
    endTime: new Date().getTime() + MinutesToMs(5),
  };
  votingService.startVoting(voting);
  res.json(voting);

  function isRequestValid(): boolean {
    return isString(req.body.name) && isStringArray(req.body.candidates);
  }
};

export const postVote: RequestHandler = (req, res) => {
  try {
    const voteRequest = new VoteRequest({...req.body, ...req.params});
    votingService.vote(voteRequest);
    res.send();
  } catch (e) {
    if (e instanceof MalformedError) {
      respondMalformed(res, 'Malformed vote');
    }
    if (e instanceof NotFoundError) {
      respondNotFound(res);
    }
  }
};

function respondMalformed(res: Response, message: string): void {
  res.status(400).json({
    error: message,
  });
}

function respondNotFound(res: Response, message = 'No such voting'): void {
  res.status(404).json({
    error: message,
  });
}
