import { AAPeriodPipe } from './';

describe('AAPeriodPipe', () => {
  
  let pipe: AAPeriodPipe;
  
  beforeEach(() => {
    pipe = new AAPeriodPipe();
  });
  
  it('transform to default response', () => {
    expect(pipe.transform(6, [])).toEqual('1 maand');
  });
  
  it('transform defined number', () => {
    expect(pipe.transform(7, [])).toEqual('1 week');
  });
});
