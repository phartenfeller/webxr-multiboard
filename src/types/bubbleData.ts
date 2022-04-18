export type GroupInfo = {
  recordCount: number;
  accumulateDimSum?: number;
  accumulateDimSumFormatted?: string;
  bgColor: string;
  textColor: string;
  percent: number;
};

export type GroupInfoMap = Map<number, GroupInfo>;

export type BubbleData = {
  recordCount: number;
  accumulateDimSum?: number;
  accumulateDimSumFormatted?: string;
  groupData: GroupInfoMap;
};

export type BubbleState = {
  header: string;
  footer: string;
  bubbleSize: number;
  data: BubbleData;
};
