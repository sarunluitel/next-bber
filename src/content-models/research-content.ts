export const researchPageContent = {
  title: "Research",
  lead: "For 75 years, BBER has provided economic data and forecasting to help state and local governments, business leaders, non-profit organizations, and community leaders identify and understand economic trends shaping New Mexico.",
  methodsLead:
    "Techniques used in past publications, projects, and presentations have included:",
  methods: [
    "Focus Groups",
    "Survey Research",
    "Feasibility Studies",
    "Labor Market Research",
    "Demographics and Migration Analysis",
    "Cost-Benefit Analysis",
    "Employment Forecasting",
    "Fiscal Impact Analysis",
  ],
  supportingParagraphs: [
    "At its core, BBER is a research group. All work is completed by PhD and Masters-level analysts who understand New Mexico. Our team is available for speaking engagements and presentations upon request.",
    "BBER guarantees authoritative, objective and non-partisan results. The cost for a custom project is determined by the scope of work.",
  ],
  sampleImage: {
    src: "/bber/research-sample.png",
    alt: "Research sample collage",
    width: 625,
    height: 625,
  },
} as const;

export const publicationsPageContent = {
  title: "Publications",
  lead: "Explore featured BBER publications or narrow the archive by category, community, and year.",
  featuredHeading: "Featured",
  resultsHeading: "Results",
  emptyMessage:
    "No publications matched the selected filters. Clear a filter or try a different combination.",
  errorMessage:
    "Publications are temporarily unavailable. Please try again in a little while.",
  searchAction: "/search",
} as const;
