# Newsletter - Send newsletter e-mails to subscribers (GDPR ready)
![Newsletter banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/newsletter/assets/images/newsletter-banner.png)

## Introduction

The plugin helps with sending newsletter.

The basic use case is as follows:
1. Visitor on page sees a subscribe-to-our-newsletter form
1. Enters his/her e-mail address and ticks checkbox that he/she agree with
1. He/she receives message to confirm the e-mail address
1. From now on, admin can send an e-mail to him/her
1. If visitor do not like the newsletter he/she can unsubscribe using link in included in every message

What is more:
* Admin can manage checkboxes rendered with form so that there are required and optional checkboxes:
  * Required have to be checked by visitor (in most cases this will be accepting regulations or policies),
  * Optional do not have to be checked. Using optional checkboxes we can give subscribers choice what type of messages they want to recieve (our offer, news or just message categories).
* Visitor can manage the message categories visiting manage newsletter page (and seeing optional checkboxes)
* Admin can specify if he/she wants to send the message to all users, or just those who accepted the particular optional checkbox
* Admin can save message without sending it

> **The plugin makes you GDPR ready and is fully translatable (see Documentation).**

[//]: # (Documentation)

### Usage
1. Create page for managing newsletter options by subscribers so that it has `:email` and `:token` variables (for example `manage-newsletter` with `/manage-newsletter/:email/:token` URL). Of course those variables can be changed.
1. Embed component `NewsletterConfirm` on exact one CMS page (Newsletter plugin will automatically look for page that has the component and cache it for 10 minutes)
1. Go to backend Newsletter -> Checkboxes and add checkboxes as your business requires
1. Embed component `NewsletterForm` on page that you want to have form rendered on (landing page or just footer partial)

> Do not forget to configure e-mail sending in your backend settings

### Translations
Plugin supports translations for all elements (there is no hardcoded frontend contents) including AJAX responses and displayed errors.

Out of the box there are only two languages:
* pl - Polski
* en - English

But of course you can prepare your own translations.

### E-mail templates
Out of the box there are two e-mail templates you can to customize:

* `inibiz.newsletter::mail.subscription` which is sent to those who want to became a subscriber
* `initbiz.newsletter::mail.message` which is sent to subscribers

In `subscription` e-mail template you can use `{{activationLink}}` variable.

In `message` e-mail template you can use:
* `{{title}}` - Title of message
* `{{content}}` - Content of message
* `{{ newsletterLink }}` - link for subscribers to sign out from newsletter

If you want, you can create your own e-mail template. While sending you just have to choose which one you want to use. The `message` e-mail template is just default one.