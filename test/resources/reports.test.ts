import { expect } from 'chai';
import { stub } from 'sinon';

import { createReportEntry, logReportEntry } from '~/resources/reports';
import { GmailThread, Reports, Rule, Sheet } from '~/types';


describe('reports resource', () => {
  describe('createReportEntry', () => {
    it('returns a Reports.Entry instance', () => {
      const thread = {
        getMessages: () => [{ getFrom: () => 'example@email.com' }],
        getFirstMessageSubject: () => 'example subject',
        getLastMessageDate: () => new Date(),
        getPermalink: () => 'www.exampleurl.com',
        getId: () => '42069',
      } as unknown as GmailThread;

      const rule: Rule = {
        source: 'example source',
        sender: 'example@email.com',
        subject: 'example subject',
        label: 'example label',
        markRead: true,
      };

      const reportEntry = createReportEntry(thread, rule);

      expect(reportEntry.source).to.equal(rule.source);
      expect(reportEntry.sender).to.equal(rule.sender);
      expect(reportEntry.senderMatch).to.equal(thread.getMessages().slice(-1)[0].getFrom());
      expect(reportEntry.subject).to.equal(rule.subject);
      expect(reportEntry.subjectMatch).to.equal(thread.getFirstMessageSubject());
      expect(reportEntry.label).to.equal(rule.label);
      expect(reportEntry.markRead).to.equal(rule.markRead);
      expect(reportEntry.received).to.equal(thread.getLastMessageDate().toString());
      expect(reportEntry.archived).is.a.string;
      expect(reportEntry.permalink).to.equal(thread.getPermalink());
      expect(reportEntry.id).to.equal(thread.getId());
    });
  });

  describe('logReportEntry', () => {
    it('appends a line to a sheet instance', () => {
      const appendRowStub = stub();
      const fakeSheet = { appendRow: appendRowStub } as unknown as Sheet;
      const fakeEntry = {} as unknown as Reports.Entry;

      logReportEntry(fakeSheet, fakeEntry);

      expect(appendRowStub.called);
    });
  });
});
