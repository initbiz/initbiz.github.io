# Cumulus Announcements -  Announce (notify) users in your Cumulus Core based system 
![Cumulus Announcements banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusannouncements/assets/images/cumulus-announcements-banner.png)

## Introduction

This plugin extends functionality of [Cumulus Core plugin](https://octobercms.com/plugin/initbiz-cumuluscore).

Using this plugin you can send announcements (and e-mails) to users in your Cumulus Core based application.

Announcements are notifications for users, so it is a great way to inform our users about:
* new features in our system,
* sales in application,
* new regulations (ave GDPR :) ),
* just new messages to our users, based on their clusters and plans as well :)

You can specify if you want to send the announcement to:
1. all users,
1. only to selected ones,
1. only to those in selected clusters
1. only to those in selected plans

This way the announcement will be displayed only to users that are in group that you specified.

[//]: # (Documentation)

In component `UserAnnouncements` all of user's announcements (personal, his or her cluster's, his or her clusters' plans) will be displayed. See screenshots for better understanding.

You can also send e-mail to every one of those groups. You do not have to publish announcements in their frontend space. Of course it is possible to both send an e-mail and publish the announcement in their frontend.

> Remember to uncheck `Send e-mail` switch while updating announcement if you do not want to send another email to users.

The plugin is fully translatable, right now there are only English and Polish translation available.

User will be notified in his or her frontend after login to your system.

## Components
There is a component named `UnreadAnnouncements` that injects all of unread announcements for user with Bootstrap modal styling and small bell icon which shows number of unread messages.

Second component renders list of all `UserAnnouncements`.

Third component `AnnouncementDetails` is meant to be embedded on page that shows one announcement. If user visits page with this component, the message is **automatically** marked as read by him or her. He or she can also delete the message here.

Being unread, read or deleted is state - relation between announcement and user. So deleting announcement by user does not actually delete the message. Just hides the message for the user.

## Future plans
1. Add automatic announcements (on events?)
1. Mark as read button working AJAXly
1. Integrate with push notifications