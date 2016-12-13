import { Component, Input, ElementRef, OnInit, AfterViewInit } from "@angular/core";
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

  //state flag indicating dragging in progress to highlight certain elements at that time
  public sliderDragInProgress: boolean = false;
  public sliderDragInProgressTimeout: number;

  public permanentDisability: boolean = false;
  public disability = {
    value: 50,
    help: 'TBD',
    label: 'Arbeidsongeschiktheidspercentage',
    options: {
      start: 50,
      step: 5,
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
      step: 5,
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

  constructor(private elementRef: ElementRef,
              private wiaPagePersonalizationService: WiaPagePersonalizationService,
              private wiaSubscriptionService: WiaSubscriptionService,
              private wiaUrlStateManager: WiaUrlStateManager,
              private calculatorDataService: CalculatorDataService,
              private wiaTealiumService: WIATealiumService) {

    super(elementRef);

    wiaSubscriptionService.externalInput$.subscribe(
      value => {
        this.updateModel(value);
      },
      err => {
        this.error = {
          type: err.type,
          details: err
        };

        console.error(this.error);
      });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {

  }

  public updateModel(value: WIAInputModel) {

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

      console.error(this.error);
    });

  }

  public getCurrentInput(): WIAInputModel {

    const input: WIAInputModel = {
      income: this.externalInput.income,
      useCase: WiaInputUseCaseEnum.USER,
      permDisability: null,
      usage: null,
      disability: this.roundToFives(this.disability.value),
      products: this.externalInput.products,
      productsIds: this.externalInput.productsIds
    };

    if (input.disability >= 80) {

      input.permDisability = this.permanentDisability;
    }

    if (input.disability < 80) {

      input.usage = this.roundToFives(this.usage.value);
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
        1: legendData.indexOf(1) > -1,
        2: legendData.indexOf(2) > -1,
        3: legendData.indexOf(3) > -1
      };
    }
  }

  public sliderUpdate(slider, val) {

    if (slider.value !== val) {

      slider.value = val;

      this.update();

      this.sliderDragInProgress = true;

      clearTimeout(this.sliderDragInProgressTimeout);

      this.sliderDragInProgressTimeout = setTimeout(() => {
        this.sliderDragInProgress = false;
      }, 500);
    }
  }

  public updatePermDisability(): void {
    this.permanentDisability = !this.permanentDisability;
    this.update();
  }

  public getActiveTab(): string {
    if (this.roundToFives(this.disability.value) < 35) {
      return '1';
    } else if (this.roundToFives(this.disability.value) >= 35 && this.roundToFives(this.disability.value) < 80) {
      return '2';
    } else {
      return '3';
    }
  }

  public getPeriodTitles() {

    const titles = [
      'vanaf 3e jaar tot max 5e jaar',
      'tot uw pensioenleeftijd'
    ];

    if (!this.externalInput) {
      return titles;
    }

    if (this.roundToFives(this.disability.value) < 35) {

      if (this.externalInput.productsIds.indexOf('WIA_BODEM') > -1) {
        titles[0] = 'vanaf 3e jaar tot het 10.5e jaar';
      } else if (this.externalInput.productsIds.indexOf('WIA_35MIN') > -1) {

        let value = this.externalInput.products.find(el => el.id === 'WIA_35MIN').attrs[0].value;
        if (value === 5) {
          titles[0] = 'vanaf 3e jaar tot het 8e jaar';
        } else if (value === 10) {
          titles[0] = 'vanaf 3e jaar tot het 13e jaar';
        }
      } else {
        titles[1] = 'tot uw pensioenleeftijd krijgt u geen uitkering';
      }
    }

    return titles;
  }

  public getLastPeriodTooltip() {

    if (this.roundToFives(this.disability.value) >= 80) {

      if (this.permanentDisability) {
        return 'Tot uw pensioenleeftijd krijgt u een IVAuitkering van de overheid'
      } else {
        return 'Tot uw pensioenleeftijd krijgt u de WGAloonaanvulling';
      }
    }

    return `Tot uw pensioenleeftijd krijgt u in principe de WGA-loonaanvulling. Benut u echter minder dan 50%
    van uw verdiencapaciteit dan verandert deze in een WGA-vervolguitkering gebaseerd op het
    minimumloon. Samen met het loon dat u nog verdient, is dit uw inkomen. Hoe meer u werkt, hoe
    hoger uw totale inkomen is.`;
  }

  public isColumnVisible(column: number) {

    if (column === 3) {
      //hide third column when disability<35% and no WIA35 OR BODEM products
      if (this.roundToFives(this.disability.value) < 35 && this.externalInput.productsIds.indexOf('WIA_35MIN') === -1
        && this.externalInput.productsIds.indexOf('WIA_BODEM') === -1) {
        return false;
      }

      if (this.roundToFives(this.disability.value) >= 80 && this.permanentDisability) {
        return false;
      }
    }

    return true;
  }

  private roundToFives(value: number) {
    return Math.round(value / 5) * 5;
  }

  public goBack() {
    this.wiaSubscriptionService.emit(null, true);
  }

  public trackById(index, item) {

    return item.id;
  }
}
