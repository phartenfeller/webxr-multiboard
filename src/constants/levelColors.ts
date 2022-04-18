export function levelColors(level: number) {
  switch (level) {
    case 0:
      return '#000000';
    case 1:
      return '#374151';
    case 2:
      return '#4b5563';
    default:
      return '#22c55e';
  }
}
