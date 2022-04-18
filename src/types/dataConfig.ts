export type FilterDims = {
  id: number;
  name: string;
  abbr: string;
  accessor: string;
};

export type CompareDim = {
  name: string;
  accessor: string;
  bgColors?: string[];
  textColors?: string[];
};

export type DimensionDefinition = {
  compareDim: CompareDim;
  filterDims: FilterDims[];
  accumulateDim: {
    enabled: boolean;
    accessor?: string;
  };
};

export type DataRecord = {
  id: number;
  compareDim: string;
  compareDimId: number;
  compareDimBgColor: string;
  compareDimTextColor: string;
  filter1: string | number;
  filter2?: string | number;
  filter3?: string | number;
  filter4?: string | number;
};

export type DataConfig = {
  dimensions: DimensionDefinition;
  records: DataRecord[];
  availableFilters: number[];
};
