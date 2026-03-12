import { Pages } from "pages";

export type UtilityLink = {
  title: string;
  url: string;
};

export type HomepageStaticContent = {
  brand: {
    siteTitle: string;
    tagline: string;
    logo: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  utilityLinks: UtilityLink[];
  hero: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  sections: {
    news: {
      title: string;
      viewAllUrl: string;
      accentImage: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
      emptyMessage: string;
      errorMessage: string;
    };
    publications: {
      title: string;
      viewAllUrl: string;
      accentImage: {
        src: string;
        alt: string;
        width: number;
        height: number;
      };
      emptyMessage: string;
      errorMessage: string;
    };
  };
  promotions: Array<{
    title: string;
    url: string;
    image: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  }>;
  about: {
    title: string;
    description: string;
    rows: Array<{
      title: string;
      description: string;
      url: string;
    }>;
  };
  footer: {
    organization: string;
    address: string;
    socialLinks: Array<{
      title: string;
      url: string;
    }>;
  };
};

export const homepageStaticContent: HomepageStaticContent = {
  brand: {
    siteTitle: "UNM BBER",
    tagline: "Bureau of Business and Economic Research",
    logo: {
      src: "/bber/bber-logo-horizontal.svg",
      alt: "UNM Bureau of Business and Economic Research",
      width: 460,
      height: 88,
    },
  },
  utilityLinks: [
    { title: "UNM Home", url: "https://www.unm.edu" },
    {
      title: "UNM Policy",
      url: "https://policy.unm.edu/university-policies/2000/2570.html",
    },
    {
      title: "UNM Contact",
      url: "https://www.unm.edu/contactunm.html",
    },
  ],
  hero: {
    src: "/bber/home-hero-expert.jpg",
    alt: "BBER experts collaborating around research materials",
    width: 1525,
    height: 601,
  },
  sections: {
    news: {
      title: "News Releases",
      viewAllUrl: Pages.News.url,
      accentImage: {
        src: "/bber/news-section-header.jpg",
        alt: "News releases section art",
        width: 460,
        height: 230,
      },
      emptyMessage: "No recent news releases are available right now.",
      errorMessage:
        "News releases are temporarily unavailable. Please check again soon.",
    },
    publications: {
      title: "Our Publications",
      viewAllUrl: Pages.Research.children.Publications.url,
      accentImage: {
        src: "/bber/publications-section-header.jpg",
        alt: "Publications section art",
        width: 460,
        height: 230,
      },
      emptyMessage: "No recent publications are available right now.",
      errorMessage:
        "Publications are temporarily unavailable. Please check again soon.",
    },
  },
  promotions: [
    {
      title: "Next Data Users Conference",
      url: Pages.Data.children.NM_Data_Users_Conference.url,
      image: {
        src: "/bber/data-users-conference-banner.png",
        alt: "New Mexico Data Users Conference banner",
        width: 1536,
        height: 1024,
      },
    },
    {
      title: "Next Forecast Meeting",
      url: Pages.About_BBER.children.Services.children.forecasting.url,
      image: {
        src: "/bber/forecast-meeting-banner.jpg",
        alt: "Forecast meeting banner",
        width: 1536,
        height: 1024,
      },
    },
  ],
  about: {
    title: "About BBER",
    description:
      "The Bureau of Business and Economic Research is the recognized expert in socioeconomic data for the state of New Mexico. BBER has helped government agencies, business leaders, decision-makers and non-profit organizations identify, understand, and forecast trends as well as changing economic markets across the Land of Enchantment.",
    rows: [
      {
        title: "Research",
        description: "Authoritative, objective and non-partisan analysis.",
        url: Pages.Research.url,
      },
      {
        title: "Dashboards",
        description: "Visually communicate relevant real-time data.",
        url: Pages.Data.url,
      },
      {
        title: "FOR-UNM",
        description: "Economic forecasting for New Mexico and five MSAs.",
        url: Pages.About_BBER.children.Services.children.forecasting.url,
      },
      {
        title: "Data Bank",
        description: "Specialized data from state and national sources.",
        url: Pages.About_BBER.children.Services.children.data_bank.url,
      },
    ],
  },
  footer: {
    organization: "UNM Bureau of Business and Economic Research",
    address: "2701 Campus Blvd NE, Office #1007, Albuquerque, NM 87131-0001",
    socialLinks: [
      { title: "GitHub", url: "https://github.com/UNM-BBER" },
      { title: "LinkedIn", url: "https://www.linkedin.com/in/unmbber/" },
      { title: "X", url: "https://x.com/UNMBBER" },
      { title: "Facebook", url: "https://www.facebook.com/UNMBBER" },
      { title: "Instagram", url: "https://www.instagram.com/UNMBBER" },
      {
        title: "YouTube",
        url: "https://www.youtube.com/channel/UCxij5K50zix6PznCtS4pvng",
      },
    ],
  },
};
