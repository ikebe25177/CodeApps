import { Asset } from '@/types/asset';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onClick: () => void;
}

const AssetCard = ({ asset, isSelected, onClick }: AssetCardProps) => {
  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md hover:bg-green-50 group',
        isSelected 
          ? 'border-green-500 shadow-lg bg-green-100' 
          : 'border-muted-gray/20'
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <Avatar className="ring-1 ring-gray-200">
          <AvatarImage src={asset.image} alt={asset.name} />
          <AvatarFallback className="bg-pastel-blue-light/30 text-soft-green-dark">
            {asset.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium text-green-800">{asset.name}</h3>
          <p className="text-sm text-muted-gray">{asset.type}</p>
          <p className="text-xs text-gray-500">ID: {asset.deviceId}</p>
        </div>
        <div
          className={cn(
            'px-2 py-1 rounded-full text-xs font-semibold',
            asset.status === 'in-use' && 'bg-gray-100/50 text-gray-800',
            asset.status === 'in-repair' && 'bg-yellow-100/50 text-yellow-800',
            asset.status === 'available' && 'bg-green-100/50 text-green-800'
          )}
        >
          {asset.status === 'in-use' ? 'In Use' : 
           asset.status === 'in-repair' ? 'In Repair' : 
           'Available'}
        </div>
      </div>
    </Card>
  );
};

export default AssetCard;
