import Voting from '../models/voting.model';

export default class VotingService {
  private static instance_: VotingService|null = null;
  private votings_: Map<string, Voting> = new Map();

  private constructor() {}

  static get instance(): VotingService {
    return this.instance_ || this.instantiate_();
  }

  private static instantiate_(): VotingService {
    this.instance_ = new VotingService();
    return this.instance_;
  }

  public startVoting(voting: Voting): void {
    this.votings_.set(voting.code, voting);
  }

  public getVoting(code: string): Voting|undefined {
    return this.votings_.get(code);
  }
};
