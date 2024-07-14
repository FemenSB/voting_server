import Voting, { VoteRequest } from '../models/voting.model';
import { arrayContainedInSet, hasDuplicates } from '../utils/array_utils';
import { MalformedError, NotFoundError } from '../utils/errors';
import { Milliseconds, MinutesToMs } from '../utils/time';

const RESULTS_EXPIRATION_TIME: Milliseconds = MinutesToMs(1);

type RunningVoting = {
  public: Voting;
  candidateSet: Set<string>;
  votes: Map<string, string[]>;
};

type VotingResults = {
  voting: Voting;
  orderedCandidates: string[];
  votes: {voter: string, vote: string[]}[];
}

export default class VotingService {
  private static instance_: VotingService|null = null;
  private runningVotings_: Map<string, RunningVoting> = new Map();
  private votingResults_: Map<string, VotingResults> = new Map();

  private constructor() {
    setInterval(this.checkForEndedVotings_.bind(this), 1000);
    setInterval(this.cleanUpVotingResults_.bind(this), 1000);
  }

  static get instance(): VotingService {
    return this.instance_ || this.instantiate_();
  }

  private static instantiate_(): VotingService {
    this.instance_ = new VotingService();
    return this.instance_;
  }

  private get now_(): Milliseconds {
    return new Date().getTime();
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

  public getVotingResults(code: string): VotingResults|undefined {
    return this.votingResults_.get(code);
  }

  public vote(voteRequest: VoteRequest): void {
    const {code, voterId, vote} = voteRequest;
    this.assertVoteValidity_(code, vote);
    this.runningVotings_.get(code)!.votes.set(voterId, vote);
  }

  private assertVoteValidity_(votingCode: string, vote: string[]): void {
    const voting = this.runningVotings_.get(votingCode);
    if (!voting) {
      throw new NotFoundError();
    }
    const candidates = voting.candidateSet;
    if (voting.public.endTime >= this.now_ ||
        candidates.size !== vote.length ||
        hasDuplicates(vote) ||
        !arrayContainedInSet(vote, candidates)) {
      throw new MalformedError();
    }
  }

  private checkForEndedVotings_() {
    const now = this.now_;
    for (const [code, voting] of this.runningVotings_) {
      if (voting.public.endTime >= now) return;
      const result = this.computeVotingResults_(voting);
      this.votingResults_.set(code, result);
      this.runningVotings_.delete(code);
    }
  }

  private cleanUpVotingResults_() {
    const deadline = this.now_ - RESULTS_EXPIRATION_TIME;
    for (const [code, results] of this.votingResults_) {
      if (results.voting.endTime <= deadline) {
        this.votingResults_.delete(code);
      }
    }
  }

  private computeVotingResults_(voting: RunningVoting): VotingResults {
    const orderedCandidates = sortCandidates(voting.candidateSet, voting.votes);
    console.log(orderedCandidates);
    const votes = Array.from(voting.votes).map(vote => {
      return {
        voter: vote[0],
        vote: vote[1],
      };
    });
    return {
      voting: voting.public,
      orderedCandidates: orderedCandidates,
      votes: votes,
    };

    function sortCandidates(candidates: Set<string>, 
        votes: Map<string, string[]>): string[] {
      const votesCounter: Map<string, number> = new Map();
      candidates.forEach(candidate => votesCounter.set(candidate, 0));
      votes.forEach((vote, _voter) => {
        vote.forEach((candidate, position) => {
          const total = votesCounter.get(candidate)! + position;
          votesCounter.set(candidate, total);
        });
      });
      const ordered = Array.from(votesCounter).sort((a, b) => a[1] - b[1]);
      return ordered.map(entry => entry[0]);
    }
  }
};
