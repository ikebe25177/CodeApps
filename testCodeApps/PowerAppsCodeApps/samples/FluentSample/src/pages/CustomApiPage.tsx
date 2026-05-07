import { Text, Card, makeStyles, shorthands, tokens, Button, Badge, Tooltip } from '@fluentui/react-components';
import { CloudRegular } from '@fluentui/react-icons';
import PageHeader from '../components/PageHeader';
import { mockAssets, Asset } from '../mockData/customApiData';
import { useState, useEffect } from 'react';

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    ...shorthands.margin('0', 'auto'),
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
  },
  dataGrid: {
    overflow: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  mockDataBadge: {
    marginBottom: '16px',
  },

});

export default function CustomApiPage() {
  const styles = useStyles();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load mock assets data (simulating API call)
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoadingAssets(true);
      setError(null);
      
      // Simulate API loading delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use static mock data instead of live API
      setAssets(mockAssets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while loading assets');
      setAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'success';
      case 'In Use': return 'brand';
      case 'Maintenance': return 'warning';
      case 'Active': return 'success';
      case 'Inactive': case 'Retired': return 'danger';
      default: return 'subtle';
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Custom API Connector Template"
        subtitle="This template demonstrates custom API connector integration patterns using Power Platform. Replace mock data with real custom connector calls to connect to your API."
        icon={<CloudRegular />}
      />

      <Badge className={styles.mockDataBadge} appearance="tint" color="warning">
        📋 Template Mode - Static Data
      </Badge>

      {/* Sample Data */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>📦 Sample Assets Data</h3>
        
        {loadingAssets ? (
          <Card style={{ padding: '24px', textAlign: 'center' }}>
            <Text>Loading sample assets data...</Text>
          </Card>
        ) : error ? (
          <Card style={{ padding: '24px', backgroundColor: tokens.colorNeutralBackground2 }}>
            <Text style={{ color: tokens.colorPaletteRedForeground2 }}>
              Error loading assets: {error}
            </Text>
            <Button 
              style={{ marginTop: '12px' }} 
              onClick={loadAssets}
              appearance="primary"
            >
              Retry
            </Button>
          </Card>
        ) : (
          <Card style={{ padding: '16px', backgroundColor: tokens.colorNeutralBackground2, marginBottom: '16px', border: `2px solid ${tokens.colorNeutralStroke2}` }}>
            <div style={{ textAlign: 'center' }}>
              <Text style={{ color: tokens.colorNeutralForeground1, lineHeight: tokens.lineHeightBase300, display: 'block', marginBottom: '8px', fontSize: tokens.fontSizeBase200, fontWeight: tokens.fontWeightSemibold }}>
                🔗 Template Ready for Your Custom Connector
              </Text>
              <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300, fontSize: tokens.fontSizeBase100 }}>
                Replace mockAssets with your custom connector service calls to connect to real data.
              </Text>
            </div>
          </Card>
        )}
        
        {!loadingAssets && !error && (
          <Card>
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: tokens.colorNeutralBackground2, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Asset ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Asset Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, fontWeight: tokens.fontWeightSemibold }}>Type</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: tokens.fontWeightSemibold }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset, index) => (
                    <tr key={asset.id} style={{ 
                      backgroundColor: index % 2 === 0 ? tokens.colorNeutralBackground1 : tokens.colorNeutralBackground2,
                      borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
                    }}>
                      <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                        <Tooltip content={`Asset ID: ${asset.id}`} relationship="description">
                          <code style={{ fontSize: tokens.fontSizeBase200, fontFamily: 'monospace', color: tokens.colorNeutralForeground2 }}>
                            {asset.id}
                          </code>
                        </Tooltip>
                      </td>
                      <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}`, maxWidth: '250px' }}>
                        <Tooltip content={asset.name} relationship="description">
                          <div style={{ 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap',
                            fontWeight: tokens.fontWeightSemibold 
                          }}>
                            {asset.name}
                          </div>
                        </Tooltip>
                      </td>
                      <td style={{ padding: '12px', borderRight: `1px solid ${tokens.colorNeutralStroke2}` }}>
                        <Text>{asset.type}</Text>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <Badge 
                          appearance="filled" 
                          color={getStatusColor(asset.status)}
                        >
                          {asset.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>

      {/* Integration Note */}
      <Card style={{ padding: '24px', backgroundColor: tokens.colorNeutralBackground2, marginTop: '32px' }}>
        <Text weight="semibold" style={{ display: 'block', marginBottom: '12px', color: tokens.colorNeutralForeground1 }}>
          � Getting Started with Your Custom Connector
        </Text>
        <Text style={{ color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase300 }}>
          This template demonstrates Power Platform custom connector integration patterns. To connect to your real API:
          1) Create your custom connector in Power Platform, 2) Generate the connector service using Power Apps SDK, 
          3) Replace the mockAssets import with your real connector service calls. 
          The DataGrid table structure and error handling patterns are ready for your data.
        </Text>
      </Card>
    </div>
  );
}
