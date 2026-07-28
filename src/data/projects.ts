export type Project = {
  name: string;
  href: string;
  tags: string[];
  summary: string;
  features: string[];
  note?: string;
};

export type ProjectCategory = {
  title: string;
  projects: Project[];
};

export const projectIntro =
  "A showcase of my work in data science, energy modeling, and software development. Each project reflects my passion for solving complex problems at the intersection of data, technology, and sustainability.";

export const focusAreas = [
  "Energy Systems Modeling",
  "Machine Learning",
  "Data Engineering",
  "Statistical Analysis",
  "Market Simulation",
];

export const projectCategories: ProjectCategory[] = [
  {
    title: "Energy Systems & Modeling",
    projects: [
      {
        name: "Atlas",
        href: "https://github.com/rte-france/ATLAS",
        tags: ["Python", "Agent-Based Simulation", "Electricity Markets", "Optimisation", "OR-Tools"],
        summary:
          "Open-source agent-based simulator of electricity markets, modelling the sequential decisions of market participants from order formulation to market clearing and portfolio optimisation.",
        features: [
          "**Day-Ahead**: order generation, clearing across interconnected areas under ATC or flow-based constraints, portfolio optimisation over thermal, hydro, storage, wind, solar and load",
          "**Intraday**: scenario-based price forecasting, re-optimisation at the execution date, and translation of the revised programme into buy/sell orders against the day-ahead position",
          "**Reserves**: FCR, aFRR, mFRR and RR procurement and activation, arbitrating energy sales against capacity held for frequency regulation",
          "Modules chained into YAML workflows, run from the CLI or the Python API",
        ],
        note: "Project made for **RTE**, developed by **Artelys**.",
      },
      {
        name: "AntaresInvest",
        href: "https://github.com/lucarammel/antaresinvest",
        tags: ["R", "Electricity Systems", "Market Design", "Investment Modeling"],
        summary:
          "Dynamic investment simulation tool for the Antares Simulator ecosystem, providing market participant perspective analysis.",
        features: [
          "Investment decision modeling for electricity markets",
          "Integration with Antares Simulator for European power system analysis",
          "Strategic behavior simulation for capacity markets",
          "Long-term market scenario planning capabilities",
        ],
        note: "Project made for **RTE**.",
      },
      {
        name: "LoadModel",
        href: "https://github.com/lucarammel/loadmodel",
        tags: ["Python", "Deep Learning", "Energy Consumption", "Neural Networks"],
        summary:
          "Advanced power demand disaggregation tool using deep learning methods to analyze electricity consumption patterns.",
        features: [
          "Multi-layer perceptron (MLP) models for demand forecasting",
          "Disaggregation of national electricity demand by end-use sector",
          "Cross-country analysis capabilities",
          "Contributed to IEA World Energy Outlook 2021",
        ],
        note: "Project made for **IEA**.",
      },
    ],
  },
  {
    title: "Data Engineering & Tools",
    projects: [
      {
        name: "mysql2pg",
        href: "https://github.com/lucarammel/MySQL2Postgre",
        tags: ["Python", "Database Migration", "PostgreSQL", "MySQL"],
        summary:
          "Robust database migration tool for seamlessly transferring data from MySQL to PostgreSQL.",
        features: [
          "Automated schema conversion",
          "Data integrity preservation",
          "Batch processing for large datasets",
          "Error handling and rollback capabilities",
        ],
      },
    ],
  },
  {
    title: "Fun Projects",
    projects: [
      {
        name: "Dating Market",
        href: "https://github.com/lucarammel/DatingMarket",
        tags: ["Python", "Simulation", "Market Analysis"],
        summary: "A playful simulation of dating app dynamics using market analysis principles.",
        features: [
          "Agent-based modeling of dating behavior",
          "Market dynamics simulation",
          "Statistical analysis of matching patterns",
          "Data visualization of relationship trends",
        ],
      },
    ],
  },
];
