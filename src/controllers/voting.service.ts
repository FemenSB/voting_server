import Voting, { VoteRequest } from '../models/voting.model';
import { hasDuplicates } from '../utils/array_utils';
import { MalformedError, NotFoundError } from '../utils/errors';

type RunningVoting = {
  public: Voting;
  candidateSet: Set<string>;
  votes: Map<string, string[]>;
};

export default class VotingService {
  private static instance_: VotingService|null = null;
  private runningVotings_: Map<string, RunningVoting> = new Map();

  private constructor() {}

  static get instance(): VotingService {
    return this.instance_ || this.instantiate_();
  }

  private static instantiate_(): VotingService {
    this.instance_ = new VotingService();
    return this.instance_;
  }

  public startVoting(voting: Voting): void {
    const candidateSet = new Set(voting.candidates);
    const runningVoting: RunningVoting = {
      public: voting,
      candidateSet: candidateSet,
      votes: new Map(),
    };
    this.runningVotings_.set(voting.code, runningVoting);
  }

  public getVoting(code: string): Voting|undefined {
    return this.runningVotings_.get(code)?.public;
  }

  public vote(voteRequest: VoteRequest): void {
    const {code, voterId, vote} = voteRequest;
    this.assertVoteValidity_(code, vote);
    this.runningVotings_.get(code)!.votes.set(voterId, vote);
  }

  private assertVoteValidity_(votingCode: string, vote: string[]): void {
    const candidates = this.runningVotings_.get(votingCode)?.candidateSet;
    if (!candidates) {
      throw new NotFoundError();
    }
    if (candidates.size !== vote.length || hasDuplicates(vote) ||
        !arrayContainedInSet(vote, candidates)) {
      throw new MalformedError();
    }

    function arrayContainedInSet(array: string[], set: Set<string>): boolean {
      return array.every(candidate => set.has(candidate));
    }
  }
};
