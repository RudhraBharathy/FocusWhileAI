export const PROMPTS = [
  {
    category: "Refactoring",
    text: "Refactor this code to adhere to the SOLID principles. specifically the Single Responsibility Principle, and explain your changes.",
  },
  {
    category: "Optimization",
    text: "Analyze the time and space complexity (Big O) of this function. Suggest a more efficient algorithm if possible.",
  },
  {
    category: "Debugging",
    text: "Act as a Senior QA Engineer. Generate a list of edge cases and potential failure points for this specific input form.",
  },
  {
    category: "Documentation",
    text: "Generate JSDoc/Docstring documentation for this function, including parameter types, return values, and a usage example.",
  },
  {
    category: "Security",
    text: "Review this code snippet for common security vulnerabilities (OWASP Top 10) such as SQL injection or XSS.",
  },
  {
    category: "React",
    text: "Convert this Class-based React component into a Functional component using Hooks (useState, useEffect).",
  },
  {
    category: "Database",
    text: "Write a raw SQL query to fetch the top 5 users by spend, joining the 'users' and 'orders' tables efficiently.",
  },
  {
    category: "Testing",
    text: "Write a Jest unit test for this function. Include assertions for success paths, failure paths, and null inputs.",
  },
  {
    category: "System Design",
    text: "Design a high-level architecture for a URL shortener (like Bit.ly). Discuss database choice, caching strategy, and scaling.",
  },
  {
    category: "API Design",
    text: "Design a RESTful API schema for a 'Task Manager' app. List the endpoints, HTTP methods, and JSON response structures.",
  },
  {
    category: "Explanation",
    text: "Explain the concept of 'Closure' in JavaScript to a 10-year-old using an analogy involving a backpack.",
  },
  {
    category: "Comparison",
    text: "Compare and contrast 'GraphQL' vs 'REST'. Create a table showing pros, cons, and best use-cases for each.",
  },
  {
    category: "Mental Model",
    text: "Explain how a 'Promise' works in asynchronous programming using the analogy of ordering food at a restaurant.",
  },
  {
    category: "Regex",
    text: "Write a Regular Expression (Regex) to validate an email address that strictly forbids free domains like gmail.com.",
  },
  {
    category: "Git",
    text: "I accidentally committed a secret key to my local git repo. Give me the commands to remove it from history completely.",
  },
  {
    category: "CSS",
    text: "Center a div both vertically and horizontally using CSS Grid. Provide the minimal code required.",
  },
  {
    category: "Typescript",
    text: "Take this messy JSON object and generate a strict TypeScript Interface that models it accurately.",
  },
  {
    category: "UI/UX",
    text: "Suggest 3 improvements to this UI component to make it more accessible (WCAG 2.1 compliant) for screen readers.",
  },
  {
    category: "Code Review",
    text: "Act as a strict Code Reviewer. Critique this pull request for readability, maintainability, and naming conventions.",
  },
  {
    category: "DevOps",
    text: "Write a Dockerfile for a Node.js application. Use multi-stage builds to keep the image size small.",
  },
  {
    category: "Shell",
    text: "Write a bash script that finds all files larger than 100MB in the current directory and logs their names to a file.",
  },
  {
    category: "Modernization",
    text: "Rewrite this legacy callback-based Node.js code to use async/await syntax for better readability.",
  },
  {
    category: "Data",
    text: "I have a CSV string. Write a Python script to parse it into a list of dictionaries without using the pandas library.",
  },
  {
    category: "Naming",
    text: "Suggest 5 distinct, semantic variable names for a boolean flag that tracks if a user is currently logged in.",
  },
  {
    category: "Strategy",
    text: "I need to migrate a monolithic app to microservices. Give me a step-by-step 6-month roadmap to do this safely.",
  },
  {
    category: "Kubernetes",
    text: "Design a Kubernetes deployment strategy for a multi-tenant SaaS application. Address namespaces, resource quotas, and network policies.",
  },
  {
    category: "Kubernetes",
    text: "Explain how Kubernetes handles pod scheduling. Analyze the impact of taints, tolerations, affinities, and priorities.",
  },
  {
    category: "Kubernetes",
    text: "Write a Kubernetes YAML configuration for a highly available backend service using HPA and PodDisruptionBudgets.",
  },
  {
    category: "Kubernetes",
    text: "Diagnose a Kubernetes cluster where pods are stuck in CrashLoopBackOff. Outline a systematic debugging approach.",
  },
  {
    category: "Kubernetes",
    text: "Compare StatefulSets vs Deployments. Provide scenarios where each is the correct choice.",
  },

  {
    category: "Cloud Architecture",
    text: "Design a fault-tolerant, multi-region architecture on AWS for a read-heavy application. Discuss trade-offs.",
  },
  {
    category: "Cloud Architecture",
    text: "Explain the differences between eventual consistency and strong consistency in distributed cloud databases.",
  },
  {
    category: "Cloud Architecture",
    text: "Propose a cost-optimization strategy for a cloud-native application experiencing unpredictable traffic spikes.",
  },
  {
    category: "Cloud Architecture",
    text: "Design an event-driven architecture using managed cloud services. Explain producer, consumer, and failure handling.",
  },
  {
    category: "Cloud Architecture",
    text: "Compare serverless functions vs containerized microservices for a high-throughput API.",
  },

  {
    category: "Python Data Science",
    text: "Implement a Python pipeline to clean, normalize, and validate a large dataset using NumPy and standard libraries.",
  },
  {
    category: "Python Data Science",
    text: "Explain the bias-variance tradeoff using a real-world machine learning example.",
  },
  {
    category: "Python Data Science",
    text: "Write a Python function to perform k-fold cross-validation from scratch.",
  },
  {
    category: "Python Data Science",
    text: "Analyze memory and performance implications of using NumPy arrays vs Python lists for numerical computation.",
  },
  {
    category: "Python Data Science",
    text: "Explain the difference between supervised, unsupervised, and self-supervised learning with practical examples.",
  },

  {
    category: "Mobile Development",
    text: "Design an offline-first architecture for a mobile app that syncs data reliably when connectivity is restored.",
  },
  {
    category: "Mobile Development",
    text: "Compare Flutter and React Native from a performance and maintainability perspective.",
  },
  {
    category: "Mobile Development",
    text: "Explain how background tasks and lifecycle events differ between iOS and Android.",
  },
  {
    category: "Mobile Development",
    text: "Design a secure authentication flow for a mobile app using OAuth 2.0 and biometrics.",
  },
  {
    category: "Mobile Development",
    text: "Optimize a mobile app experiencing excessive battery drain. Outline diagnostic steps.",
  },

  {
    category: "DevOps",
    text: "Design a CI/CD pipeline that supports blue-green deployments with automated rollback.",
  },
  {
    category: "DevOps",
    text: "Explain infrastructure as code principles and compare Terraform with CloudFormation.",
  },
  {
    category: "DevOps",
    text: "Design a monitoring and alerting strategy for a distributed microservices system.",
  },
  {
    category: "DevOps",
    text: "Explain how to secure secrets in CI/CD pipelines without exposing them in logs.",
  },
  {
    category: "DevOps",
    text: "Propose a strategy for zero-downtime database migrations in production.",
  },

  {
    category: "Distributed Systems",
    text: "Explain the CAP theorem and apply it to a real distributed system design.",
  },
  {
    category: "Distributed Systems",
    text: "Design a distributed rate-limiting system that works across multiple data centers.",
  },
  {
    category: "Distributed Systems",
    text: "Analyze how consensus algorithms like Raft ensure fault tolerance.",
  },
  {
    category: "Distributed Systems",
    text: "Explain idempotency and why it is critical in distributed APIs.",
  },
  {
    category: "Distributed Systems",
    text: "Design a message ordering guarantee strategy in an event-driven system.",
  },

  {
    category: "Security",
    text: "Design a defense-in-depth strategy for a cloud-native application.",
  },
  {
    category: "Security",
    text: "Explain how mutual TLS works and when it should be used in microservices.",
  },
  {
    category: "Security",
    text: "Review an authentication system for common JWT-related vulnerabilities.",
  },
  {
    category: "Security",
    text: "Explain threat modeling and apply it to a payment processing service.",
  },
  {
    category: "Security",
    text: "Design a secure data encryption strategy for data at rest and in transit.",
  },

  {
    category: "Performance",
    text: "Profile a backend API under load and identify CPU vs I/O bottlenecks.",
  },
  {
    category: "Performance",
    text: "Explain how caching at different layers impacts overall system latency.",
  },
  {
    category: "Performance",
    text: "Design a load-testing strategy that simulates real user behavior.",
  },
  {
    category: "Performance",
    text: "Analyze the impact of garbage collection on application latency.",
  },
  {
    category: "Performance",
    text: "Explain how to optimize SQL queries using indexing and execution plans.",
  },

  {
    category: "Architecture",
    text: "Compare hexagonal architecture with traditional layered architecture.",
  },
  {
    category: "Architecture",
    text: "Design a modular monolith that can later be decomposed into microservices.",
  },
  {
    category: "Architecture",
    text: "Explain domain-driven design and identify bounded contexts in an e-commerce system.",
  },
  {
    category: "Architecture",
    text: "Design a scalable notification system supporting email, SMS, and push.",
  },
  {
    category: "Architecture",
    text: "Analyze the trade-offs between synchronous and asynchronous communication.",
  },

  {
    category: "AI/ML Engineering",
    text: "Design a production-ready ML inference service with scalability and monitoring.",
  },
  {
    category: "AI/ML Engineering",
    text: "Explain data drift and concept drift and how to detect them in production.",
  },
  {
    category: "AI/ML Engineering",
    text: "Design a feature store architecture for machine learning pipelines.",
  },
  {
    category: "AI/ML Engineering",
    text: "Explain the differences between batch inference and real-time inference.",
  },
  {
    category: "AI/ML Engineering",
    text: "Propose a model versioning and rollback strategy.",
  },

  {
    category: "Backend",
    text: "Design a pagination strategy for APIs handling millions of records.",
  },
  {
    category: "Backend",
    text: "Compare REST, gRPC, and GraphQL for internal microservice communication.",
  },
  {
    category: "Backend",
    text: "Design a webhook delivery system with retries and idempotency.",
  },
  {
    category: "Backend",
    text: "Explain eventual consistency using a shopping cart example.",
  },
  {
    category: "Backend",
    text: "Design an audit logging system that meets compliance requirements.",
  },

  {
    category: "Frontend Architecture",
    text: "Design a scalable frontend architecture for a large enterprise React application.",
  },
  {
    category: "Frontend Architecture",
    text: "Explain code-splitting strategies and their impact on performance.",
  },
  {
    category: "Frontend Architecture",
    text: "Design a state management strategy for a complex UI with real-time updates.",
  },
  {
    category: "Frontend Architecture",
    text: "Compare CSR, SSR, and ISR rendering strategies.",
  },
  {
    category: "Frontend Architecture",
    text: "Optimize a frontend app suffering from excessive re-renders.",
  },

  {
    category: "Testing",
    text: "Design an end-to-end testing strategy for a microservices-based system.",
  },
  {
    category: "Testing",
    text: "Explain property-based testing and when it is more effective than example-based tests.",
  },
  {
    category: "Testing",
    text: "Design a contract testing approach for independent service teams.",
  },
  {
    category: "Testing",
    text: "Explain how to test event-driven systems reliably.",
  },
  {
    category: "Testing",
    text: "Propose a flaky-test detection and mitigation strategy.",
  },

  {
    category: "Data Engineering",
    text: "Design a real-time data ingestion pipeline using streaming technologies.",
  },
  {
    category: "Data Engineering",
    text: "Explain the Lambda vs Kappa architecture patterns.",
  },
  {
    category: "Data Engineering",
    text: "Design a data warehouse schema optimized for analytical queries.",
  },
  {
    category: "Data Engineering",
    text: "Explain exactly-once processing semantics in streaming systems.",
  },
  {
    category: "Data Engineering",
    text: "Design a backfill strategy for historical data reprocessing.",
  },

  {
    category: "Reliability",
    text: "Explain SLOs, SLIs, and SLAs with concrete examples.",
  },
  {
    category: "Reliability",
    text: "Design a graceful degradation strategy for partial system outages.",
  },
  {
    category: "Reliability",
    text: "Explain circuit breakers and bulkheads in resilient systems.",
  },
  {
    category: "Reliability",
    text: "Design chaos engineering experiments for a critical service.",
  },
  {
    category: "Reliability",
    text: "Propose an incident response and postmortem process.",
  },

  {
    category: "Mobile Performance",
    text: "Optimize a mobile app launch time with detailed profiling steps.",
  },
  {
    category: "Mobile Performance",
    text: "Explain memory management differences between Android and iOS.",
  },
  {
    category: "Mobile Performance",
    text: "Design an image loading and caching strategy for mobile apps.",
  },
  {
    category: "Mobile Performance",
    text: "Analyze trade-offs between native modules and cross-platform abstractions.",
  },
  {
    category: "Mobile Performance",
    text: "Design push notification handling for high reliability.",
  },

  {
    category: "Leadership",
    text: "Explain how to conduct a technical design review effectively.",
  },
  {
    category: "Leadership",
    text: "Design a mentorship plan for onboarding junior engineers.",
  },
  {
    category: "Leadership",
    text: "Explain strategies for reducing technical debt over time.",
  },
  {
    category: "Leadership",
    text: "Design a process for making architecture decisions at scale.",
  },
  {
    category: "Leadership",
    text: "Explain how to balance delivery speed with long-term maintainability.",
  },
];
