// Mock data for Custom API connector examples
// This file demonstrates the data structure expected from custom API connectors
// Replace this mock data with real custom connector calls in your implementation

export interface Asset {
  // Unique identifier for the asset
  id: number;
  // Name of the asset
  name: string;
  // Category/type of the asset
  type: string;
  // Current status of the asset
  status: string;
}

// Mock assets for API responses - matches the Power Platform custom connector structure
export const mockAssets: Asset[] = [
  {
    id: 1,
    name: "Dell Laptop XPS 13",
    type: "Electronics",
    status: "Available"
  },
  {
    id: 2,
    name: "Conference Room Projector",
    type: "Electronics",
    status: "In Use"
  },
  {
    id: 3,
    name: "Standing Desk",
    type: "Furniture",
    status: "Available"
  },
  {
    id: 4,
    name: "Wireless Mouse",
    type: "Electronics",
    status: "Available"
  },
  {
    id: 5,
    name: "Office Chair",
    type: "Furniture",
    status: "In Use"
  },
  {
    id: 6,
    name: "Monitor 24 inch",
    type: "Electronics",
    status: "Maintenance"
  },
  {
    id: 7,
    name: "Desk Lamp",
    type: "Furniture",
    status: "Available"
  },
  {
    id: 8,
    name: "Bluetooth Headphones",
    type: "Electronics",
    status: "Available"
  },
  {
    id: 9,
    name: "Whiteboard",
    type: "Office Supplies",
    status: "In Use"
  },
  {
    id: 10,
    name: "Printer",
    type: "Electronics",
    status: "Maintenance"
  }
];