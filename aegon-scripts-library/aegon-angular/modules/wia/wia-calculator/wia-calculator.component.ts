import { Component, Input, ElementRef, OnInit } from "@angular/core";

import { AABaseComponent } from "../../../lib/classes/AABaseComponent";

import { CalculatorDataService } from "./wia-calculator-data.service";
import { defaultOptions } from "./defaultOptions";
import { WiaPagePersonalizationService } from "../wia-page/wia-page.personalization.service";
import { WIAInputEntity } from "../wia-page/models/wia-input.entity";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";
import { WiaUrlStateManager } from "../wia-page/wia-page.url-state.service";
import { WiaInputUseCaseEnum } from "../wia-page/models/wia-input-use-case.enum";

@Component({
  selector: 'aa-wia-calculator',
  template: require('./template.html'),
  providers: [CalculatorDataService, WiaPagePersonalizationService, WiaUrlStateManager, WiaSubscriptionService]
})
export class WiaCalculatorComponent extends AABaseComponent implements OnInit {
  @Input() options: any = {};
  @Input() data: any = {};

  public defaultOptions: any = defaultOptions;

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
          end: 35,
          color: '#B6D9EF'
        }, {
          start: 35,
          end: 80,
          color: '#85BFE5'
        }, {
          start: 80,
          end: 100,
          color: '#3395D4'
        }
      ],
      labels: [
        {
          value: 0,
          label: '0 %'
        },
        {
          value: 35,
          label: '35'
        },
        {
          value: 80,
          label: '80'
        },
        {
          value: 100,
          label: '100 %'
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
          end: 50,
          color: '#85BFE5'
        }, {
          start: 50,
          end: 100,
          color: '#3395D4'
        }
      ],
      labels: [
        {
          value: 0,
          label: '0 %'
        },
        {
          value: 50,
          label: '50'
        },
        {
          value: 100,
          label: '100 %'
        }
      ]
    }
  };

  public externalInput : WIAInputEntity;

  public graphData : any[] = [];
  public legendData;

  constructor(thisElement: ElementRef,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaSubscriptionService: WiaSubscriptionService,
              private wiaUrlStateManager: WiaUrlStateManager,
              private calculatorDataService: CalculatorDataService) {

    super(thisElement);

    wiaSubscriptionService.subscribe(value => this.updateModel(value));
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public updateModel(value: WIAInputEntity) {

    if (!value) {
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

  public getCurrentInput(): WIAInputEntity {

    const input : WIAInputEntity = {
      income: this.externalInput.income,
      useCase: WiaInputUseCaseEnum.USER,
      disability: Math.round(this.disability.value / 10) * 10,
      products: this.externalInput.products,
      productsIds: this.externalInput.productsIds
    };

    if (this.disability.value >= 80) {

      input.permDisability = this.permanentDisability;
    }

    if (this.disability.value >= 35 && this.disability.value < 80) {

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

        console.log('graphData', graphData);
        console.log('legendData', legendData);

        this.graphData = [
          {
            suppressAmountLabels: true,
            columns: [graphData[0], graphData[1]]
          },
          {
            columns: [graphData[2]]
          },
          {
            subgraph: true,
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
      this.update();
    }
  }

  public updatePermDisability(val) {

    console.log('updatePermDisability', val, this.permanentDisability);

    this.permanentDisability = !this.permanentDisability;
    this.update();
  }

  public trackById(index, item) {

    return item.id;
  }
}
