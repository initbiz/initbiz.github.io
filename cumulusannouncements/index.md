# Cumulus Announcements -  Announce (notify) users in your Cumulus Core based system 
![Cumulus Announcements banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusannouncements/assets/images/cumulus-announcements-banner.png)

## Introduction

This plugin extends the functionality of [Cumulus Core plugin](https://octobercms.com/plugin/initbiz-cumuluscore).

Using this plugin you can send announcements (and e-mails) to users in your Cumulus Core based application.

Announcements are notifications for users, so it is a great way to inform our users about:
* New features in our system,
* Sales in the application,
* New regulations (ave GDPR :) ),
* Just new messages to our users, based on their clusters and plans as well :)

You can specify if you want to send the announcement to:
1. all users,
1. only to selected ones,
1. only to those in selected clusters
1. only to those in selected plans

This way the announcement will be displayed only to users that are in the group you specified.

[//]: # (Documentation)

In the `UserAnnouncements` component, all of the user's announcements (personal, his or her cluster's, his or her clusters' plans) will be displayed. See screenshots for better understanding.

You can also send e-mail to every one of those groups. You do not have to publish announcements in their frontend space. Of course, it is possible to both send an e-mail and publish the announcement in their frontend.

> Remember to uncheck the `Send e-mail` switch while updating the announcement if you do not want to send another email to users.

The plugin is fully translatable, right now there are only English and Polish translations available.

User will be notified in his or her frontend after login to your system.

## Components
There is a component named `UnreadAnnouncements` that injects all of the unread announcements for the user with Bootstrap modal styling and small bell icon which shows the number of unread messages.

The second component renders a list of all `UserAnnouncements`.

The third component `AnnouncementDetails` is meant to be embedded on a page that shows one announcement. If the user visits the page with this component, the message is **automatically** marked as read by him or her. He or she can also delete the message here.

Being unread, read or deleted is state - relation between announcement and user. So deleting the announcement by the user does not actually delete the message. It just hides the message for the user.

## Future plans
1. Add automatic announcements (on events?)
1. Mark the "as read" button working AJAXly
1. Integrate with push notifications
