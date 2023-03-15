import { expect } from 'chai';
import { stub, SinonStub } from 'sinon';

import { getThread, getThreadMetadata } from '../../src/resources/threads';


describe('threads resource module', () => {
  let gmailAppStub: any;

  beforeEach(() => {
    global.GmailApp = {
      getThreadById: (id: string) => {},
    } as any;

    gmailAppStub = stub(GmailApp);

    gmailAppStub.getThreadById.callsFake((id: string) => ({
      getFirstMessageSubject: () => 'sample subject',
      getMessages: () => [{ getFrom: () => 'sample sender' }],
    }));
  });

  afterEach(() => {
    gmailAppStub.getThreadById.restore();
    delete global.GmailApp;
  });

  describe('getThread', () => {
    it('returns a GmailThread instance when passed an id string', () => {
      const thread = getThread('somethreadid123');

      expect(thread.getMessages).to.exist;
      expect(thread.getFirstMessageSubject).to.exist;
    });
  });

  describe('getThreadMetadata', () => {
    it('returns thread metadata when passed a GmailThread instance', () => {
      const thread = gmailAppStub.getThreadById('anotherthreadid456');
      const threadMetadata = getThreadMetadata(thread);

      expect(threadMetadata.sender).to.equal('sample sender');
      expect(threadMetadata.subject).to.equal('sample subject');
    });
  });
});
