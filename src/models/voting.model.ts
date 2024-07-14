import { MalformedError } from '../utils/errors';
import { Milliseconds } from '../utils/time';
import { isString, isStringArray } from '../utils/type_guards';

type Voting = {
  name: string;
  code: string;
  candidates: string[];
  endTime: Milliseconds;
};

export default Voting;

export class VoteRequest {
  public code: string;
  public voterId: string;
  public vote: string[];

  constructor(data: any) {
    const { code, voterId, vote } = data;
    if (dataIsValid()) {
      this.code = code;
      this.voterId = voterId;
      this.vote = vote;
    } else {
      throw new MalformedError();
    }

    function dataIsValid() {
      return isString(code) && isString(voterId) && isStringArray(vote);
    }
  }
}
