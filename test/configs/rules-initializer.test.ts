import { expect } from 'chai';
import { stub } from 'sinon';

import { importRules } from '~/configs/rules-initializer';


describe('rules initializer config module', () => {
  describe('importRules', () => {
    it('returns an array of Rule instances when spreadhseet ID env var is unset', () => {
      const rules = importRules();

      rules.forEach((rule) => {
        expect(rule.source).to.be.a('string');
        expect(rule.sender).to.be.a('string');
        expect(rule.subject).to.be.a('string');
      });
    });
  });
});
