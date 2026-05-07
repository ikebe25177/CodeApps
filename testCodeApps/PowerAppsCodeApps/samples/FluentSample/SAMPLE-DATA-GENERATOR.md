# Sample Data Generator for Projects Table

This document provides a script to generate 5,000 sample project records for testing and development purposes.

## Prerequisites

Before running this script, you need to have the Projects table created. Follow the setup instructions in the [Azure SQL Connection Guide](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-connect-to-azure-sql.md) to create the required database schema.

## Overview

The sample data generator creates realistic project data with:
- ✅ **5,000 unique project records**
- ✅ **Randomized project names** with sequential numbering
- ✅ **Realistic date ranges** (past and future dates)
- ✅ **Varied statuses** (Planning, Active, On Hold, Completed, Cancelled)
- ✅ **Different priorities** (Low, Medium, High, Critical)
- ✅ **Random budgets** between $10,000 and $500,000
- ✅ **Rotating project managers** from a pool of sample emails

## Usage

### Step 1: Execute the Script

1. Open your SQL Server Management Studio or Azure Data Studio
2. Connect to your Azure SQL Database
3. Copy and execute the contents of [`generate-sample-data.sql`](./generate-sample-data.sql)

### Step 2: Monitor Progress

The script provides progress indicators every 1,000 records:
```
Generated 1000 records...
Generated 2000 records...
Generated 3000 records...
Generated 4000 records...
Generated 5000 records...
Successfully generated 5000 sample project records!
```

### Step 3: Verify Results

The script automatically verifies the data generation:
```sql
-- Results will show:
TotalRecords: 5003 (3 original + 5000 new)
SampleRecords: 5000
```

## Sample Data Characteristics

### Project Names
- Base names from a realistic pool (Website Redesign, Mobile App Development, etc.)
- Sequential numbering for uniqueness (e.g., "Website Redesign 1", "API Integration 2500")

### Date Ranges
- **Start dates**: Random dates within the last year
- **End dates**: Random dates within the next year
- Ensures realistic project timelines

### Budget Distribution
- **Range**: $10,000 to $500,000
- **Increment**: Rounded to nearest $100
- **Distribution**: Evenly distributed across the range

### Project Managers
- Pool of 10 sample email addresses
- Randomly assigned to ensure variety
- Format: `firstname.lastname@company.com`

## Cleanup (Optional)

To remove only the generated sample data while keeping original records:

```sql
DELETE FROM [dbo].[Projects] 
WHERE [CreatedBy] = 'sample-data-generator';
```

## Performance Notes

- ⚡ **Execution time**: Approximately 30-60 seconds for 5,000 records
- 💾 **Memory usage**: Minimal - uses efficient batch processing
- 📊 **Database size**: ~2-3 MB additional storage

## Troubleshooting

### Common Issues

1. **Table doesn't exist**
   - Ensure you've run the schema creation script from the [Azure SQL guide](https://github.com/microsoft/PowerAppsCodeApps/blob/FluentSample/docs/how-to-connect-to-azure-sql.md)

2. **Permission errors**
   - Verify your user has INSERT permissions on the Projects table

3. **Constraint violations**
   - The script uses only valid Status and Priority values as defined in the table constraints

## Integration with FluentSample

This sample data works perfectly with the FluentSample Power Apps Code App:
- ✅ **SQL Database page** will display all 5,000+ records
- ✅ **Search and filtering** functionality will be more realistic
- ✅ **Performance testing** with substantial data
- ✅ **Pagination** behavior can be properly evaluated

Ready to test your app with realistic data volume! 🚀
