import { EMAIL_TEMPLATE_LOCATION, DIGEST_EMAIL_SUBJECT_PREFIX, USER_EMAIL } from '~/configs/constants-initializer';
import { Reports, Template } from '~/types';


// helper method for date strings
const getFullDate = (): string => {
  const date = new Date();
  const day: number = date.getDate();
  const month: number = date.getMonth() + 1;
  const year: number = date.getFullYear();
  return `${year}-${month}-${day}`;
};

// even though this just returns a typed array, better to abstract it
// here and let the main script ignore anything about digest implementation
// besides how to call the methods it imports
export const createDigest = (): Array<Reports.Entry> => {
  return [];
};

// arguably not ideal practice to mutate arrays, but the digest list is
// essentially intended as a data store; in a different runtime it might
// be a redux or mobx store
export const addDigestReportEntry = (digest: Array<Reports.Entry>, reportEntry: Reports.Entry): void => {
  digest.push(reportEntry);
};

// initialize and return a digest email instance with date and digest entry data
export const generateTemplate = (reportEntries: Array<Reports.Entry>): Template => {
  const template = HtmlService.createTemplateFromFile(EMAIL_TEMPLATE_LOCATION);
  template.fullDate = getFullDate();
  template.reportEntries = reportEntries;

  return template;
};

// send the digest email
export const sendDigestEmail = (template: Template): void => {
  MailApp.sendEmail({
    to: USER_EMAIL,
    subject: `${DIGEST_EMAIL_SUBJECT_PREFIX} - ${getFullDate()}`,
    htmlBody: template.evaluate().getContent(),
  });
};
