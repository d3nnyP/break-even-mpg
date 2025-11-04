export interface Vehicle {
    cost: number;
    mpg: number;
    gasPrice: number;
  }
  
  export interface VehicleData {
    miles: number;
    total: number;
  }
  
  export interface Intersection {
    miles: number;
    cost: number;
  }
  
  export interface VehicleSummary {
    vehicleCost: number;
    totalFuelCost: number;
    costPerMile: number;
    totalCost: number;
  }