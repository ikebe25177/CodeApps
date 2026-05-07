import React from 'react';
import {
  SearchBox,
  makeStyles,
  Spinner,
  MessageBar,
  Button,
  Input,
  Label,
  Card,
  Text,
  Badge,
  Tooltip,
  tokens,
  InputOnChangeData,
  SearchBoxChangeEvent,
} from '@fluentui/react-components';
import {
  DatabaseRegular,
  ErrorCircleRegular,
  SearchRegular,
  ChevronLeftRegular,
  ChevronRightRegular,
  AddRegular,
} from '@fluentui/react-icons';
import PageHeader from '../components/PageHeader';

// Projects type definition - matches SQL database structure
interface Projects {
  ProjectId?: number;
  Name: string;
  Description?: string;
  StartDate?: string;
  EndDate?: string;
  Status: string;
  Priority: string;
  Budget?: number;
  ProjectManagerEmail: string;
  CreatedBy?: string;
  CreatedDate?: string;
  IsActive?: boolean;
}

// Styling
const useStyles = makeStyles({
  container: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  searchContainer: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    marginBottom: '16px',
  },
  dataGrid: {
    overflow: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  paginationInfo: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  paginationButtons: {
    display: 'flex',
    gap: '8px',
  },
  messageBar: {
    marginBottom: '16px',
  },
  generateSection: {
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: '24px',
  },
  generateControls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    marginTop: '12px',
  },
});

// String constants
const STRINGS = {
  LOADING_MESSAGE: 'Loading projects...',
  ERROR_MESSAGE: 'Unable to load projects. Please check your connection and try again.',
  SEARCH_PLACEHOLDER: 'Search projects...',
  NO_RESULTS_MESSAGE: 'No projects found matching your search.',
  ARIA_LABEL_DATA_GRID: 'Projects data grid',
  GENERATE_DATA_TITLE: 'Generate Sample Data',
  GENERATE_DATA_DESCRIPTION: 'Add test projects to the static data set',
  GENERATE_RECORDS_LABEL: 'Number of records to generate',
  GENERATE_BUTTON: 'Generate Projects',
  GENERATING_MESSAGE: 'Generating sample data...',
  GENERATION_SUCCESS: 'Successfully generated {count} projects!',
  GENERATION_ERROR: 'Failed to generate sample data.',
  GENERATION_DISABLED: 'Template mode - Sample data generation simulates adding to mock data',
  PAGINATION_PREVIOUS: 'Previous page',
  PAGINATION_NEXT: 'Next page',
  PAGINATION_PAGE_INFO: 'Page {current} of {total}',
} as const;

// Mock data that matches the SQL database structure
const MOCK_PROJECTS: Projects[] = [
  {
    ProjectId: 1,
    Name: 'Digital Transformation Initiative 1',
    Description: 'Modernize legacy systems and improve operational efficiency',
    StartDate: '2024-03-15T00:00:00.000Z',
    EndDate: '2024-12-31T00:00:00.000Z',
    Status: 'Active',
    Priority: 'High',
    Budget: 250000,
    ProjectManagerEmail: 'john.smith@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-01-15T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 2,
    Name: 'Customer Portal Redesign 1',
    Description: 'Enhance user experience and streamline customer interactions',
    StartDate: '2024-02-01T00:00:00.000Z',
    EndDate: '2024-08-30T00:00:00.000Z',
    Status: 'Planning',
    Priority: 'Medium',
    Budget: 180000,
    ProjectManagerEmail: 'sarah.johnson@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-01-20T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 3,
    Name: 'Mobile App Development 1',
    Description: 'Develop native mobile applications for iOS and Android',
    StartDate: '2024-04-01T00:00:00.000Z',
    EndDate: '2025-01-15T00:00:00.000Z',
    Status: 'Active',
    Priority: 'Critical',
    Budget: 320000,
    ProjectManagerEmail: 'mike.wilson@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-03-01T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 4,
    Name: 'Data Analytics Platform 1',
    Description: 'Build comprehensive analytics and reporting capabilities',
    StartDate: '2024-01-15T00:00:00.000Z',
    EndDate: '2024-10-31T00:00:00.000Z',
    Status: 'Completed',
    Priority: 'High',
    Budget: 420000,
    ProjectManagerEmail: 'lisa.brown@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2023-12-15T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 5,
    Name: 'Cloud Migration Project 1',
    Description: 'Migrate on-premises infrastructure to cloud services',
    StartDate: '2024-05-01T00:00:00.000Z',
    EndDate: '2024-11-30T00:00:00.000Z',
    Status: 'On Hold',
    Priority: 'Medium',
    Budget: 380000,
    ProjectManagerEmail: 'david.davis@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-04-01T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 6,
    Name: 'Security Enhancement Program 1',
    Description: 'Implement advanced security measures and compliance standards',
    StartDate: '2024-03-01T00:00:00.000Z',
    EndDate: '2024-09-30T00:00:00.000Z',
    Status: 'Active',
    Priority: 'Critical',
    Budget: 290000,
    ProjectManagerEmail: 'john.smith@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-02-15T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 7,
    Name: 'Process Automation Suite 1',
    Description: 'Automate manual processes to reduce operational overhead',
    StartDate: '2024-06-01T00:00:00.000Z',
    EndDate: '2025-02-28T00:00:00.000Z',
    Status: 'Planning',
    Priority: 'Low',
    Budget: 150000,
    ProjectManagerEmail: 'sarah.johnson@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-05-15T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 8,
    Name: 'User Experience Optimization 1',
    Description: 'Optimize user interfaces for better usability and engagement',
    StartDate: '2024-04-15T00:00:00.000Z',
    EndDate: '2024-10-15T00:00:00.000Z',
    Status: 'Active',
    Priority: 'Medium',
    Budget: 200000,
    ProjectManagerEmail: 'mike.wilson@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-03-20T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 9,
    Name: 'API Integration Platform 1',
    Description: 'Create unified API layer for system integration',
    StartDate: '2024-07-01T00:00:00.000Z',
    EndDate: '2025-01-31T00:00:00.000Z',
    Status: 'Planning',
    Priority: 'High',
    Budget: 350000,
    ProjectManagerEmail: 'lisa.brown@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-06-15T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 10,
    Name: 'Business Intelligence Dashboard 1',
    Description: 'Develop real-time business intelligence and reporting tools',
    StartDate: '2024-08-01T00:00:00.000Z',
    EndDate: '2025-03-31T00:00:00.000Z',
    Status: 'Planning',
    Priority: 'Medium',
    Budget: 280000,
    ProjectManagerEmail: 'david.davis@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-07-15T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 11,
    Name: 'Digital Transformation Initiative 2',
    Description: 'Modernize legacy systems and improve operational efficiency',
    StartDate: '2024-09-01T00:00:00.000Z',
    EndDate: '2025-05-31T00:00:00.000Z',
    Status: 'Planning',
    Priority: 'Low',
    Budget: 190000,
    ProjectManagerEmail: 'john.smith@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-08-15T00:00:00.000Z',
    IsActive: true
  },
  {
    ProjectId: 12,
    Name: 'Customer Portal Redesign 2',
    Description: 'Enhance user experience and streamline customer interactions',
    StartDate: '2024-10-01T00:00:00.000Z',
    EndDate: '2025-04-30T00:00:00.000Z',
    Status: 'Planning',
    Priority: 'Medium',
    Budget: 220000,
    ProjectManagerEmail: 'sarah.johnson@company.com',
    CreatedBy: 'system@company.com',
    CreatedDate: '2024-09-15T00:00:00.000Z',
    IsActive: true
  }
];

// TEMPLATE: Data service abstraction - Replace this with real API integration
class ProjectsDataService {
  // TEMPLATE: Replace this method with real API calls to your SQL database
  static async getAll(options?: {
    top?: number;
    skip?: number;
    filter?: string;
    orderBy?: string[];
    select?: string[];
  }): Promise<{ success: boolean; data: Projects[]; total: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filteredData = [...MOCK_PROJECTS];
    
    // Apply search filter
    if (options?.filter) {
      const searchTerm = this.extractSearchTerm(options.filter);
      if (searchTerm) {
        filteredData = filteredData.filter(project => 
          project.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (project.Description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.Status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.Priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.ProjectManagerEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
    }
    
    // Apply ordering
    if (options?.orderBy?.includes('Name')) {
      filteredData.sort((a, b) => a.Name.localeCompare(b.Name));
    }
    
    const total = filteredData.length;
    
    // Apply pagination
    if (options?.skip !== undefined && options?.top !== undefined) {
      filteredData = filteredData.slice(options.skip, options.skip + options.top);
    }
    
    return { success: true, data: filteredData, total };
  }
  
  // TEMPLATE: Replace this method with real API calls to create projects
  static async create(project: Omit<Projects, 'ProjectId'>): Promise<{ success: boolean; data: Projects }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProject: Projects = {
      ...project,
      ProjectId: Math.max(...MOCK_PROJECTS.map(p => p.ProjectId || 0)) + 1
    };
    
    MOCK_PROJECTS.push(newProject);
    
    return { success: true, data: newProject };
  }
  
  private static extractSearchTerm(filter: string): string | null {
    // Extract search term from OData filter string
    const match = filter.match(/contains\([^,]+,\s*'([^']+)'\)/);
    return match ? match[1] : null;
  }
}

// Main component
const SqlPage: React.FC = () => {
  const styles = useStyles();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const [recordCount, setRecordCount] = React.useState(5);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationMessage, setGenerationMessage] = React.useState('');
  
  // State for project data
  const [projects, setProjects] = React.useState<Projects[]>([]);
  const [totalRecords, setTotalRecords] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));

  // Debounce search term
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load project data
  const loadProjects = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get total count first
      const countResult = await ProjectsDataService.getAll({
        filter: debouncedSearchTerm 
          ? `contains(tolower(Name),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(Description),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(Status),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(Priority),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(ProjectManagerEmail),'${debouncedSearchTerm.toLowerCase()}')`
          : undefined
      });
      
      if (!countResult.success) {
        throw new Error('Failed to load projects count');
      }
      
      setTotalRecords(countResult.total);
      
      // Get paginated data
      const result = await ProjectsDataService.getAll({
        top: recordsPerPage,
        skip: (currentPage - 1) * recordsPerPage,
        orderBy: ['Name'],
        filter: debouncedSearchTerm 
          ? `contains(tolower(Name),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(Description),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(Status),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(Priority),'${debouncedSearchTerm.toLowerCase()}') or contains(tolower(ProjectManagerEmail),'${debouncedSearchTerm.toLowerCase()}')`
          : undefined
      });
      
      if (!result.success) {
        throw new Error('Failed to load projects');
      }
      
      setProjects(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setProjects([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  // Load projects when dependencies change
  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Ensure current page is valid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const generateSampleData = React.useCallback(async () => {
    setIsGenerating(true);
    setGenerationMessage(STRINGS.GENERATING_MESSAGE);

    try {
      for (let i = 0; i < recordCount; i++) {
        const projectData = {
          Name: `Generated Project ${Date.now()}-${i + 1}`,
          Description: `This is a test project generated on ${new Date().toLocaleDateString()}`,
          StartDate: new Date().toISOString(),
          EndDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from now
          Status: ['Planning', 'Active', 'Completed', 'On Hold'][Math.floor(Math.random() * 4)],
          Priority: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
          Budget: Math.floor(Math.random() * 500000) + 50000,
          ProjectManagerEmail: `manager${i + 1}@company.com`,
          CreatedBy: 'generator@company.com',
          CreatedDate: new Date().toISOString(),
          IsActive: true
        };

        const result = await ProjectsDataService.create(projectData);
        if (!result.success) {
          throw new Error('Failed to create project');
        }
      }
      
      setGenerationMessage(STRINGS.GENERATION_SUCCESS.replace('{count}', recordCount.toString()));
      // Reload projects to show new data
      await loadProjects();
      
      setTimeout(() => {
        setGenerationMessage('');
      }, 3000);
    } catch (err) {
      console.error('Generation error:', err);
      setGenerationMessage(STRINGS.GENERATION_ERROR);
      setTimeout(() => {
        setGenerationMessage('');
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  }, [recordCount, loadProjects]);

  const hasError = !!error;

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Memoize handlers to prevent unnecessary re-renders
  const handleSearchChange = React.useCallback((_: SearchBoxChangeEvent, data: InputOnChangeData) => {
    setSearchTerm(data.value || '');
  }, []);

  const handleGenerateDataCallback = React.useCallback(() => {
    if (recordCount > 0 && recordCount <= 100) {
      generateSampleData();
    }
  }, [recordCount, generateSampleData]);

  const handleRecordCountChange = React.useCallback((_: React.FormEvent<HTMLInputElement>, data: InputOnChangeData) => {
    if (data.value !== undefined && data.value !== null) {
      const numValue = parseInt(data.value, 10);
      if (!isNaN(numValue)) {
        setRecordCount(Math.max(1, Math.min(100, numValue)));
      }
    }
  }, []);

  // Show loading spinner only on initial load (when there's no existing data)
  const isInitialLoading = isLoading && projects.length === 0 && !searchTerm;

  // Loading state - only show full loading screen on initial load
  if (isInitialLoading) {
    return (
      <div className={styles.container}>
        <PageHeader
          title="SQL Database Connector Template"
          subtitle="Loading project data..."
          icon={<DatabaseRegular />}
        />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px' }}>
          <Spinner size="large" label={STRINGS.LOADING_MESSAGE} />
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={styles.container}>
        <PageHeader
          title="SQL Database Connector Template"
          subtitle="Template for SQL Database integration"
          icon={<DatabaseRegular />}
        />
        <MessageBar intent="error" className={styles.messageBar}>
          <ErrorCircleRegular style={{ marginRight: '8px' }} />
          {STRINGS.ERROR_MESSAGE}
          {error && (
            <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
              {error}
            </div>
          )}
        </MessageBar>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title="SQL Database Connector Template"
        subtitle="This page demonstrates how to implement SQL connector integration with pagination, search, and data management features. Ready for real data connection."
        icon={<DatabaseRegular />}
      />

      {/* Template Information */}
      <Card style={{ padding: '16px', backgroundColor: tokens.colorNeutralBackground2, marginBottom: '24px', border: `2px solid ${tokens.colorNeutralStroke2}` }}>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ color: tokens.colorNeutralForeground1, lineHeight: tokens.lineHeightBase300, display: 'block', marginBottom: '8px', fontSize: tokens.fontSizeBase200, fontWeight: tokens.fontWeightSemibold }}>
            📋 Template Mode - Static Data
          </Text>
          <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300, fontSize: tokens.fontSizeBase100 }}>
            This template uses mock data. Replace ProjectsDataService with real API calls to connect to your SQL database.
          </Text>
        </div>
      </Card>

      {/* Sample Data Generation Section */}
      <Card className={styles.generateSection}>
        <Text style={{ fontSize: tokens.fontSizeBase300, fontWeight: tokens.fontWeightSemibold, marginBottom: '8px', display: 'block' }}>
          {STRINGS.GENERATE_DATA_TITLE}
        </Text>
        <Text style={{ fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2, marginBottom: '12px', display: 'block' }}>
          {STRINGS.GENERATION_DISABLED}
        </Text>
        
        <div className={styles.generateControls}>
          <div>
            <Label htmlFor="recordCountInput" style={{ fontSize: tokens.fontSizeBase200 }}>
              {STRINGS.GENERATE_RECORDS_LABEL}
            </Label>
            <Input
              id="recordCountInput"
              type="number"
              min={1}
              max={100}
              value={recordCount.toString()}
              onChange={handleRecordCountChange}
              style={{ width: '120px' }}
            />
          </div>
          
          <Button
            appearance="primary"
            icon={<AddRegular />}
            onClick={handleGenerateDataCallback}
            disabled={isGenerating}
          >
            {isGenerating ? STRINGS.GENERATING_MESSAGE : STRINGS.GENERATE_BUTTON}
          </Button>
        </div>
        
        {generationMessage && (
          <Text 
            style={{ 
              marginTop: '12px', 
              display: 'block',
              color: generationMessage.includes('Success') ? tokens.colorPaletteGreenForeground2 : tokens.colorPaletteRedForeground2,
              fontWeight: tokens.fontWeightSemibold
            }}
          >
            {generationMessage}
          </Text>
        )}
      </Card>

      {/* Search */}
      <div className={styles.searchContainer}>
        <SearchBox
          placeholder={STRINGS.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ flexGrow: 1, maxWidth: '400px' }}
        />
      </div>

      {/* Simple Table Implementation */}
      <Card>
        <div style={{ overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: tokens.colorNeutralBackground2, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Project Name</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Priority</th>
                <th style={{ padding: '12px', textAlign: 'right', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Budget</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Start Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>End Date</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: tokens.fontWeightSemibold }}>Project Manager</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.ProjectId} style={{ 
                  backgroundColor: index % 2 === 0 ? tokens.colorNeutralBackground1 : tokens.colorNeutralBackground2,
                  borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
                }}>
                  <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, maxWidth: '250px' }}>
                    <Tooltip content={project.Name} relationship="description">
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        fontWeight: tokens.fontWeightSemibold 
                      }}>
                        {project.Name}
                      </div>
                    </Tooltip>
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, maxWidth: '300px' }}>
                    <Tooltip content={project.Description || 'No description'} relationship="description">
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {project.Description || 'No description'}
                      </div>
                    </Tooltip>
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                    <Badge 
                      appearance={
                        project.Status === 'Active' ? 'filled' :
                        project.Status === 'Completed' ? 'tint' :
                        project.Status === 'Planning' ? 'outline' :
                        'ghost'
                      }
                      color={
                        project.Status === 'Active' ? 'success' :
                        project.Status === 'Completed' ? 'brand' :
                        project.Status === 'Planning' ? 'warning' :
                        'danger'
                      }
                    >
                      {project.Status}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                    <Badge 
                      appearance="outline"
                      color={
                        project.Priority === 'Critical' ? 'danger' :
                        project.Priority === 'High' ? 'severe' :
                        project.Priority === 'Medium' ? 'warning' :
                        'subtle'
                      }
                    >
                      {project.Priority}
                    </Badge>
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, textAlign: 'right' }}>
                    <span style={{ fontWeight: tokens.fontWeightSemibold }}>
                      ${project.Budget?.toLocaleString() || '0'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                    {project.StartDate ? new Date(project.StartDate).toLocaleDateString() : 'Not set'}
                  </td>
                  <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                    {project.EndDate ? new Date(project.EndDate).toLocaleDateString() : 'Not set'}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Tooltip content={project.ProjectManagerEmail} relationship="description">
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        maxWidth: '200px'
                      }}>
                        {project.ProjectManagerEmail}
                      </div>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.paginationContainer}>
          <Text className={styles.paginationInfo}>
            {STRINGS.PAGINATION_PAGE_INFO
              .replace('{current}', currentPage.toString())
              .replace('{total}', totalPages.toString())} • {totalRecords} total records
          </Text>
          
          <div className={styles.paginationButtons}>
            <Button
              icon={<ChevronLeftRegular />}
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
              aria-label={STRINGS.PAGINATION_PREVIOUS}
            >
              Previous
            </Button>
            <Button
              icon={<ChevronRightRegular />}
              iconPosition="after"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
              aria-label={STRINGS.PAGINATION_NEXT}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* No Results Message */}
      {!isLoading && projects.length === 0 && searchTerm && (
        <MessageBar intent="info">
          <SearchRegular style={{ marginRight: '8px' }} />
          {STRINGS.NO_RESULTS_MESSAGE}
        </MessageBar>
      )}
    </div>
  );
};

export default SqlPage;
