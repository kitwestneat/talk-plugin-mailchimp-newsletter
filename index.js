const debug = require('debug')('talk:plugin:mailchimp-newsletter');
const Mailchimp = require('mailchimp-api-v3')

function subUser(email_address) {
  if (!mailchimp) {
    console.warn('Mailchimp plugin requires TALK_MAILCHIMP_API_KEY and TALK_MAILCHIMP_LIST_ID env parameters');
  }

  // 'subscribed' (single opt-in) or 'pending' (double opt-in)
  let status = process.env.TALK_MAILCHIMP_USER_STATUS || 'pending';

  debug(`adding ${email_address} with status ${status}`);

  return mailchimp.post(`/lists/${process.env.TALK_MAILCHIMP_LIST_ID}/members`, {
    email_address,
    status,
  });
}

let mailchimp;

if (!process.env.TALK_MAILCHIMP_API_KEY || !process.env.TALK_MAILCHIMP_LIST_ID) {
  console.warn('Mailchimp plugin requires TALK_MAILCHIMP_API_KEY and TALK_MAILCHIMP_LIST_ID env parameters');
} else {
  mailchimp = new Mailchimp(process.env.TALK_MAILCHIMP_API_KEY);
}

module.exports = {
  connect(connectors) {
    const { graph: { subscriptions: { getBroker } } } = connectors;

    // Get the handle for the broker.
    const broker = getBroker();

    // The passed in method will fire for every user that is created.
    broker.on('userCreated', user => {
      if (user.profiles.length == 0) {
        debug(`cannot determine email address for user: ` + JSON.stringify(user));
        return;
      }

      if (user.profiles.length > 1) {
        debug(`new user has more than one user profile: ` + JSON.stringify(user));
      }

      let { id, provider, metadata } = user.profiles[0];
      let email;
      if (provider == 'local') {
        email = id;
      } else if (metadata && metadata.email) {
        email = metadata.email;
      } else {
        debug(`cannot determine email address for user: ` + JSON.stringify(user));
        return;
      }

      await subUser(email).catch(debug);

      debug(`added ${email} to newsletter`);
    });
  },
};
