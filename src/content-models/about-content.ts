import { normalizePageUrl, Pages } from "pages";

export type AboutImageAsset = {
  src: string;
  alt: string;
  aspectRatio?: string;
};

export type AboutLinkItem = {
  title: string;
  href: string;
  description?: string;
};

export type AboutContentSection = {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: AboutLinkItem[];
  note?: string;
};

export type AboutQuote = {
  quote: string;
  attribution: string;
};

export type AboutServiceFeature = {
  title: string;
  href: string;
  description: string;
  image: AboutImageAsset;
};

export type AboutSubscriptionTier = {
  title: string;
  price: string;
  items: string[];
};

export type AboutPersonSummary = {
  slug: string;
  name: string;
  role: string;
  email?: string;
  employmentLabel?: string;
  tenure?: string;
  image: AboutImageAsset;
  profilePath: string;
  excerpt: string;
};

type AboutBasePage = {
  path: string;
  title: string;
  lead?: string;
  eyebrow?: string;
  sidebarPath?: string;
};

export type AboutArticlePage = AboutBasePage & {
  kind: "article";
  heroImage?: AboutImageAsset;
  sections: AboutContentSection[];
  quotes?: AboutQuote[];
};

export type AboutServicesLandingPage = AboutBasePage & {
  kind: "services-landing";
  serviceFeatures: AboutServiceFeature[];
  sections: AboutContentSection[];
};

export type AboutForecastingPage = AboutBasePage & {
  kind: "forecasting";
  heroImage?: AboutImageAsset;
  supportingImages?: AboutImageAsset[];
  sections: AboutContentSection[];
  subscriptionTiers: AboutSubscriptionTier[];
};

export type AboutPeopleDirectoryPage = AboutBasePage & {
  kind: "people-directory";
  currentPeople: AboutPersonSummary[];
  pastPeople?: AboutPersonSummary[];
  pastPeopleHeading?: string;
};

export type AboutPersonProfilePage = AboutBasePage & {
  kind: "person-profile";
  directoryPath: string;
  directoryTitle: string;
  person: AboutPersonSummary;
  sections: AboutContentSection[];
};

export type AboutHelpfulLinksPage = AboutBasePage & {
  kind: "helpful-links";
  groups: {
    title: string;
    links: AboutLinkItem[];
  }[];
};

export type AboutContactPage = AboutBasePage & {
  kind: "contact";
  mapImage: AboutImageAsset;
  formEmail: string;
  intro: string;
  locationSummary: string;
  locations: {
    title: string;
    lines: string[];
  }[];
  contactLinks: {
    title: string;
    href: string;
    description?: string;
  }[];
};

export type AboutPage =
  | AboutArticlePage
  | AboutServicesLandingPage
  | AboutForecastingPage
  | AboutPeopleDirectoryPage
  | AboutPersonProfilePage
  | AboutHelpfulLinksPage
  | AboutContactPage;

const aboutImages = {
  servicesForecasting: {
    src: "/bber/about/for-unm.png",
    alt: "New Mexico Economic Forecast service banner",
    aspectRatio: "16 / 5",
  },
  servicesDataBank: {
    src: "/bber/about/data-bank.png",
    alt: "Data Bank service banner",
    aspectRatio: "16 / 5",
  },
  servicesDashboards: {
    src: "/bber/about/data-dashboards.png",
    alt: "Data Dashboards service banner",
    aspectRatio: "16 / 5",
  },
  servicesResearch: {
    src: "/bber/about/research-service.png",
    alt: "Research service banner",
    aspectRatio: "16 / 5",
  },
  servicesSpeaking: {
    src: "/bber/about/speaking.png",
    alt: "Speaking engagements service banner",
    aspectRatio: "16 / 5",
  },
  forecastingHero: {
    src: "https://api.bber.unm.edu/api/files/FOR_UNM_Page_Graphic_012018_a1dec52520.jpg",
    alt: "FOR-UNM forecasting publication sample",
    aspectRatio: "16 / 10",
  },
  forecastingCorporate: {
    src: "https://api.bber.unm.edu/api/files/FOR_UNM_9cd2887dd7.png",
    alt: "FOR-UNM corporate subscription sample",
    aspectRatio: "5 / 7",
  },
  forecastingSnapshot: {
    src: "https://api.bber.unm.edu/api/files/Snapshot_1ac85ecdde.png",
    alt: "FOR-UNM snapshot subscription sample",
    aspectRatio: "5 / 7",
  },
  dataBank: {
    src: "/bber/about/state-data-center.png",
    alt: "New Mexico State Data Center graphic",
    aspectRatio: "4 / 3",
  },
  dashboards: {
    src: "https://api.bber.unm.edu/api/files/Dashboard_Sample_38d408d079.png",
    alt: "Sample BBER dashboard",
    aspectRatio: "16 / 10",
  },
  research: {
    src: "https://api.bber.unm.edu/api/files/research_sample_f359ba2cc1.png",
    alt: "BBER research sample graphic",
    aspectRatio: "16 / 10",
  },
  history: {
    src: "/bber/about/history.jpg",
    alt: "Historic image of Hodgin Hall at UNM",
    aspectRatio: "4 / 3",
  },
  contactMap: {
    src: "/bber/about/unm-visitor-map.webp",
    alt: "UNM visitor map showing the BBER location",
    aspectRatio: "4 / 3",
  },
} satisfies Record<string, AboutImageAsset>;

const staticAboutPages = {
  about: {
    path: Pages.About_BBER.url,
    title: "About",
    lead: "The University of New Mexico Bureau of Business and Economic Research provides socioeconomic data, forecasting, and policy-focused research across New Mexico.",
    eyebrow: "About",
    sidebarPath: Pages.About_BBER.url,
    kind: "article",
    sections: [
      {
        title: "Who We Are",
        paragraphs: [
          "The University of New Mexico Bureau of Business and Economic Research (BBER) is the recognized expert in providing socioeconomic data and forecasting in New Mexico. With more than 70 years of experience, BBER's research team provides economic forecasting as well as economic research services and data communication tools tailored to the needs of clients - public, private, nonprofit, and philanthropic - seeking to understand and shape public policy on the state, regional, and local levels.",
          "BBER's services and research help leaders in the Land of Enchantment to understand, forecast and identify trends and changing economic markets across the state of New Mexico in order to inform decision making.",
        ],
      },
      {
        title: "History",
        paragraphs: [
          "BBER was founded on July 1, 1945. Then the Bureau of Business Research (BBR), it was established in response to two major concerns:",
          "Since the early 1990s, BBER has provided research and data through two programs funded by the New Mexico State Legislature: The Census Dissemination and Demographic Analysis Program and the Resource Geographic Information System Program (RGIS). The former allows BBER to add significant value to basic Census Bureau data while the latter promotes and utilizes GIS technologies for data dissemination and research.",
          "From the beginning to the present, BBER has focused on helping New Mexicans better understand the state's economy and the demographic characteristics of our population.",
        ],
        bullets: [
          "New Mexico's economy was lagging nationally with the highest unemployment rate of any state in 1940.",
          "The University of New Mexico (UNM) was seeking to assume a significant role in providing community service and leadership, as well as to focus university resources toward fostering the economic development of New Mexico.",
        ],
        links: [
          {
            title: "RGIS",
            href: "https://rgis.unm.edu/",
            description: "Resource Geographic Information System at UNM.",
          },
        ],
      },
    ],
    quotes: [
      {
        quote:
          "BBER is the most credible and independent source of economic data and analysis in New Mexico. Our Company has a membership with BBER so that we have limitless access to information that analyses the current state of the economy in our state such that we can make informed business decisions on where to focus our attention and manage our business.",
        attribution: "Norm Becker, President + CEO, NM Mutual",
      },
      {
        quote:
          "BBER was really helpful and knowledgeable in working with the City of Santa Fe to create a data dashboard that appears on the city's home page. Members of the public have already commented on the helpfulness of having key data for the city in an easily accessible place with a visual format. If you're a proponent of transparency and believe key data should be available to everyone, a data dashboard is the way to go. BBER has the tools and know-how to get it done.",
        attribution:
          "Reed Liming, Division Director, Land Use + Long Range Plnng., City of Santa Fe",
      },
      {
        quote:
          '"UNM-BBER has been an invaluable partner with NMMS working in the field with local MainStreet and Arts & Cultural District organizations. They have provided critical economic analysis that helps determine the current economic market position of the commercial district. More importantly they set a firm economic foundation from which our affiliated communities can set a strong market vision statement to achieve over the next 5 years which tutors their strategies to transform their local economy and the priority economic development projects for implementation to move their vision to reality."',
        attribution: "Rich Williams, Director, NM Mainstreet",
      },
      {
        quote:
          '"Trustworthy, unbiased market research based on accurate data and analytics is the only way for business owners to see where they\'re going. New Mexico is fortunate to have the University of New Mexico Bureau of Business and Economic Research or BBER."',
        attribution: "Santa Fe New Mexican",
      },
    ],
  },
  services: {
    path: Pages.About_BBER.children.Services.url,
    title: "Services",
    lead: "BBER supports decision makers across New Mexico with forecasting, data curation, dashboards, tailored research, and speaking engagements.",
    eyebrow: "About / Services",
    sidebarPath: Pages.About_BBER.children.Services.url,
    kind: "services-landing",
    serviceFeatures: [
      {
        title: "NM Economic Forecasting",
        href: Pages.About_BBER.children.Services.children.forecasting.url,
        description:
          "Quarterly forecasting subscriptions with statewide and regional projections for budgeting, planning, and strategic decisions.",
        image: aboutImages.servicesForecasting,
      },
      {
        title: "Data Bank",
        href: Pages.About_BBER.children.Services.children.data_bank.url,
        description:
          "Curated New Mexico datasets, historical reference materials, geospatial resources, and public data access services.",
        image: aboutImages.servicesDataBank,
      },
      {
        title: "Data Dashboards",
        href: Pages.About_BBER.children.Services.children.data_dashboards.url,
        description:
          "Custom dashboard subscriptions that present real-time indicators for places, industries, and organizations.",
        image: aboutImages.servicesDashboards,
      },
      {
        title: "Research",
        href: Pages.About_BBER.children.Services.children.research.url,
        description:
          "Applied research tailored to policy, industry, and community questions across New Mexico.",
        image: aboutImages.servicesResearch,
      },
      {
        title: "Speaking Engagements",
        href: Pages.About_BBER.children.Contact.url,
        description:
          "Fee-based speaking engagements and presentations from the BBER research team upon request.",
        image: aboutImages.servicesSpeaking,
      },
    ],
    sections: [
      {
        title: "New Mexico Economic Forecast (FOR-UNM)",
        paragraphs: [
          "The New Mexico Economic Forecast (FOR-UNM) is a tool for decision makers in the private and public sector to understand historic, current and future economic trends in New Mexico.",
          "The forecast is exclusively produced by BBER and should be used to guide future decision making, identify future markets and aid in budget planning processes. This service is a quarterly subscription package which projects over 300 economic variables for the state as a whole, as well as for each of the major metropolitan areas - Albuquerque, Farmington, Las Cruces, Permian Basin, Santa Fe and non-metro.",
        ],
        links: [
          {
            title: "New Mexico Economic Forecasting",
            href: Pages.About_BBER.children.Services.children.forecasting.url,
          },
        ],
      },
      {
        title: "Data",
        paragraphs: [
          "BBER is the best resource for statistical information regarding the Land of Enchantment. BBER houses a large database focusing exclusively on New Mexico data that is pulled from state and national sources.",
          "BBER is skilled in identifying accurate data, as well as processing, formatting and maintaining large data sets. This ability to curate data is unlike any other data service in New Mexico.",
          "The data can be accessed via three outlets: Data Dashboards, Data Subscriptions and BBER's website.",
          "Access to data is available on an annual fee-based subscription. By signing up for BBER's Data Subscription Service, you will receive password protected access to selected data sets.",
        ],
        links: [
          {
            title: "Data Bank",
            href: Pages.About_BBER.children.Services.children.data_bank.url,
          },
          {
            title: "Public Data",
            href: Pages.Data.url,
          },
        ],
      },
      {
        title: "Dashboards",
        paragraphs: [
          "Data Dashboards are used to visually communicate current indicators of a specific place or industry to those whom a government agency, business or organization serves. Put simply, it is a way to tell your story prominently on your website.",
          "The service is an annual subscription that is a customized package to the subscriber's needs.",
        ],
        links: [
          {
            title: "Data Dashboards",
            href: Pages.About_BBER.children.Services.children.data_dashboards
              .url,
          },
        ],
      },
      {
        title: "Research",
        paragraphs: [
          "BBER has the expertise to understand the economic indicators and trends affecting the U.S. and New Mexico's economy. In turn, BBER can apply this knowledge to tailored and detailed research.",
          "At its core, BBER is a research group and our team of PhD and Masters-level analysts are eager to hear about your individual and tailored project needs.",
        ],
        links: [
          {
            title: "Research",
            href: Pages.About_BBER.children.Services.children.research.url,
          },
        ],
      },
      {
        title: "Speaking Engagements",
        paragraphs: [
          "BBER is available for fee-based speaking engagements upon request. Contact us to arrange for a presentation by BBER.",
        ],
        links: [
          {
            title: "Contact us",
            href: Pages.About_BBER.children.Contact.url,
          },
        ],
        note: "For information on BBER services and how BBER can help serve you, contact bber@unm.edu.",
      },
    ],
  },
  forecasting: {
    path: Pages.About_BBER.children.Services.children.forecasting.url,
    title: "New Mexico Economic Forecasting (FOR-UNM)",
    lead: "BBER’s flagship quarterly forecasting service gives public and private decision makers statewide and regional outlooks for New Mexico’s economy.",
    eyebrow: "About / Services",
    sidebarPath: Pages.About_BBER.children.Services.children.forecasting.url,
    kind: "forecasting",
    heroImage: aboutImages.forecastingHero,
    supportingImages: [
      aboutImages.forecastingCorporate,
      aboutImages.forecastingSnapshot,
    ],
    sections: [
      {
        paragraphs: [
          "The New Mexico Economic Forecast (FOR-UNM) has been produced by BBER for over 30 years. This service provides information and analysis of economic trends that businesses and government leaders in the Land of Enchantment need to identify opportunities, evaluate performance and develop budgets.",
          "The forecast is used by the state government for revenue projections in setting the state budget. The forecast can also be useful to public and private organizations.",
        ],
      },
      {
        title: "The Econometric Model",
        paragraphs: [
          "The FOR-UNM model is an employment/income regional model, consisting of 375 equations. About two-thirds of the equations are estimated using statistical regression methods, and the remaining third are identity equations.",
          "Each estimated equation explains the historical, statistical relationship between a New Mexico economic variable, such as manufacturing employment, and one or more other constituents. These explanatory factors may be national economic variables like interest rates and/or a New Mexico specific variable such as state population.",
          "Through the specification of the model, national economic impacts as well as state-specific economic impacts are captured in the projection of the N.M. economy. Linking the state econometric model to national economic activity requires the availability of a forecast of the U.S. economy in order to project the state economy. FOR-UNM relies upon the national economic calculations of Global Insight, Inc., one of the largest and most reliable national economic forecast services.",
          "To reflect the structural differences between the economies of urban and rural New Mexico, the FOR-UNM model forecasts six regional models: Albuquerque MSA, Santa Fe MSA, Las Cruces MSA, Farmington MSA, Permian Basin MSA (Lea and Eddy Counties) and non-metro New Mexico (the entire state of New Mexico minus the five metro areas). After forecasting those regions, the results are analyzed to obtain a forecast for the entire Land of Enchantment.",
        ],
      },
    ],
    subscriptionTiers: [
      {
        title: "Full Subscription",
        price: "$7,500 annually",
        items: [
          "Quarterly updates in February, May, August, and November.",
          "Outlooks on the national economy in addition to the state economy.",
          "Breakouts for Albuquerque, Farmington, Las Cruces, Permian Basin, Santa Fe, and non-metro New Mexico.",
          "Forecast variables include industry employment, income, labor force, oil and gas production, commercial and residential building permits, and other leading indicators.",
          "Historical and five-year forecast data spreadsheet on quarterly, annual, and fiscal-year time steps.",
          "Complete forecast publication in electronic and hard-copy formats.",
          "Quarterly meetings with in-depth discussion, Q&A, and guest speaker presentations.",
        ],
      },
      {
        title: "Corporate Subscription",
        price: "$25,000 annually",
        items: [
          "All of the benefits in the full subscription.",
          "One-on-one access to BBER's director for data and analysis targeted to your needs.",
          "Database login access to multiple selected data sets.",
          "Name recognition and logo placement on the BBER website with an active link to your site.",
          "Logo placement on promotional fliers and other materials as appropriate.",
        ],
      },
      {
        title: "Snapshot Subscription",
        price: "$1,000 annually",
        items: [
          "Quarterly updates in February, May, August, and November.",
          "Brief outlooks on the national and state economy.",
          "Limited breakouts for Albuquerque, Farmington, Las Cruces, Permian Basin, Santa Fe, and non-metro New Mexico.",
          "Forecast variables include personal income, employment, civilian labor force, and unemployment rate.",
          "Historical and two-year forecast data on quarterly and annual time steps.",
          "Publication in electronic format only.",
        ],
      },
    ],
  },
  dataBank: {
    path: Pages.About_BBER.children.Services.children.data_bank.url,
    title: "Data Bank",
    lead: "The Data Bank is the backbone of BBER’s data services, combining curated New Mexico datasets, historical reference materials, and geospatial resources.",
    eyebrow: "About / Services",
    sidebarPath: Pages.About_BBER.children.Services.children.data_bank.url,
    kind: "article",
    heroImage: aboutImages.dataBank,
    sections: [
      {
        paragraphs: [
          "The Data Bank is the backbone of the services that BBER provides. BBER has developed sophisticated technology to collect and identify accurate data, as well as process, format and maintain large data sets.",
          "BBER has the ability to layer various types of data in order to analyze and forecast trends and relationships between economic factors based on location. This competency to curate data is unlike any other data service in the Land of Enchantment. The focus of BBER's data collection is New Mexico data.",
          "This data is collected and stored electronically through the Data Bank. As New Mexico's representative of the U.S. Census Bureau's State Data Center program, BBER is the reliable source for up-to-date information on the state's economy.",
          "The Data Bank curates data pulled from state and national sources, and meticulously collects information from local sources to provide businesses, government agencies and community.",
        ],
        links: [
          {
            title: "State Data Center",
            href: "https://bber.unm.edu/state-data-center-description",
          },
          {
            title: "Interactive RGIS Tool",
            href: Pages.Data.children.RGIS.url,
          },
        ],
      },
      {
        title: "Data and Maintenance Schedule",
        links: [
          {
            title: "Download PDF",
            href: "https://api.bber.unm.edu/api/files/BBER_Available_Data_2019_306ebb7af9.pdf",
          },
        ],
      },
      {
        title: "Data Bank Library",
        paragraphs: [
          "The Data Bank houses a reference library collection that boasts hard copy census reports for the U.S. and New Mexico, dating back to the 1930. The library also has historical data on CDs, sheet maps, and microfilm not available elsewhere; publications with socioeconomic data from other federal and state agencies; books, reports, and periodicals pertaining to national, regional, state, and local economic conditions; demographic research publications; and nearly all of BBER's published studies.",
          "New information is received and disseminated exclusively in digital formats.",
          "The Data Bank Library is open to the public for reference use; a photocopier and scanner are available. The library collection can be searched through LIBROS, UNM's online catalog (select UNM Department Libraries as part of the search).",
          "BBER has a digital repository that is accessable through the UNM Digital Repository for older publications.",
        ],
        links: [
          {
            title: "LIBROS",
            href: "https://unm.worldcat.org/",
          },
          {
            title: "Digital Repository",
            href: "https://digitalrepository.unm.edu/business_economic_research/",
          },
        ],
      },
      {
        title: "Data Bank Hours",
        bullets: [
          "Monday, Tuesday, Wednesday, and Friday — 8:30 a.m. to 5:00 p.m.",
          "Thursday — Closed",
        ],
      },
      {
        title: "Data Users Conference",
        paragraphs: [
          "Each fall, BBER hosts the annual N.M. Data Users Conference. This conference offers various information sessions for data users across the state.",
        ],
        links: [
          {
            title: "Conference webpage",
            href: Pages.Data.children.NM_Data_Users_Conference.url,
          },
        ],
      },
    ],
  },
  dataDashboards: {
    path: Pages.About_BBER.children.Services.children.data_dashboards.url,
    title: "Data Dashboards",
    lead: "BBER dashboards help organizations tell their story with current indicators, tailored metrics, and regularly updated web-based data visualizations.",
    eyebrow: "About / Services",
    sidebarPath:
      Pages.About_BBER.children.Services.children.data_dashboards.url,
    kind: "article",
    heroImage: aboutImages.dashboards,
    sections: [
      {
        paragraphs: [
          "The Data Dashboard service is used to visually communicate real time data indicators of a specific place or industry to those whom a government agency, business or organization serves. Specific data can be pulled from BBER's Data Bank, public records or from other sources provided by the customer.",
        ],
      },
      {
        title: "Indicators BBER Tracks",
        bullets: [
          "Employment: total jobs and businesses, year-over-year growth, employment by industry, industry comparison, and location quotients.",
          "Population: total population, annual growth rate, race and ethnicity, and age pyramid views.",
          "Migration: components of change, migration change, place of birth, and pull factors.",
          "Income: household income, household types, poverty measures, and housing cost burden.",
          "Commuting: mean travel time, transportation choices, solo drivers, and zero-vehicle availability.",
          "Education: educational attainment, school-age population, labor participation, and unemployment.",
          "Housing: total housing units, renter share, multi-family housing, median value, and property taxes.",
          "Gross receipts: total gross receipts, taxable gross receipts, gross tax, food and medical tax, and term-over-term growth.",
          "Building permits: state-issued, county-issued, district-issued, residential, and non-residential permits.",
          "Miscellaneous: oil and gas data plus state and local government finances.",
        ],
      },
      {
        paragraphs: [
          "The service is an annual subscription that is customized to the subscriber's needs. Clients of the Data Dashboard service receive tailor-made, web-based data visualization snapshots. Regular maintenance and updates to the dashboards and/or access to a customized database are included.",
        ],
        note: "To inquire about a dashboard for your business or organization, contact us at bber@unm.edu.",
      },
    ],
  },
  researchService: {
    path: Pages.About_BBER.children.Services.children.research.url,
    title: "Research",
    lead: "BBER applies economic expertise and New Mexico-specific knowledge to custom research, presentations, and policy analysis.",
    eyebrow: "About / Services",
    sidebarPath: Pages.About_BBER.children.Services.children.research.url,
    kind: "article",
    heroImage: aboutImages.research,
    sections: [
      {
        paragraphs: [
          "For 75 years, BBER has provided economic data and forecasting to help State and local governments, business leaders, non-profit organizations and community leaders identify and understand economic trends that are shaping the state of New Mexico.",
        ],
      },
      {
        title: "Techniques Used in Past Research Projects and Presentations",
        bullets: [
          "Focus Groups",
          "Survey Research",
          "Feasibility Studies",
          "Labor Market Research",
          "Demographics/Migration Analysis",
          "Cost-Benefit Analysis",
          "Employment Forecasting",
          "Fiscal Impact Analysis",
        ],
      },
      {
        paragraphs: [
          "At its core, BBER is a research group. All work is completed by PhD and Masters-level analysts who understand New Mexico. Our team is available for speaking engagements and presentations upon request.",
          "BBER guarantees authoritative, objective and non-partisan results. The cost for a custom project is determined by the scope of work.",
        ],
        links: [
          {
            title: "Projects",
            href: Pages.Research.children.Publications.url,
          },
          {
            title: "Presentations",
            href: Pages.Research.children.Presentation.url,
          },
        ],
      },
    ],
  },
  history: {
    path: Pages.About_BBER.children.History.url,
    title: "History",
    lead: "Since 1945, BBER has grown from a small research unit into one of the Southwest’s most established economic research institutions.",
    eyebrow: "About",
    sidebarPath: Pages.About_BBER.children.History.url,
    kind: "article",
    heroImage: aboutImages.history,
    sections: [
      {
        title: "Our History",
        paragraphs: [
          "The Bureau of Business and Economic Research (BBER) at the University of New Mexico (UNM) was established in 1945 as the Bureau of Business Research (BBR) in response to two major concerns: the need for accurate and timely business information in the state of New Mexico and the desire to create a research institution that would help stimulate economic growth in the state.",
          "Initially a small research unit within the UNM School of Business, the BBR's mission began to expand in the early 1950s to undertake more in-depth economic research projects, including economic forecasting and impact analysis.",
          "In response to the expanded mission, the name of the organization changed from the Bureau of Business Research to the Bureau of Business and Economic Research. Over the years, the BBER has become one of the premier economic research institutions in the region.",
          "Today, the Bureau's research and consulting services cover a broad range of topics, including economic development, energy and natural resources, health care, transportation, and workforce development. The Bureau provides valuable economic and business data to policymakers, businesses, and individuals throughout New Mexico and the surrounding region.",
          "Throughout its history, the BBER has remained committed to its mission of providing accurate, objective, and timely economic research and analysis to help promote economic growth and development in New Mexico and beyond.",
        ],
      },
    ],
  },
  helpfulLinks: {
    path: Pages.About_BBER.children.Helpful_Links.url,
    title: "Helpful Links",
    lead: "A curated directory of census, state, federal, university, and economic development resources frequently used by BBER and New Mexico data users.",
    eyebrow: "About",
    sidebarPath: Pages.About_BBER.children.Helpful_Links.url,
    kind: "helpful-links",
    groups: [
      {
        title: "US Census",
        links: [
          { title: "US Census Main Page", href: "https://www.census.gov/" },
          {
            title: "CBDT: Census Bureau Data Tool",
            href: "https://data.census.gov/",
          },
          {
            title: "CBB Census Business Builder",
            href: "https://cbb.census.gov/",
          },
          {
            title: "CBP: County Business Patterns",
            href: "https://www.census.gov/econ/cbp/",
          },
          {
            title: "Economic Census",
            href: "https://www.census.gov/programs-surveys/economic-census.html",
          },
          {
            title: "Population Estimates",
            href: "https://www.census.gov/popest/",
          },
          {
            title: "Population Projections",
            href: "https://www.census.gov/topics/population/population-projections.html",
          },
          {
            title: "SAIPE: Small Area Income and Poverty Estimates",
            href: "https://www.census.gov/programs-surveys/saipe.html",
          },
          {
            title: "SAHIE: Small Area Health Insurance Estimates",
            href: "https://www.census.gov/programs-surveys/sahie.html",
          },
          {
            title: "LEHD: Local Employer-Household Dynamics",
            href: "https://lehd.ces.census.gov/",
          },
          {
            title: "State Data Center Program and Contacts",
            href: "https://www.census.gov/sdc/",
          },
          {
            title: "Latest National Economic Indicators",
            href: "https://www.census.gov/economic-indicators/",
          },
        ],
      },
      {
        title: "Alternative US Census Data Sources",
        links: [
          {
            title: "MCDC: Missouri Census Data Center",
            href: "https://mcdc.missouri.edu/",
          },
          {
            title: "NHGIS: National Historical Geographic Information System",
            href: "https://www.nhgis.org/",
          },
          {
            title: "Census Reporter",
            href: "https://beta.censusreporter.org/",
          },
          {
            title: "IPUMS: Integrated Public Use Microdata Series",
            href: "https://usa.ipums.org/usa/index.shtml",
          },
          {
            title: "ESRI for mapping users",
            href: "https://www.esri.com/en-us/home%3E",
          },
          {
            title: "DRP Data Rescue Project Portal",
            href: "https://portal.datarescueproject.org/%3E",
          },
        ],
      },
      {
        title: "New Mexico State Agencies",
        links: [
          {
            title: "State of New Mexico Home Page",
            href: "https://www.newmexico.gov/",
          },
          {
            title: "Department of Workforce Solutions (DWS)",
            href: "https://www.dws.state.nm.us/",
          },
          {
            title: "Tax & Revenue Department (TRD)",
            href: "https://www.tax.newmexico.gov/Default.aspx",
          },
          {
            title: "Economic Development Department (EDD)",
            href: "https://edd.newmexico.gov/",
          },
          {
            title: "Department of Health (DOH)",
            href: "https://nmhealth.org/",
          },
          {
            title:
              "Indicator Based Information System for Public Health (IBIS)",
            href: "https://ibis.health.state.nm.us/home/Welcome.html",
          },
          { title: "NM Legislature", href: "https://www.nmlegis.gov/lcs/" },
          {
            title: "Public Education Department (PED)",
            href: "https://ped.state.nm.us/ped/index.html",
          },
          {
            title: "Higher Education Department (HED)",
            href: "https://www.hed.state.nm.us/",
          },
          {
            title: "Mid-Region Council of Governments (MRCOG)",
            href: "https://www.mrcog-nm.gov/",
          },
        ],
      },
      {
        title: "Federal Government Data & Resources",
        links: [
          {
            title: "BEA: Bureau of Economic Analysis",
            href: "https://www.bea.gov/",
          },
          {
            title: "BLS: Bureau of Labor Statistics",
            href: "https://www.bls.gov/",
          },
          {
            title: "NCES: National Center for Education Statistics",
            href: "https://nces.ed.gov/",
          },
          {
            title: "SDDS: School District Demographic System",
            href: "https://nces.ed.gov/surveys/sdds/about.aspx",
          },
          {
            title: "CDC: Center for Disease Control",
            href: "https://www.cdc.gov/",
          },
          {
            title: "State and Territorial Data",
            href: "https://www.cdc.gov/nchs/fastats/state-and-territorial-data.htm",
          },
          { title: "Kansas City Fed", href: "https://www.kansascityfed.org/" },
          {
            title: "BJS: Bureau of Justice Statistics",
            href: "https://www.bjs.gov/",
          },
          {
            title: "BTS: Bureau of Transportation Statistics",
            href: "https://www.bts.gov/",
          },
          {
            title: "NASS: National Agricultural Statistics Service",
            href: "https://www.nass.usda.gov/",
          },
          {
            title: "EIA: US Energy Information Administration",
            href: "https://www.eia.gov/",
          },
        ],
      },
      {
        title: "University of New Mexico Resources",
        links: [
          {
            title: "Geospatial and Population Studies (GPS)",
            href: "https://gps.unm.edu/",
          },
          {
            title: "GPS Traffic Research Unit (TRU)",
            href: "https://tru.unm.edu/index.html",
          },
          {
            title: "Earth Data Analysis Center (EDAC)",
            href: "https://edac.unm.edu/",
          },
          {
            title: "Resource Geographic Information System (RGIS)",
            href: "https://rgis.unm.edu/",
          },
        ],
      },
      {
        title: "Miscellaneous",
        links: [
          {
            title: "GPS Population Projections",
            href: "https://ibis.health.state.nm.us/query/selection/pop/PopSelection.html",
          },
          { title: "Kids Count Data", href: "https://kff.org/statedata/" },
          { title: "State Health Facts", href: "https://kff.org/statedata/" },
          {
            title: "County Health Rankings",
            href: "https://www.countyhealthrankings.org/",
          },
          {
            title: "STATSIndiana - USA Counties IN Profile",
            href: "https://www.stats.indiana.edu/uspr/a/us_profile_frame.html",
          },
        ],
      },
      {
        title: "Economic Development Groups",
        links: [
          {
            title: "AED: Albuquerque Economic Development",
            href: "https://www.abq.org/default.aspx",
          },
          {
            title: "CABQ ED: City of Albuquerque Economic Development",
            href: "https://www.cabq.gov/economicdevelopment",
          },
          {
            title: "NM SBDC: NM Small Business Development Center",
            href: "https://www.abq.org/Starting_A_Business.aspx",
          },
          {
            title: "GGEDC: Greater Gallup Economic Development Corporation",
            href: "https://gallupedc.com/gallup",
          },
        ],
      },
    ],
  },
  contact: {
    path: Pages.About_BBER.children.Contact.url,
    title: "Contact Us",
    lead: "Reach out to the BBER team for services, data requests, or questions about the bureau’s work.",
    eyebrow: "About",
    sidebarPath: Pages.About_BBER.children.Contact.url,
    kind: "contact",
    intro: "Send us a message or say hi in the live chat.",
    formEmail: "bber@unm.edu",
    mapImage: aboutImages.contactMap,
    locationSummary:
      "BBER is located in the University Information Technology Building on UNM’s Central Campus.",
    locations: [
      {
        title: "Physical Address",
        lines: [
          "University Information Technology Building",
          "2701 Campus Blvd NE",
          "Office #1007",
          "Albuquerque, NM 87131",
        ],
      },
      {
        title: "Mailing Address",
        lines: [
          "MSC06 3510",
          "1 University of New Mexico",
          "Albuquerque, NM 87131-0001",
        ],
      },
    ],
    contactLinks: [
      {
        title: "Questions About BBER Services",
        href: "mailto:bber@unm.edu",
        description: "bber@unm.edu",
      },
      {
        title: "Data Requests",
        href: "mailto:sreagan@unm.edu",
        description: "sreagan@unm.edu",
      },
      {
        title: "UNM Central Campus Visitor Map",
        href: "https://ppd.unm.edu/assets/documents/campus-maps/visitormapcentral_numeric.pdf",
        description: "BBER is in the UNM IT building (building 153).",
      },
    ],
  },
} satisfies Record<string, AboutPage>;

const aboutPageList: AboutPage[] = Object.values(staticAboutPages);

export function findAboutPage(pathname: string) {
  const normalizedPathname = normalizePageUrl(pathname);

  return (
    aboutPageList.find((page) => {
      return normalizePageUrl(page.path) === normalizedPathname;
    }) ?? null
  );
}

export function getAboutSubpageSlugs() {
  return aboutPageList
    .filter(
      (page) =>
        normalizePageUrl(page.path) !== normalizePageUrl(Pages.About_BBER.url),
    )
    .map((page) => {
      return normalizePageUrl(page.path).split("/").filter(Boolean).slice(1);
    });
}
