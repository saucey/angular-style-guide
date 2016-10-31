import { Component, Input, OnChanges } from "@angular/core";

interface BarConfig {
  id: string,
  percentage: number,
  amount?: number,
  meta?: Object
}

interface ColumnConfig {
  id: string,
  bars: Array<BarConfig>
}

interface GraphData {
  suppressAmountLabels?: boolean,
  columns: ColumnConfig[]
}

@Component({
  selector: 'wia-calculator-graph',
  template: require('./template.html')
})
export class WiaCalculatorGraphComponent implements OnChanges {
  @Input() data: GraphData;

  public trackById(index, item) {

    return item.id;
  }

  ngOnChanges(changes) {}

  public sumHeights(bars: Array<BarConfig>): number {

    return bars.reduce((sum, bar) => sum + bar.percentage, 0)
  }
}
