import { Pages } from "pages";

export type ColoniasResourceLink = {
  title: string;
  href: string;
  description?: string;
};

export type ColoniasNarrativeSection = {
  title?: string;
  paragraphs: string[];
};

export type ColoniaMapLink = {
  title: string;
  href: string;
};

export type ColoniaCountyGroup = {
  county: string;
  maps: ColoniaMapLink[];
};

export const COLONIAS_OVERVIEW_PAGE = {
  path: Pages.Data.children.Colonias.url,
  title: "Colonias",
  eyebrow: "Data",
  lead: "BBER's colonia estimates, maps, and shapefiles support infrastructure planning, grant preparation, and applied research for New Mexico communities near the U.S.-Mexico border.",
  heroParagraphs: [
    "What is a colonia? The U.S. Department of Housing and Urban Development (HUD) defines colonias as rural communities in close proximity to the U.S.-Mexico border, lacking access to basic services such as water, sewer, or housing. Official socioeconomic data on these communities has typically been scarce, making it difficult for government agencies to secure federal funding that could improve colonia infrastructure.",
    "BBER developed an approach for approximating colonia geographies and tabulating data representative of those communities. Under contract with the New Mexico Mortgage Finance Authority, BBER produced 2010 Census tabulations and 2006-2010 American Community Survey 5-year estimates for areas that approximate the geographic extent of New Mexico colonias. The resulting estimates, maps, and shapefiles are published here for public use.",
  ],
  heroLinks: [
    {
      title: "HUD colonia definition",
      href: "https://portal.hud.gov/hudportal/HUD?src=/states/shared/working/groups/frmwrkcoln/commonquestions",
    },
    {
      title: "Colonia Maps",
      href: Pages.Data.children.Colonias.children.nm_colonia_maps.url,
    },
    {
      title:
        "Colonia Population and Socioeconomic Housing Characteristic Estimation",
      href: "https://api.bber.unm.edu/api/files/Colonia_Pop_Hsg_Est_aa1c823fbd.pdf",
    },
  ],
  downloadableResources: [
    {
      title: "Selected Colonia Data from 2010 Census, Summary File 1",
      href: "https://api.bber.unm.edu/api/files/Colonias_2010_Census_a4041c464b.xls",
      description:
        "Excel workbook with 2010 Census tabulations for candidate colonia blocks.",
    },
    {
      title:
        "Selected Colonia Data from American Community Survey (ACS) 5-Year Estimates, 2006-2010",
      href: "https://api.bber.unm.edu/api/files/Colonias_0610_ACS_d4210331c8.xls",
      description:
        "Excel workbook with ACS socioeconomic and housing estimates for approximated colonias.",
    },
    {
      title: "Colonia Maps",
      href: Pages.Data.children.Colonias.children.nm_colonia_maps.url,
      description:
        "County-grouped PDF maps for each mapped New Mexico colonia.",
    },
    {
      title: "GIS Shape Files",
      href: "https://api.bber.unm.edu/api/files/NM_Candidate_Colonia_Blocks_3983a83e52.zip",
      description:
        "ZIP archive of candidate colonia blocks used in BBER's geographic approximations.",
    },
  ],
  methodologySections: [
    {
      title: "Candidate Colonia Block Selection",
      paragraphs: [
        "The 2010 Census candidate colonia blocks were selected to approximate the geographic extent of each colonia. The selection process was conducted in ArcGIS by overlaying census block boundaries onto ortho-photography and zooming into colonia locations provided by an NMSU study.",
        "Block boundary data are from the Census Bureau's TIGER Program, while the ortho-photography are vintage 2011 images from the New Mexico Resource Geographic Information System (RGIS) Clearinghouse. The map directory presents the images used to select candidate colonia blocks, and the shapefile download contains the candidate colonia blocks for each colonia.",
      ],
    },
    {
      paragraphs: [
        "BBER tabulated population and socioeconomic and housing characteristic estimates for 118 U.S. Department of Housing and Urban Development designated colonias. Some colonias are incorporated or are designated by the U.S. Census Bureau as Census Designated Places, and BBER's approximation process may differ from the estimates and boundaries available directly from the Census Bureau for those places.",
      ],
    },
    {
      title: "Candidate Colonia Block Data Tabulation",
      paragraphs: [
        "Block population and housing data from the 2010 Census are aggregated for candidate colonia blocks that approximate the geographic colonia extent. Population measures include total population, number of households, population living in households, average household size, and households by age of householder.",
        "Housing measures include total housing unit counts, vacancy status, tenure, mortgage status for owner-occupied units, and vacancy by type.",
      ],
    },
    {
      title: "Colonia Block Group Tabulation",
      paragraphs: [
        "Block group socioeconomic and detailed housing estimates from the American Community Survey 2006-2010 5-Year Estimates are also provided. These are the smallest geographies for which these estimates are available, but they are geographically larger than blocks and may not fully reflect the approximated colonia.",
        "The ACS workbook includes a percentage showing how much of each block group's total population is represented by candidate colonia blocks. That percentage is calculated by dividing the sum of the candidate colonia block population in the block group by the total population of the block group from the 2010 Census.",
        "ACS estimates cover characteristics such as total population, median household income, ratio of income to poverty, poverty status of persons and households, tenure by occupants per room, units in structure, year built, heating fuel, plumbing, kitchen facilities, median gross rent, and median home value. Because ACS statistics are sample-based, they are subject to sampling variability, especially for small geographic areas.",
      ],
    },
  ] satisfies ColoniasNarrativeSection[],
  referenceLinks: [
    {
      title: "RGIS Clearinghouse",
      href: "https://rgis.unm.edu/",
      description:
        "Statewide geospatial reference source used in BBER's colonia block selection workflow.",
    },
  ],
} as const;

export const COLONIA_MAPS_PAGE = {
  path: Pages.Data.children.Colonias.children.nm_colonia_maps.url,
  title: "Colonia Maps",
  eyebrow: "Data",
  lead: "County-grouped PDF maps for 118 New Mexico colonias prepared by BBER for the New Mexico Mortgage Finance Authority.",
  backHref: Pages.Data.children.Colonias.url,
  backLabel: "Back to Colonias",
  introParagraphs: [
    "The Bureau of Business and Economic Research (BBER) at UNM created maps of 118 New Mexico colonias for the New Mexico Mortgage Finance Authority. A description of the method used to tabulate population and housing estimates, along with 2010 Census and American Community Survey 2006-2010 5-Year Estimates tabulations and the GIS shape file, are available on the Colonias page.",
    "Maps of each colonia are linked below and organized by county for easier browsing and download.",
  ],
  overviewLinks: [
    {
      title: "Colonias data and methodology",
      href: Pages.Data.children.Colonias.url,
    },
  ],
  counties: [
    {
      county: "Catron County",
      maps: [
        {
          title: "Alma",
          href: "https://api.bber.unm.edu/api/files/Alma_7d05b3b2b7.pdf",
        },
        {
          title: "Apache Creek",
          href: "https://api.bber.unm.edu/api/files/Apache_Creek_5eefd26514.pdf",
        },
        {
          title: "Aragon",
          href: "https://api.bber.unm.edu/api/files/Aragon_2019f0a4b3.pdf",
        },
        {
          title: "Beaverhead",
          href: "https://api.bber.unm.edu/api/files/Beaverhead_ae2a1af6d8.pdf",
        },
        {
          title: "Cruzville",
          href: "https://api.bber.unm.edu/api/files/Cruzville_dece85b43a.pdf",
        },
        {
          title: "Datil",
          href: "https://api.bber.unm.edu/api/files/Datil_cb1fa110b0.pdf",
        },
        {
          title: "Escudilla Bonita",
          href: "https://api.bber.unm.edu/api/files/Escudilla_Bonita_1a763972d5.pdf",
        },
        {
          title: "Glenwood",
          href: "https://api.bber.unm.edu/api/files/Glenwood_8b8a403c8b.pdf",
        },
        {
          title: "Homestead",
          href: "https://api.bber.unm.edu/api/files/Homestead_b34539628d.pdf",
        },
        {
          title: "Horse Springs",
          href: "https://api.bber.unm.edu/api/files/Horse_Springs_74bd993e03.pdf",
        },
        {
          title: "Lower Frisco",
          href: "https://api.bber.unm.edu/api/files/Lower_Frisco_7090991bab.pdf",
        },
        {
          title: "Luna",
          href: "https://api.bber.unm.edu/api/files/Luna_6190a01bc6.pdf",
        },
        {
          title: "Middle Frisco",
          href: "https://api.bber.unm.edu/api/files/Middle_Frisco_5e2c2a8942.pdf",
        },
        {
          title: "Mogollon",
          href: "https://api.bber.unm.edu/api/files/Mogollon_7c7de49e4b.pdf",
        },
        {
          title: "Pie Town",
          href: "https://api.bber.unm.edu/api/files/Pie_Town_a8554590b6.pdf",
        },
        {
          title: "Pleasanton",
          href: "https://api.bber.unm.edu/api/files/Pleasanton_19c4296329.pdf",
        },
        {
          title: "Quemado",
          href: "https://api.bber.unm.edu/api/files/Quemado_58c294aede.pdf",
        },
        {
          title: "Rancho Grande",
          href: "https://api.bber.unm.edu/api/files/Rancho_Grande_5bf7b1a229.pdf",
        },
        {
          title: "The Rivers",
          href: "https://api.bber.unm.edu/api/files/The_Rivers_5c2aaa7592.pdf",
        },
        {
          title: "Reserve",
          href: "https://api.bber.unm.edu/api/files/Reserve_0a6ed19e7b.pdf",
        },
        {
          title: "Willow Creek",
          href: "https://api.bber.unm.edu/api/files/Willow_Creek_fdf6d8050c.pdf",
        },
      ],
    },
    {
      county: "Chaves County",
      maps: [
        {
          title: "Lake Arthur",
          href: "https://api.bber.unm.edu/api/files/Lake_Arthur_a5213a72df.pdf",
        },
      ],
    },
    {
      county: "Dona Ana County",
      maps: [
        {
          title: "Anthony",
          href: "https://api.bber.unm.edu/api/files/Anthony_df6919e01c.pdf",
        },
        {
          title: "Berino",
          href: "https://api.bber.unm.edu/api/files/Berino_d470a20e48.pdf",
        },
        {
          title: "Brazito",
          href: "https://api.bber.unm.edu/api/files/Brazito_dc2bdc2cde.pdf",
        },
        {
          title: "Cattleland",
          href: "https://api.bber.unm.edu/api/files/Cattleland_89bea37462.pdf",
        },
        {
          title: "Chamberino",
          href: "https://api.bber.unm.edu/api/files/Chamberino_70c5998a86.pdf",
        },
        {
          title: "Chaparral (Pt.)",
          href: "https://api.bber.unm.edu/api/files/Chaparral_Dona_Ana_50dbaa1069.pdf",
        },
        {
          title: "Del Cerro",
          href: "https://api.bber.unm.edu/api/files/Del_Cerro_3e389f09f4.pdf",
        },
        {
          title: "Dona Ana",
          href: "https://api.bber.unm.edu/api/files/Dona_Ana_4c5f824c41.pdf",
        },
        {
          title: "El Milagro",
          href: "https://api.bber.unm.edu/api/files/El_Milagro_cfeb7da35e.pdf",
        },
        {
          title: "Fairacres",
          href: "https://api.bber.unm.edu/api/files/Fairacres_e09523e980.pdf",
        },
        {
          title: "Ft Selden",
          href: "https://api.bber.unm.edu/api/files/Ft_Selden_01da5205fd.pdf",
        },
        {
          title: "Garfield",
          href: "https://api.bber.unm.edu/api/files/Garfield_38cf70470e.pdf",
        },
        {
          title: "Hill",
          href: "https://api.bber.unm.edu/api/files/Hill_77830c7d6a.pdf",
        },
        {
          title: "Joy Drive Subd.",
          href: "https://api.bber.unm.edu/api/files/Joy_Drive_Subd_923180ca5d.pdf",
        },
        {
          title: "La Mesa",
          href: "https://api.bber.unm.edu/api/files/La_Mesa_dce251465f.pdf",
        },
        {
          title: "La Union",
          href: "https://api.bber.unm.edu/api/files/La_Union_31a1945758.pdf",
        },
        {
          title: "Las Palmeras",
          href: "https://api.bber.unm.edu/api/files/Las_Palmeras_41dfc6364f.pdf",
        },
        {
          title: "Leasburg",
          href: "https://api.bber.unm.edu/api/files/Leasburg_6dfbb45dc1.pdf",
        },
        {
          title: "Mesquite",
          href: "https://api.bber.unm.edu/api/files/Mesquite_219c446f86.pdf",
        },
        {
          title: "Montana Vista",
          href: "https://api.bber.unm.edu/api/files/Montana_Vista_fe31f81daa.pdf",
        },
        {
          title: "Moongate",
          href: "https://api.bber.unm.edu/api/files/Moongate_f781293287.pdf",
        },
        {
          title: "Mountain View",
          href: "https://api.bber.unm.edu/api/files/Mountain_View_31547ac3c3.pdf",
        },
        {
          title: "Old Picacho",
          href: "https://api.bber.unm.edu/api/files/Old_Picacho_a8e473cf13.pdf",
        },
        {
          title: "Organ",
          href: "https://api.bber.unm.edu/api/files/Organ_7eca02b96e.pdf",
        },
        {
          title: "Placitas",
          href: "https://api.bber.unm.edu/api/files/Placitas_28c7e40eb9.pdf",
        },
        {
          title: "Radium Springs",
          href: "https://api.bber.unm.edu/api/files/Radium_Springs_d271b1a296.pdf",
        },
        {
          title: "Rincon",
          href: "https://api.bber.unm.edu/api/files/Rincon_d1a96f788d.pdf",
        },
        {
          title: "Rodey",
          href: "https://api.bber.unm.edu/api/files/Rodey_18478e2a03.pdf",
        },
        {
          title: "Salem",
          href: "https://api.bber.unm.edu/api/files/Salem_bc319421d8.pdf",
        },
        {
          title: "San Isidro",
          href: "https://api.bber.unm.edu/api/files/San_Isidro_Rev3_7_12_022baf11a8.pdf",
        },
        {
          title: "San Miguel",
          href: "https://api.bber.unm.edu/api/files/San_Miguel_4510996387.pdf",
        },
        {
          title: "San Pablo",
          href: "https://api.bber.unm.edu/api/files/San_Pablo_26560e7a21.pdf",
        },
        {
          title: "Sunland Park",
          href: "https://api.bber.unm.edu/api/files/Sunland_Park_48cbd3dee9.pdf",
        },
        {
          title: "Tortugas",
          href: "https://api.bber.unm.edu/api/files/Tortugas_b95688393a.pdf",
        },
        {
          title: "Vado",
          href: "https://api.bber.unm.edu/api/files/Vado_8cdd67e94b.pdf",
        },
        {
          title: "Winterheaven",
          href: "https://api.bber.unm.edu/api/files/Winterheaven_f08105c246.pdf",
        },
      ],
    },
    {
      county: "Eddy County",
      maps: [
        {
          title: "Happy Valley",
          href: "https://api.bber.unm.edu/api/files/Happy_Valley_aefca48600.pdf",
        },
        {
          title: "Hope",
          href: "https://api.bber.unm.edu/api/files/Hope_628975af16.pdf",
        },
        {
          title: "Malaga",
          href: "https://api.bber.unm.edu/api/files/Malaga_e1a869a3e1.pdf",
        },
      ],
    },
    {
      county: "Grant County",
      maps: [
        {
          title: "Arenas Valley",
          href: "https://api.bber.unm.edu/api/files/Arenas_Valley_18348aa099.pdf",
        },
        {
          title: "Bayard",
          href: "https://api.bber.unm.edu/api/files/Bayard_0fc4249989.pdf",
        },
        {
          title: "Bear Mountain",
          href: "https://api.bber.unm.edu/api/files/Bear_Mountain_bd43861324.pdf",
        },
        {
          title: "Buckhorn",
          href: "https://api.bber.unm.edu/api/files/Buckhorn_d565df368c.pdf",
        },
        {
          title: "Carlisle",
          href: "https://api.bber.unm.edu/api/files/Carlisle_c1a96101c8.pdf",
        },
        {
          title: "Cliff",
          href: "https://api.bber.unm.edu/api/files/Cliff_0aa6d73053.pdf",
        },
        {
          title: "Cottage San",
          href: "https://api.bber.unm.edu/api/files/Cottage_San_222996d101.pdf",
        },
        {
          title: "Faywood",
          href: "https://api.bber.unm.edu/api/files/Faywood_771532a38d.pdf",
        },
        {
          title: "Gila",
          href: "https://api.bber.unm.edu/api/files/Gila_6fb36c59d4.pdf",
        },
        {
          title: "Gila Hot Springs",
          href: "https://api.bber.unm.edu/api/files/Gila_Hot_Springs_f999bb52f7.pdf",
        },
        {
          title: "Hachita",
          href: "https://api.bber.unm.edu/api/files/Hachita_482e7037ae.pdf",
        },
        {
          title: "Lake Roberts",
          href: "https://api.bber.unm.edu/api/files/Lake_Roberts_33e13fbf69.pdf",
        },
        {
          title: "Mimbres",
          href: "https://api.bber.unm.edu/api/files/Mimbres_06e0743220.pdf",
        },
        {
          title: "Mockingbird Hill",
          href: "https://api.bber.unm.edu/api/files/Mockingbird_Hill_a45d892443.pdf",
        },
        {
          title: "Mule Creek",
          href: "https://api.bber.unm.edu/api/files/Mule_Creek_c41e9af249.pdf",
        },
        {
          title: "Pinos Altos",
          href: "https://api.bber.unm.edu/api/files/Pinos_Altos_32cbb55c98.pdf",
        },
        {
          title: "Redrock",
          href: "https://api.bber.unm.edu/api/files/Redrock_ffc158b389.pdf",
        },
        {
          title: "Riverside",
          href: "https://api.bber.unm.edu/api/files/Riverside_383d1d1623.pdf",
        },
        {
          title: "Rosedale",
          href: "https://api.bber.unm.edu/api/files/Rosedale_22935a6e96.pdf",
        },
        {
          title: "San Juan",
          href: "https://api.bber.unm.edu/api/files/San_Juan_bb606f86fe.pdf",
        },
        {
          title: "San Lorenzo",
          href: "https://api.bber.unm.edu/api/files/San_Lorenzo_c44b9a0732.pdf",
        },
        {
          title: "Santa Clara",
          href: "https://api.bber.unm.edu/api/files/Santa_Clara_b1900e2fd4.pdf",
        },
        {
          title: "Separ",
          href: "https://api.bber.unm.edu/api/files/Separ_ec9dfa5aae.pdf",
        },
        {
          title: "Silver City (Map 1 of 2)",
          href: "https://api.bber.unm.edu/api/files/Silver_City1_48ce7f1d8f.pdf",
        },
        {
          title: "Silver City (Map 2 of 2)",
          href: "https://api.bber.unm.edu/api/files/Silver_City2_f5f4872493.pdf",
        },
        {
          title: "White Signal",
          href: "https://api.bber.unm.edu/api/files/White_Signal_b0bc2dbedf.pdf",
        },
        {
          title: "Whitewater",
          href: "https://api.bber.unm.edu/api/files/Whitewater_3fa4418e17.pdf",
        },
      ],
    },
    {
      county: "Hidalgo County",
      maps: [
        {
          title: "Cotton",
          href: "https://api.bber.unm.edu/api/files/Cotton_e109204bb5.pdf",
        },
        {
          title: "Del Sol",
          href: "https://api.bber.unm.edu/api/files/Del_Sol_dd4f3edd5c.pdf",
        },
        {
          title: "Glen Acres",
          href: "https://api.bber.unm.edu/api/files/Glen_Acres_759f37b4f9.pdf",
        },
        {
          title: "Lordsburg (Map 1 of 2)",
          href: "https://api.bber.unm.edu/api/files/Lordsburg1_f7028ae388.pdf",
        },
        {
          title: "Lordsburg (Map 2 of 2)",
          href: "https://api.bber.unm.edu/api/files/Lordsburg2_f78d541f2a.pdf",
        },
        {
          title: "Rodeo",
          href: "https://api.bber.unm.edu/api/files/Rodeo_4a29e3c8a3.pdf",
        },
        {
          title: "Virden",
          href: "https://api.bber.unm.edu/api/files/Virden_d96992b064.pdf",
        },
        {
          title: "Windmill",
          href: "https://api.bber.unm.edu/api/files/Windmill_99749cc476.pdf",
        },
      ],
    },
    {
      county: "Lincoln County",
      maps: [
        {
          title: "Nogal",
          href: "https://api.bber.unm.edu/api/files/Nogal_d8b73f5229.pdf",
        },
        {
          title: "Ruidoso Downs (Map 1 of 2)",
          href: "https://api.bber.unm.edu/api/files/Ruidoso_Downs1_e948c16fd7.pdf",
        },
        {
          title: "Ruidoso Downs (Map 2 of 2)",
          href: "https://api.bber.unm.edu/api/files/Ruidoso_Downs2_24720e2744.pdf",
        },
      ],
    },
    {
      county: "Luna County",
      maps: [
        {
          title: "Catfish Farms",
          href: "https://api.bber.unm.edu/api/files/Catfish_Farms_3fb38503d5.pdf",
        },
        {
          title: "Columbus (Map 1 of 2)",
          href: "https://api.bber.unm.edu/api/files/Columbus1_326a7feeb6.pdf",
        },
        {
          title: "Columbus (Map 2 of 2)",
          href: "https://api.bber.unm.edu/api/files/Columbus2_7bb18bc187.pdf",
        },
        {
          title: "Keeler Farm Rd.",
          href: "https://api.bber.unm.edu/api/files/Keeler_Farm_Road_e535e9f117.pdf",
        },
        {
          title: "Sunshine",
          href: "https://api.bber.unm.edu/api/files/Sunshine_6e290db0a4.pdf",
        },
      ],
    },
    {
      county: "Otero County",
      maps: [
        {
          title: "Bent",
          href: "https://api.bber.unm.edu/api/files/Bent_7638b4ccb4.pdf",
        },
        {
          title: "Boles Acres",
          href: "https://api.bber.unm.edu/api/files/Boles_Acres_cfae9cc800.pdf",
        },
        {
          title: "Chaparral (Pt.)",
          href: "https://api.bber.unm.edu/api/files/Chaparral_Otero_50d1d2d6b5.pdf",
        },
        {
          title: "Cloudcroft",
          href: "https://api.bber.unm.edu/api/files/Cloudcroft_4efbdd68dc.pdf",
        },
        {
          title: "Dog Canyon",
          href: "https://api.bber.unm.edu/api/files/Dog_Canyon_f98af34da7.pdf",
        },
        {
          title: "Dungan",
          href: "https://api.bber.unm.edu/api/files/Dungan_b6cb38611e.pdf",
        },
        {
          title: "High Rolls",
          href: "https://api.bber.unm.edu/api/files/High_Rolls_ce663cfd56.pdf",
        },
        {
          title: "La Luz",
          href: "https://api.bber.unm.edu/api/files/La_Luz_881bda983b.pdf",
        },
        {
          title: "Mayhill",
          href: "https://api.bber.unm.edu/api/files/Mayhill_71440a9e9a.pdf",
        },
        {
          title: "Mescalero",
          href: "https://api.bber.unm.edu/api/files/Mescalero_6028747831.pdf",
        },
        {
          title: "Orogrande",
          href: "https://api.bber.unm.edu/api/files/Orogrande_0b3e90d455.pdf",
        },
        {
          title: "Pinon",
          href: "https://api.bber.unm.edu/api/files/Pinon_1ed1b26763.pdf",
        },
        {
          title: "Sacramento",
          href: "https://api.bber.unm.edu/api/files/Sacramento_4d36a48cec.pdf",
        },
        {
          title: "Timberon",
          href: "https://api.bber.unm.edu/api/files/Timberon_b3dcc879c3.pdf",
        },
        {
          title: "Tularosa (Map 1 of 2)",
          href: "https://api.bber.unm.edu/api/files/Tularosa1_b150fa91a3.pdf",
        },
        {
          title: "Tularosa (Map 2 of 2)",
          href: "https://api.bber.unm.edu/api/files/Tularosa2_9119f866d0.pdf",
        },
        {
          title: "Twin Forks",
          href: "https://api.bber.unm.edu/api/files/Twin_Forks_d7c6a64430.pdf",
        },
        {
          title: "Weed",
          href: "https://api.bber.unm.edu/api/files/Weed_cec3a80dc3.pdf",
        },
      ],
    },
    {
      county: "Sierra County",
      maps: [
        {
          title: "Butte City",
          href: "https://api.bber.unm.edu/api/files/Butte_City_c863966b40.pdf",
        },
      ],
    },
    {
      county: "Socorro County",
      maps: [
        {
          title: "San Antonio",
          href: "https://api.bber.unm.edu/api/files/San_Antonio_405f73a5ef.pdf",
        },
      ],
    },
  ] satisfies ColoniaCountyGroup[],
} as const;
