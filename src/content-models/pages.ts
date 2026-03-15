export type PageNode = {
  title: string;
  url: string;
  children?: Record<string, PageNode>;
};

export const Pages = {
  Home: {
    title: "Home",
    url: "/",
    children: {},
  },
  Data: {
    title: "Data",
    url: "/data/",
    children: {
      NM_Data_Users_Conference: {
        title: "NM Data Users Conference",
        url: "/data/nm-duc/",
        children: {},
      },
      NM_Statewide: {
        title: "NM Statewide",
        url: "/data/nm-statewide/",
        children: {
          industry_profiles: {
            title: "Industry Profiles",
            url: "/data/nm-statewide/industry-profiles/",
            children: {},
          },
          gross_receipts: {
            title: "Gross Receipts",
            url: "/data/nm-statewide/gross-receipts/",
            children: {},
          },
          census_tables: {
            title: "Census Tables",
            url: "/data/nm-statewide/census-tables/",
            children: {},
          },
          geographic_reference_maps: {
            title: "Census Area Reference Maps",
            url: "/data/nm-statewide/geographic-reference-maps",
            children: {},
          },
          energy: {
            title: "Energy",
            url: "/data/nm-statewide/energy",
            children: {},
          },
        },
      },
      counties: {
        title: "Counties",
        url: "/data/counties/",
        children: {},
      },
      Places: {
        title: "Places",
        url: "/data/places/",
        children: {},
      },
      Tribal_Areas: {
        title: "Tribal Areas",
        url: "/data/tribal-areas/",
        children: {},
      },
      Colonias: {
        title: "Colonias",
        url: "/data/colonias/",
        children: {
          nm_colonia_maps: {
            title: "Colonia Maps",
            url: "/data/colonias/nm-colonia-maps/",
            children: {},
          },
        },
      },
      Open_Data: {
        title: "Open Data",
        url: "/data/open-data/",
        children: {
          unm: {
            title: "The University of New Mexico",
            url: "/data/open-data/unm/",
            children: {},
          },
          city_of_albuquerque: {
            title: "City of Albuquerque",
            url: "/data/open-data/city-of-albuquerque/",
            children: {},
          },
          sunshine_portal: {
            title: "Sunshine Portal",
            url: "/data/open-data/sunshine-portal/",
            children: {},
          },
          federal: {
            title: "Data.gov",
            url: "/data/open-data/federal/",
            children: {},
          },
        },
      },
      RGIS: {
        title: "RGIS",
        url: "/data/rgis/",
        children: {},
      },
      Data_Portal: {
        title: "Data Portal",
        url: "/data/bberdb/",
        children: {},
      },
      COVID_Indicators: {
        title: "NM Economic Indicators",
        url: "/data/econindicators/",
        children: {},
      },
      Location_Quotient: {
        title: "Location Quotient",
        url: "/data/location-quotient/",
        children: {},
      },
      CPI: {
        title: "Consumer Price Index",
        url: "/data/cpi",
      },
      API_Documentation: {
        title: "API Documentation",
        url: "/data/apidoc",
        children: {},
      },
    },
  },
  News: {
    title: "News",
    url: "/news/",
    children: {},
  },
  Research: {
    title: "Research",
    url: "/research/",
    children: {
      Publications: {
        title: "Publications",
        url: "/research/publications/",
        children: {},
      },
      Presentation: {
        title: "Presentation",
        url: "/research/presentations/",
        children: {},
      },
      Projects: {
        title: "Projects",
        url: "/research/projects/",
        children: {},
      },
    },
  },
  Subscribers: {
    title: "Subscribers",
    url: "/subscribers/",
    children: {
      FOR_UNM_Login: {
        title: "FOR UNM Login",
        url: "/subscribers/forunm/",
        children: {},
      },
      Privacy_Policy: {
        title: "Privacy Policy",
        url: "/subscribers/PrivacyPolicy/",
        children: {},
      },
    },
  },
  About_BBER: {
    title: "About",
    url: "/about/",
    children: {
      Services: {
        title: "Services",
        url: "/about/services/",
        children: {
          forecasting: {
            title: "NM Economic Forecasting",
            url: "/about/services/forecasting/",
            children: {},
          },
          data_bank: {
            title: "Data Bank",
            url: "/about/services/data-bank/",
            children: {},
          },
          data_dashboards: {
            title: "Data Dashboards",
            url: "/about/services/data-dashboards/",
            children: {},
          },
          research: {
            title: "Research",
            url: "/about/services/research",
            children: {},
          },
        },
      },
      Staff: {
        title: "Staff",
        url: "/about/staff/",
        children: {},
      },
      Directors: {
        title: "Directors",
        url: "/about/directors/",
        children: {},
      },
      History: {
        title: "History",
        url: "/about/history/",
        children: {},
      },
      Helpful_Links: {
        title: "Helpful Links",
        url: "/about/helpfulLinks/",
        children: {},
      },
      Contact: {
        title: "Contact",
        url: "/about/contact/",
        children: {},
      },
    },
  },
} satisfies Record<string, PageNode>;

export type PageRecord = typeof Pages;

export type PageTrailEntry = {
  key: string;
  node: PageNode;
};

export type ResolvedPage = {
  key: string;
  node: PageNode;
  trail: PageTrailEntry[];
};

export type NavigationBranchItem = {
  key: string;
  title: string;
  url: string;
  isOverview: boolean;
  branch: NavigationBranch | null;
};

export type NavigationBranch = {
  key: string;
  title: string;
  url: string;
  items: NavigationBranchItem[];
};

export type SectionSidebarItem = {
  title: string;
  url: string;
  isActive: boolean;
};

export type SectionSidebarModel = {
  currentPage: PageNode;
  parentPage: PageNode | null;
  goBackTarget: {
    title: string;
    url: string;
  };
  items: SectionSidebarItem[];
  mode: "children" | "siblings";
  sectionTitle: string;
};

export function normalizePageUrl(url: string) {
  if (url === "/") {
    return url;
  }

  return url.replace(/\/+$/, "");
}

export function getPageChildren(pageNode: PageNode) {
  return pageNode.children ?? {};
}

export function pageHasChildren(pageNode: PageNode) {
  return Object.keys(getPageChildren(pageNode)).length > 0;
}

function buildNavigationBranch(
  key: string,
  pageNode: PageNode,
): NavigationBranch {
  const childItems = Object.entries(getPageChildren(pageNode)).map(
    ([childKey, childNode]) => ({
      key: childNode.url,
      title: childNode.title,
      url: childNode.url,
      isOverview: false,
      branch: pageHasChildren(childNode)
        ? buildNavigationBranch(childKey, childNode)
        : null,
    }),
  );

  return {
    key,
    title: pageNode.title,
    url: pageNode.url,
    items: [
      {
        key: `${pageNode.url}__overview`,
        title: "Overview",
        url: pageNode.url,
        isOverview: true,
        branch: null,
      },
      ...childItems,
    ],
  };
}

export function getNavigationBranch(
  pageNode: PageNode,
  pageKey = pageNode.url,
) {
  return buildNavigationBranch(pageKey, pageNode);
}

export function getPrimaryNavigationBranches(
  pages: Record<string, PageNode> = Pages,
) {
  return Object.entries(pages).map(([key, node]) => ({
    key,
    node,
    branch: pageHasChildren(node) ? getNavigationBranch(node, key) : null,
  }));
}

export function flattenPages(
  pages: Record<string, PageNode>,
  trail: PageTrailEntry[] = [],
): ResolvedPage[] {
  return Object.entries(pages).flatMap(([key, node]) => {
    const nextTrail = [...trail, { key, node }];

    return [
      { key, node, trail: nextTrail },
      ...flattenPages(getPageChildren(node), nextTrail),
    ];
  });
}

export function findPageByUrl(
  pathname: string,
  pages: Record<string, PageNode> = Pages,
) {
  const normalizedPathname = normalizePageUrl(pathname);

  return (
    flattenPages(pages).find(({ node }) => {
      return normalizePageUrl(node.url) === normalizedPathname;
    }) ?? null
  );
}

export function getPageBreadcrumbs(pathname: string) {
  return findPageByUrl(pathname)?.trail ?? [];
}

export function findParentPage(
  pathname: string,
  pages: Record<string, PageNode> = Pages,
) {
  const resolvedPage = findPageByUrl(pathname, pages);

  if (!resolvedPage || resolvedPage.trail.length < 2) {
    return null;
  }

  return resolvedPage.trail[resolvedPage.trail.length - 2] ?? null;
}

export function getSiblingPages(
  pathname: string,
  pages: Record<string, PageNode> = Pages,
) {
  const parentPageEntry = findParentPage(pathname, pages);

  if (!parentPageEntry) {
    return [];
  }

  return Object.values(getPageChildren(parentPageEntry.node));
}

function pageUrlMatchesPathname(pageNode: PageNode, pathname: string) {
  return normalizePageUrl(pageNode.url) === normalizePageUrl(pathname);
}

export function getSectionSidebarModel(
  pathname: string,
  pages: Record<string, PageNode> = Pages,
): SectionSidebarModel | null {
  const resolvedPage = findPageByUrl(pathname, pages);

  if (!resolvedPage) {
    return null;
  }

  const currentPage = resolvedPage.node;
  const parentPageEntry = findParentPage(pathname, pages);
  const parentPage = parentPageEntry?.node ?? null;
  const currentPageHasChildren = pageHasChildren(currentPage);
  const sidebarSourcePage = currentPageHasChildren ? currentPage : parentPage;

  if (!sidebarSourcePage) {
    return null;
  }

  const items = Object.values(getPageChildren(sidebarSourcePage)).map(
    (node) => ({
      title: node.title,
      url: node.url,
      isActive: pageUrlMatchesPathname(node, pathname),
    }),
  );

  return {
    currentPage,
    parentPage,
    goBackTarget: parentPage
      ? {
          title: parentPage.title,
          url: parentPage.url,
        }
      : {
          title: Pages.Home.title,
          url: Pages.Home.url,
        },
    items,
    mode: currentPageHasChildren ? "children" : "siblings",
    sectionTitle: sidebarSourcePage.title,
  };
}

export function getStaticPageSlugs() {
  return flattenPages(Pages)
    .filter(({ node }) => normalizePageUrl(node.url) !== "/")
    .map(({ node }) => {
      return normalizePageUrl(node.url).split("/").filter(Boolean);
    });
}
