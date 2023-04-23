export function sleep(ms = 1000): Promise<void> {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

export function generateOffsets(startOffset: number, total: number): number[] {
  const interval = 20;
  const start = startOffset + interval;
  const offsets = [];

  for (let i = start; i <= total; i += interval) {
    offsets.push(i);
  }

  return offsets;
}
