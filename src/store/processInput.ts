import { DataConfig, DataRecord, FilterDims } from '../types/dataConfig';
import { object, string, array, InferType } from 'yup';
import defaultColors from '../util/colors';

const compareDimIdMap: Map<string, number> = new Map();

const dataParamSchema = object({
  dimensions: object({
    compareDim: object({
      name: string().required(),
      accessor: string().required(),
      bgColors: array().of(string()),
      textColors: array().of(string()),
    }),
    accumulateDimAccessor: string(),
    filterDims: array()
      .min(1)
      .max(4)
      .of(
        object({
          name: string().required(),
          accessor: string().required(),
          abbr: string().required(),
        })
      ),
  }),
  records: array().min(2),
});

type DataInput = InferType<typeof dataParamSchema>;

function createConfig(input: DataInput): DataConfig {
  const accessors = input.dimensions.filterDims.map((d) => d.accessor);
  console.log({ accessors });

  const records: DataRecord[] = [];

  const bgColors =
    input.dimensions.compareDim.bgColors || defaultColors.map((c) => c.bg);
  const textColors =
    input.dimensions.compareDim.textColors || defaultColors.map((c) => c.text);

  for (let i = 0; i < input.records.length; i++) {
    const compareDim = input.records[i][input.dimensions.compareDim.accessor];
    let compareDimId: number;

    if (!compareDim) {
      console.warn(
        `Skipping record ${i} with no compareDim value: ${JSON.stringify(
          input.records[i]
        )}`
      );
      continue;
    } else if (!compareDimIdMap.has(compareDim)) {
      compareDimId = compareDimIdMap.size;
      compareDimIdMap.set(compareDim, compareDimIdMap.size);
    } else {
      compareDimId = compareDimIdMap.get(compareDim);
    }

    const bgColorIdx = (compareDimId + bgColors.length - 1) % bgColors.length;
    const textColorIdx =
      (compareDimId + textColors.length - 1) % textColors.length;

    records.push({
      id: i,
      compareDim,
      compareDimId,
      compareDimBgColor: bgColors[bgColorIdx],
      compareDimTextColor: textColors[textColorIdx],
      filter1: input.records[i][accessors[0]],
      filter2: accessors.length >= 2 && input.records[i][accessors[1]],
      filter3: accessors.length >= 3 && input.records[i][accessors[2]],
      filter4: accessors.length >= 4 && input.records[i][accessors[3]],
    });
  }

  const filterDims: FilterDims[] = [];

  for (let i = 0; i < input.dimensions.filterDims.length; i++) {
    const filterDim = input.dimensions.filterDims[i];
    filterDims.push({
      id: i + 1,
      name: filterDim.name,
      abbr: filterDim.abbr,
      accessor: filterDim.accessor,
    });
  }

  return {
    dimensions: {
      compareDim: input.dimensions.compareDim,
      filterDims,
      accumulateDim: {
        enabled: !!input.dimensions.accumulateDimAccessor,
        accessor: input.dimensions.accumulateDimAccessor,
      },
    },
    records,
    availableFilters: filterDims.map((d) => d.id),
  };
}

export default async function processInput(
  input: unknown
): Promise<DataConfig> {
  const data: DataInput = await dataParamSchema.validate(input);
  return createConfig(data);
}
