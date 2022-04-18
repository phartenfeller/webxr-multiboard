import { DataConfig } from '../../types/dataConfig';
import { BubbleData, GroupInfoMap, GroupInfo } from '../../types/bubbleData';
import formatNumber from '../../calc/util/formatNumber';

function groupCompareDim(dataConfig: DataConfig): BubbleData {
  let accumulateDimSum = 0;
  let gInfoMap: GroupInfoMap = new Map();

  // get general acc sum
  if (dataConfig.dimensions.accumulateDim.enabled) {
    for (let i = 0; i < dataConfig.records.length; i++) {
      accumulateDimSum +=
        dataConfig.records[i][dataConfig.dimensions.accumulateDim.accessor];
    }
  }

  // build map info grouped by compaer dims
  for (let i = 0; i < dataConfig.records.length; i++) {
    let gInfo;
    if (gInfoMap.has(dataConfig.records[i].compareDimId)) {
      gInfo = gInfoMap.get(dataConfig.records[i].compareDimId);
    } else {
      gInfo = {
        recordCount: 0,
        accumulateDimSum: 0,
        bgColor: dataConfig.records[i].compareDimBgColor,
        textColor: dataConfig.records[i].compareDimTextColor,
      };
    }

    gInfo.recordCount++;

    if (dataConfig.dimensions.accumulateDim.enabled) {
      gInfo.accumulateDimSum +=
        dataConfig.records[i][dataConfig.dimensions.accumulateDim.accessor];
    }
    gInfoMap.set(dataConfig.records[i].compareDimId, gInfo);
  }

  // format acc values for groups and calc percent
  for (const [key, value] of gInfoMap.entries()) {
    if (dataConfig.dimensions.accumulateDim.enabled) {
      value.accumulateDimSumFormatted = formatNumber(value.accumulateDimSum);

      value.percent = (value.accumulateDimSum / accumulateDimSum) * 100;
    } else {
      console.log(
        `pct = ${value.recordCount} / ${dataConfig.records.length} = ${
          value.recordCount / dataConfig.records.length
        }`
      );
      value.percent = (value.recordCount / dataConfig.records.length) * 100;
    }

    gInfoMap.set(key, value);
  }

  return {
    recordCount: dataConfig.records.length,
    accumulateDimSum,
    accumulateDimSumFormatted: accumulateDimSum
      ? formatNumber(accumulateDimSum)
      : undefined,
    groupData: gInfoMap,
  };
}

export default groupCompareDim;
