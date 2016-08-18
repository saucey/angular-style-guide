import {Component, ElementRef, ViewChild, AfterViewInit, OnInit} from 'angular2/core';
import {AAConfigComponent} from './AAConfigComponent';

export class AATemplateComponent extends AAConfigComponent implements OnInit {
  public data : any = {};

  ngOnInit(): void {
    super.ngOnInit();
    this.data = this.options;
    console.log('template init', this.data);
  }
}
