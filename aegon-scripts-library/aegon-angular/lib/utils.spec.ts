import { migrateTemplate } from './util';

describe('migrateTemplate', () => {

  const oldTemplate = `<li *ngFor="#item in items"></li>`;
  const newTemplate = `<li *ngFor="let item in items"></li>`;

  it('transform old syntax to new one', () => {
    expect(migrateTemplate(oldTemplate)).toEqual(newTemplate);
  });

  it('returns the same syntax if it is already new one', () => {
    expect(migrateTemplate(newTemplate)).toEqual(newTemplate);
  });
});
