import { normalizePageUrl, Pages } from "pages";

export type SubscriberLinkItem = {
  title: string;
  href: string;
  description?: string;
};

export type SubscriberContentSection = {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: SubscriberLinkItem[];
  note?: string;
};

type SubscribersBasePage = {
  path: string;
  title: string;
  eyebrow?: string;
  lead?: string;
  sidebarPath?: string;
};

export type SubscribersArticlePage = SubscribersBasePage & {
  kind: "article";
  sections: SubscriberContentSection[];
};

export type SubscribersLandingPage = SubscribersBasePage & {
  kind: "landing";
  sections: SubscriberContentSection[];
  accessLinks: SubscriberLinkItem[];
};

export type SubscribersLoginPage = SubscribersBasePage & {
  kind: "login";
  usernameLabel: string;
  passwordLabel: string;
  submitLabel: string;
  supportTitle: string;
  supportParagraphs: string[];
  supportLinks: SubscriberLinkItem[];
  statusNote: string;
};

export type SubscribersPage =
  | SubscribersArticlePage
  | SubscribersLandingPage
  | SubscribersLoginPage;

const staticSubscribersPages = {
  subscribers: {
    path: Pages.Subscribers.url,
    title: "Subscribers",
    eyebrow: "Subscribers",
    sidebarPath: Pages.Subscribers.url,
    kind: "landing",
    lead: "BBER subscriber services support forecasting, dashboard access, and data resources for organizations that need deeper analysis and regularly updated New Mexico information.",
    sections: [
      {
        paragraphs: [
          "The Bureau of Business and Economic Research offers paid subscriber services, including FOR-UNM Economic Forecasting, FOR-UNM Snapshot, custom-designed Data Dashboards, and online database access beyond the data tools included on our main site.",
          "If you are interested in subscriber services for your organization, research program, or instructional work, please contact BBER to discuss current offerings and access options.",
        ],
        links: [
          {
            title: "NM Economic Forecasting",
            href: Pages.About_BBER.children.Services.children.forecasting.url,
            description: "Quarterly and annual forecasting services.",
          },
          {
            title: "Data Dashboards",
            href: Pages.About_BBER.children.Services.children.data_dashboards
              .url,
            description: "Custom dashboard design and deployment.",
          },
          {
            title: "Data Bank",
            href: Pages.About_BBER.children.Services.children.data_bank.url,
            description:
              "Expanded access to data resources and related support.",
          },
          {
            title: "Contact BBER",
            href: Pages.About_BBER.children.Contact.url,
            description:
              "Discuss subscriptions, forecasting access, or account questions.",
          },
        ],
      },
    ],
    accessLinks: [
      {
        title: "FOR-UNM Quarterly Forecasts Login",
        href: Pages.Subscribers.children.FOR_UNM_Login.url,
        description: "Subscriber sign-in page for authorized forecast users.",
      },
      {
        title: "Privacy Policy",
        href: Pages.Subscribers.children.Privacy_Policy.url,
        description:
          "Privacy practices covering BBER website and subscriber services.",
      },
    ],
  },
  forunm: {
    path: Pages.Subscribers.children.FOR_UNM_Login.url,
    title: "FOR UNM Login",
    eyebrow: "Subscribers",
    sidebarPath: Pages.Subscribers.url,
    kind: "login",
    lead: "Authorized subscribers use this page to access FOR-UNM forecasting materials and related subscriber resources.",
    usernameLabel: "Username",
    passwordLabel: "Password",
    submitLabel: "Login",
    supportTitle: "Subscriber Assistance",
    supportParagraphs: [
      "FOR-UNM access is reserved for authorized subscribers. Secure sign-in services are being connected within this site experience.",
      "If you need access, password assistance, or confirmation of your subscription status, please contact BBER directly and the team will help you reach the appropriate subscriber materials.",
    ],
    supportLinks: [
      {
        title: "Contact BBER",
        href: Pages.About_BBER.children.Contact.url,
        description: "General subscriber and account assistance.",
      },
      {
        title: "Privacy Policy",
        href: Pages.Subscribers.children.Privacy_Policy.url,
        description:
          "Read the privacy practices for website and subscriber use.",
      },
    ],
    statusNote:
      "Online sign-in is being prepared for the new site. Existing subscribers may contact BBER for immediate assistance.",
  },
  privacyPolicy: {
    path: Pages.Subscribers.children.Privacy_Policy.url,
    title: "Privacy Policy",
    eyebrow: "Subscribers",
    sidebarPath: Pages.Subscribers.url,
    kind: "article",
    lead: "This privacy policy explains how BBER handles website and subscriber-related information across its public web presence.",
    sections: [
      {
        note: "Updated July 27, 2016",
        paragraphs: [
          "This privacy policy discloses the privacy practices for bber.unm.edu and bberwebapp-env.us-west-2.elasticbeanstalk.com.",
          "This website has been created as a resource to provide demographic and economic data related to the State of New Mexico. To support that purpose, BBER may collect personal data such as IP address, registration information, internet service provider information, navigation data, or contact information.",
        ],
      },
      {
        title: "When you contact us",
        paragraphs: [
          "When you contact BBER through the contact page, you are asked to provide your first and last name, email address, and optionally a contact number so staff may follow up on your request. Information you provide is not stored, shared, or sold with third parties other than as needed to provide the service you requested.",
          "When contacting BBER, you may choose to be added to the email mailing list used to share information about New Mexico data products and related activities such as conferences. You may unsubscribe from this list at any time.",
        ],
      },
      {
        title: "Browsing data",
        paragraphs: [
          "When using the website, small packets of information may be collected and transmitted to Google for analytics purposes only. This information helps BBER staff understand which pages are most viewed and provides aggregated information about site use.",
          "Google Analytics is managed under Google's privacy policy. If you would like to limit the data shared with Google, consider using a private browsing window while signed out of Google services and closing that window after your session.",
          "BBER staff do not gain access to personal data through Google Analytics reporting.",
        ],
        links: [
          {
            title: "Google privacy policy",
            href: "https://www.google.com/policies/privacy/",
          },
        ],
      },
      {
        title: "Cookies",
        paragraphs: [
          "Cookies are small pieces of data stored on your computer to improve your experience on bber.unm.edu.",
          "When using BBER login services, such as the FOR-UNM subscriber login, cookies may be stored on your computer to help maintain your authenticated session and reduce repeated sign-ins.",
          "By using these services, you consent to having cookies stored on your computer in a limited quantity and only for the activities described in this policy.",
        ],
      },
      {
        title: "Social media policy",
        paragraphs: [
          "BBER staff maintain X and Facebook pages where articles and related content may be posted. By visiting those services, information may be collected by Facebook, X, and WordPress under the privacy policies of those providers.",
        ],
      },
      {
        title: "Offsite links",
        paragraphs: [
          "In fulfilling its mission, the website includes links that take users away from bber.unm.edu. While BBER aims to link only to high-quality resources believed to be useful, BBER is not responsible for the content or privacy practices of external sites.",
        ],
      },
      {
        title: "Updates",
        paragraphs: [
          "This privacy policy may change from time to time, and updates will be posted on this page.",
        ],
      },
    ],
  },
} satisfies Record<string, SubscribersPage>;

const allSubscribersPages = Object.values(staticSubscribersPages);

export function findSubscribersPage(pathname: string) {
  const normalizedPathname = normalizePageUrl(pathname);

  return (
    allSubscribersPages.find((page) => {
      return normalizePageUrl(page.path) === normalizedPathname;
    }) ?? null
  );
}
