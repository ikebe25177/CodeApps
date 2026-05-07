import { useState, useMemo } from 'react';
import { assets as initialAssets } from '@/data/assets';
import AssetCard from '@/components/AssetCard';
import AssetDetail from '@/components/AssetDetail';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Asset } from '@/types/asset';
import { Cpu, Bell } from 'lucide-react';
import { owners } from '@/data/owners';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Index = () => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Asset['status'] | 'all'>('all');

  // Calculate counts for each status
  const statusCounts = useMemo(() => {
    const counts = {
      all: assets.length,
      'in-use': 0,
      'in-repair': 0,
      'available': 0
    };
    
    assets.forEach(asset => {
      counts[asset.status] += 1;
    });
    
    return counts;
  }, [assets]);

  // Update asset status
  const updateAssetStatus = (assetId: string, newStatus: Asset['status']) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, status: newStatus } 
          : asset
      )
    );
  };

  // Assign owner to asset
  const assignOwnerToAsset = (assetId: string, ownerId: string) => {
    // Find the owner from the owners data
    const owner = owners.find((owner) => owner.id === ownerId);
    
    if (owner) {
      setAssets(prevAssets => 
        prevAssets.map(asset => 
          asset.id === assetId 
            ? { ...asset, owner } 
            : asset
        )
      );
    }
  };

  // Filter assets based on search query and status filter
  const filteredAssets = useMemo(() => {
    return assets
      .filter(asset => {
        // Filter by search query (name or type)
        const matchesSearch = 
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.type.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filter by status
        const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Sort by status: 'available', 'in-repair', 'in-use'
        const statusOrder = {
          'available': 1,
          'in-repair': 2,
          'in-use': 3
        };
        
        return statusOrder[a.status] - statusOrder[b.status];
      });
  }, [searchQuery, statusFilter, assets]);

  // If the selected asset is not in filtered results, select the first one
  useMemo(() => {
    if (filteredAssets.length > 0 && !filteredAssets.some(asset => asset.id === selectedAssetId)) {
      setSelectedAssetId(filteredAssets[0].id);
    }
  }, [filteredAssets, selectedAssetId]);

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

  return (
    <div className="min-h-screen bg-white">
      <div className="py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
              <Cpu className="h-8 w-8" /> Woodgrove Technologies
            </h1>
            <div className="flex items-center space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" className="rounded-md bg-white">
                      <Bell className="h-8 w-8 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Card className="px-4 py-2 flex items-center space-x-3 shadow-sm rounded-lg border-0 hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer">
                <div className="text-right mr-2">
                  <p className="font-medium">Alex Johnson</p>
                  <p className="text-sm text-gray-500">IT Administrator</p>
                </div>
                <Avatar className="h-10 w-10 ring-2 ring-gray-200">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000" alt="Alex Johnson" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Unified card containing all components */}
        <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden">
          {/* Asset Tracker Header */}
          <div className="p-4 border-b bg-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-bold text-green-800 mb-4 md:mb-0">Asset Tracker</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className="text-sm h-9 bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 border-green-200"
                >
                  All ({statusCounts.all})
                </Button>
                <Button
                  variant={statusFilter === 'in-use' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('in-use')}
                  className="text-sm h-9 bg-gray-100 text-gray-800 hover:bg-gray-200 hover:text-gray-900 border-gray-200"
                >
                  In Use ({statusCounts['in-use']})
                </Button>
                <Button
                  variant={statusFilter === 'in-repair' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('in-repair')}
                  className="text-sm h-9 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 border-yellow-200"
                >
                  In Repair ({statusCounts['in-repair']})
                </Button>
                <Button
                  variant={statusFilter === 'available' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('available')}
                  className="text-sm h-9 bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900 border-green-200"
                >
                  Available ({statusCounts['available']})
                </Button>
              </div>
            </div>
          </div>
          
          {/* Content area with search, asset cards and details */}
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="space-y-3">
                  {/* Search Input */}
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-green-200 focus-visible:ring-green-500"
                  />
                </div>
                
                {/* Asset Cards */}
                <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset) => (
                      <AssetCard
                        key={asset.id}
                        asset={asset}
                        isSelected={asset.id === selectedAssetId}
                        onClick={() => setSelectedAssetId(asset.id)}
                      />
                    ))
                  ) : (
                    <div className="text-center p-4 border rounded-md bg-white/80">
                      <p className="text-gray-500">No assets match your search criteria</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2">
                {selectedAsset && (
                  <AssetDetail 
                    asset={selectedAsset} 
                    onStatusUpdate={(newStatus) => updateAssetStatus(selectedAsset.id, newStatus)}
                    onAssignOwner={(assetId, ownerId) => assignOwnerToAsset(assetId, ownerId)}
                    className="bg-white backdrop-blur-sm rounded-xl border border-gray-100" 
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
