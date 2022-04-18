import { DataConfig, DataRecord } from '../../types/dataConfig';

function groupFilterDim(
  dataConfig: DataConfig,
  filterNo: number
): { [key: string]: DataRecord[] } {
  const groupBy = `filter${filterNo}`;

  return dataConfig.records.reduce((acc, curr) => {
    const key = curr[groupBy];

    // filter out null values
    if (key === null) {
      return acc;
    }

    const existing = key in acc;

    if (existing) {
      acc[key].push(curr);
    } else {
      acc[key] = [curr];
    }

    return acc;
  }, {});
}

export default groupFilterDim;
