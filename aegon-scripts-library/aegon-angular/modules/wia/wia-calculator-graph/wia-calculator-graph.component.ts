import { Component, Input, OnChanges } from "@angular/core";

interface BarConfig {
  percentage: number,
  hint?: string
}

interface ColumnConfig {
  percentage?: number,
  amount?: number,
  bars?: Array<BarConfig>
}

interface GraphConfig {
  col1: ColumnConfig,
  col2: ColumnConfig,
  col3: ColumnConfig,
  col4: ColumnConfig,
  col34: ColumnConfig
}

@Component({
  selector: 'aa-wia-calculator-graph',
  template: require('./template.html')
})
export class WiaCalculatorGraph implements OnChanges {
  @Input() data: GraphConfig;

  public trackByBar(index, item) {

    return item.id;
  }


  // merge two first elements in two last columns if they are the same type and have the same value
  ngOnChanges(changes) {

    const col3 = changes.data.currentValue.col3;
    const col4 = changes.data.currentValue.col4;
    const col34 = changes.data.currentValue.col34;

    const firstCol3Item = col3.bars.filter(bar => bar.percentage > 0).slice(-1)[0];
    const firstCol4Item = col4.bars.filter(bar => bar.percentage > 0).slice(-1)[0];

    if (firstCol3Item && firstCol4Item && firstCol3Item.id === firstCol4Item.id && firstCol3Item.percentage === firstCol4Item.percentage) {
      col3.bars = col3.bars.filter(el => el.id !== firstCol3Item.id);
      col4.bars = col4.bars.filter(el => el.id !== firstCol4Item.id);

      col34.bars = [firstCol3Item];

    } else {
      col34.bars = [
        {
          percentage: 0,
          id: 'GOV_01', //@FIXME must be dynamic, needed for animation
          meta: {}
        }
      ]
    }

  }

  public sumHeights(bars: Array<BarConfig>): number {

    return bars.reduce((sum, bar) => sum + bar.percentage, 0)
  }
}
