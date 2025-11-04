import './style.css';
import { VehicleCalculator } from './calculator.ts';
import { GraphRenderer } from './graph.ts';
import { UIController } from './ui.ts';

class App {
  private ui: UIController;
  private graph: GraphRenderer;

  constructor() {
    this.ui = new UIController();
    this.graph = new GraphRenderer('graphCanvas');
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    const button = document.querySelector('button');
    if (button) {
      button.addEventListener('click', () => this.calculate());
    }
  }

  calculate(): void {
    const v1 = this.ui.getVehicle1();
    const v2 = this.ui.getVehicle2();
    const milesDriven = this.ui.getMilesDriven();
    const milesPerYear = this.ui.getMilesPerYear();

    const v1Summary = VehicleCalculator.getSummary(v1, milesDriven);
    const v2Summary = VehicleCalculator.getSummary(v2, milesDriven);

    const v1Data = VehicleCalculator.generateDataPoints(v1, milesDriven);
    const v2Data = VehicleCalculator.generateDataPoints(v2, milesDriven);

    const intersection = VehicleCalculator.findIntersection(v1, v2, milesDriven);

    this.ui.showResults();
    this.ui.displayIntersection(intersection, v1Summary.totalCost, v2Summary.totalCost, milesPerYear);
    this.ui.displaySummary(1, v1Summary);
    this.ui.displaySummary(2, v2Summary);
    this.graph.draw(v1Data, v2Data, intersection, milesPerYear);
  }

  init(): void {
    this.calculate();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});