"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * aa-wia-content.component.ts created on 9/29/16 2:20 PM.
 *
 * @description Provides functionality for showing/hiding content under headers.
 * @author Florian Popa <florian@webgenerals.com>
 */
var core_1 = require('@angular/core');
var AABaseComponent_1 = require("../../lib/classes/AABaseComponent");
var template = require('./template.html');
var contentData = require('./data.json');
var AAWiaContentComponent = (function (_super) {
    __extends(AAWiaContentComponent, _super);
    function AAWiaContentComponent(elementRef) {
        var _this = this;
        _super.call(this, elementRef);
        this.elementRef = elementRef;
        this.productsList = [];
        this.topicsList = contentData;
        /**
         * Active item location by row and column
         */
        this.activeItem = {
            row: null,
            column: null
        };
        this.showFullText = false;
        this.visibility = 'hidden';
        /**
         * Sets the active item by row and column
         *
         * @param row
         * @param column
         */
        this.setActiveItem = function (row, column) {
            _this.setShowFullText(false);
            if (_this.activeItem.row === row && _this.activeItem.column === column) {
                _this.activeItem.row = null;
                _this.activeItem.column = null;
            }
            else {
                _this.activeItem.row = row;
                _this.activeItem.column = column;
            }
        };
        /**
         * Retrieves the active item
         *
         * @returns {Object}
         */
        this.getActiveItem = function () {
            return _this.activeItem;
        };
        this.isFullTextShown = function (description) {
            return _this.showFullText && _this.isDescriptionTextValid(description);
        };
        this.setShowFullText = function (showFullText) {
            _this.showFullText = showFullText;
            if (showFullText) {
                _this.visibility = 'shown';
            }
            else {
                _this.visibility = 'hidden';
            }
        };
        /**
         * Checks if the description has the text property and value
         *
         * @param description
         * @returns {boolean}
         */
        this.isDescriptionTextValid = function (description) {
            if (description.hasOwnProperty('text') && typeof description.text != 'undefined' && description.text != null && description.text.length > 0) {
                return true;
            }
            else {
                return false;
            }
        };
    }
    AAWiaContentComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    AAWiaContentComponent = __decorate([
        core_1.Component({
            selector: 'aa-wia-content',
            providers: [],
            template: template,
            animations: [
                core_1.trigger('shrinkOut', [
                    core_1.state('in', core_1.style({
                        height: '*'
                    })),
                    core_1.transition('void => *', [
                        core_1.style({
                            height: 0
                        }),
                        core_1.animate('150ms 0 ease-out', core_1.style({
                            height: '*'
                        }))
                    ]),
                    core_1.transition('* => void', [
                        core_1.style({
                            height: '*'
                        }),
                        core_1.animate('150ms 0 ease-in', core_1.style({
                            height: 0
                        }))
                    ])
                ])
            ]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AAWiaContentComponent);
    return AAWiaContentComponent;
}(AABaseComponent_1.AABaseComponent));
exports.AAWiaContentComponent = AAWiaContentComponent;
//# sourceMappingURL=aa-wia-content.component.js.map