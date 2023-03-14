import { expect } from 'chai';
import { stub } from 'sinon';


import { getAllThreadIds } from '../../src/resources/inbox';

(global as any).Gmail = {
  Users: {
    Threads: {
      // match this signature to its type from @types/google-apps-script
      list: (): { threads: Array<{ id: string }>, nextPageToken?: string } => (
        { threads: [{ id: 'foo' }], nextPageToken: null }
      ),
    },
  }
};

describe('inbox module', () => {
  describe('getAllThreadIds', () => {
    // TODO: figure out a way to type this better
    let gmailStub: any;

    beforeEach(() => {
      gmailStub = stub(Gmail.Users.Threads);
      // behavior for result smaller than the service's page size limit
      gmailStub.list.returns({
        threads: [
          { id: 'foo' },
          { id: 'bar' },
        ],
        nextPageToken: null,
      });
    });

    afterEach(() => {
      gmailStub.list.restore();
    });

    it('returns an array of id strings', () => {
      const ids = getAllThreadIds();
      expect(ids).to.have.members(['foo', 'bar']);
    });

    it('returns an array of id strings when threads list is longer than service page limit', () => {
      gmailStub.list.onFirstCall().returns({
        threads: [
          { id: 'baz' },
          { id: 'qux' },
        ],
        nextPageToken: 'somepagetoken',
      });

      const ids = getAllThreadIds();
      expect(ids).to.have.members(['foo', 'bar', 'baz', 'qux']);
    });
  });
});
