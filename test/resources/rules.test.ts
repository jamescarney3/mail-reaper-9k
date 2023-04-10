import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { matchToRule, isDigest } from '~/resources/rules';
import * as rulesInitializer from '~/configs/rules-initializer';
import * as constantsInitializer from '~/configs/constants-initializer';


describe('rules resource module', () => {
  describe('matchToRule', () => {
    const matchToRuleSandbox = createSandbox();

    afterEach(() => {
      matchToRuleSandbox.restore();
    });

    it('finds a rule with exactly matching sender and subject', () => {
      const sender = 'example1@sender.com';
      const subject = 'Example Subject 1!';

      const exampleRule = {
        source: 'example source',
        sender: 'example1@sender.com',
        subject: 'Example Subject 1!',
      };

      matchToRuleSandbox.stub(rulesInitializer, 'rules').value([exampleRule]);

      const ruleMatch = matchToRule(sender, subject);
      expect(ruleMatch).to.exist;
      expect(ruleMatch.source).to.equal('example source');
    });

    it('finds a rule that with matching sender and subject substrings', () => {
      const sender = 'example1@sender.com';
      const subject = 'Example Subject 1!';

      const exampleRule = {
        source: 'example source',
        sender: '@sender.com',
        subject: 'Example',
      };

      matchToRuleSandbox.stub(rulesInitializer, 'rules').value([exampleRule]);

      const ruleMatch = matchToRule(sender, subject);
      expect(ruleMatch).to.exist;
      expect(ruleMatch.source).to.equal('example source');
    });

    it('finds a rule that matches sender without a subject', () => {
      const sender = 'example1@sender.com';
      const subject = 'Example Subject 1!';

      const matchingExampleRule = {
        source: 'matching example source',
        sender: 'example1@sender.com',
      };

      matchToRuleSandbox.stub(rulesInitializer, 'rules').value([matchingExampleRule]);

      const ruleMatch = matchToRule(sender, subject);
      expect(ruleMatch).to.exist;
      expect(ruleMatch.source).to.equal('matching example source');
    });
  });

  describe('isDigest', () => {
    const isDigestSandbox = createSandbox();

    beforeEach(() => {
      isDigestSandbox.stub(constantsInitializer, 'USER_EMAIL').value('user@example.com');
      isDigestSandbox.stub(constantsInitializer, 'DIGEST_EMAIL_SUBJECT_PREFIX').value('example prefix for subject');
    });

    afterEach(() => {
      isDigestSandbox.restore();
    });

    it('correctly identifies digest threads', () => {
      const matchingDigestSender = constantsInitializer.USER_EMAIL;
      const nonMatchingDigestSender = 'foo@bar.com';
      const matchingSubject = constantsInitializer.DIGEST_EMAIL_SUBJECT_PREFIX;
      const nonMatchingSubject = 'subject without the right prefix';

      expect(isDigest(matchingDigestSender, matchingSubject)).to.be.true;
      expect(isDigest(nonMatchingDigestSender, matchingSubject)).to.be.false;
      expect(isDigest(matchingDigestSender, nonMatchingSubject)).to.be.false;
      expect(isDigest(nonMatchingDigestSender, nonMatchingSubject)).to.be.false;
    });
  });
});
