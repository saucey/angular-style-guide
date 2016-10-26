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

  // public subgraph : GraphData = {
  //   columns: [
  //     {
  //       bars: [
  //         {
  //           percentage: 100,
  //           amount: 100,
  //           meta: {
  //             color: 'red'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       bars: [
  //         {
  //           percentage: 100,
  //           amount: 100,
  //           meta: {
  //             color: 'red'
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // };

  // merge two first elements in two last columns if they are the same type and have the same value
  ngOnChanges(changes) {

    console.log('got', changes.data.currentValue);

    // const newData : GraphData  = {
    //   label: 'label',
    //   annualSum: 120000,
    //   monthlySum: 10000,
    //   mergeColumns: false,
    //   columns: [
    //     {
    //       bars: [
    //         {
    //           percentage: 25,
    //           amount: 2500,
    //           meta: {
    //             color: 'red'
    //           }
    //         },
    //         {
    //           percentage: 25,
    //           amount: 2500,
    //           meta: {
    //             color: 'blue'
    //           }
    //         }
    //       ]
    //     },
    //     {
    //       bars: [
    //         {
    //           percentage: 66,
    //           amount: 1234,
    //           meta: {
    //             color: 'yellow'
    //           }
    //         }
    //       ]
    //     }
    //   ]
    // };
    //
    // this.data = newData;

    // const col3 = changes.data.currentValue.col3;
    // const col4 = changes.data.currentValue.col4;
    // const col34 = changes.data.currentValue.col34;
    //
    // const firstCol3Item = col3.bars.filter(bar => bar.percentage > 0).slice(-1)[0];
    // const firstCol4Item = col4.bars.filter(bar => bar.percentage > 0).slice(-1)[0];
    //
    // if (firstCol3Item && firstCol4Item && firstCol3Item.id === firstCol4Item.id && firstCol3Item.percentage === firstCol4Item.percentage) {
    //   col3.bars = col3.bars.filter(el => el.id !== firstCol3Item.id);
    //   col4.bars = col4.bars.filter(el => el.id !== firstCol4Item.id);
    //
    //   col34.bars = [firstCol3Item];
    //
    // } else {
    //   col34.bars = [
    //     {
    //       percentage: 0,
    //       id: 'GOV_01', //@FIXME must be dynamic, needed for animation
    //       meta: {}
    //     }
    //   ]
    // }

  }

  public sumHeights(bars: Array<BarConfig>): number {

    return bars.reduce((sum, bar) => sum + bar.percentage, 0)
  }
}
