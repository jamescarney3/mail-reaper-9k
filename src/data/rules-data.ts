import { Rule } from '~/types';


// specify rules here if you would prefer not to do so in a Google Sheets
// document - with the caveat that any changes to the ruleset will require
// a subsequent build and push to GAS in order to take effect

// individual rules take the shape of the Rule type defined elsewhere in
// the project; the source, sender, and subject properties are required
// and the label and markRead (defaults to true) properties are optional

// refer to the comment block below for examples of rule formatting

const rules: Array<Rule> = [
  /*
  {
    source: 'Human Recognizable Name, Inc.',
    sender: 'regexforsender@humanrecognizable.org',
    subject: 'example subject pattern',
    label: 'Some Category/Human Recognizable',
  }, {
    source: 'Some Newsletter',
    sender: 'somecooltopic@newsletters.com',
    subject: 'weekly newsletter subject pattern',
    label: 'Newsletters',
    markRead: false,
  }, {
    source: 'Limited Time Offers',
    sender: 'marketing@somestore.com',
    subject: '50% off today only',
  },
  */
];


export default rules;
