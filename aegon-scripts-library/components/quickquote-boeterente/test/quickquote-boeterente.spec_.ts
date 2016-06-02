import {QuickQuoteBoeterenteComponent} from '../quickquote-boeterente.component';

import {it, inject, describe, beforeEach, expect, beforeEachProviders} from 'angular2/testing';

describe('QuickQuoteBoeterenteComponent', () => {

	/*
	 * 
	 */
	 it('should return the difference in years between two date strings', inject([QuickQuoteBoeterenteComponent], (boeterente:QuickQuoteBoeterenteComponent) => {
		 expect(boeterente.dateDiff('2015-01-24', '2016-04-22', 'years')).toMatchPattern(/[1]/);
	 }))
});