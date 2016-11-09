import { Component, Input, OnInit } from "@angular/core";
import { FNOLDataService } from "../shared/services/fnol.data.service";
import { FAQItem } from "../shared/models";

const template = require('./template.html');

@Component({
    selector: 'fnol-faq',
    template: template,
    providers: [FNOLDataService]
})


export class FNOLFAQComponent implements OnInit{

    @Input() id: string;
    @Input() title: string = '';

    faqItems: Array<FAQItem> = [];

    constructor(private fnolDataService: FNOLDataService) {}

    ngOnInit() {

        this.faqItems = this.fnolDataService.getFAQItems(this.id);
    }
}