import type { Vehicle, VehicleData, Intersection, VehicleSummary } from './types.ts';

export class VehicleCalculator {
  static calculateTotalCost(vehicle: Vehicle, miles: number): number {
    const fuelCost = (miles / vehicle.mpg) * vehicle.gasPrice;
    return vehicle.cost + fuelCost;
  }

  static calculateFuelCost(vehicle: Vehicle, miles: number): number {
    const gallons = miles / vehicle.mpg;
    return gallons * vehicle.gasPrice;
  }

  static calculateCostPerMile(vehicle: Vehicle, miles: number): number {
    const totalCost = this.calculateTotalCost(vehicle, miles);
    return totalCost / miles;
  }

  static generateDataPoints(vehicle: Vehicle, maxMiles: number, interval: number = 500): VehicleData[] {
    const data: VehicleData[] = [];
    for (let miles = 0; miles <= maxMiles; miles += interval) {
      data.push({
        miles,
        total: this.calculateTotalCost(vehicle, miles)
      });
    }
    return data;
  }

  static findIntersection(v1: Vehicle, v2: Vehicle, maxMiles: number): Intersection | null {
    const fuelCostPerMile1 = v1.gasPrice / v1.mpg;
    const fuelCostPerMile2 = v2.gasPrice / v2.mpg;

    if (Math.abs(fuelCostPerMile1 - fuelCostPerMile2) < 0.0001) {
      return null;
    }

    const miles = (v2.cost - v1.cost) / (fuelCostPerMile1 - fuelCostPerMile2);

    if (miles > 0 && miles <= maxMiles) {
      const cost = v1.cost + (miles / v1.mpg) * v1.gasPrice;
      return { miles, cost };
    }

    return null;
  }

  static getSummary(vehicle: Vehicle, miles: number): VehicleSummary {
    const totalFuelCost = this.calculateFuelCost(vehicle, miles);
    const totalCost = vehicle.cost + totalFuelCost;
    const costPerMile = totalCost / miles;

    return {
      vehicleCost: vehicle.cost,
      totalFuelCost,
      costPerMile,
      totalCost
    };
  }
}