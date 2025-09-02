import { DataItem } from "@/types/api";

export const mockData: DataItem[] = [
  {
    id: "1",
    title: "New React 19 Features - Game Changing Updates",
    description: "Exploring the latest features in React 19 including Server Components, Actions, and improved Suspense handling. A comprehensive guide for developers.",
    source: "reddit",
    author: "reactdev_2024",
    created_at: "2024-01-15T10:30:00Z",
    url: "https://reddit.com/r/reactjs/example1",
    score: 245,
    tags: ["react", "frontend", "javascript", "webdev"],
    data_type: "post"
  },
  {
    id: "2",
    title: "awesome-backend-apis",
    description: "A curated list of awesome backend API resources, tools, and libraries for modern web development. Includes REST, GraphQL, and more.",
    source: "github",
    author: "apimaster",
    created_at: "2024-01-14T15:45:00Z",
    url: "https://github.com/apimaster/awesome-backend-apis",
    score: 892,
    tags: ["api", "backend", "resources", "tools"],
    data_type: "repository"
  },
  {
    id: "3",
    title: "Building Scalable Microservices with Node.js",
    description: "Learn how to design and implement scalable microservices architecture using Node.js, Docker, and Kubernetes. Best practices included.",
    source: "reddit",
    author: "microservice_guru",
    created_at: "2024-01-14T09:20:00Z",
    url: "https://reddit.com/r/node/example3",
    score: 156,
    tags: ["nodejs", "microservices", "architecture", "docker"],
    data_type: "post"
  },
  {
    id: "4",
    title: "data-collection-pipeline",
    description: "High-performance data collection and processing pipeline built with TypeScript. Supports multiple data sources and real-time processing.",
    source: "github",
    author: "dataengineer",
    created_at: "2024-01-13T14:10:00Z",
    url: "https://github.com/dataengineer/data-collection-pipeline",
    score: 423,
    tags: ["typescript", "data-pipeline", "etl", "processing"],
    data_type: "repository"
  },
  {
    id: "5",
    title: "Database Design Best Practices for 2024",
    description: "Modern database design patterns and best practices. Covers SQL, NoSQL, and NewSQL databases with real-world examples.",
    source: "reddit",
    author: "db_architect",
    created_at: "2024-01-13T11:30:00Z",
    url: "https://reddit.com/r/database/example5",
    score: 298,
    tags: ["database", "design", "sql", "nosql"],
    data_type: "post"
  },
  {
    id: "6",
    title: "Issue: Performance optimization needed for large datasets",
    description: "Looking for suggestions to optimize query performance when dealing with datasets over 100M records. Current approach is too slow.",
    source: "github",
    author: "perfoptimizer",
    created_at: "2024-01-12T16:45:00Z",
    url: "https://github.com/someproject/issues/123",
    score: 67,
    tags: ["performance", "optimization", "database", "scaling"],
    data_type: "issue"
  },
  {
    id: "7",
    title: "REST API Security Checklist - Complete Guide",
    description: "Comprehensive security checklist for REST APIs including authentication, authorization, rate limiting, and data validation strategies.",
    source: "other",
    author: "security_expert",
    created_at: "2024-01-12T08:15:00Z",
    url: "https://example.com/api-security-guide",
    score: 445,
    tags: ["security", "api", "authentication", "best-practices"],
    data_type: "post"
  },
  {
    id: "8",
    title: "supabase-integration-toolkit",
    description: "Toolkit for seamless Supabase integration with React applications. Includes auth helpers, database hooks, and TypeScript types.",
    source: "github",
    author: "supabase_fan",
    created_at: "2024-01-11T13:20:00Z",
    url: "https://github.com/supabase_fan/integration-toolkit",
    score: 234,
    tags: ["supabase", "react", "typescript", "integration"],
    data_type: "repository"
  }
];

export const generateMoreMockData = (count: number, startId: number = 9): DataItem[] => {
  const sources: DataItem['source'][] = ['reddit', 'github', 'other'];
  const dataTypes = ['post', 'repository', 'issue', 'discussion'];
  const tagPool = [
    'javascript', 'typescript', 'react', 'nodejs', 'python', 'database',
    'api', 'frontend', 'backend', 'security', 'performance', 'architecture',
    'microservices', 'docker', 'kubernetes', 'aws', 'cloud', 'devops'
  ];

  return Array.from({ length: count }, (_, index) => {
    const id = (startId + index).toString();
    const source = sources[Math.floor(Math.random() * sources.length)];
    const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
    const tagCount = Math.floor(Math.random() * 4) + 2;
    const randomTags = [...tagPool].sort(() => 0.5 - Math.random()).slice(0, tagCount);
    
    return {
      id,
      title: `Sample ${dataType} ${id} - ${randomTags[0]} related content`,
      description: `This is a sample ${dataType} about ${randomTags.join(', ')}. Generated for demonstration purposes.`,
      source,
      author: `user${id}`,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      url: `https://${source}.com/sample/${id}`,
      score: Math.floor(Math.random() * 500) + 10,
      tags: randomTags,
      data_type: dataType
    };
  });
};