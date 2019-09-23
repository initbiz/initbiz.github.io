# Cumulus Announcements -  Announce (notify) users in your Cumulus Core based system 
![Cumulus Announcements banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusannouncements/assets/images/cumulus-announcements-banner.png)

## Introduction

This plugin extends the functionality of [Cumulus Core plugin](https://octobercms.com/plugin/initbiz-cumuluscore).

Using this plugin you can send announcements (notifications) and e-mails to users in your Cumulus Core based application.

[//]: # (Documentation)

## Announcements

You can specify if you want to send the announcement to:
1. all users,
1. only to selected ones,
1. only to those in selected clusters
1. only to those in selected plans

You can specify if you want to send an e-mail or publish the announcement. You can send e-mail, publish them in the system or both.

> Remember that sent e-mails cannot be unsent. If you have sent e-mails and want to update the announcement then remember that if you do not uncheck the `Send e-mail` switch, the e-mail will be sent again.

### Note for developers

From the developer's point of view, announcements are always dedicated to a group of users and with those users, the relation in DB will be stored. Remember though that this is not `users()` relation to get users that the announcement was dedicated for. In DB we are storing relations with users, clusters and plans to properly render the views in backend and to keep it clean. While saving the announcement `users_to_announce()` relation will be filled with the users and the information if they have marked the announcement as read or deleted.

## Announcers

Announcers are rules that define automatic announcements. Plugins register their own announcer types, for example, Cumulus Core registers `New user registers` announcer type, while Cumulus Subscriptions registers `Subscription expires` announcer.

More Announcer types will be added on request or our demand, do not hesitate to ask for more.

## Upgrade v.1 -> v.2

The `announcementRepository` was removed. The methods from there were mostly moved to the `Announcement` model:

* `getPublished` -> `Announcement::published()->get()`
* `getAllUsersUnreadAnnouncements` -> `Announcement::unreadByUser($user)->get()`
* `markAnnouncementRead` -> `$announcement->markAsReadBy($user)`
* `markAnnouncementDeleted` -> `$announcement->markAsDeletedBy($user)`

There were also added a few very handy methods to the model so check it out to find more cool stuff.

The `announcementManager` trait was removed.

The `UnreadAnnouncements` component was removed. Right now `UserAnnouncements` injects unread announcements as well.