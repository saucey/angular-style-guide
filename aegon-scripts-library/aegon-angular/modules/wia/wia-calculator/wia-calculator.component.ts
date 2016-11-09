import { Component, Input, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core";

import { AABaseComponent } from "../../../lib/classes/AABaseComponent";

import { CalculatorDataService } from "./wia-calculator-data.service";
import { defaultOptions } from "./defaultOptions";
import { WiaPagePersonalizationService } from "../wia-page/wia-page.personalization.service";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";
import { WiaUrlStateManager } from "../wia-page/wia-page.url-state.service";
import { WiaInputUseCaseEnum } from "../wia-content/enums/wia-input-use-case.enum";
import { AATabsViewComponent } from "../../../components/aa-tabs-view/aa-tabs-view.component";

@Component({
  selector: 'aa-wia-calculator',
  template: require('./template.html'),
  providers: [CalculatorDataService, WiaPagePersonalizationService, WiaUrlStateManager, WiaSubscriptionService]
})
export class WiaCalculatorComponent extends AABaseComponent implements OnInit, AfterViewInit {
  @Input() options: any = {};
  @Input() data: any = {};

  @ViewChild(AATabsViewComponent) tabsView : AATabsViewComponent;

  public defaultOptions: any = defaultOptions;
  //visible tooltip id
  public showTooltip: number = 0;

  public permanentDisability: boolean = false;
  public disability = {
    value: 50,
    help: 'TBD',
    label: 'Arbeidsongeschiktheidspercentage',
    options: {
      start: 50,
      step: 1,
      range: {
        min: 0,
        max: 100
      },
      ranges: [
        {
          start: 0,
          end: 34.7,
          color: '#FFFFFF'
        }, {
          start: 34.7,
          end: 35.3,
          color: 'transparent'
        }, {
          start: 35.3,
          end: 79.7,
          color: '#FFFFFF'
        }, {
          start: 79.7,
          end: 80.3,
          color: 'transparent'
        }, {
          start: 80.3,
          end: 100,
          color: '#FFFFFF'
        }
      ],
      labels: [
        {
          value: 0,
          label: '0%'
        },
        {
          value: 35,
          label: '35%'
        },
        {
          value: 80,
          label: '80%'
        },
        {
          value: 100,
          label: '100%'
        }
      ]
    }
  };
  public usage = {
    value: 50,
    help: 'TBD',
    label: 'Benutting restverdiencapaciteit',
    options: {
      start: 50,
      step: 1,
      range: {
        min: 0,
        max: 100
      },
      ranges: [
        {
          start: 0,
          end: 49.3,
          color: '#FFFFFF'
        }, {
          start: 49.3,
          end: 50.7,
          color: 'transparent'
        }, {
          start: 50.7,
          end: 100,
          color: '#FFFFFF'
        }
      ],
      labels: [
        {
          value: 0,
          label: '0%'
        },
        {
          value: 50,
          label: '50%'
        },
        {
          value: 100,
          label: '100%'
        }
      ]
    }
  };

  public externalInput : WIAInputModel;

  public graphData : any[] = [];
  public legendData;

  // Ids for tabs view component
  public tabs = {
    first: 'first',
    second: 'second',
    third: 'third'
  };

  // Centers of disability ranges to be set after switching tabs
  public disabilityCenters = {
    first: 20,
    second: 55,
    third: 90
  };

  constructor(thisElement: ElementRef,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaSubscriptionService: WiaSubscriptionService,
              private wiaUrlStateManager: WiaUrlStateManager,
              private calculatorDataService: CalculatorDataService) {

    super(thisElement);

    wiaSubscriptionService.externalInput$.subscribe(value => this.updateModel(value));
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {

    this.tabsView.onTabChange(() => {
      if (this.getActiveTab() !== this.tabsView.active) {
        this.disability.value = this.disabilityCenters[this.tabs[this.tabsView.active]];
      }
    });
  }

  public updateModel(value: WIAInputModel) {

    if (!value) {
      this.externalInput = null;
      return;
    }

    this.externalInput = value;

    //@TODO extend it instead of using ifs
    if (typeof value.disability !== 'undefined') {
      this.disability.value = value.disability;
    }

    if (typeof value.usage !== 'undefined') {
      this.usage.value = value.usage;
    }

    if (typeof value.permDisability !== 'undefined') {
      this.permanentDisability = value.permDisability;
    }

    this.update();
  }

  public getCurrentInput(): WIAInputModel {

    const input : WIAInputModel = {
      income: this.externalInput.income,
      useCase: WiaInputUseCaseEnum.USER,
      disability: Math.round(this.disability.value / 10) * 10,
      products: this.externalInput.products,
      productsIds: this.externalInput.productsIds
    };

    if (this.disability.value >= 80) {

      input.permDisability = this.permanentDisability;
    }

    if (this.disability.value < 80) {

      input.usage = Math.round(this.usage.value / 10) * 10
    }

    return input;
  }

  public update() {

    const currentInput = this.getCurrentInput();

    const code = this.wiaPagePersonalizationService.inputToCode(currentInput);
    this.wiaUrlStateManager.setUrlCode(code);

    this.calculatorDataService.getData(currentInput).subscribe(data => {

      // prevent crash in case data couldn't be found
      if (data) {

        const {graphData, legendData} = data;

        this.graphData = [
          {
            suppressAmountLabels: true,
            amountAnnual: graphData[0].amount,
            amountMonthly: graphData[0].amount / 12,
            columns: [graphData[0], graphData[1]]
          },
          {
            amountAnnual: graphData[2].amount,
            amountMonthly: graphData[2].amount / 12,
            columns: [graphData[2]]
          },
          {
            amountAnnual: graphData[3].amount,
            amountMonthly: graphData[3].amount / 12,
            columns: [graphData[3]]
          }
        ];

        this.legendData = legendData;
      }
    })
  }

  public sliderUpdate(slider, val) {

    if (slider.value !== val) {

      slider.value = val;

      if (this.tabsView) {
        this.tabsView.setActiveById(this.getActiveTab());
      }

      this.update();
    }
  }

  public updatePermDisability(): void {
    this.permanentDisability = !this.permanentDisability;
    this.update();
  }
  
  public getActiveTab(): string {
    if (this.disability.value < 35) {
      return this.tabs.first;
    } else if (this.disability.value >= 35 && this.disability.value < 80) {
      return this.tabs.second;
    } else {
      return this.tabs.third;
    }
  }

  public goBack () {
    this.wiaSubscriptionService.emit(null);
  }

  public trackById(index, item) {

    return item.id;
  }
}
