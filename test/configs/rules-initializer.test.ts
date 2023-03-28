import { expect } from 'chai';
import { stub, createSandbox } from 'sinon';

// NB: need to define this here because it needs to exist in the global scope
// before the rules-initializer module loads; this is related to the anti-
// pattern discussed in that module's comments and is one of the aspects that
// could magically become nicer if the application were to transition more
// fully to functional patterns
global.SpreadsheetApp = {
  openById: (id: string) => ({
    getSheetByName: (name: string) => ({
      getDataRange: () => ({ getValues: (): Array<Array<string>> => [[]] }),
    }),
  }),
} as any;

import { _getRules, rules } from '~/configs/rules-initializer';
import * as rulesData from '~/data/rules-data';
import * as constants from '~/configs/constants-initializer';


describe('rules initializer config module', () => {
  describe('getRules initializer', () => {
    const rulesSandbox = createSandbox();

    afterEach(() => {
      rulesSandbox.restore();
    });

    it('returns an array of Rule instances from a data module', () => {
      rulesSandbox.replace(constants, 'RULES_SOURCE', 'data module');
      rulesSandbox.replace(rulesData, 'default', [
        {
          source: 'Human Recognizable Name, Inc.',
          sender: 'regexforsender@humanrecognizable.org',
          subject: 'example subject pattern',
          label: 'Some Category/Human Recognizable',
        }, {
          source: 'Some Newsletter',
          sender: 'somecooltopic@newsletters.com',
          subject: 'weekly newsletter subject pattern',
          label: 'Newsletters',
          markRead: false,
        }, {
          source: 'Limited Time Offers',
          sender: 'marketing@somestore.com',
          subject: '50% off today only',
        },
      ]);

      _getRules('data module').forEach((rule) => {
        expect(rule.source).to.be.a('string');
        expect(rule.sender).to.be.a('string');
        expect(rule.subject).to.be.a('string');
      });
    });

    it('returns an array of Rule instances from a Sheets document', () => {
      rulesSandbox.replace(constants, 'RULES_SOURCE', 'sheets doc');
      rulesSandbox.stub(global.SpreadsheetApp, 'openById').returns({
        getSheetByName: (name: string) => ({
          getDataRange: () => ({
            getValues: (): Array<Array<string>> => [
              ['source', 'sender', 'subject', 'camelCased','space space', 'underscore_sep', 'hyphen-sep'],
              ['Limited Time Offers','marketing@somestore.com','50% off today only']
            ],
          }),
        }),
      } as any);

      _getRules('sheets doc').forEach((rule) => {
        expect(rule.source).to.be.a('string');
        expect(rule.sender).to.be.a('string');
        expect(rule.subject).to.be.a('string');
      });
    });

    // NB: this is probably overkill since the RULES_SOURCE constant is typed
    // as a union of possible values, but if anyone manages to outsmart the
    // compiler at least this will fail
    it('throws an error when RULES_SOURCE constant is invalid', () => {
      rulesSandbox.replace(constants, 'RULES_SOURCE', 'invalid value' as any);

      expect(_getRules).to.throw();
    });
  });
});
