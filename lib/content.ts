// Everything on the site comes from this file. Edit here, not in components.

export const site = {
  name: "Deepshika Thakur",
  surname: "Thakur",
  given: "Deepshika",
  role: "AI/ML Engineer",
  location: "Denton, Texas",
  timezone: "America/Chicago",
  email: "deepshikathakur01@gmail.com",
  github: "https://github.com/deepshika111",
  linkedin: "", // paste your LinkedIn URL here and it will appear in Contact
  resume: "", // e.g. "/resume.pdf" after dropping the file in /public
  url: "https://deepshika-portfolio.vercel.app", // set to your real domain
  tagline:
    "I build systems that help language models find the right page, and then act on it.",
  description:
    "Deepshika Thakur is an AI/ML engineer building LLM applications, RAG pipelines and agent workflows in Python, from experiment to deployed API.",
};

export const about = {
  lede:
    "In 2022 I was tuning gradient-boosted models and building training sets with PySpark. Today I build the systems around large language models: the retrieval that feeds them, the agents that let them use real tools, and the APIs that keep them answering at scale.",
  body: [
    "At Datadog I design multi-step agent workflows in LangGraph and CrewAI, connect them to enterprise tools through MCP, and serve them through FastAPI on Azure. Before that, at Hexaware, I built classical ML and NLP pipelines end to end and set up MLflow for experiment tracking and model versioning.",
    "I'm comfortable taking a model from experiment tracking in MLflow to a deployed API on AWS. I hold an M.S. in Computer Science from the University of North Texas.",
  ],
};

export type Plate = "agents" | "rag" | "multimodal" | "fraud" | "pipeline";

export type Work = {
  id: string;
  org: string;
  dates: string;
  title: string;
  context: string;
  summary: string;
  built: string[];
  results: { value: string; label: string }[];
  stack: string[];
  plate: Plate;
  link?: { href: string; label: string };
};

export const work: Work[] = [
  {
    id: "agents",
    org: "Datadog",
    dates: "Dec 2025 – Present",
    title: "Agents that take over the routine work",
    context: "Datadog, 2025 to present",
    summary:
      "Multi-step agent workflows in LangGraph and CrewAI that handle retrieval and routine tasks, wired into enterprise tools and APIs through MCP.",
    built: [
      "Designed multi-step workflows in LangGraph and CrewAI for retrieval and routine tasks.",
      "Connected agents to enterprise tools and REST services through MCP instead of writing glue code for each new tool.",
      "Built the GenAI applications around them in Python with LangChain, Semantic Kernel and FastAPI.",
      "Deployed to Azure with Docker and Kubernetes so development and production match.",
    ],
    results: [
      { value: "~20%", label: "of manual steps removed from the processes the agents replaced" },
      { value: "~15%", label: "less integration effort for each new tool, thanks to MCP" },
    ],
    stack: ["LangGraph", "CrewAI", "MCP", "Semantic Kernel", "LangChain", "FastAPI", "Azure", "Kubernetes"],
    plate: "agents",
  },
  {
    id: "rag",
    org: "Datadog",
    dates: "Dec 2025 – Present",
    title: "Retrieval that finds the right context",
    context: "Datadog, 2025 to present",
    summary:
      "RAG pipelines with custom chunking, Hugging Face embeddings, pgvector and Pinecone, served through FastAPI against PostgreSQL.",
    built: [
      "Built custom chunking and embedding pipelines with Hugging Face models, pgvector and Pinecone.",
      "Tuned chunking and retrieval until the model saw the right passages more often.",
      "Ran the FastAPI services that serve these LLM apps against PostgreSQL and vector stores.",
      "Moved prompts to structured outputs and function calling for faster, more consistent answers.",
    ],
    results: [
      { value: "+15%", label: "relevant-context hits after tuning chunking and retrieval" },
      { value: "8K+", label: "requests a month through the FastAPI services" },
      { value: "−12%", label: "average inference latency with structured outputs" },
    ],
    stack: ["Hugging Face", "pgvector", "Pinecone", "PostgreSQL", "FastAPI", "Pydantic"],
    plate: "rag",
  },
  {
    id: "multimodal",
    org: "Academic project",
    dates: "University of North Texas",
    title: "Multimodal AI Research Assistant",
    context: "Academic project, University of North Texas",
    summary:
      "One place to search and summarize text, images and audio across mixed-format academic datasets.",
    built: [
      "Indexed mixed-format material with LlamaIndex and stored vectors in Qdrant.",
      "Used CLIP to make images searchable and Whisper to turn audio into searchable text.",
      "Wrapped search and summarization in a Streamlit interface.",
    ],
    results: [],
    stack: ["LlamaIndex", "Qdrant", "CLIP", "Whisper", "Streamlit"],
    plate: "multimodal",
  },
  {
    id: "fraud",
    org: "Academic project",
    dates: "University of North Texas",
    title: "Real-Time Fraud Detection",
    context: "Academic project, University of North Texas",
    summary:
      "A streaming pipeline that scores transactions as they arrive, with engineered features and data-quality checks on the way in.",
    built: [
      "Streamed transactions through Apache Flink.",
      "Engineered transaction features and served them with Feast.",
      "Trained a LightGBM classifier and validated incoming data with Great Expectations.",
    ],
    results: [
      { value: "94%+", label: "validation accuracy on a simulated financial dataset" },
    ],
    stack: ["LightGBM", "Apache Flink", "Feast", "Great Expectations"],
    plate: "fraud",
  },
  {
    id: "pipelines",
    org: "Hexaware",
    dates: "Apr 2022 – Jul 2024",
    title: "ML pipelines, end to end",
    context: "Hexaware, 2022 to 2024",
    summary:
      "Pipelines covering data prep, feature engineering, training and validation, tracked in MLflow and served over FastAPI and AWS.",
    built: [
      "Built pipelines in Python and SQL from data prep through validation.",
      "Tuned scikit-learn and XGBoost models with feature selection and hyperparameter search.",
      "Developed Hugging Face text classifiers for a monthly stream of records.",
      "Set up MLflow tracking and versioning, replacing a manual process.",
      "Served models through FastAPI and deployed selected ones with S3 and SageMaker.",
    ],
    results: [
      { value: "10–12%", label: "higher F1 on classification and regression models" },
      { value: "50K+", label: "records classified each month" },
      { value: "~25%", label: "less team time spent managing models" },
      { value: "−20%", label: "recurring preprocessing time with PySpark and SQL" },
    ],
    stack: ["scikit-learn", "XGBoost", "Hugging Face", "PySpark", "MLflow", "FastAPI", "AWS SageMaker"],
    plate: "pipeline",
  },
];

export type Entry = {
  id: string;
  from: string;
  to: string;
  org: string;
  place: string;
  role: string;
  lines: string[];
  workIds: string[];
};

export const record: Entry[] = [
  {
    id: "datadog",
    from: "DEC 2025",
    to: "Present",
    org: "Datadog",
    place: "USA",
    role: "AI/ML Engineer",
    lines: [
      "Build GenAI applications that connect LLMs to internal tools and REST services.",
      "Design LangGraph and CrewAI agent workflows and connect them to tools through MCP.",
      "Build and tune RAG pipelines; run the FastAPI services behind them.",
      "Use scikit-learn and PyTorch for classification and similarity models, improving selected models by about 10%.",
    ],
    workIds: ["agents", "rag"],
  },
  {
    id: "unt",
    from: "AUG 2024",
    to: "May 2026",
    org: "University of North Texas",
    place: "Denton, Texas",
    role: "M.S. Computer Science",
    lines: [
      "Master of Science in Computer Science, completed May 2026.",
      "Academic projects in multimodal retrieval and real-time fraud detection.",
    ],
    workIds: ["multimodal", "fraud"],
  },
  {
    id: "hexaware",
    from: "APR 2022",
    to: "Jul 2024",
    org: "Hexaware",
    place: "India",
    role: "ML Engineer",
    lines: [
      "Built end-to-end ML pipelines in Python and SQL.",
      "Developed Hugging Face text classifiers handling 50K+ records a month.",
      "Set up MLflow for experiment tracking and model versioning.",
      "Deployed selected models on AWS with S3 and SageMaker.",
    ],
    workIds: ["pipelines"],
  },
];

// Skills. `see` points at work ids or record ids where the skill was used.
export type Subject = { term: string; heading: string; see: string[] };

const s = (heading: string, items: [string, string[]][]): Subject[] =>
  items.map(([term, see]) => ({ term, heading, see }));

export const subjects: Subject[] = [
  ...s("Generative AI", [
    ["LLMs", ["datadog", "agents", "rag"]],
    ["RAG", ["rag"]],
    ["AI agents", ["agents"]],
    ["Prompt engineering", ["rag"]],
    ["Embeddings", ["rag", "multimodal"]],
    ["Semantic and vector search", ["rag", "multimodal"]],
    ["Tool and function calling", ["rag", "agents"]],
  ]),
  ...s("Agent frameworks", [
    ["LangChain", ["agents"]],
    ["LangGraph", ["agents"]],
    ["Semantic Kernel", ["agents"]],
    ["CrewAI", ["agents"]],
    ["OpenAI Agents SDK", []],
    ["MCP", ["agents"]],
    ["LlamaIndex", ["multimodal"]],
  ]),
  ...s("Machine learning and NLP", [
    ["Python", ["datadog", "hexaware"]],
    ["PyTorch", ["datadog"]],
    ["scikit-learn", ["datadog", "pipelines"]],
    ["XGBoost", ["pipelines"]],
    ["LightGBM", ["fraud"]],
    ["Hugging Face Transformers", ["rag", "pipelines"]],
    ["CLIP", ["multimodal"]],
    ["Whisper", ["multimodal"]],
  ]),
  ...s("Backend and serving", [
    ["FastAPI", ["agents", "rag", "pipelines"]],
    ["REST APIs", ["agents"]],
    ["Pydantic", []],
    ["Streamlit", ["multimodal"]],
  ]),
  ...s("Data and vector stores", [
    ["PostgreSQL", ["rag"]],
    ["pgvector", ["rag"]],
    ["Pinecone", ["rag"]],
    ["Qdrant", ["multimodal"]],
    ["SQL", ["pipelines"]],
    ["Pandas", []],
    ["NumPy", []],
    ["PySpark", ["pipelines"]],
    ["Apache Flink", ["fraud"]],
    ["Feast", ["fraud"]],
  ]),
  ...s("MLOps and cloud", [
    ["MLflow", ["pipelines"]],
    ["Great Expectations", ["fraud"]],
    ["Docker", ["agents"]],
    ["Kubernetes", ["agents"]],
    ["Azure", ["agents"]],
    ["AWS S3 and SageMaker", ["pipelines"]],
    ["Git", []],
    ["Linux", []],
  ]),
];

// Resolve a `see` id to a readable label and, for work, an openable case study.
export function lookup(id: string): { label: string; workId?: string } {
  const w = work.find((x) => x.id === id);
  if (w) return { label: `${w.title} (${w.context.split(",")[0]})`, workId: w.id };
  const r = record.find((x) => x.id === id);
  if (r) return { label: `${r.org}, ${r.role}` };
  return { label: id };
}
