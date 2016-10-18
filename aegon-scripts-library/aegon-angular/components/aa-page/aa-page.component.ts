/**
 * Page component
 */

// Imports
import {Component, Compiler, Directive, ElementRef, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {AABaseComponent} from "../../lib/classes/AABaseComponent";
import {defaultOptions} from "./defaultOptions";

// Constants
const template = require('./template.html');

@Component({
  selector: 'aa-page',
  template: template
})

export class AAPageComponent extends AABaseComponent implements OnInit {
  public defaultOptions: any = defaultOptions;

  @Input('src')
  @ViewChild('pagePartial', { read: ViewContainerRef })

  protected contentTarget: ViewContainerRef;
  
  constructor(private thisElement: ElementRef, private compiler: Compiler) {
    super(thisElement);
  }

  ngOnInit() {
    var dynamicPartial = this.createPagePartial();
    
    this.compiler.compileModuleAndAllComponentsAsync(dynamicPartial)
      .then((factory: any) => this.contentTarget.createComponent(factory));
    
    super.ngOnInit();
  }

  createPagePartial() {
    @Component({
      selector: 'page-partial',
      templateUrl: 'partials/dip-vpu.html',
    })
    
    class pagePartial {}
    return pagePartial ;
  }
}

@Directive({ selector: '[myHighlight]' })
export class HighlightDirective {
    constructor(el: ElementRef, renderer: Renderer) {
       renderer.setElementStyle(el.nativeElement, 'backgroundColor', 'yellow');
    }
}