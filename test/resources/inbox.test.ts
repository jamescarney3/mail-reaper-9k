import { expect } from 'chai';
import { createSandbox, SinonSandbox } from 'sinon';

import { ensureLabel } from '~/resources/inbox';


describe('inbox resource', () => {
  describe('ensureLabel', () => {
    let ensureLabelSandbox: SinonSandbox;

    beforeEach(() => {
      ensureLabelSandbox = createSandbox();

      global.GmailApp = {
        getUserLabelByName: () => ({}),
        createLabel: () => ({}),
      } as unknown as GoogleAppsScript.Gmail.GmailApp; // cast to any and only stub relevant methods
    });

    afterEach(() => {
      ensureLabelSandbox.restore();
    });

    it('returns a label instance if one exists with a given name', () => {
      ensureLabelSandbox.stub(GmailApp, 'getUserLabelByName').callsFake((name: string) => {
        if (name === 'foo') return ({
          getName: () => ('foo'),
        } as unknown as GoogleAppsScript.Gmail.GmailLabel);
        return null
      });

      const label = ensureLabel('foo');
      expect(label.getName()).to.equal('foo');
    });

    it('creates a new label if one does not exist with a given name', () => {
      ensureLabelSandbox.stub(GmailApp, 'getUserLabelByName').returns(null);
      ensureLabelSandbox.stub(GmailApp, 'createLabel').callsFake((name: string) => ({
        getName: () => (name),
      } as unknown as GoogleAppsScript.Gmail.GmailLabel));

      const label = ensureLabel('bar');
      expect(label.getName()).to.equal('bar');
    });
  });
});
