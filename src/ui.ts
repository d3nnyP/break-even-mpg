import type { Vehicle, VehicleSummary, Intersection } from './types.ts';

export class UIController {
  private getInputValue(id: string): number {
    const element = document.getElementById(id) as HTMLInputElement;
    return parseFloat(element.value) || 0;
  }

  getVehicle1(): Vehicle {
    return {
      cost: this.getInputValue('vehicleCost1'),
      mpg: this.getInputValue('fuelEconomy1') || 1,
      gasPrice: this.getInputValue('gasCost1')
    };
  }

  getVehicle2(): Vehicle {
    return {
      cost: this.getInputValue('vehicleCost2'),
      mpg: this.getInputValue('fuelEconomy2') || 1,
      gasPrice: this.getInputValue('gasCost2')
    };
  }

  getMilesDriven(): number {
    return this.getInputValue('milesDriven');
  }

  getMilesPerYear(): number {
    return this.getInputValue('milesPerYear') || 15000;
  }

  showResults(): void {
    const resultSection = document.getElementById('resultSection');
    if (resultSection) {
      resultSection.classList.add('show');
    }
  }

  displayIntersection(intersection: Intersection | null, v1Total: number, v2Total: number, milesPerYear: number): void {
    const intersectionDiv = document.getElementById('intersectionInfo');
    if (!intersectionDiv) return;

    // Clear existing content
    intersectionDiv.replaceChildren();

    if (intersection) {
      intersectionDiv.className = 'intersection-info';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'intersection-title';
      titleDiv.textContent = '✨ Break-Even Point Found!';
      intersectionDiv.appendChild(titleDiv);

      const valueDiv = document.createElement('div');
      valueDiv.className = 'intersection-value';
      valueDiv.textContent = `${intersection.miles.toLocaleString('en-US', { maximumFractionDigits: 0 })} miles`;
      intersectionDiv.appendChild(valueDiv);

      const costDiv = document.createElement('div');
      costDiv.style.marginTop = '10px';
      costDiv.style.color = '#555';
      costDiv.textContent = `At $${intersection.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total cost`;
      intersectionDiv.appendChild(costDiv);

      if (milesPerYear > 0) {
        const years = intersection.miles / milesPerYear;
        const yearsDiv = document.createElement('div');
        yearsDiv.style.marginTop = '10px';
        yearsDiv.style.color = '#555';
        yearsDiv.textContent = `That's approximately ${years.toFixed(1)} years at ${milesPerYear.toLocaleString('en-US')} miles per year`;
        intersectionDiv.appendChild(yearsDiv);
      }
    } else {
      intersectionDiv.className = 'intersection-info none';

      const titleDiv = document.createElement('div');
      titleDiv.className = 'intersection-title';
      titleDiv.textContent = 'No Intersection Found';
      intersectionDiv.appendChild(titleDiv);

      const messageDiv = document.createElement('div');
      messageDiv.style.color = '#555';
      messageDiv.style.marginTop = '10px';
      const cheaper = v1Total < v2Total ? 'Vehicle 1' : 'Vehicle 2';
      messageDiv.textContent = `${cheaper} is always cheaper within the mileage range`;
      intersectionDiv.appendChild(messageDiv);
    }
  }

  displaySummary(vehicleNum: 1 | 2, summary: VehicleSummary): void {
    const summaryDiv = document.getElementById(`summary${vehicleNum}`);
    if (!summaryDiv) return;

    // Clear existing content
    summaryDiv.replaceChildren();

    const summaryItems = [
      { label: 'Vehicle Cost:', value: `$${summary.vehicleCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
      { label: 'Total Fuel Cost:', value: `$${summary.totalFuelCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
      { label: 'Cost Per Mile:', value: `$${summary.costPerMile.toFixed(3)}` },
      { label: 'Total Cost:', value: `$${summary.totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}` }
    ];

    summaryItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'summary-item';

      const labelSpan = document.createElement('span');
      labelSpan.className = 'summary-label';
      labelSpan.textContent = item.label;

      const valueSpan = document.createElement('span');
      valueSpan.className = 'summary-value';
      valueSpan.textContent = item.value;

      itemDiv.appendChild(labelSpan);
      itemDiv.appendChild(valueSpan);
      summaryDiv.appendChild(itemDiv);
    });
  }
}