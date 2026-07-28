export type Entry = {
  organisation: string;
  location: string;
  title: string;
  period: string;
  bullets: string[];
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export const education: Entry[] = [
  {
    organisation: "École des Mines de Paris (Mines ParisTech)",
    location: "Paris, 5th arrondissement",
    title: "Civil Engineer",
    period: "Sept. 2020 – Mar. 2022",
    bullets: ["Specialization in **Geostatistics and Applied Probabilities**."],
  },
  {
    organisation: "École supérieure de physique et chimie industrielles de Paris (ESPCI Paris)",
    location: "Paris, 5th arrondissement",
    title: "Engineering – Physics Track",
    period: "Sept. 2017 – Sept. 2020",
    bullets: [
      "Multidisciplinary scientific foundation: mathematics, physics, chemistry, and biology.",
      "Major in **Biophysics**.",
    ],
  },
  {
    organisation: "Lycée Hoche",
    location: "Versailles",
    title: "Preparatory Classes for Engineering Schools – Physics & Chemistry Track",
    period: "Sept. 2015 – Aug. 2017",
    bullets: [
      "Multidisciplinary scientific training: mathematics, physics, and chemistry.",
      "Preparation for competitive engineering school entrance exams.",
    ],
  },
];

export const experience: Entry[] = [
  {
    organisation: "Artelys",
    location: "Paris",
    title: "Software Engineer – Data & Energy",
    period: "May 2023 – Present",
    bullets: [
      "Designed and developed **Atlas**, a modular power market simulator (day-ahead, intraday, reserves) for **RTE**; built the optimization core with **or-tools**, a typed data pipeline (**Pydantic**, **Polars**), and a workflow orchestration engine with rollback-safe module chaining.",
      "Designed and deployed microservices and production applications using **Docker**, **CI/CD pipelines** (GitHub Actions, GitLab CI), **FastAPI**, and **AWS S3** / **PostgreSQL** for data storage.",
      "Implemented **workflow orchestration** through API-driven coordination and **Slurm** job scheduling on HPC clusters; integrated **RabbitMQ** for asynchronous task handling.",
      "Developed and maintained operational solutions (dashboards, APIs, web applications) exposing data science models to end users, using **Python**, **R**, and **Plotly**.",
      "Applied statistical and ML techniques in the energy sector: **time series forecasting**, **clustering**, and **climate-adjusted modeling** for energy demand and production.",
      "Delivered hands-on **Python** and **R** training sessions, from programming fundamentals to deploying production dashboards for electricity consumption and production data.",
    ],
  },
  {
    organisation: "Réseau Transport d'Électricité (RTE)",
    location: "Paris, La Défense",
    title: "Software Engineer – Data & Energy",
    period: "Mar. 2022 – Mar. 2023",
    bullets: [
      "Developed a modular simulator **AntaresInvest** in **R** to model investment strategies, integrated as an extension of the **Antares Simulator** for European power system analysis.",
      "Developed and maintained a **Python**-based heuristic model to simulate network investments and battery operation under future grid conditions.",
      "Performed prospective techno-economic studies assessing the value of **stationary storage (batteries)** for congestion management in the 2050 power grid.",
      "Modeled **investment decisions** and strategic behaviors of market participants in electricity and **capacity markets**, contributing to long-term scenario planning.",
    ],
  },
  {
    organisation: "International Energy Agency (IEA)",
    location: "Paris, 15th arrondissement",
    title: "Intern – Software – Data & Energy",
    period: "Mar. 2021 – Sept. 2021",
    bullets: [
      "Built a **Python** model using **deep learning (MLPs)** to disaggregate national electricity demand by end-use sector across multiple countries.",
      "Conducted quantitative energy economics analysis and contributed to the **World Energy Outlook 2021**, particularly within the demand-side modeling chapter.",
    ],
  },
];

export const skills: SkillGroup[] = [
  {
    title: "Programming",
    items: [
      "**Python, R** (expert level, package development, modeling, data science, visualization, optimization, deep learning, APIs)",
      "**SQL**",
    ],
  },
  {
    title: "Software & Tools",
    items: [
      "**Docker** (containerization and microservices development)",
      "**PostgreSQL** (database)",
      "**Slurm** (HPC workload manager)",
      "**RabbitMQ** (message broker)",
    ],
  },
  {
    title: "Languages",
    items: ["**English** (fluent)", "**Spanish** (fluent)", "**French** (native)"],
  },
];
