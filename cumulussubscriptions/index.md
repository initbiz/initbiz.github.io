# Cumulus Subscriptions - Add subscriptions to plans in your Cumulus based app
![Cumulus Subscriptions banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulussubscriptions/assets/images/cumulus-subscriptions-banner.png)

## Introduction

The plugin is an extension of [**Cumulus core** ](https://octobercms.com/plugin/initbiz-cumuluscore).

It gives you ability to manage your clusters' subscriptions and orders.

[//]: # (Documentation)

## Installation
After installation, your current plans will become no-expiring, no-paid ones (explanation below) and all clusters will get no-expiring subscription to plan that they had before installation. This way you and your users will not spot any difference. The only one will be managing the clusters' plans which right now will be possible only by managing their subscriptions.

### Set up the scheduler
In order to make the plugin work as expected you have to have scheduler set up (click [here](https://octobercms.com/docs/setup/installation#crontab-setup) for info how to do it).

> Note: The plugin is not supplying any payment gateway methods, but wraps everything about the process for you.

## Subscriptions
The key idea behind the plugin are subscriptions. The subscriptions are assignments between clusters and plans that can be paid, expiring or both. It's customizable and pretty powerful idea.

The plugin takes care of changing clusters' plans by checking their subscriptions every day and changing those which have expired. They will be changed to the plan set in subscription as plan after expiry.

> Note: Deleting subscription will not change cluster's plan

## Orders

Orders are good addition to the subscriptions. They automate the process of calculating the price and simplifies upgrading plans or prolongating subscriptions.

See the `example usage` section below to get the idea.

> Useful notes about the orders:
> 1. Orders are issued by clusters (or an admin in backend on their behalf)
> 1. Calculating the upgrading price works only when both plans use the same currency.

## Example plans switching scenarios
You can create a lot of combinations of plans. Every plan has "plan after expiry" property, which means you can set every config you want to get using plans in such way.

If you want you may event toggle two plans every week if you set so. I does not make sense, but you can :). Just set one week expiry period for both, and "plan after expiry" to each other.

Maybe in your environment it makes sense to create "Trial" and "After trial" plans.

Or maybe "Bronze", "Silver", "Gold" and "Not paid". In this case "Not paid" will not have any paid features assigned to it. This way cluster which has not paid, will lose access to the paid features.

## Example usecase
Let's assume we want to have four plans in our application:

1. **Free** that
   1. is not expiring,
   1. is not paid,
   1. has **Plus** and **Pro** plans set as possible to upgrade
1. **Trial** that
   1. expires after 14 days,
   1. is not paid,
   1. has **Free** plan set as plan after expiry,
   1. has full set of paid features,
   1. has **Plus** and **Pro** plans set as possible to upgrade
1. **Plus** that
   1. expires after 1 year,
   1. is paid $150 a year,
   1. has **Free** plan set as plan after expiry,
   1. has a few paid features,
   1. has **Pro** plan set as possible to upgrade
1. **Pro** that
   1. expires after 1 year,
   1. is paid $250 a year,
   1. has **Free** plan set as plan after expiry,
   1. has full set of paid features,

What is more, we have configured `CumulusCore` to auto-assign newly registered clusters to **Trial** plan.

Let's say we have a user that wants to register his company (ACME Corp.) in our service.

After he registers his company, he is getting by default **Trial** subscription and full access to our system for 14 days. He can leave it untouched and after those 14 days his plan will change automatically to **Free**.

He can also create order using `ManageSubscription` and `CreateOrder` components.

Trial and not expiring plans cannot be prolongated so the only thing he can do is to upgrade his plan to **Plus** or **Pro** according to our configuration.

He decided to upgrade to **Plus** right now. He enters page to manage his subscription and selects **Plus** plan to upgrade to. Automatically the price $150 is calculated and he moves to the "create-order" page. After that he is redirected to payment page.

When the payment is successful he is getting subscription for one year of **Plus** plan.

Let's say that after a half of a year he visits the "manage-subscription" page again. This time he can do two things there: prolongate or upgrade:

1. if he decides to prolongate, than he will automatically create order for next $150 and his subscription will prolongate typically for the next year,
1. there is a half of the year left for the current subscription to end. So that if he decides to upgrade his plan to **Pro**, he will have to pay the difference between prices for the period that has left. In this case the difference in prices is $100, so for the half of the year it's $50 still left to pay (see `PriceCalculator` section below).

## Upgrade guide

### v.1 to v.2

The `SubscriptionRepository` was removed. All methods from the repository were moved to `Subscription` model. Refer to the model code for more info.
