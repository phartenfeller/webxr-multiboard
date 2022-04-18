import { ringData } from '../../types/ringData';

function getRingText(ring: ringData, accEnabled: boolean) {
  if (accEnabled) {
    return `${ring.formatted}\n(${ring.percent}%)\n${ring.recordCount}x`;
  }
  return `${ring.recordCount}\n(${ring.percent}%)\n${ring.recordCount}x`;
}

export default getRingText;
