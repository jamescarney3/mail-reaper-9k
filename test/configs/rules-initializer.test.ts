import { expect } from 'chai';
import { stub } from 'sinon';

import { importRules } from '~/configs/rules-initializer';


describe('rules initializer config module', () => {
  describe('importRules', () => {
    let spreadsheetAppStub: any;

    beforeEach(() => {
      // NB: defining this here and then having to stub it sucks; should find
      // out if there's a better way to handle this or if it's a natural
      // issue with testing complex globals
      global.SpreadsheetApp = {
        openById: (id: string) => ({
          getSheetByName: (name: string) => ({
            getDataRange: () => ({ getValues: (): Array<Array<string>> => [[]] }),
          }),
        }),
      } as any;

      spreadsheetAppStub = stub(SpreadsheetApp);
    });

    afterEach(() => {
      spreadsheetAppStub.openById.restore();
      delete global.SpreadsheetApp;
    });

    it('returns an array of Rule instances from data module', () => {
      const rules = importRules();

      rules.forEach((rule) => {
        expect(rule.source).to.be.a('string');
        expect(rule.sender).to.be.a('string');
        expect(rule.subject).to.be.a('string');
      });
    });

    it('returns an array of Rule instances from a Sheets doc', () => {
      // NB: see comment above, annoying to have to do this
      spreadsheetAppStub.openById.returns({
        getSheetByName: (name: string) => ({
          getDataRange: () => ({
            getValues: (): Array<Array<string>> => [
              ['source', 'sender', 'subject', 'space delimited', 'dash-delimited', 'under_delimited', 'Capitalized header'],
              ['example source 1', 'example1@sender.com', 'Example Subject 1!'],
              ['example source 2', 'example2@sender.com', 'Example Subject 2!'],
            ],
          }),
        }),
      });

      const rules = importRules('some-sheets-doc-id-1234');

      rules.forEach((rule) => {
        expect(rule.source).to.be.a('string');
        expect(rule.sender).to.be.a('string');
        expect(rule.subject).to.be.a('string');
      });
    });
  });
});
