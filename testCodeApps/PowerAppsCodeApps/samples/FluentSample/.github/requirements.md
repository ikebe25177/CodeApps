# FluentSample Requirements

## Project Overview
This is a **ready-to-use static template** demonstrating Power Apps Code App integration patterns. The template provides a fully functional application with realistic mock data that users can **directly connect to their real Power Platform data sources**. 

**Primary Purpose**: 
- **Provide Working Foundation**: Complete static app with mock data that users can immediately run and explore
- **Enable Easy Migration**: Use GitHub Copilot to help users replace mock data with their actual Power Platform connectors
- **Demonstrate Integration Patterns**: Show practical examples of Office 365, SQL, and Custom API connector usage
- **Accelerate Development**: Give developers a production-ready starting point for their own Power Apps Code Apps

**User Journey**: Clone → Run locally → Use Copilot to connect to real data → Deploy to Power Platform

## Core Features

### 1. Navigation System
- **Main Navigation Menu** with clear section descriptions
- **Responsive design** that works on desktop and mobile
- **Visual indicators** for active/current section
- **Sample descriptions** directly in the navigation to explain what each example demonstrates

### 2. Office 365 Connector Example
**Current Implementation**: User directory search and profile display with static mock data
- **Features**:
  - Search functionality across 50+ realistic user profiles with departments, roles, and contact info
  - User profile cards showing DisplayName, JobTitle, Email, Department, BusinessPhones, OfficeLocation
  - Profile photo placeholders with fallback avatars
  - Current user context display
  - Responsive grid layout adapting to screen sizes
- **Mock Data Structure**: Matches Office 365 Users connector API response format
- **Migration Path**: Clear TODO comments and side-by-side code examples for Copilot-assisted conversion
- **Target Connector**: Office 365 Users connector (`shared_office365users`)
- **Reference Documentation**: [How to Connect to Data](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-connect-to-data.md)

### 3. SQL Connector Example
**Purpose**: Demonstrate transitioning from mock database operations to live Azure SQL integration
- **Features**:
  - Static implementation with realistic SQL mock data (Projects, Tasks, Employees)
  - Comprehensive CRUD operations with mock data foundation
  - Data pagination patterns ready for live data
  - GitHub Copilot-friendly code structure for easy connector migration
  - Search and filtering capabilities with realistic data scenarios
- **Copilot Integration Goal**: Guide users through replacing mock database calls with Power Apps SDK SQL connector
- **Reference Documentation**: [How to Connect to Azure SQL](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-connect-to-azure-sql.md)
- **Navigation Description**: "SQL Database - CRUD operations, search, and data management"

### 4. Custom Connector Example
**Current Implementation**: Basic asset management interface with realistic mock data
- **Features**:
  - Asset listing with 30+ realistic business assets (equipment, software, facilities)
  - Asset cards showing Name, Type, Category, Status, Location, Purchase Date, and Cost
  - Search functionality to filter assets by name
  - Status indicators (Available, In Use, Maintenance, Retired)
  - Category-based organization (IT Equipment, Software, Office Supplies, etc.)
  - Responsive card layout with detailed asset information
- **Mock Data Structure**: Designed to match common asset management API response formats
- **Migration Path**: Structured for easy Copilot-assisted conversion to custom connector calls
- **Target Integration**: Power Platform custom connectors for asset management APIs
- **Reference Documentation**: [How to Create API and Custom Connector](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-create-api-and-custom-connector.md)
- **Navigation Description**: "Custom API - External service integration and custom connectors"

### 5. Data Pagination Support
**Purpose**: Efficiently handle large datasets across all examples
- **Implementation**: Follow patterns from [PowerAppsCodeApps Discussion #49](https://github.com/microsoft/PowerAppsCodeApps/discussions/49)
- **Features**:
  - **Page-based navigation** (Previous/Next buttons)
  - **Page size selection** (10, 25, 50, 100 items per page)
  - **Total record count** display
  - **Jump to page** functionality
  - **Loading states** during page transitions
  - **URL parameter support** for shareable paginated views
- **Apply to**: SQL connector example primarily, adaptable to other connectors as needed

## Technical Requirements

### UI Framework
- **Fluent UI React v9** for all components
- **Consistent design language** following Microsoft design principles
- **Responsive layout** using Fluent UI's responsive utilities
- **Accessibility compliance** (WCAG 2.1 AA)

### Navigation Implementation
- **React Router** for client-side routing
- **Breadcrumb navigation** for deep pages
- **Side navigation panel** with collapsible sections
- **Mobile-friendly** hamburger menu for smaller screens

### State Management
- **React Context** for global app state
- **React Query/TanStack Query** for server state and caching
- **Local state** using React hooks for component-specific data

### Error Handling
- **Global error boundary** for unhandled errors
- **Toast notifications** for user feedback
- **Retry mechanisms** for failed API calls
- **Graceful degradation** when connectors are unavailable

### Performance
- **Code splitting** by route/feature
- **Lazy loading** for heavy components
- **Memoization** for expensive computations
- **Virtualization** for large data lists

## Project Structure
```
FluentSample/
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Main layout with navigation
│   │   ├── PageHeader.tsx          # Page header component
│   │   ├── PaginationComponent.tsx # Data pagination
│   │   └── ThemedApp.tsx           # Theme wrapper component
│   ├── pages/
│   │   ├── HomePage.tsx            # Landing page with app overview
│   │   ├── Office365Page.tsx       # Office 365 connector demo
│   │   ├── SqlPage.tsx             # SQL database demo
│   │   └── CustomApiPage.tsx       # Custom API connector demo
│   ├── hooks/
│   │   ├── usePagination.ts        # Reusable pagination logic
│   │   └── useTheme.ts             # Theme management hooks
│   ├── contexts/
│   │   ├── ThemeContext.ts         # Theme context definition
│   │   └── ThemeContext.tsx        # Theme provider implementation
│   ├── mockData/                   # Mock data for development
│   │   ├── office365Data.ts        # Office 365 mock data
│   │   ├── sqlData.ts              # SQL mock data
│   │   └── customApiData.ts        # Custom API mock data
│   ├── assets/                     # Static assets and images
│   ├── App.tsx                     # Main app with routing
│   ├── main.tsx                    # Entry point with providers
│   ├── PowerProvider.tsx           # Power Apps SDK setup
│   ├── App.css                     # Global styles
│   └── index.css                   # Base styles
├── public/                         # Public assets
├── contentMedia/                   # Documentation media files
│   └── 1-clone_repo.gif           # Setup demonstration GIF
├── .github/                        # GitHub metadata
│   ├── copilot-instructions.md     # Copilot development guidance
│   └── requirements.md             # This requirements document
├── README.md                       # Setup and usage guide
├── package.json                    # Dependencies and scripts
└── power.config.json               # Power Apps configuration
```

## User Experience Requirements

### Landing Page
- **Welcome message** explaining the app's purpose
- **Quick navigation cards** to each example
- **Getting started guide** for developers
- **Links to documentation** and resources

### Example Pages
- **Clear headings** describing the connector and its capabilities
- **Step-by-step demonstrations** of key features
- **Code snippets** showing implementation details
- **Live data interactions** where possible
- **Error simulation** buttons for testing error handling

### Documentation Integration
- **Inline help text** referencing the provided documentation links
- **"Learn More" buttons** linking to detailed guides
- **Tooltips** explaining Power Platform concepts
- **Code examples** with copy-to-clipboard functionality

## Data Requirements

### Sample Data
- **Mock data** for development when connectors aren't available
- **Test records** for SQL database examples
- **Realistic user scenarios** demonstrating practical use cases

### Security Considerations
- **No sensitive data** in sample implementations
- **Environment variable** usage for connection strings
- **Error messages** that don't expose internal details
- **Proper authentication** handling for all connectors

## Success Criteria
1. **Effective Copilot Integration**: GitHub Copilot can successfully guide users from mock data to live connectors
2. **Clear Transition Paths**: Well-documented and AI-friendly code patterns for connector migration
3. **Functional Static Foundation**: Fully working app with realistic mock data as starting point
4. **Power Apps SDK Demonstration**: Clear examples of connector usage patterns
5. **Smooth navigation** between sections and connector examples
6. **Responsive design** that works across all device sizes
7. **Comprehensive documentation** supporting both human and AI-assisted development

## Implementation Status

### ✅ Completed
- **Project Structure**: React + TypeScript + Vite foundation ready for connector integration
- **Static App Foundation**: Fully functional app with realistic mock data across all connector types
- **Navigation System**: Complete layout with routing between connector examples
- **Theme System**: Dark/light theme support with context management
- **Copilot-Optimized Code**: GitHub Copilot-friendly patterns with clear TODO markers for migration
- **Mock Data Foundation**: Comprehensive mock data matching real Power Platform API structures
- **Documentation**: Detailed setup guides and connector migration instructions
- **Development Workflow**: Build system, linting, and development environment ready

### 🔄 In Progress / Needs Update
- **Copilot Migration Guidance**: Refining prompts and patterns for optimal AI assistance
- **Power Platform Integration**: Adding more detailed connector integration examples
- **Error Handling**: Expanding error scenarios for live connector integration
- **Performance Optimization**: Enhancing patterns for production-ready connector usage

### 📋 Next Steps for Users (with Copilot Assistance)
- **Connect to Office 365**: Use Copilot to replace mock user data with live Office 365 Users connector
- **Integrate SQL Database**: Leverage AI assistance to connect mock CRUD operations to real Azure SQL
- **Setup Custom Connectors**: Use Copilot guidance to replace mock API calls with custom connector integration
- **Environment Configuration**: AI-assisted setup of Power Platform connections and authentication

## Future Enhancements
- **SharePoint connector** example
- **Dataverse integration** (when supported)
- **Multi-language support**
- **Theme customization** options
- **Advanced filtering** and search capabilities
- **Export functionality** for data views
- **Real-time updates** using SignalR or similar
