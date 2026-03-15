export const API_DOCUMENTATION_OVERVIEW = {
  eyebrow: "Data API",
  title: "API Documentation",
  lead: "Use the BBER REST API to retrieve current public datasets in a scriptable format for research, classroom work, and applied analysis. The examples below focus on the active read-only endpoints and request patterns available through the API.",
  restEndpoint: "https://api.bber.unm.edu/api/data/rest/bbertable",
  mapEndpoint: "https://api.bber.unm.edu/api/data/rest/makemap",
  metadataEndpoint:
    "https://api.bber.unm.edu/api/data/rest/metadata?api=tablevalues&table=s0801&variables=[stfips,areatype,periodyear,periodtype]",
  exampleRepository: "https://github.com/UNM-BBER/BBERAPI-sample",
} as const;

export const API_DOCUMENTATION_PARAMETER_ROWS = [
  {
    name: "table",
    description: "Data source table to query.",
    sampleValues: "rp80, dp05",
  },
  {
    name: "variables",
    description: "List of variables to return from the selected table.",
    sampleValues: "foodmedt, grosstax",
  },
  {
    name: "stfips",
    description: "Federal Information Processing Standards state code.",
    sampleValues: "00, 35",
  },
  {
    name: "areatype",
    description:
      "Code describing the type of geography, such as statewide, county, or metropolitan area.",
    sampleValues: "00, 01, 04, 21",
  },
  {
    name: "area",
    description:
      "Six-digit geographic identifier based on Census geography codes.",
    sampleValues: "000001, 000028",
  },
  {
    name: "periodtype",
    description:
      "Code for the period type, such as day, month, quarter, or annual.",
    sampleValues: "01, 04",
  },
  {
    name: "periodyear",
    description: "Year represented by the observation.",
    sampleValues: "2020, 2021",
  },
  {
    name: "period",
    description:
      "Period within the year, such as month number, quarter number, or 00 for annual values.",
    sampleValues: "1, 2",
  },
  {
    name: "indcode",
    description: "Two- to six-digit industry code when available.",
    sampleValues: "11, 23",
  },
  {
    name: "adjusted",
    description:
      "Seasonal adjustment flag where supported by the selected dataset.",
    sampleValues: "0, 1",
  },
  {
    name: "ownership",
    description:
      "Ownership identifier for labor-market series and similar datasets.",
    sampleValues: "00, 50",
  },
  {
    name: "token",
    description:
      "Authentication token for private or subscription-based datasets when required.",
    sampleValues: "ABCXXXX",
  },
] as const;

export const API_DOCUMENTATION_SECTIONS = {
  rangeExamples: [
    "https://api.bber.unm.edu/api/data/rest/bbertable?table=sp500&periodyear=2018-2021",
    "https://api.bber.unm.edu/api/data/rest/bbertable?table=sp500&periodyear=2005-2010,2015-2020",
    "https://api.bber.unm.edu/api/data/rest/bbertable?table=sp500&periodyear=2010,2015,2020",
  ],
  mergeExample:
    "https://api.bber.unm.edu/api/data/rest/bbertable?table=b11005,b11001&variables=b11005.tot_hhoneplusu18_famhh_marriedfam_e,b11001.tot_nonfamhh_hhalone_e",
  metadataExamples: [
    "https://api.bber.unm.edu/api/data/rest/metadata?api=tables",
    "https://api.bber.unm.edu/api/data/rest/metadata?api=tablevalues&table=s0801&variables=[stfips,areatype,periodyear,periodtype]",
  ],
  responseExample:
    '{ "metadata": { "columns": [...], "table": {...} }, "data": [...] }',
} as const;
