# talk-plugin-mailchimp-newsletter

This is a plugin for the Coral Projects' Talk commenting platform. It
subscribes new users to a given mailchimp newsletter, using either single
opt-in or double opt-in.

## Parameters
- TALK_MAILCHIMP_LIST_ID: (required) The API id of the mailing list. The API ID
is different than the frontend ID, and can be found using the mailchimp API
playground:
https://us1.api.mailchimp.com/playground/

- TALK_MAILCHIMP_API_KEY: (required) The API key of the mailchimp account. It
can be found or created in the dashboard under Profile -> Extras -> API keys.

- TALK_MAILCHIMP_USER_STATUS: (optional, defaults to 'pending') Either
'subscribed' or 'pending'. Specifies if users should be added via single or
double opt-in. With the 'pending' (double opt-in) status, the user will receive
a confirmation email before being added to the list. The 'subscribed' users
will be immediately added.
