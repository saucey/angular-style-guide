import { CalculatorProductsService } from '../aa-wia-calculator-products.service';

describe('CalculatorProductService', () => {

  let productService: CalculatorProductsService;

  beforeEach(() => {
    productService = new CalculatorProductsService();

    productService.setProductConfigurations([
      ['1', '2', '3'],
      ['1', '2', '4'],
      ['1', '5']
    ]);
  });

  describe('getProductsConfigurations', () => {

    it('is defined', () => {
      expect(productService.getProductsConfigurations).toBeDefined();
    });

    it('gives correct results for given array with strings', () => {
      expect(productService.getProductsConfigurations([
        ['1', '2', '3']
      ])).toEqual(
        [
          ['1', '2', '3']
        ]
      );
    });

    it('gives correct results for given array with an array', () => {
      expect(productService.getProductsConfigurations([
        ['1', ['2', '3']]
      ])).toEqual(
        [
          ['1', '2'],
          ['1', '3']
        ]
      );
    });

    it('gives correct results for for given array with arrays', () => {
      expect(productService.getProductsConfigurations([
        ['1', ['2', '3'], ['4', '5', '6'], '7']
      ])).toEqual(
        [
          ['1', '2', '4', '7'],
          ['1', '2', '5', '7'],
          ['1', '2', '6', '7'],
          ['1', '3', '4', '7'],
          ['1', '3', '5', '7'],
          ['1', '3', '6', '7']
        ]
      );
    });


    it('gives correct results for given array with arrays only', () => {
      expect(productService.getProductsConfigurations([
        [['1', '2']]
      ])).toEqual(
        [
          ['1'],
          ['2']
        ]
      );
    });

  });

  describe('getAvailableProducts', () => {

    it('is defined', () => {
      expect(productService.getAvailableProducts).toBeDefined();
    });

    it('gives all products when there is nothing already selected', () => {

      expect(productService.getAvailableProducts([])).toEqual(['1', '2', '3', '4', '5']);
    });

    it('gives only available for one selected', () => {

      // If we selected product "3" we can only select products 1,2 (1st set)
      // we cannot select product "4", because there is no combination in which 3 and 4 are together
      expect(productService.getAvailableProducts(['3'])).toEqual(['1', '2', '3']);
    });

    it('gives only available for one selected, which is in mutiple combinations', () => {

      expect(productService.getAvailableProducts(['1'])).toEqual(['1', '2', '3', '4', '5']);
    });

    it('gives only available for multiple selected', () => {

      expect(productService.getAvailableProducts(['1', '3'])).toEqual(['1', '2', '3']);
    });
  })
});
