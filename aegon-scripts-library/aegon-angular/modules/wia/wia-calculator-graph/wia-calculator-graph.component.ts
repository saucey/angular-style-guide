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

      column.bars = mergedBars;
    });
  }

  public sumHeights(bars: Array<BarConfig>): number {

    return bars.reduce((sum, bar) => sum + bar.percentage, 0)
  }
}
