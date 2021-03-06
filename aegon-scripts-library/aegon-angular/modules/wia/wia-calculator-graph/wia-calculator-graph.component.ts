import { Component, Input, OnChanges } from "@angular/core";

import { clone } from "../../../../aegon-angular/lib/util";

interface BarConfig {
  id: string,
  percentage: number
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

  ngOnChanges(changes) {

    changes.data.currentValue.columns.forEach(column => {
      const bars = clone(column.bars);
      const mergedBars = [];

      bars.forEach(bar => {
        const existing = mergedBars.find(el => el.category === bar.category);
        if (existing) {
          existing.amountMonthly += bar.amountMonthly;
          existing.amountYearly += bar.amountYearly;
          existing.percentage += bar.percentage;
        } else {
          mergedBars.push(bar);
        }
      });

      bars.forEach(bar => {
        bar.percentage = bar.percentage ? Math.max(bar.percentage, 10) : 0; //Minimal percentage value is 10 to ensure correct UI
      });

      column.bars = mergedBars;
    });
  }

  public sumHeights(bars: Array<BarConfig>): number {

    const height = bars.reduce((sum, bar) => sum + bar.percentage, 0);

    return Math.min(height, 100);
  }
}
