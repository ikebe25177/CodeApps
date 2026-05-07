-- Create the Projects table for the FluentSample demo
-- Execute this script in your Azure SQL Database to create the table and sample data

-- Create the dbo.Projects table
CREATE TABLE dbo.Projects (
    ProjectId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    StartDate DATETIME2 NULL,
    EndDate DATETIME2 NULL,
    Status NVARCHAR(50) NOT NULL,
    Priority NVARCHAR(50) NOT NULL,
    Budget DECIMAL(18,2) NULL,
    ProjectManagerEmail NVARCHAR(255) NOT NULL,
    CreatedBy NVARCHAR(255) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    IsActive BIT NOT NULL DEFAULT 1
);

-- Insert sample data
INSERT INTO dbo.Projects (Name, Description, StartDate, EndDate, Status, Priority, Budget, ProjectManagerEmail, CreatedBy, IsActive)
VALUES 
('Website Redesign', 'Complete overhaul of company website with modern design and improved user experience', '2024-01-15', '2024-06-30', 'Active', 'High', 75000.00, 'alice.johnson@contoso.com', 'system', 1),
('Mobile App Development', 'Native mobile application for iOS and Android platforms', '2024-03-01', '2024-09-15', 'Planning', 'Critical', 120000.00, 'bob.smith@contoso.com', 'system', 1),
('Database Migration', 'Migrate legacy database to cloud infrastructure', '2024-02-01', '2024-05-30', 'Completed', 'Medium', 45000.00, 'carol.davis@contoso.com', 'system', 1),
('Security Audit', 'Comprehensive security assessment and vulnerability testing', '2024-04-01', '2024-07-15', 'On Hold', 'High', 30000.00, 'david.wilson@contoso.com', 'system', 1),
('AI Integration', 'Integrate machine learning capabilities into existing systems', '2024-05-01', '2024-12-31', 'Planning', 'Low', 95000.00, 'eve.brown@contoso.com', 'system', 1),
('Cloud Migration', 'Move on-premises infrastructure to Azure cloud', '2024-06-01', '2024-11-30', 'Active', 'Medium', 150000.00, 'frank.miller@contoso.com', 'system', 1),
('Customer Portal', 'Self-service portal for customers to manage their accounts', '2024-07-01', '2024-10-15', 'Planning', 'High', 80000.00, 'grace.taylor@contoso.com', 'system', 1),
('API Modernization', 'Update legacy APIs to REST and GraphQL standards', '2024-03-15', '2024-08-30', 'Active', 'Medium', 60000.00, 'henry.anderson@contoso.com', 'system', 1);

-- Verify the data was inserted
SELECT COUNT(*) as TotalProjects FROM dbo.Projects;
SELECT * FROM dbo.Projects ORDER BY ProjectId;
