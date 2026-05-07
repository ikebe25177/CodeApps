-- =============================================
-- SAMPLE DATA GENERATOR FOR PROJECTS TABLE
-- =============================================
-- This script generates 5,000 sample project records
-- for the Projects table created in the Azure SQL setup guide

SET NOCOUNT ON;

-- Clear existing sample data (optional)
-- DELETE FROM [dbo].[Projects] WHERE [CreatedBy] LIKE '%sample%';

-- Generate 5,000 sample projects
DECLARE @Counter INT = 1;
DECLARE @ProjectNames TABLE (Name NVARCHAR(255));
DECLARE @Statuses TABLE (Status NVARCHAR(50));
DECLARE @Priorities TABLE (Priority NVARCHAR(20));
DECLARE @Managers TABLE (Email NVARCHAR(255));

-- Insert sample project names
INSERT INTO @ProjectNames VALUES 
('Website Redesign'), ('Mobile App Development'), ('Database Migration'), ('Cloud Infrastructure'), 
('API Integration'), ('Security Audit'), ('Performance Optimization'), ('User Experience Update'),
('Data Analytics Platform'), ('E-commerce Enhancement'), ('Customer Portal'), ('Inventory System'),
('HR Management System'), ('Financial Dashboard'), ('Marketing Automation'), ('Quality Assurance'),
('DevOps Pipeline'), ('Machine Learning Model'), ('Blockchain Integration'), ('IoT Implementation');

-- Insert statuses
INSERT INTO @Statuses VALUES ('Planning'), ('Active'), ('On Hold'), ('Completed'), ('Cancelled');

-- Insert priorities  
INSERT INTO @Priorities VALUES ('Low'), ('Medium'), ('High'), ('Critical');

-- Insert sample managers
INSERT INTO @Managers VALUES 
('sarah.johnson@company.com'), ('mike.chen@company.com'), ('lisa.williams@company.com'),
('david.brown@company.com'), ('emma.davis@company.com'), ('james.wilson@company.com'),
('sophia.miller@company.com'), ('robert.taylor@company.com'), ('olivia.garcia@company.com'),
('william.martinez@company.com');

-- Generate records
WHILE @Counter <= 5000
BEGIN
    INSERT INTO [dbo].[Projects] (
        [Name], 
        [Description], 
        [StartDate], 
        [EndDate], 
        [Status], 
        [Priority], 
        [Budget], 
        [ProjectManagerEmail], 
        [CreatedBy]
    )
    SELECT 
        CONCAT((SELECT TOP 1 Name FROM @ProjectNames ORDER BY NEWID()), ' ', @Counter),
        CONCAT('Sample project description for project ', @Counter, ' with automated data generation'),
        DATEADD(day, ABS(CHECKSUM(NEWID())) % 365 * -1, GETDATE()), -- Random date in last year
        DATEADD(day, ABS(CHECKSUM(NEWID())) % 365, GETDATE()), -- Random date in next year
        (SELECT TOP 1 Status FROM @Statuses ORDER BY NEWID()),
        (SELECT TOP 1 Priority FROM @Priorities ORDER BY NEWID()),
        ROUND((ABS(CHECKSUM(NEWID())) % 500000 + 10000), -2), -- Random budget 10k-500k
        (SELECT TOP 1 Email FROM @Managers ORDER BY NEWID()),
        'sample-data-generator'
    ;
    
    SET @Counter = @Counter + 1;
    
    -- Progress indicator every 1000 records
    IF @Counter % 1000 = 0
        PRINT CONCAT('Generated ', @Counter, ' records...');
END

PRINT CONCAT('Successfully generated ', @Counter - 1, ' sample project records!');

-- Verify the data
SELECT 
    COUNT(*) as TotalRecords,
    COUNT(CASE WHEN CreatedBy = 'sample-data-generator' THEN 1 END) as SampleRecords
FROM [dbo].[Projects];
