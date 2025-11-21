// src/data/mockData.js
export const mockTests = [
  {
    id: 1,
    title: "Основы JavaScript",
    description: "Тест по основам программирования на JavaScript",
    tags: ["programming", "javascript", "beginner"],
    questionsCount: 10,
    timeLimit: 30,
    difficulty: "beginner",
    available: true
  },
  {
    id: 2,
    title: "React.js основы",
    description: "Тестирование знаний по React.js и компонентам",
    tags: ["react", "frontend", "javascript"],
    questionsCount: 15,
    timeLimit: 45,
    difficulty: "intermediate",
    available: true
  },
  {
    id: 3,
    title: "Базы данных SQL",
    description: "Тест по основам реляционных баз данных и SQL",
    tags: ["database", "sql", "backend"],
    questionsCount: 20,
    timeLimit: 60,
    difficulty: "intermediate",
    available: true
  }
];

export const mockAdmin = {
  email: "admin@test.ru",
  password: "admin123"
};