import { Asset, Owner } from '@/types/asset';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { owners } from '@/data/owners';

interface AssetDetailProps {
  asset: Asset;
  onStatusUpdate: (newStatus: Asset['status']) => void;
  onAssignOwner?: (assetId: string, ownerId: string) => void;
  className?: string;
}

const AssetDetail = ({ asset, onStatusUpdate, onAssignOwner, className }: AssetDetailProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Asset['status']>(asset.status);
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  
  // When asset changes, update the selected status
  useEffect(() => {
    setSelectedStatus(asset.status);
    setHasChanges(false);
  }, [asset.id, asset.status]);

  const handleStatusChange = (newStatus: Asset['status']) => {
    setSelectedStatus(newStatus);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // If changing to in-use and the asset is not already in-use, open the reserve dialog
    if (selectedStatus === 'in-use' && asset.status !== 'in-use') {
      setIsReserveDialogOpen(true);
    } else {
      // Otherwise just update the status
      onStatusUpdate(selectedStatus);
      setHasChanges(false);
    }
  };

  const handleReserve = () => {
    if (selectedOwnerId && onAssignOwner) {
      // First, assign the owner
      onAssignOwner(asset.id, selectedOwnerId);
      
      // Then update the status to 'in-use'
      onStatusUpdate('in-use');
      
      // Close the dialog and reset selection
      setIsReserveDialogOpen(false);
      setSelectedOwnerId('');
      setHasChanges(false);
    }
  };

  return (
    <>
      <Card className={cn("h-full", className)}>
        <CardHeader className="pb-4">
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            <Avatar className="w-32 h-32 ring-2 ring-gray-200">
              <AvatarImage src={asset.image} alt={asset.name} />
              <AvatarFallback>{(asset.name).charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{asset.name}</h2>
              <p className="text-gray-500">{asset.type}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Asset Information</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className={cn(
                    "font-medium py-1 px-2 rounded-md inline-block",
                    asset.status === 'in-use' && 'bg-gray-100 text-gray-800',
                    asset.status === 'in-repair' && 'bg-yellow-100 text-yellow-800',
                    asset.status === 'available' && 'bg-green-100 text-green-800'
                  )}>
                    {asset.status === 'in-use' ? 'In Use' : 
                     asset.status === 'in-repair' ? 'In Repair' : 
                     'Available'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Value</p>
                  <p className="font-medium">${asset.value.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="font-medium">{asset.purchaseDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium">{asset.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium">{asset.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="font-medium">{asset.serialNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Asset ID</p>
                  <p className="font-medium">{asset.deviceId}</p>
                </div>
              </div>
              
              {/* Owner Information Section - Only shown for assets that are in-use */}
              {asset.status === 'in-use' && asset.owner && (
                <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                  <h3 className="text-lg font-semibold mb-3 text-green-800">Owner Information</h3>
                  <div className="flex items-center space-x-4 mb-3">
                    <Avatar className="h-16 w-16 ring-2 ring-green-200">
                      <AvatarImage src={asset.owner.image} alt={asset.owner.name} />
                      <AvatarFallback>{asset.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-lg">{asset.owner.name}</h4>
                      <p className="text-gray-600">{asset.owner.title}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{asset.owner.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{asset.owner.phone}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Status Change Dropdown */}
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Update Status</p>
                  <div className="flex space-x-2">
                    <Select
                      value={selectedStatus}
                      onValueChange={(value: Asset['status']) => handleStatusChange(value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available" className="text-green-700">Available</SelectItem>
                        <SelectItem value="in-repair" className="text-yellow-700">In Repair</SelectItem>
                        <SelectItem value="in-use" className="text-gray-700">In Use</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleSaveChanges}
                      disabled={!hasChanges || selectedStatus === asset.status}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reserve Dialog */}
      <Dialog open={isReserveDialogOpen} onOpenChange={setIsReserveDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reserve {asset.name}</DialogTitle>
            <DialogDescription>
              Select an owner to assign this device to.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedOwnerId}
              onValueChange={setSelectedOwnerId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an owner" />
              </SelectTrigger>
              <SelectContent>
                {owners.map((owner) => (
                  <SelectItem 
                    key={owner.id} 
                    value={owner.id}
                    className="flex items-center space-x-2"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={owner.image} alt={owner.name} />
                        <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{owner.name} - {owner.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsReserveDialogOpen(false);
                setSelectedStatus(asset.status); // Reset to original status if cancelled
                setHasChanges(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReserve}
              disabled={!selectedOwnerId}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Confirm Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssetDetail;
