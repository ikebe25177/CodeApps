// Mock data for SQL connector examples
// This file demonstrates the data structure expected from SQL connectors
// Replace this mock data with real SQL connector calls in your implementation

export interface MockProject {
  id: number;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  budget: number;
  ownerId: number;
  teamSize: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface MockTask {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Blocked';
  assigneeId: number;
  estimatedHours: number;
  actualHours: number;
  dueDate: string;
  createdDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface MockEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  role: string;
  hireDate: string;
  salary: number;
  managerId?: number;
}

// Mock projects (100+ entries for pagination testing)
export const mockProjects: MockProject[] = [
  {
    id: 1,
    name: "Customer Portal Redesign",
    description: "Complete redesign of the customer-facing portal with modern UI/UX",
    status: "Active",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    budget: 150000,
    ownerId: 1,
    teamSize: 8,
    priority: "High"
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native mobile app for iOS and Android platforms",
    status: "Planning",
    startDate: "2025-03-01",
    endDate: "2025-12-31",
    budget: 300000,
    ownerId: 2,
    teamSize: 12,
    priority: "Critical"
  },
  {
    id: 3,
    name: "Database Migration",
    description: "Migrate legacy database to cloud infrastructure",
    status: "Completed",
    startDate: "2024-08-01",
    endDate: "2024-12-15",
    budget: 75000,
    ownerId: 3,
    teamSize: 5,
    priority: "Medium"
  },
  // Generate additional projects for pagination
  ...Array.from({ length: 97 }, (_, i) => ({
    id: i + 4,
    name: `Project ${i + 4}`,
    description: `Description for project ${i + 4}`,
    status: ['Planning', 'Active', 'Completed', 'On Hold'][i % 4] as MockProject['status'],
    startDate: new Date(2025, (i % 12), 1).toISOString().split('T')[0],
    endDate: new Date(2025, (i % 12) + 6, 30).toISOString().split('T')[0],
    budget: Math.floor(Math.random() * 500000) + 50000,
    ownerId: (i % 10) + 1,
    teamSize: Math.floor(Math.random() * 15) + 3,
    priority: ['Low', 'Medium', 'High', 'Critical'][i % 4] as MockProject['priority']
  }))
];

// Mock tasks
export const mockTasks: MockTask[] = [
  {
    id: 1,
    projectId: 1,
    title: "UI Wireframe Creation",
    description: "Create wireframes for all major portal pages",
    status: "Completed",
    assigneeId: 4,
    estimatedHours: 40,
    actualHours: 35,
    dueDate: "2025-02-15",
    createdDate: "2025-01-20",
    priority: "High"
  },
  {
    id: 2,
    projectId: 1,
    title: "Frontend Development",
    description: "Implement responsive frontend using React and TypeScript",
    status: "In Progress",
    assigneeId: 5,
    estimatedHours: 120,
    actualHours: 85,
    dueDate: "2025-04-30",
    createdDate: "2025-02-01",
    priority: "High"
  },
  {
    id: 3,
    projectId: 2,
    title: "Market Research",
    description: "Research competitor apps and user requirements",
    status: "Completed",
    assigneeId: 6,
    estimatedHours: 80,
    actualHours: 75,
    dueDate: "2025-02-28",
    createdDate: "2025-01-15",
    priority: "Critical"
  },
  // Generate more tasks
  ...Array.from({ length: 47 }, (_, i) => ({
    id: i + 4,
    projectId: Math.floor(i / 5) + 1,
    title: `Task ${i + 4}`,
    description: `Description for task ${i + 4}`,
    status: ['Not Started', 'In Progress', 'Completed', 'Blocked'][i % 4] as MockTask['status'],
    assigneeId: (i % 20) + 1,
    estimatedHours: Math.floor(Math.random() * 80) + 10,
    actualHours: Math.floor(Math.random() * 60) + 5,
    dueDate: new Date(2025, (i % 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    createdDate: new Date(2025, Math.max(0, (i % 12) - 1), 1).toISOString().split('T')[0],
    priority: ['Low', 'Medium', 'High', 'Critical'][i % 4] as MockTask['priority']
  }))
];

// Mock employees
export const mockEmployees: MockEmployee[] = [
  {
    id: 1,
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@company.com",
    department: "Engineering",
    role: "Senior Software Engineer",
    hireDate: "2022-03-15",
    salary: 95000,
    managerId: 10
  },
  {
    id: 2,
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@company.com",
    department: "Product",
    role: "Product Manager",
    hireDate: "2021-07-22",
    salary: 110000,
    managerId: 11
  },
  // Generate more employees
  ...Array.from({ length: 48 }, (_, i) => ({
    id: i + 3,
    firstName: `FirstName${i + 3}`,
    lastName: `LastName${i + 3}`,
    email: `employee${i + 3}@company.com`,
    department: ['Engineering', 'Product', 'Design', 'Marketing', 'Sales'][i % 5],
    role: ['Engineer', 'Manager', 'Designer', 'Analyst', 'Specialist'][i % 5],
    hireDate: new Date(2020 + (i % 5), i % 12, (i % 28) + 1).toISOString().split('T')[0],
    salary: Math.floor(Math.random() * 100000) + 50000,
    managerId: i < 10 ? undefined : Math.floor(i / 10) + 1
  }))
];

// Helper functions for mock SQL operations
export const getProjectById = (id: number): MockProject | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getTasksByProjectId = (projectId: number): MockTask[] => {
  return mockTasks.filter(task => task.projectId === projectId);
};

export const getEmployeeById = (id: number): MockEmployee | undefined => {
  return mockEmployees.find(employee => employee.id === id);
};

export const searchProjects = (query: string): MockProject[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProjects.filter(project => 
    project.name.toLowerCase().includes(lowercaseQuery) ||
    project.description.toLowerCase().includes(lowercaseQuery) ||
    project.status.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterProjectsByStatus = (status: MockProject['status']): MockProject[] => {
  return mockProjects.filter(project => project.status === status);
};

export const createMockProject = (project: Omit<MockProject, 'id'>): MockProject => {
  const newId = Math.max(...mockProjects.map(p => p.id)) + 1;
  const newProject = { ...project, id: newId };
  mockProjects.push(newProject);
  return newProject;
};

export const updateMockProject = (id: number, updates: Partial<MockProject>): MockProject | null => {
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) return null;
  
  mockProjects[projectIndex] = { ...mockProjects[projectIndex], ...updates };
  return mockProjects[projectIndex];
};

export const deleteMockProject = (id: number): boolean => {
  const projectIndex = mockProjects.findIndex(p => p.id === id);
  if (projectIndex === -1) return false;
  
  mockProjects.splice(projectIndex, 1);
  // Also delete associated tasks
  const taskIndicesToDelete = mockTasks.map((task, index) => task.projectId === id ? index : -1).filter(i => i !== -1);
  taskIndicesToDelete.reverse().forEach(index => mockTasks.splice(index, 1));
  
  return true;
};
