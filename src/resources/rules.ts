import { USER_EMAIL, DIGEST_EMAIL_SUBJECT_PREFIX } from '~/configs/constants-initializer';
import { rules } from '~/configs/rules-initializer'
import { Rule } from '~/types';


// prefer positional arguments here in order not to have to deconstruct them
// from an options arg when only 2 values are required
export const matchToRule = (sender: string, subject: string): Rule | undefined => {
  return rules.find((rule) => {
    return sender.includes(rule.sender) && (!rule.subject || subject.includes(rule.subject));
  });
};

export const isDigest = (sender: string, subject: string): boolean => {
  return sender === USER_EMAIL && subject.includes(DIGEST_EMAIL_SUBJECT_PREFIX);
};


export default { matchToRule };
