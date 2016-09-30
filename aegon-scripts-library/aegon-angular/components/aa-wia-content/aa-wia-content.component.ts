/**
 * aa-wia-content.component.ts created on 9/29/16 2:20 PM.
 *
 * @description Provides functionality for showing/hiding content under headers.
 * @author Florian Popa <florian@webgenerals.com>
 */
import { Component, ElementRef, OnInit } from '@angular/core';
import {AABaseComponent} from "../../lib/classes/AABaseComponent";

const template = require('./template.html');

@Component({
  selector: 'aa-wia-content',
  providers: [],
  template: template
})

/**
 * Collapsible content component
 */
export class AAWiaContentComponent extends AABaseComponent implements OnInit {

  public activeRow;

  public showFullText = false;

  public contentList = [
    {
      title: 'Wat krijgt u in deze regeling?',
      iconsList: [
        'https://cdn3.iconfinder.com/data/icons/diagram_v2/PNG/96x96/diagram_v2-10.png',
        'https://cdn3.iconfinder.com/data/icons/diagram_v2/PNG/96x96/diagram_v2-04.png',
        'https://cdn3.iconfinder.com/data/icons/diagram_v2/PNG/96x96/diagram_v2-18.png'
      ],
      descriptionsList: [
        {
          image: 'https://cdn3.iconfinder.com/data/icons/diagram_v2/PNG/96x96/diagram_v2-10.png',
          intro: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eget imperdiet nisl. Vivamus convallis velit nulla. Morbi non odio varius sem porttitor maximus. Praesent egestas ligula ac diam luctus, id congue elit venenatis. Donec maximus quis tellus in tristique. Duis ut enim augue. Phasellus molestie eros eget viverra malesuada. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
          text: ''
        },
        {
          image: 'https://cdn3.iconfinder.com/data/icons/diagram_v2/PNG/96x96/diagram_v2-04.png',
          intro: 'Wilt u precies weten wat deze regeling u biedt? Kijk dan in de polisvoorwaarden. U vindt deze onderaan de pagina onder documenten of vraag de polisvoorwaarden bij ons op.',
          text: `Hieronder ziet u wat uw werkgever voor u geregeld heeft als u arbeidsongeschikt bent. Uw werkgever heeft een:
          WGA-Excedentverzekering U kan langere tijd niet of minder werken. U krijgt daarom een WGA-uitkering van het UWV. Verdiende u voordat u arbeidsongeschikt werd meer dan de loongrens voor de sociale verzekeringen (2016: € 52.766,37)? Dan krijgt u voor het loon boven die loongrens geen uitkering van het UWV. Met de WGA-Excedentverzekering krijgt u dan wel een
  uitkering voor het loon boven die loongrens.
  WGA-Aanvullingsverzekering light
  U kan langere tijd niet of minder werken. Dan komt uw inkomen in gevaar. Het UWV bepaalt hoeveel u nog wél kan
  werken en wat u daarmee nog kan verdienen. Dit noemen we uw ‘restverdiencapaciteit’. De hoogte van uw uitkering
  van het UWV hangt af van deze restverdiencapaciteit. En van wat u verdiende voordat u arbeidsongeschikt werd. Met
  de WGA-Aanvullingsverzekering light krijgt u een uitkering als u volgens het UWV recht heeft op een
  WGA-vervolguitkering.
  WGA-Aanvullingsverzekering
  U kan langere tijd niet of minder werken. Dan komt uw inkomen in gevaar. Het UWV bepaalt hoeveel u nog wél kan
  werken en wat u daarmee nog kan verdienen. Dit noemen we uw ‘restverdiencapaciteit’. De hoogte van uw uitkering
  van het UWV hangt af van deze restverdiencapaciteit. En van wat u verdiende voordat u arbeidsongeschikt werd. Met
  de WGA-Aanvullingsverzekering krijgt u een uitkering als u volgens het UWV minimaal 35% arbeidsongeschikt bent,
  maar niet 80% of meer.
  WIA-35minverzekering
  Bent u langer dan twee jaar arbeidsongeschikt? Dan komt u in de WIA en kan u er in inkomen flink op achteruitgaan.
  Bent u volgens de WIA-beschikking van het UWV minder dan 35% arbeidsongeschikt? Dan krijgt u zelfs helemaal geen
  uitkering. Met de WIA-35minverzekering krijgt u een uitkering als u volgens het UWV minder dan 35%
  arbeidsongeschikt bent.
  Bent u langer dan twee jaar arbeidsongeschikt? Dan komt u in de WIA en kan u er in inkomen flink op achteruitgaan.
  Bent u volgens de WIA-beschikking van het UWV minder dan 35% arbeidsongeschikt? Dan krijgt u zelfs helemaal geen
  uitkering. Met de WIA-Bodemverzekering krijgt u een uitkering als u volgens het UWV 15% of meer arbeidsongeschikt
  bent, maar minder dan 35%`
        },
        {
          image: 'https://cdn3.iconfinder.com/data/icons/diagram_v2/PNG/96x96/diagram_v2-18.png',
          intro: 'Bent u volgens de WIA-beschikking van het UWV minder dan 35% arbeidsongeschikt?'
        }
      ]
    }
  ];

  constructor(private elementRef: ElementRef) {
    super(elementRef);
  }

  /**
   * Sets the currently active row.
   *
   * @param currentRow
   */
  public setActiveRow = (currentRow) => {
    this.setShowFullText(false);
    if (this.activeRow === currentRow) return;
    this.activeRow = currentRow;
  }

  public getActiveRow = () => {
    return this.activeRow;
  }

  public setShowFullText = (showFullText) => {
    this.showFullText = showFullText;
  }

  public isFullTextShown = () => {
    return this.showFullText;
  }

  /**
   * Checks if the description has the text property and value
   *
   * @param description
   * @returns {boolean}
   */
  public isDescriptionTextValid = (description) => {
    if (description.hasOwnProperty('text') && typeof description.text != 'undefined' && description.text != null && description.text.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit():void {
    super.ngOnInit();
  }
}
