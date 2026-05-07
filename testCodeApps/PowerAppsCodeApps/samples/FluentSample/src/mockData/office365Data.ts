// Mock data for Office 365 Users connector
// This file demonstrates the data structure expected from Office 365 Users connector
// The data structure matches the live Office365UsersService.User interface

// TODO: Replace this mock interface with the actual Office 365 User type from Power Apps SDK
export interface User {
  Id: string;
  AccountEnabled: boolean;
  BusinessPhones: string[];
  City: string;
  CompanyName: string;
  Country: string;
  Department: string;
  DisplayName: string;
  GivenName: string;
  JobTitle: string;
  Mail: string;
  MailNickname: string;
  mobilePhone?: string;
  OfficeLocation: string;
  PostalCode: string;
  Surname: string;
  TelephoneNumber: string;
  UserPrincipalName: string;
}

// Mock user profiles that match the Office 365 User interface
export const mockUsers: User[] = [
  {
    Id: "550e8400-e29b-41d4-a716-446655440001",
    AccountEnabled: true,
    BusinessPhones: ["+1 (425) 555-0100"],
    City: "Seattle",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Engineering",
    DisplayName: "Alex Johnson",
    GivenName: "Alex",
    JobTitle: "Senior Software Engineer",
    Mail: "alex.johnson@contoso.com",
    MailNickname: "alexj",
    mobilePhone: "+1 (425) 555-0101",
    OfficeLocation: "Building 1, Floor 3",
    PostalCode: "98052",
    Surname: "Johnson",
    TelephoneNumber: "+1 (425) 555-0100",
    UserPrincipalName: "alex.johnson@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440002",
    AccountEnabled: true,
    BusinessPhones: ["+1 (415) 555-0200"],
    City: "San Francisco",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Product Management",
    DisplayName: "Sarah Chen",
    GivenName: "Sarah",
    JobTitle: "Senior Product Manager",
    Mail: "sarah.chen@contoso.com",
    MailNickname: "sarahc",
    mobilePhone: "+1 (415) 555-0201",
    OfficeLocation: "Building A, Floor 5",
    PostalCode: "94105",
    Surname: "Chen",
    TelephoneNumber: "+1 (415) 555-0200",
    UserPrincipalName: "sarah.chen@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440003",
    AccountEnabled: true,
    BusinessPhones: ["+1 (512) 555-0300"],
    City: "Austin",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Design",
    DisplayName: "Michael Rodriguez",
    GivenName: "Michael",
    JobTitle: "Principal UX Designer",
    Mail: "michael.rodriguez@contoso.com",
    MailNickname: "michaelr",
    mobilePhone: "+1 (512) 555-0301",
    OfficeLocation: "Building C, Floor 2",
    PostalCode: "78701",
    Surname: "Rodriguez",
    TelephoneNumber: "+1 (512) 555-0300",
    UserPrincipalName: "michael.rodriguez@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440004",
    AccountEnabled: true,
    BusinessPhones: ["+1 (206) 555-0400"],
    City: "Seattle",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Marketing",
    DisplayName: "Emily Davis",
    GivenName: "Emily",
    JobTitle: "Marketing Director",
    Mail: "emily.davis@contoso.com",
    MailNickname: "emilyd",
    mobilePhone: "+1 (206) 555-0401",
    OfficeLocation: "Building 2, Floor 4",
    PostalCode: "98052",
    Surname: "Davis",
    TelephoneNumber: "+1 (206) 555-0400",
    UserPrincipalName: "emily.davis@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440005",
    AccountEnabled: true,
    BusinessPhones: ["+1 (212) 555-0500"],
    City: "New York",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Sales",
    DisplayName: "David Wilson",
    GivenName: "David",
    JobTitle: "Sales Manager",
    Mail: "david.wilson@contoso.com",
    MailNickname: "davidw",
    mobilePhone: "+1 (212) 555-0501",
    OfficeLocation: "Building North, Floor 10",
    PostalCode: "10001",
    Surname: "Wilson",
    TelephoneNumber: "+1 (212) 555-0500",
    UserPrincipalName: "david.wilson@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440006",
    AccountEnabled: true,
    BusinessPhones: ["+1 (425) 555-0600"],
    City: "Redmond",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Human Resources",
    DisplayName: "Lisa Thompson",
    GivenName: "Lisa",
    JobTitle: "HR Business Partner",
    Mail: "lisa.thompson@contoso.com",
    MailNickname: "lisat",
    mobilePhone: "+1 (425) 555-0601",
    OfficeLocation: "Building 4, Floor 1",
    PostalCode: "98052",
    Surname: "Thompson",
    TelephoneNumber: "+1 (425) 555-0600",
    UserPrincipalName: "lisa.thompson@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440007",
    AccountEnabled: true,
    BusinessPhones: ["+1 (310) 555-0700"],
    City: "Los Angeles",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Engineering",
    DisplayName: "James Anderson",
    GivenName: "James",
    JobTitle: "DevOps Engineer",
    Mail: "james.anderson@contoso.com",
    MailNickname: "jamesa",
    mobilePhone: "+1 (310) 555-0701",
    OfficeLocation: "Building West, Floor 3",
    PostalCode: "90210",
    Surname: "Anderson",
    TelephoneNumber: "+1 (310) 555-0700",
    UserPrincipalName: "james.anderson@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440008",
    AccountEnabled: true,
    BusinessPhones: ["+1 (415) 555-0800"],
    City: "San Francisco",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Finance",
    DisplayName: "Jennifer Martinez",
    GivenName: "Jennifer",
    JobTitle: "Financial Analyst",
    Mail: "jennifer.martinez@contoso.com",
    MailNickname: "jenniferm",
    mobilePhone: "+1 (415) 555-0801",
    OfficeLocation: "Building A, Floor 8",
    PostalCode: "94105",
    Surname: "Martinez",
    TelephoneNumber: "+1 (415) 555-0800",
    UserPrincipalName: "jennifer.martinez@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440009",
    AccountEnabled: false,
    BusinessPhones: ["+1 (206) 555-0900"],
    City: "Seattle",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "IT",
    DisplayName: "Robert Taylor",
    GivenName: "Robert",
    JobTitle: "IT Administrator",
    Mail: "robert.taylor@contoso.com",
    MailNickname: "robertt",
    mobilePhone: "+1 (206) 555-0901",
    OfficeLocation: "Building 3, Floor 1",
    PostalCode: "98052",
    Surname: "Taylor",
    TelephoneNumber: "+1 (206) 555-0900",
    UserPrincipalName: "robert.taylor@contoso.com"
  },
  {
    Id: "550e8400-e29b-41d4-a716-446655440010",
    AccountEnabled: true,
    BusinessPhones: ["+1 (512) 555-1000"],
    City: "Austin",
    CompanyName: "Contoso Corporation",
    Country: "United States",
    Department: "Legal",
    DisplayName: "Maria Garcia",
    GivenName: "Maria",
    JobTitle: "Legal Counsel",
    Mail: "maria.garcia@contoso.com",
    MailNickname: "mariag",
    mobilePhone: "+1 (512) 555-1001",
    OfficeLocation: "Building C, Floor 6",
    PostalCode: "78701",
    Surname: "Garcia",
    TelephoneNumber: "+1 (512) 555-1000",
    UserPrincipalName: "maria.garcia@contoso.com"
  }
];

// Helper functions for mock data manipulation
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.Id === id);
};

export const searchUsers = (query: string, top: number = 50): User[] => {
  if (!query.trim()) {
    return [];
  }
  
  const lowercaseQuery = query.toLowerCase();
  const filtered = mockUsers.filter(user => 
    user.DisplayName?.toLowerCase().includes(lowercaseQuery) ||
    user.Mail?.toLowerCase().includes(lowercaseQuery) ||
    user.Department?.toLowerCase().includes(lowercaseQuery) ||
    user.JobTitle?.toLowerCase().includes(lowercaseQuery) ||
    user.GivenName?.toLowerCase().includes(lowercaseQuery) ||
    user.Surname?.toLowerCase().includes(lowercaseQuery)
  );
  
  return filtered.slice(0, top);
};

export const getUsersByDepartment = (department: string): User[] => {
  return mockUsers.filter(user => user.Department === department);
};

// Mock current user (for MyProfile functionality)
export const mockCurrentUser: User = {
  Id: "550e8400-e29b-41d4-a716-446655440001",
  AccountEnabled: true,
  BusinessPhones: ["+1 (425) 555-0100"],
  City: "Seattle",
  CompanyName: "Contoso Corporation",
  Country: "United States",
  Department: "Engineering",
  DisplayName: "Alex Johnson",
  GivenName: "Alex",
  JobTitle: "Senior Software Engineer",
  Mail: "alex.johnson@contoso.com",
  MailNickname: "alexj",
  mobilePhone: "+1 (425) 555-0101",
  OfficeLocation: "Building 1, Floor 3",
  PostalCode: "98052",
  Surname: "Johnson",
  TelephoneNumber: "+1 (425) 555-0100",
  UserPrincipalName: "alex.johnson@contoso.com"
};
