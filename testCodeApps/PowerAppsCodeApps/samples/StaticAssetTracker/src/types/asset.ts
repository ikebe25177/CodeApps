export interface Owner {
  id: string;
  name: string;
  image: string;
  title: string;
  email: string;
  phone: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  status: 'in-use' | 'in-repair' | 'available';
  purchaseDate: string;
  value: number;
  owner?: Owner;
  description: string;
  deviceId: string;
  image: string;
  brand: string;
  model: string;
  serialNumber: string;
}
