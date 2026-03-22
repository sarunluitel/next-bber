import { Pages } from "pages";

export type StaticResourceLink = {
  title: string;
  href: string;
  description?: string;
  auxiliaryLinks?: {
    title: string;
    href: string;
  }[];
};

export type StaticResourceLinkGroup = {
  title?: string;
  description?: string;
  layout?: "cards" | "list" | "compact";
  columns?: 1 | 2 | 3;
  links: StaticResourceLink[];
};

export type StaticResourceSection = {
  title?: string;
  note?: string;
  paragraphs?: string[];
  linkGroups?: StaticResourceLinkGroup[];
};

export type StaticResourceCallout = {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
};

export type StaticResourcePage = {
  path: string;
  title: string;
  eyebrow: string;
  lead: string;
  backLink?: {
    href: string;
    label: string;
  };
  callouts?: StaticResourceCallout[];
  sections: StaticResourceSection[];
};

const cityOfAlbuquerqueLinks: StaticResourceLink[] = [
  {
    title: "Zone Atlas",
    href: "https://data.cabq.gov/business/zoneatlas/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/zoneatlas/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "WiFi Spots",
    href: "https://data.cabq.gov/community/wifi/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/wifi/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Voting Locations 2015",
    href: "https://data.cabq.gov/government/votinglocations/2015/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/votinglocations/2015/MetaData.pdf",
      },
    ],
  },
  {
    title: "Voting Locations 2013",
    href: "https://data.cabq.gov/government/votinglocations/2013/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/votinglocations/2013/MetaData_2013.pdf/view",
      },
    ],
  },
  {
    title: "Volunteerism RSS",
    href: "https://data.cabq.gov/community/volunteerism/volunteer",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/volunteerism/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Vendor Checkbook",
    href: "https://data.cabq.gov/government/vendorcheckbook/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/vendorcheckbook/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Vehicle Emissions",
    href: "https://data.cabq.gov/airquality/vehicleemissions/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/airquality/vehicleemissions/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Ungraded Employee Earnings",
    href: "https://data.cabq.gov/government/ungraded/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/ungraded/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Transit Routes and Stops",
    href: "https://data.cabq.gov/transit/routesandstops/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/transit/routesandstops/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Transit in Real Time",
    href: "https://data.cabq.gov/transit/realtime/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/transit/realtime/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Transit Maps",
    href: "https://data.cabq.gov/transit/Maps/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/transit/Maps/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Traffic Barricades",
    href: "https://data.cabq.gov/government/trafficbarricades/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/trafficbarricades/MetaData.pdf",
      },
    ],
  },
  {
    title: "Top 250 Employee Earners",
    href: "https://data.cabq.gov/government/top250/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/top250/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Swimming Pool Admissions",
    href: "https://data.cabq.gov/community/swimmingpooladmissions/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/swimmingpooladmissions/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Summer Lunch",
    href: "https://data.cabq.gov/community/summerlunch/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/summerlunch/SummerLunch2015%20-%20CoreMetaData.pdf",
      },
    ],
  },
  {
    title: "Route 66 Signs",
    href: "https://data.cabq.gov/rt66signs/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/rt66signs/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Restaurant Inspections in LIVES Format",
    href: "https://data.cabq.gov/business/LIVES/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/LIVES/Yelp%20LIVES%20-%20CoreMetaData.pdf/view",
      },
    ],
  },
  {
    title: "Residential Trash and Recycling Routes",
    href: "https://data.cabq.gov/government/solidwaste/trashroutes/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/solidwaste/trashroutes/MetaData.pdf",
      },
    ],
  },
  {
    title: "Registered Historic Places",
    href: "https://data.cabq.gov/community/reghistplaces",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/reghistplaces/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Recycling Drop-off Locations",
    href: "https://data.cabq.gov/community/recyclingdrop/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/recyclingdrop/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Public Art",
    href: "https://data.cabq.gov/community/art/publicart/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/art/publicart/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Prescription Trails",
    href: "https://data.cabq.gov/community/prescripttrails/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/prescripttrails/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Pool Inspections",
    href: "https://data.cabq.gov/business/poolinspections/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/poolinspections/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Pollen Count Daily",
    href: "https://data.cabq.gov/airquality/pollen/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/airquality/pollen/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Police Beats",
    href: "https://data.cabq.gov/publicsafety/policebeats/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/publicsafety/policebeats/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Police Area Commands",
    href: "https://data.cabq.gov/publicsafety/policeareacommands/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/publicsafety/policeareacommands/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Parks",
    href: "https://data.cabq.gov/community/parksandrec/parks/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/parksandrec/parks/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Parking Citations",
    href: "https://data.cabq.gov/publicsafety/parkingcitations/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/publicsafety/parkingcitations/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Open Trails",
    href: "https://data.cabq.gov/community/opentrails/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/opentrails/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "ABQ Open Space",
    href: "https://data.cabq.gov/community/openspace/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/openspace/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Albuquerque Neighborhoods",
    href: "https://data.cabq.gov/community/neighborhoods/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/neighborhoods/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Graded Employee Earnings",
    href: "https://data.cabq.gov/government/graded/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/graded/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Google Transit Feed Specification",
    href: "https://data.cabq.gov/transit/gtfs/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/transit/gtfs/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Golf Courses",
    href: "https://data.cabq.gov/community/golfcourses",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/golfcourses/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Food Inspections",
    href: "https://data.cabq.gov/business/foodinspections/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/foodinspections/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Film Locations",
    href: "https://data.cabq.gov/business/filmlocations/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/filmlocations/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "FEMA Exemptions",
    href: "https://data.cabq.gov/FEMA/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/FEMA/Metadata.pdf/view",
      },
    ],
  },
  {
    title: "City Events RSS",
    href: "https://data.cabq.gov/community/events/RSS",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/events/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Employee Benefits and Rates",
    href: "https://data.cabq.gov/government/eebenefitsrates",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/eebenefitsrates/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "DMD Projects",
    href: "https://data.cabq.gov/government/dmdprojects",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/dmdprojects/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Crime Incidents",
    href: "https://data.cabq.gov/publicsafety/policeincidents/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/publicsafety/policeincidents/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "City News RSS",
    href: "https://data.cabq.gov/community/news/news",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/news/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "City Limits",
    href: "https://data.cabq.gov/government/citylimits/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/citylimits/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "City Council Districts",
    href: "https://data.cabq.gov/government/citycouncildistricts/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/citycouncildistricts/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Campaign Vendor",
    href: "https://data.cabq.gov/government/campaignvendor/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/campaignvendor/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Campaign Finalized",
    href: "https://data.cabq.gov/government/campaignfinalized/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/campaignfinalized/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Business Registration",
    href: "https://data.cabq.gov/business/busregistration",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/busregistration/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Building Permits",
    href: "https://data.cabq.gov/business/buildingpermits/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/buildingpermits/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Bike Paths",
    href: "https://data.cabq.gov/community/bikepaths/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/community/bikepaths/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Air Quality",
    href: "https://data.cabq.gov/airquality/aqindex/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/airquality/aqindex/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Address Points",
    href: "https://data.cabq.gov/government/addresspoints",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/government/addresspoints/MetaData.pdf/view",
      },
    ],
  },
  {
    title: "Address Atlas",
    href: "https://data.cabq.gov/business/addressatlas/",
    auxiliaryLinks: [
      {
        title: "Metadata",
        href: "https://data.cabq.gov/business/addressatlas/MetaData.pdf/view",
      },
    ],
  },
];

export const OPEN_DATA_LANDING_PAGE: StaticResourcePage = {
  path: Pages.Data.children.Open_Data.url,
  title: "Open Data",
  eyebrow: "Data",
  lead: "Open data refers to information that is publicly available without restrictive copyright barriers, allowing people to access, use, reuse, and share it freely.",
  sections: [
    {
      paragraphs: [
        "Open data resources have become increasingly important for public transparency, classroom use, applied research, and community problem-solving.",
        "New Mexico now has a growing collection of open data resources. The pages below highlight several starting points that are especially useful for students, faculty, policymakers, researchers, and community partners.",
      ],
      linkGroups: [
        {
          title: "Featured Open Data Sources",
          description:
            "Explore university, municipal, state, and federal resources from one place.",
          layout: "cards",
          columns: 2,
          links: [
            {
              title: "The University of New Mexico",
              href: Pages.Data.children.Open_Data.children.unm.url,
              description:
                "University transparency, institutional analytics, library data services, and campus research resources.",
            },
            {
              title: "City of Albuquerque",
              href: Pages.Data.children.Open_Data.children.city_of_albuquerque
                .url,
              description:
                "A broad collection of municipal datasets and metadata links from Albuquerque's open data portal.",
            },
            {
              title: "Sunshine Portal",
              href: Pages.Data.children.Open_Data.children.sunshine_portal.url,
              description:
                "State government transparency resources through the New Mexico Sunshine Portal.",
            },
            {
              title: "Data.gov",
              href: Pages.Data.children.Open_Data.children.federal.url,
              description:
                "Federal open data categories and gateway links for national datasets and APIs.",
            },
          ],
        },
      ],
    },
  ],
};

export const OPEN_DATA_UNM_PAGE: StaticResourcePage = {
  path: Pages.Data.children.Open_Data.children.unm.url,
  title: "The University of New Mexico Data Resources",
  eyebrow: "Open Data",
  lead: "The University of New Mexico provides a range of data resources for students, faculty, staff, researchers, and the public.",
  backLink: {
    href: Pages.Data.children.Open_Data.url,
    label: "Back to Open Data",
  },
  sections: [
    {
      paragraphs: [
        "UNM publishes resources that support transparency, institutional reporting, research, and teaching. These include enrollment reports, campus analytics, digital collections, and library data support.",
        "Together, these resources help users find information on university operations, student outcomes, research materials, and project support.",
      ],
    },
    {
      title: "UNM Sunshine Portal",
      paragraphs: [
        "UNM maintains its own Sunshine Portal, similar to the State of New Mexico's portal, where users can review university expenditures, contracts, salaries, and budget-related information.",
      ],
      linkGroups: [
        {
          layout: "list",
          links: [
            {
              title: "UNM Sunshine Portal",
              href: "https://sunshine.unm.edu/",
            },
          ],
        },
      ],
    },
    {
      title: "Office of Institutional Analytics",
      paragraphs: [
        "The Office of Institutional Analytics compiles and publishes official reports and aggregated institutional data, including enrollment, course performance, and time-to-degree reporting.",
      ],
      linkGroups: [
        {
          layout: "list",
          links: [
            {
              title: "Office of Institutional Analytics",
              href: "https://oia.unm.edu/",
            },
            {
              title: "Class Enrollment Data",
              href: "https://oia.unm.edu/facts-and-figures/official-enrollment-reports.html",
            },
            {
              title: "Course Fail Rates",
              href: "https://oia.unm.edu/facts-and-figures/course-fail-rates.html",
            },
            {
              title: "Time to Degree Reports",
              href: "https://oia.unm.edu/facts-and-figures/time-to-degree-.html",
            },
          ],
        },
      ],
    },
    {
      title: "UNM Library Data Services",
      paragraphs: [
        "UNM Library Data Services supports research and academic projects by helping users locate, manage, analyze, and visualize data.",
      ],
      linkGroups: [
        {
          layout: "list",
          links: [
            {
              title: "UNM Library",
              href: "https://library.unm.edu/",
            },
            {
              title: "Library Data Services",
              href: "https://library.unm.edu/services/data.php",
            },
          ],
        },
      ],
    },
    {
      title: "Additional Resources",
      paragraphs: [
        "Additional campus resources may also be useful when exploring UNM data, scholarship, and student success tools.",
      ],
      linkGroups: [
        {
          layout: "list",
          links: [
            {
              title: "UNM Digital Repository",
              href: "https://digitalrepository.unm.edu/",
            },
            {
              title: "LoboAchieve",
              href: "https://loboachieve.unm.edu/",
            },
          ],
        },
      ],
    },
  ],
};

export const OPEN_DATA_CITY_OF_ALBUQUERQUE_PAGE: StaticResourcePage = {
  path: Pages.Data.children.Open_Data.children.city_of_albuquerque.url,
  title: "City of Albuquerque",
  eyebrow: "Open Data",
  lead: "The City of Albuquerque publishes a broad set of municipal datasets and metadata documents through its public open data portal.",
  backLink: {
    href: Pages.Data.children.Open_Data.url,
    label: "Back to Open Data",
  },
  sections: [
    {
      paragraphs: [
        "The city portal includes operational, public safety, transit, community, environmental, and government datasets. The links below mirror the live BBER page's external resource directory and provide direct access to both datasets and supporting metadata when available.",
      ],
      linkGroups: [
        {
          title: "Portal Entry Point",
          layout: "list",
          links: [
            {
              title: "City of Albuquerque Open Data Portal",
              href: "https://www.cabq.gov/abq-data/",
            },
          ],
        },
        {
          title: "Published Datasets",
          layout: "compact",
          columns: 2,
          links: cityOfAlbuquerqueLinks,
        },
      ],
    },
  ],
};

export const OPEN_DATA_SUNSHINE_PORTAL_PAGE: StaticResourcePage = {
  path: Pages.Data.children.Open_Data.children.sunshine_portal.url,
  title: "Sunshine Portal",
  eyebrow: "Open Data",
  lead: "The New Mexico Sunshine Portal supports public transparency by publishing financial and administrative information from state agencies.",
  backLink: {
    href: Pages.Data.children.Open_Data.url,
    label: "Back to Open Data",
  },
  sections: [
    {
      paragraphs: [
        "According to the Sunshine Portal, the goal of the site is to improve transparency in state government.",
        "Data are available from agencies and systems such as SHARE, the State Land Office, the Department of Finance and Administration, and the State Investment Council. SHARE is New Mexico's statewide financial and human resources system, which records financial transactions and personnel activity for most state agencies.",
      ],
      linkGroups: [
        {
          layout: "list",
          links: [
            {
              title: "New Mexico Sunshine Portal",
              href: "https://sunshineportalnm.com/",
            },
            {
              title: "Sunshine Portal Home",
              href: "https://www.sunshineportalnm.com/",
            },
          ],
        },
      ],
    },
  ],
};

export const OPEN_DATA_FEDERAL_PAGE: StaticResourcePage = {
  path: Pages.Data.children.Open_Data.children.federal.url,
  title: "Data.gov",
  eyebrow: "Open Data",
  lead: "Data.gov is the federal government's central portal for open datasets, APIs, developer tools, and cross-agency data discovery.",
  backLink: {
    href: Pages.Data.children.Open_Data.url,
    label: "Back to Open Data",
  },
  sections: [
    {
      paragraphs: [
        "Data.gov brings together federal data resources in one searchable location with current documentation and links to topic-specific collections. The platform is especially useful for researchers, civic technologists, educators, and public-sector analysts who need broad discovery across agencies.",
        "It also links to many other open data providers, including state, local, and international sources.",
      ],
      linkGroups: [
        {
          title: "Browse Federal Data by Topic",
          layout: "compact",
          columns: 2,
          links: [
            {
              title: "Agriculture",
              href: "https://catalog.data.gov/dataset?q=agriculture",
            },
            {
              title: "Business",
              href: "https://catalog.data.gov/dataset?q=business",
            },
            {
              title: "Climate",
              href: "https://catalog.data.gov/dataset?q=climate",
            },
            {
              title: "Consumer",
              href: "https://catalog.data.gov/dataset?q=consumer",
            },
            {
              title: "Ecosystems",
              href: "https://catalog.data.gov/dataset?q=ecosystems",
            },
            {
              title: "Education",
              href: "https://catalog.data.gov/dataset?q=education",
            },
            {
              title: "Energy",
              href: "https://catalog.data.gov/dataset?q=energy",
            },
            {
              title: "Finance",
              href: "https://catalog.data.gov/dataset?q=finance",
            },
            {
              title: "Health",
              href: "https://catalog.data.gov/dataset?q=health",
            },
            {
              title: "Local Government",
              href: "https://catalog.data.gov/dataset?q=local+government",
            },
            {
              title: "Manufacturing",
              href: "https://catalog.data.gov/dataset?q=manufacturing",
            },
            {
              title: "Ocean",
              href: "https://catalog.data.gov/dataset?q=ocean",
            },
            {
              title: "Public Safety",
              href: "https://catalog.data.gov/dataset?q=public+safety",
            },
            {
              title: "Science and Research",
              href: "https://catalog.data.gov/dataset?q=science+research",
            },
          ],
        },
        {
          title: "Additional Federal Resource",
          layout: "list",
          links: [
            {
              title: "Data.gov Open Government Resources",
              href: "https://data.gov/open-gov/",
            },
          ],
        },
      ],
    },
  ],
};

export const NM_STATEWIDE_GROSS_RECEIPTS_PAGE: StaticResourcePage = {
  path: Pages.Data.children.NM_Statewide.children.gross_receipts.url,
  title: "Gross Receipts",
  eyebrow: "NM Statewide",
  lead: "This page provides reference information about New Mexico gross receipts data and directs users to the BBER Data Portal for current access.",
  backLink: {
    href: Pages.Data.children.NM_Statewide.url,
    label: "Back to NM Statewide",
  },
  callouts: [
    {
      title: "Looking for annual gross receipts data?",
      description:
        "Annual gross receipts data are available through the BBER Data Portal. Questions about subscription access or data use may be directed to BBER.",
      href: Pages.Data.children.Data_Portal.url,
      actionLabel: "Open Data Portal",
    },
    {
      title: "Need assistance?",
      description:
        "Contact BBER with questions about subscriptions, access, or gross receipts data resources.",
      href: Pages.About_BBER.children.Contact.url,
      actionLabel: "Contact BBER",
    },
  ],
  sections: [
    {
      note: "Source: New Mexico Taxation and Revenue Department. All releases may be subject to future revision.",
      paragraphs: [
        "The data portal provides access to current gross receipts resources used by BBER.",
      ],
      linkGroups: [
        {
          layout: "list",
          links: [
            {
              title: "Open Gross Receipts in the Data Portal",
              href: Pages.Data.children.Data_Portal.url,
            },
          ],
        },
      ],
    },
    {
      title: "Important Note About New Mexico Gross Receipts, 2004-2006",
      paragraphs: [
        'When a company registered with the New Mexico Taxation and Revenue Department (NMTRD), it could indicate more than one North American Industry Classification System (NAICS) code. The RP-80 gross receipts report, however, classified a company according to its "primary" NAICS code. A large number of reporting forms were assigned a NAICS code correctly, but the "primary" industry box was not checked. When the system did not find a primary code, the company was placed in the unclassified section of the RP-80 report.',
        'Those companies were later updated with the correct "primary" designation and moved from the unclassified section to the appropriate NAICS categories. NMTRD then reran the quarterly RP-80 reports from the first quarter of 2004 through the first quarter of 2006. These revised RP-80 releases provide more accurate information.',
        "A second important change also occurred at the beginning of fiscal year 2005, when the state adopted an accounting policy change allowed under the modified accrual basis of accounting. The revised RP-80 reports now reflect the three months of activity within each quarter, rather than the three months reported during that period. For example, the first quarter 2004 report now reflects January, February, and March 2004 activity, rather than returns submitted during January, February, and March that referred partly to prior-month activity.",
      ],
    },
  ],
};
