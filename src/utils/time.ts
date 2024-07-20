export type Milliseconds = number;
export type Minutes = number;

export function MinutesToMs(minutes: Minutes): Milliseconds {
  return SecondsToMs(minutes * 60);
}

export function SecondsToMs(seconds: Minutes): Milliseconds {
  return seconds * 1000;
}
