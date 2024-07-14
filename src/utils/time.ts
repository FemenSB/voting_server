export type Milliseconds = number;
export type Minutes = number;

export function MinutesToMs(minutes: Minutes): Milliseconds {
  return minutes*60*1000;
}
