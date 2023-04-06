import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { createDigest, addDigestReportEntry, generateTemplate, sendDigestEmail } from '~/resources/digest';
import { Reports } from '~/types';


const digestResourceSandbox = createSandbox();
const createTemplateFromFileStub = digestResourceSandbox.stub();
const sendEmailStub = digestResourceSandbox.stub();


describe('digest resource module', () => {
  beforeEach(() => {
    global.HtmlService = {
      createTemplateFromFile: createTemplateFromFileStub,
    } as unknown as GoogleAppsScript.HTML.HtmlService;

    global.MailApp = {
      sendEmail: sendEmailStub,
    } as unknown as GoogleAppsScript.Mail.MailApp;
  });

  afterEach(() => {
    digestResourceSandbox.restore();
  });

  describe('createDigest', () => {
    it('returns an empty array', () => {
      const digest = createDigest();

      expect(digest).to.be.an('array').that.is.empty;
    });
  });

  describe('addDigestReportEntry', () => {
    it('adds a Reports.Entry instance to a digest array', () => {
      const exampleDigest = [] as unknown as Array<Reports.Entry>;
      const exampleReportEntry = {} as unknown as Reports.Entry;

      addDigestReportEntry(exampleDigest, exampleReportEntry);

      expect(exampleDigest.slice(-1)[0]).to.equal(exampleReportEntry);
    });
  });

  describe('generateTemplate', () => {
    it('returns a Gmail template instance', () => {
      createTemplateFromFileStub.returns({
        fullDate: '',
        reportEntries: [],
      });
      const digest = [{ foo: 'bar' }] as unknown as Array<Reports.Entry>;

      const template = generateTemplate(digest);

      expect(createTemplateFromFileStub.called).to.be.true;
      expect(template.reportEntries).to.equal(digest);
    });
  });

  describe('sendDigestEmail', () => {
    it('sends a digest email', () => {
      const templateContent = 'html-string';
      const template = {
        evaluate: () => ({
          getContent: () => templateContent,
        }),
      } as unknown as GoogleAppsScript.HTML.HtmlTemplate;

      sendDigestEmail(template);

      expect(sendEmailStub.calledOnce).to.be.true;
      expect(sendEmailStub.firstCall.firstArg.htmlBody).to.equal(templateContent);
    });
  });
});
