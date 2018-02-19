const events = require('services/events');
const { USERS_NEW } = require('services/events/constants');
const debug = require('debug')('talk:plugin:mailchimp-newsletter');
const Mailchimp = require('mailchimp-api-v3')

if (!process.env.TALK_MAILCHIMP_API_KEY || !process.env.TALK_MAILCHIMP_LIST_ID)
  throw new Error('Mailchimp plugin requires TALK_MAILCHIMP_API_KEY and TALK_MAILCHIMP_LIST_ID env parameters');

const mailchimp = new Mailchimp(process.env.TALK_MAILCHIMP_API_KEY);

function subUser(email_address) {
  // 'subscribed' (single opt-in) or 'pending' (double opt-in)
  let status = process.env.TALK_MAILCHIMP_USER_STATUS || 'pending';

  mailchimp.post(`/lists/${process.env.TALK_MAILCHIMP_LIST_ID}/members`, {
    email_address,
    status,
  });
}

events.on(USERS_NEW, async user => {
  debug(`got new user event: ` + JSON.stringify(user));
});
