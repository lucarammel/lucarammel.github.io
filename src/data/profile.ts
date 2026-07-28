export type Social = {
  label: string;
  href: string;
  icon: "mail" | "linkedin" | "github" | "malt";
};

export type Tool = {
  name: string;
  href: string;
  logo: string;
};

const devicon = (path: string) =>
  `https://raw.githubusercontent.com/devicons/devicon/master/icons/${path}`;

export const profile = {
  name: "Lucas Pereira",
  role: "Software Engineer & Data Scientist",
  location: "Paris",
  photo: "/lucas.png",
  tagline:
    "Energy systems modelling, analytics and decision-support tools — from forecasting and simulation to deployment and automation.",
  highlights: [
    "**Software Engineer & Data Scientist** with a strong background in **modeling**, **analytics**, and **decision-support tools** for the energy sector",
    "Experienced in designing **end-to-end data solutions**, from forecasting and simulation to deployment and automation",
    "Proven track record in translating complex systems into actionable insights for **market design** and **energy planning**",
    "Motivated by impactful challenges at the intersection of data, systems, and sustainability, especially in **ClimateTech**",
    "I have a strong interest for software development and discovering new tools, always curious about new technologies coming out!",
  ],
  currentRole: {
    company: "Artelys",
    href: "https://www.artelys.com/",
    previously: [
      { name: "RTE", href: "https://www.rte-france.com/" },
      { name: "IEA", href: "https://www.iea.org/" },
    ],
  },
} as const;

export const tools: Tool[] = [
  { name: "Python", href: "https://www.python.org", logo: devicon("python/python-original.svg") },
  { name: "R", href: "https://www.r-project.org/", logo: devicon("r/r-original.svg") },
  { name: "FastAPI", href: "https://fastapi.tiangolo.com/", logo: devicon("fastapi/fastapi-original.svg") },
  { name: "Docker", href: "https://www.docker.com/", logo: devicon("docker/docker-original.svg") },
  { name: "PostgreSQL", href: "https://www.postgresql.org/", logo: devicon("postgresql/postgresql-original.svg") },
  { name: "AWS", href: "https://aws.amazon.com/", logo: devicon("amazonwebservices/amazonwebservices-original-wordmark.svg") },
  { name: "GitHub Actions", href: "https://github.com/features/actions", logo: devicon("github/github-original.svg") },
  { name: "Plotly", href: "https://plotly.com/", logo: devicon("plotly/plotly-original.svg") },
  { name: "RabbitMQ", href: "https://www.rabbitmq.com/", logo: devicon("rabbitmq/rabbitmq-original.svg") },
  {
    name: "Polars",
    href: "https://pola.rs/",
    logo: "https://raw.githubusercontent.com/pola-rs/polars-static/master/logos/polars-logo-dimmed.svg",
  },
  { name: "MongoDB", href: "https://www.mongodb.com/", logo: devicon("mongodb/mongodb-original.svg") },
];

export const socials: Social[] = [
  { label: "Email", href: "mailto:lucaspereira0497@gmail.com", icon: "mail" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lucasmagustopereira/", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/lucarammel", icon: "github" },
  { label: "Malt", href: "https://www.malt.fr/profile/lucaspereira3", icon: "malt" },
];
