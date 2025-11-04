import type { VehicleData, Intersection } from './types.ts';

export class GraphRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private padding: number = 70;

  constructor(canvasId: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error(`Canvas with id "${canvasId}" not found`);
    }
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context');
    }
    this.ctx = ctx;
  }

  draw(v1Data: VehicleData[], v2Data: VehicleData[], intersection: Intersection | null, milesPerYear: number = 0): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const graphWidth = width - this.padding * 2;
    const graphHeight = height - this.padding * 2;

    this.ctx.clearRect(0, 0, width, height);

    const maxMiles = Math.max(...v1Data.map(d => d.miles));
    const allCosts = [...v1Data.map(d => d.total), ...v2Data.map(d => d.total)];
    const minCost = Math.min(...allCosts);
    const maxCost = Math.max(...allCosts);

    const costRange = maxCost - minCost;
    const paddedMinCost = Math.max(0, minCost - costRange * 0.1);
    const paddedMaxCost = maxCost + costRange * 0.1;

    this.drawAxes(width, height);
    this.drawGrid(width, height, graphWidth, graphHeight, maxMiles, paddedMinCost, paddedMaxCost, milesPerYear);
    this.drawLine(v1Data, maxMiles, paddedMinCost, paddedMaxCost, graphWidth, graphHeight, '#003478');
    this.drawLine(v2Data, maxMiles, paddedMinCost, paddedMaxCost, graphWidth, graphHeight, '#EB0A1E');
    
    if (intersection) {
      this.drawIntersection(intersection, maxMiles, paddedMinCost, paddedMaxCost, graphWidth, graphHeight);
    }

    this.drawLegend(width, height);
  }

  private drawAxes(width: number, height: number): void {
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, this.padding);
    this.ctx.lineTo(this.padding, height - this.padding);
    this.ctx.lineTo(width - this.padding, height - this.padding);
    this.ctx.stroke();
  }

  private drawGrid(
    width: number, 
    height: number, 
    graphWidth: number, 
    graphHeight: number,
    maxMiles: number,
    minCost: number,
    maxCost: number,
    milesPerYear: number = 0
  ): void {
    this.ctx.strokeStyle = '#e0e0e0';
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = '#666';
    this.ctx.font = '12px Arial';

    this.ctx.textAlign = 'right';
    const ySteps = 6;
    for (let i = 0; i <= ySteps; i++) {
      const y = height - this.padding - (graphHeight / ySteps) * i;
      const value = minCost + ((maxCost - minCost) / ySteps) * i;

      this.ctx.beginPath();
      this.ctx.moveTo(this.padding, y);
      this.ctx.lineTo(width - this.padding, y);
      this.ctx.stroke();

      this.ctx.fillText('$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 }), this.padding - 10, y + 4);
    }

    this.ctx.textAlign = 'center';
    const xSteps = 6;
    
    for (let i = 0; i <= xSteps; i++) {
      const x = this.padding + (graphWidth / xSteps) * i;
      const milesValue = (maxMiles / xSteps) * i;
      
      // Draw miles label
      this.ctx.fillText(
        milesValue.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' mi',
        x,
        height - this.padding + 20
      );
      
      // Draw years label if milesPerYear is provided
      if (milesPerYear > 0) {
        const years = milesValue / milesPerYear;
        this.ctx.fillStyle = '#888';
        this.ctx.font = '11px Arial';
        this.ctx.fillText(
          `(${years.toFixed(1)} yrs)`,
          x,
          height - this.padding + 35
        );
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
      }
    }

    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 14px Arial';
    const xAxisLabel = milesPerYear > 0 ? 'Miles Driven (Years)' : 'Miles Driven';
    this.ctx.fillText(xAxisLabel, width / 2, height - (milesPerYear > 0 ? 5 : 10));

    this.ctx.save();
    this.ctx.translate(15, height / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText('Total Cost ($)', 0, 0);
    this.ctx.restore();
  }

  private drawLine(
    data: VehicleData[],
    maxMiles: number,
    minCost: number,
    maxCost: number,
    graphWidth: number,
    graphHeight: number,
    color: string
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    data.forEach((point, index) => {
      const x = this.padding + (point.miles / maxMiles) * graphWidth;
      const y = this.canvas.height - this.padding - ((point.total - minCost) / (maxCost - minCost)) * graphHeight;

      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });

    this.ctx.stroke();
  }

  private drawIntersection(
    intersection: Intersection,
    maxMiles: number,
    minCost: number,
    maxCost: number,
    graphWidth: number,
    graphHeight: number
  ): void {
    const x = this.padding + (intersection.miles / maxMiles) * graphWidth;
    const y = this.canvas.height - this.padding - ((intersection.cost - minCost) / (maxCost - minCost)) * graphHeight;

    this.ctx.fillStyle = '#4caf50';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 8, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  private drawLegend(width: number, height: number): void {
    const legendX = width - this.padding - 120;
    const legendY = height - this.padding - 50;

    this.ctx.fillStyle = '#003478';
    this.ctx.fillRect(legendX, legendY, 30, 4);
    this.ctx.fillStyle = '#333';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Vehicle 1', legendX + 40, legendY + 4);

    this.ctx.fillStyle = '#EB0A1E';
    this.ctx.fillRect(legendX, legendY + 25, 30, 4);
    this.ctx.fillStyle = '#333';
    this.ctx.fillText('Vehicle 2', legendX + 40, legendY + 29);
  }
}