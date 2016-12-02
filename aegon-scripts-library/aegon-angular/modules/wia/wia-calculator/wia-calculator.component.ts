import { Component, Input, ElementRef, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { AABaseComponent } from "../../../lib/classes/AABaseComponent";
import { CalculatorDataService } from "./wia-calculator-data.service";
import { defaultOptions } from "./defaultOptions";
import { WiaPagePersonalizationService } from "../wia-page/wia-page.personalization.service";
import { WIAInputModel } from "../wia-page/models/wia-input.model";
import { WiaSubscriptionService } from "../wia-page/wia-page.subscription.service";
import { WiaUrlStateManager } from "../wia-page/wia-page.url-state.service";
import { WiaInputUseCaseEnum } from "../wia-content/enums/wia-input-use-case.enum";
import { WIATealiumService } from "../wia-page/wia-tealium.service";

@Component({
  selector: 'aa-wia-calculator',
  template: require('./template.html'),
  providers: [WiaPagePersonalizationService, WiaUrlStateManager, WiaSubscriptionService]
})
export class WiaCalculatorComponent extends AABaseComponent implements OnInit, AfterViewInit {
  @Input() options: any = {};
  @Input() data: any = {};

  public simulationData: any = {};

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

  public externalInput: WIAInputModel;
  public error = null;

  public graphData: any = null;

  //default values as placeholder until real data is loaded
  public legendData = {
    1: true,
    2: true,
    3: true
  };

  private lastInput: WIAInputModel = null;

  constructor(thisElement: ElementRef,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaSubscriptionService: WiaSubscriptionService,
              private wiaUrlStateManager: WiaUrlStateManager,
              private calculatorDataService: CalculatorDataService,
              private wiaTealiumService: WIATealiumService) {

    super(thisElement);

    wiaSubscriptionService.externalInput$.subscribe(
      value => this.updateModel(value),
      err => {
        this.error = {
          type: err.type,
          details: err
        }
      });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {

  }

  public updateModel(value: WIAInputModel) {

    window.scrollTo(0, 0);

    if (!value) {
      this.externalInput = null;
      return;
    }

    this.error = null;
    this.externalInput = value;

    this
      .wiaTealiumService
      .wiaToolResultPresented();

    //Update local model with received input
    if (typeof value.disability !== 'undefined') {
      this.disability.value = value.disability;
    }
    if (typeof value.usage !== 'undefined') {
      this.usage.value = value.usage;
    }
    if (typeof value.permDisability !== 'undefined') {
      this.permanentDisability = value.permDisability;
    }

    const currentInput = this.getCurrentInput();


    this.calculatorDataService.getScenario(currentInput).then(scenario => {

      this.simulationData = scenario;
      this.refresh(currentInput);
    }).catch(err => {
      this.error = {
        type: 'response',
        details: err
      };
    });

  }

  public getCurrentInput(): WIAInputModel {

    const input: WIAInputModel = {
      income: this.externalInput.income,
      useCase: WiaInputUseCaseEnum.USER,
      permDisability: null,
      usage: null,
      disability: Math.round(this.disability.value / 5) * 5,
      products: this.externalInput.products,
      productsIds: this.externalInput.productsIds
    };

    if (input.disability >= 80) {

      input.permDisability = this.permanentDisability;
    }

    if (input.disability < 80) {

      input.usage = Math.round(this.usage.value / 5) * 5;
    }

    return input;
  }

  public update() {

    const currentInput = this.getCurrentInput();

    // no changes, ignore update
    if (this.lastInput && this.lastInput.usage === currentInput.usage
      && this.lastInput.disability === currentInput.disability
      && this.lastInput.permDisability === currentInput.permDisability) {
      return;
    }

    this.lastInput = currentInput;

    this.calculatorDataService.getScenario(currentInput).then(data => {
      this.simulationData = data;
      this.refresh(currentInput);
    });
  }

  public refresh(currentInput: WIAInputModel) {

    const code = this.wiaPagePersonalizationService.inputToCode(currentInput);
    this.wiaUrlStateManager.setUrlCode(code);

    // prevent crash in case data couldn't be found
    if (this.simulationData && this.simulationData.graphData) {

      const {graphData, legendData} = this.simulationData;

      this.graphData = [
        {
          columns: [graphData[1], graphData[2]]
        },
        {
          columns: [graphData[3]]
        },
        {
          columns: [graphData[4]]
        }
      ];

      this.legendData = {
        1: legendData.includes(1),
        2: legendData.includes(2),
        3: legendData.includes(3)
      };
    }
  }

  public sliderUpdate(slider, val) {

    if (slider.value !== val) {

      slider.value = val;

      this.update();
    }
  }

  public updatePermDisability(): void {
    this.permanentDisability = !this.permanentDisability;
    this.update();
  }

  public getActiveTab(): string {
    if (this.disability.value < 35) {
      return '1';
    } else if (this.disability.value >= 35 && this.disability.value < 80) {
      return '2';
    } else {
      return '3';
    }
  }

  public goBack() {
    this.wiaSubscriptionService.emit(null);
  }

  public trackById(index, item) {

    return item.id;
  }
}
