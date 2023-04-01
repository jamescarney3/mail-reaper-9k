import { expect } from 'chai';
import { stub, SinonStub, SinonStubbedInstance } from 'sinon';

import { listThreadIds, getThread, getThreadMetadata, updateThread } from '~/resources/threads';
import { GmailThread, GmailLabel } from '~/types';


describe('threads resource module', () => {
  let gmailAppStub: SinonStubbedInstance<GoogleAppsScript.Gmail.GmailApp>;
  let gmailThreadsStub: SinonStubbedInstance<GoogleAppsScript.Gmail.Collection.Users.ThreadsCollection>;

  beforeEach(() => {
    global.GmailApp = {
      getThreadById: () => ({} as GmailThread),
    } as unknown as GoogleAppsScript.Gmail.GmailApp;

    global.Gmail = {
      Users: {
        Threads: {
          // match this signature to its type from @types/google-apps-script
          list: (): { threads: Array<{ id: string }>, nextPageToken?: string } => (
            { threads: [{ id: 'foo' }], nextPageToken: null }
          ),
        },
      },
    } as unknown as GoogleAppsScript.Gmail;

    gmailAppStub = stub(GmailApp);
    gmailThreadsStub = stub(Gmail.Users.Threads);

    gmailAppStub.getThreadById.returns({
      getFirstMessageSubject: () => 'sample subject',
      getMessages: () => [
        { getFrom: () => 'sample sender' }
      ] as unknown as Array<GoogleAppsScript.Gmail.GmailMessage>,
    } as unknown as GmailThread);

    gmailThreadsStub.list.returns({
      threads: [{ id: 'foo' }, { id: 'bar' }],
      nextPageToken: null,
    });
  });

  afterEach(() => {
    gmailAppStub.getThreadById.restore();
    delete global.GmailApp;
    delete global.Gmail;
  });

  describe('listThreadIds', () => {
    it('returns an array of id strings', () => {
      const ids = listThreadIds();
      expect(ids).to.have.members(['foo', 'bar']);
    });

    it('returns an array of id strings when threads list is longer than service page limit', () => {
      gmailThreadsStub.list.onFirstCall().returns({
        threads: [
          { id: 'baz' },
          { id: 'qux' },
        ],
        nextPageToken: 'somepagetoken',
      });

      const ids = listThreadIds();
      expect(ids).to.have.members(['foo', 'bar', 'baz', 'qux']);
    });
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

  describe('updateThread', () => {
    let exampleThread: GmailThread;

    beforeEach(() => {
      // cast to GmailThread type in order not to have to implement entire shape
      exampleThread = {
        moveToArchive: stub(),
        addLabel: stub(),
        markRead: stub(),
      } as unknown as GmailThread;
    });

    // no after cleanup hook here since stubs are redeclared every before hook

    it('archives a thread', () => {
      updateThread(exampleThread, {});
      expect((exampleThread.moveToArchive as unknown as SinonStub<[], void>).called).to.be.true;
    });

    it('labels a thread when called with a label option', () => {
      // cast to GmailLabel type, same as above
      const exampleLabel = {} as unknown as GmailLabel;
      updateThread(exampleThread, { label: exampleLabel });
      expect((exampleThread.addLabel as unknown as SinonStub<[GmailLabel], void>).calledWith(exampleLabel)).to.be.true;
    });

    it('marks a thread as when called with markRead option set to true', () => {
      updateThread(exampleThread, { markRead: true });
      expect((exampleThread.markRead as unknown as SinonStub<[], void>).called).to.be.true;
    });
  });
});
