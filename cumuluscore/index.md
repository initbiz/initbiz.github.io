# Cumulus Core - create a SaaS (multi-tenant) application in OctoberCMS
![Cumulus banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumuluscore/assets/images/cumulus-banner.png)

## Introduction

The plugin is a skeleton for building Software as a Service (SaaS, multi-tenant) applications using OctoberCMS. SaaS is (according to Wikipedia) a software licensing and delivery model in which software is licensed on a subscription basis and is centrally hosted.

The easiest way to understand the contept is to imagine an application that you want to create for your clients (one application for more than one client) but it is going to be hosted on your server.

Here are some use cases where Cumulus may help:
* system for your clients' companies where they can have their private data in the cloud (your server) while other clients cannot see each other's data like invoicing system, client management system, etc.
* system for schools where classes can share some data and have access to some data while cannot see other classes data like exams system, school diary, etc.
* every system that supports cutting functionality for different plans (like "Free", "Plus", "Pro") like in the example in documentation in the 'Example pricing table' section.

[//]: # (Documentation)

## Installation

You can install Cumulus in the following ways:

1. from [OctoberCMS Marketplace](https://octobercms.com/plugin/initbiz-cumuluscore),
1. clone the code from [GitHub repo](https://github.com/initbiz/oc-cumuluscore-plugin) into `/plugins/initbiz/cumuluscore` directory,
1. install using Composer `composer require initbiz/oc-cumuluscore-plugin`,

### TL;DR

If you want to play with Cumulus right away:
1. install [Cumulus theme](https://octobercms.com/theme/initbiz-cumulus)
1. run `php artisan cumulus:seed` command (see [Cumulus Demo](https://octobercms.com/plugin/initbiz-cumulusdemo) documentation for info about the command)

as shown in the video below:

[![Cumulus demo video thumbnail](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/youtube_demo_screenshot.png)](https://www.youtube.com/watch?v=Y0-OvGzmP5w)

After that, you are ready to play with Cumulus based app with demo data seeded (user demo@example.com with password demo) :).

## Terms used in Cumulus and this document

**User** is a frontend user from `RainLab.User` plugin who can log to frontend. See [RainLab.User documentation](https://octobercms.com/plugin/rainlab-user) for more info about this. Frontend users differ from backend admins, check "Separated frontend and backend user access" section below for more info.

**Cluster** is a group of users who share some data between them and can be described as one entity. The most common example is the company. But it also applies to offices, office branches, classes in school, schools, etc. Cluster is not a `usergroup` from `RainLab.User` plugin (like a guest, registered and so on). User groups are about permissions (like read, write, update, etc.) while clusters are about organizing users in logical entities.

**Plan**s are assigned to clusters. A cluster can have only one plan at a time. Imagine a pricing table like in the 'Example pricing table' section below. Plans, in this case, are "Free", "Plus", "Pro".

**Feature** is a part of the functionality of the application. The easiest explanation of features is the records in the above table. Features are registered by your plugins as described below. It is fully up to you to create the functionality of your application. Features are assigned to plans so that clusters with some plan will have access to some features.

### Separated frontend and backend user access
It may be difficult to understand the difference between frontend and backend users at first glance.

By design, backend admin is a developer like me and you while the frontend (Cumulus) user is your client. Your clients are using your application but they must not see other clients' data (of course if you do not want to). And you, as backend admin, have access to all data of your clients.

So as you can see those are two completely different points of view on the same application.

## Concept
In all SaaS applications there are at least two groups of pages:
1. publicly visible pages (where you put your offer, regulations, contact form, login form, register form, etc.),
1. pages accessible only for registered and logged in users.

In Cumulus we extend the second group of pages so that you may have also pages that are accessible only for users that are:
1. logged in and nothing more (like manage profile page or some kind of dashboard),
1. assigned to a particular cluster (for example cluster's dashboard page with data that can be visible for all users in the cluster),
1. assigned to a cluster that has access to some features (for example a cluster can have access to pages concerning invoicing).

Check the "How to" section below to see how it is done.

## Features
Cumulus is using features to separate functionality and access for users. Every plugin can register its own features using the `registerCumulusFeatures` method in the plugin registration file.

The syntax is similar to registering backend permissions. For example:

    public function registerCumulusFeatures()
    {
        return [
           'initbiz.cumulusinvoices.manage_invoices' => [
               'name' => 'initbiz.cumulusinvoices::lang.feature.manage_invoices',
               'description' => 'initbiz.cumulusinvoices::lang.feature.manage_invoices_desc',
           ]
        ];
    }

Features are assigned to plans. So that every cluster that has a particular plan has the same set of features. It is a good idea to have them as many as possible to make the application customizable.

![Example plan](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/example-plan.png)

Before creating and using features it is a good idea to read about the `FeatureGuard` component below.

### Registering cluster's features
> **Registering features in system differs from registering cluster's features.** Registering features in the system is described in the section right above.

Every time any cluster obtains access to any feature (**for the first time, once**) we call it registering cluster's feature. Registering clusters' features is the process of running some 'registering' code when a cluster gets access to a feature whether by changes of the cluster's plan or plan's features.

To register a feature you have to bind to `initbiz.cumuluscore.registerClusterFeature` event and check if it is your feature being registered right now like in the example below:

    Event::listen('initbiz.cumuluscore.registerClusterFeature', function ($clusterSlug, $featureCode) {
        if ($featureCode === "initbiz.cumulusinvoices.manage_invoices") {
            // perform some registering code, for example, seed tables for the cluster with sample data
        }
    });

The event is blocking so if you decide to stop the process of registration then return false and an exception will be thrown.

## How-to
### Shortcut


### Full way
As defined in **Concept** section above, pages in Cumulus applications are in one of four groups. In Cumulus we use October's components to create a page (or layout) as one of the group.

* public pages do not require special configuration
* pages that require the user to be logged in should use `Session` component from `RainLab.User`
* pages that require the user to be assigned to a particular cluster should use `CumulusGuard` component
* pages that require the current cluster to have access to particular feature should use `FeatureGuard` component

If you want to check if the user is signed in, is assigned to a cluster and the cluster has access to a feature, then embed all three components (`Session`, `CumulusGuard` and `FeatureGuard`).

![Feature guard](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/feature-guard.png)

The cleanest way will be creating layouts with sets of component configurations instead of embedding them on every page.

> More information about the components can be found below.

Example usage for our client will be as follows:
1. User visits the login page and after successfully logging in he/she will be redirected to "Choose cluster" page (screenshot below)
1. After he/she chooses a cluster he/she will be redirected to the cluster's dashboard.

On the "Choose cluster" page will be the `UserClustersList` component embedded which automatically redirects the user to cluster's dashboard if he/she is assigned to only one cluster.

### Clusters' *usernames*
Clusters' usernames are unique strings to be used in URLs so that URLs can be changed by the client the way they want to. The same feature on Facebook and Twitter is called *username* so we decided to use name *username* as well.

If you enable 'using usernames in URLs' in Cumulus general settings then you have to ensure that you have not been using `cluster_slug` variable from URL. To get cluster or its slug from URL you may use Cumulus's helpers class:

    $cluster = Helpers::getClusterFromUrlParam($this->property('clusterUniq'));
    $clusterSlug = Helpers::getClusterSlugFromUrlParam($this->property('clusterUniq'));

Notice however that `CumulusGuard` component injects `cluster` object to pages that use it (or their layout).

#### Username validation
There are two events fired where you can validate username.

The first one is `initbiz.cumuluscore.beforeClusterSave` which basically is fired every time you save or update the cluster. It gets a `cluster` model object as a parameter and you can stop executing and propagating to other listeners if you return `false`.

The second one is `initbiz.cumuluscore.usernameUnique` which is run in `ClusterRepository`in `usernameUnique` method. It gets two parameters: `username` and `clusterSlug`. It may be used for example to check if the username is unique in more places than one cumulus host.

`ClusterUpdate` component in [Cumulus Plus](https://octobercms.com/plugin/initbiz-cumulusplus) plugin validates the username for you using AJAX.

### Login page
The login page can use the `Account` component from `RainLab.Users` plugin. It should be configured so that it automatically redirects to the "Choose cluster" page after successfully logging in.

![Login page](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/login-page.png)

### "Choose cluster" page
On "Choose cluster" page should be `UserClustersList` component embedded. It will automatically redirect the user to the cluster's dashboard if he/she is assigned to only one cluster.

![Choose cluster page](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/choose-cluster-page.png)

### Cluster's dashboard
Welcome screen for everyone in the cluster. Place for statistics (and [Cumulus Plus](https://octobercms.com/plugin/initbiz-cumulusplus) component).

![Cluster's dashboard page](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/cluster-dashboard-page.png)

From this level, every page's URL should contain cluster slug variable. By default it is `:cluster` but it can be changed in the component. So from now, all pages will have URL similar to this:

![Cluster's dashboard page view](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/cluster-dashboard-page-view.png)

### Feature pages
Every page of your system that provides some functionality is considered as "Feature page". So here is where Cumulus cannot help anymore (and tries to not disturb you with unnecessary code bloat).

### Components

**UserClustersList**

The component's role is to render a view to select the cluster if the user is assigned to more than one cluster.

> Note: If the user is assigned to one cluster then the component will automatically redirect to `Cluster dashboard page`

![Clusters list component](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/user-cluster-list-component.png)

**CumulusGuard**

The `CumulusGuard` component is here to check if the logged-in user has access to the cluster that he/she tries to visit. It uses cluster slug from URL.

What is more, the component pushes two variables to view:
* `cluster` which contains current cluster's slug
* `clusterData ` which contains an array of the current cluster data.

and sets active cluster's slug in session variable and cookie as `cumulus_clusterslug`.

**FeatureGuard**
Feature guard is a component that ensures if the current cluster can see the page based on features it has access to.

**Remember that only one of the checked features is enough to let the user see the page**

![Feature guard](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/feature-guard.png)

> If you want to filter content on one page so that only a cluster that has access to this feature can see it use `canEnterFeature` twig function described below.

### Repositories
In Cumulus we decided to use repositories to access data from DB.

That is because we had problems with models using models using models (this inception O.o) and problems with the organization of useful methods since Models are just representations of tables in the database and not the entire data.

Of course under the hood there are typical Eloquent models, so if you want to use them go ahead.

To use `clusterRepository` you have to create the object as in the example below:

    use Initbiz\CumulusCore\Repositories\ClusterRepository;
    ...
    $clusterSlug = $this->property('clusterUniq');
    $clusterRepository = new ClusterRepository($clusterSlug);
    $clusterData = $clusterRepository->getCurrentCluster();

**ClusterRepository**

`canEnterCluster(int $userId, string $clusterSlug)` - check if user can enter given cluster

`canEnterFeature(string $clusterSlug, string $featureCode)` - check if cluster can enter the feature (using its plan)

`getClustersUsers(array $clustersSlugs)` - get array of users in given clusters array (can be more than one)

`getClusterFeatures(string $clusterSlug)` - get array of cluster's features

`addUserToCluster(int $userId, string $clusterSlug)` - adds user to cluster

`addClusterToPlan(string $clusterSlug, string $planSlug)` - assigns a plan to cluster

`getClustersPlans(array $clustersSlugs)` - get array of clusters that has given plans (can be more than one)

**PlanRepository**

`getPlansUsers(array $plansSlugs)` - the method takes an array of plans slugs and gets all users that are in those plans.

**ClusterFeatureLogRepository**

`registerClusterFeatures(string $clusterSlug, array $features)` - the method log that this cluster has access to such features.

**UserRepository**

`addUserToGroup($userId, $groupCode)` - adds user to group (`RainLab.UserGroup`)

`activateUser($userId)` - activate user (by default users are not active)

## Auto assign
Auto assigning is Cumulus functionality that automatically assigns users and clusters during their registering. You can create a lot of different configurations so it should meet your expectations.

Go to Settings -> Cumulus -> Auto assign where you will find two tabs: "Auto assign users" and "Auto assign clusters".

### Auto assign users
![Auto assign users](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/auto-assign-users.png)

While auto assigning users to clusters you can decide whether you want to:
* create a new cluster using variable specified in "variable name" (for example company name)
* choose existing cluster for every newly registered user
* get cluster slug from variable

You can also decide whether you want to add a user to a group (`RainLab.UserGroup`) after registering or not.

### Auto assign clusters
![Auto assign clusters](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/auto-assign-clusters.png)

While auto assigning clusters to plans you can decide if you want to:
* assign the user to concrete plan (in most cases something like Free or Trial) or
* get the plan from a variable (if you have more then one plan that cluster can be assigned)

Please note that:
* auto assigning clusters will work only if creating a new cluster is enabled in "Auto assign users" tab
* auto assigning clusters to plans from variable will be possible only when you allow that in the plan definition

## `ClusterFiltrable` trait
As you may have noticed, data in the database will not be filtered automatically to your clusters. You have to do it yourself. The `ClusterFiltrable` trait will be useful in this case.

Just use it in your model as in the example:

    class Course extends Model
    {
        use \Initbiz\CumulusCore\Traits\ClusterFiltrable;
        ...
    }

If you want to use the `clusterFiltered()` method without any parameters than add `cluster_slug` attribute to your model where you will be storing the owning cluster's slug. If you use id than you will have to add parameters to the `clusterFiltered()` method as described below.

### `clusterFiltered($value = '', $attribute = 'cluster_slug')` scope
If you want to filter model using `cluster_slug` attribute in your table just add `clusterFiltered()` to your query.

    ExampleModel::clusterFiltered()->get();

The method gets two optional parameters. The first is a value and the second is an attribute. If you do not specify any of them, then the scope will use the current cluster slug and tries to use the `cluster_slug` attribute in the model.

If you want to filter by `cluster_id` column you can use `clusterIdFiltered()` method.

You can customize the attribute and the column by specifying parameters like

    ExampleModel::clusterFiltered($attributeValue, 'attribute_column')->get();

### `clusterUnique($attribute, $table = null, $columnName = 'cluster_slug')`
The `ClusterFiltrable` trait adds `clusterUnique` method as well. The method returns validation rule (string) for October's validator (more about validation can be found [here](https://octobercms.com/docs/services/validation)).

Parameters to this method work similar to `clusterFiltered` method described above.

The method returns a string of validation rule. You can use the rule in the model's constructor. Let's say we want to check if `invoice_number` is unique in the cluster scope (while other clusters can safely have the same number).

    public function __construct(array $attributes = array())
    {
        parent::__construct($attributes);
        $this->rules['invoice_number'] = $this->clusterUnique('invoice_number');
    }
If you want to specify the table name or column name to build a unique rule then you have to use parameters in the method. By default it will use `$this->table` attribute and `cluster_slug` as a column name, for example:

    $this->rules['invoice_number'] = $this->clusterUnique('invoice_number', 'invoices', 'cluster_id');

## Twig extensions
### `canEnterFeature('feature.code')`
If you want to check in twig if current cluster has access to "feature.code" than use `canEnterFeature('feature.code')` Twig function.

For example:

    {% if canEnterFeature('initbiz.cumulusdemo.paid_feature') %}
        Something visible only to those who have access to initbiz.cumulusdemo.paid_feature.
    {% endif %}

## Rainlab.User note
The plugin extends RainLab.User plugin and uses the same `User` model, so if you want to restrict backend admin to manage users remember that there is controller from RainLab.Users that use the same Model and can access the same data.

## Menus / Navigation
Cumulus extends [RainLab.Pages](https://octobercms.com/plugin/rainlab-pages) plugin to build menus.

**Version 1.2.20 of RainLab.Pages is required**

![Static menu in cumulus](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/menu-static-pages.png)

As you can see there are two new things. The first is a menu item type: Cumulus page. It defines items that have `cluster_slug` in URLs and the cluster slug will be injected to URL. The second is the "Cumulus" tab. Under the tab, you can choose features that are required to see the menu item for a cluster. If none specified then everybody can see it. But if any feature is checked then the cluster must have access to it to see the menu entry. What is more, the cluster can have access to just one of the features and entry will appear.

## Troubleshooting
### I cannot see my registered features
If you cannot see your features then go to Settings -> Cumulus -> Features and click the `Clear feature cache` button.

## Contributing
Every contribution is very welcomed, especially from professional devs who can suggest the better organization of code. Thanks for your time in advance :)

## Doc helpers etc.
### Example pricing table
Here you have an example pricing table with plans that you can create using Cumulus. The image is here only for reference purposes and is not related to Cumulus itself.

![Pricing table example](https://github.com/initbiz/initbiz.github.io/raw/master/cumuluscore/assets/images/pricing-table.png)

## Upgrade guide

### from v.2.* to v.3.*
The repositories were moved to the models.

General:
1. Ensure you have enabled `Allow registration` on plans that you automatically assign clusters to.

Events:
1. `initbiz.cumuluscore.addClusterToPlan` became `initbiz.cumuluscore.autoAssignClusterToPlan` and is run only on auto assigning cluster to plan
1. `initbiz.cumuluscore.addUserToCluster` became `initbiz.cumuluscore.autoAssignUserToCluster` and is run only on auto assigning user to cluster
1. `initbiz.cumuluscore.beforeAutoAssignNewCluster` is removed, instead use `initbiz.cumuluscore.beforeAutoAssignClusterToPlan`
1. `initbiz.cumuluscore.beforeAutoAssignUserToCluster` and `initbiz.cumuluscore.beforeAutoAssignClusterToPlan` added
1. `registerClusterFeature(string $clusterSlug, string $feature)` event now looks like that `registerClusterFeature(Cluster $cluster, string $feature)`

Helpers:
1. `getCluster` now returns `Cluster` object
1. `clusterId`, `clusterUsername`, `getClusterUsernameFromUrlParam` and `getClusterSlugFromUrlParam` were removed, use `getClusterFromUrlParam` instead

All repositories:
1. `getByRelationPropertiesArray()` -> `$model->relation()->get()` and foreach with `unique()`

`UserRepository`:

1. `getUserClusterList($userId)` -> `$user->clusters()->get()`

`PlanRepository`:

1. `getPlansUsers($plansSlugs)` -> `$plan->getUsers()` + foreach and `unique()`.

`ClusterRepository`:

1. `getClustersUsers($clustersSlugs)` -> `$cluster->users()->get()` + foreach and `unique()`.
1. `getClustersPlans($clustersSlugs)` -> `$plans->push($cluster->plan()->first())` + foreach and `unique()`.
1. `canEnterFeature($clusterSlug, $featureCode)` -> `$cluster->canEnterFeature($featureCode)`
1. `getClusterFeatures($clusterSlug)` -> `$cluster->features`
1. `usernameUnique($username, $clusterSlug)` -> `Helpers::usernameUnique($username, $clusterSlug`

`ClusterFeatureLogRepository`:

1. `clusterRegisteredFeatures(string $clusterSlug)` -> `$cluster->registered_features`
1. `registerClusterFeature(string $clusterSlug, string $feature)` -> `$cluster->registerFeature(string $feature)`
1. `registerClusterFeatures(string $clusterSlug, array $features)` -> `$cluster->registerFeatures(array $features)`

`Cluster` Model:

1. Relation `clusterRegisteredFeatures` renamed to `featureLogs`

### from v.2.0.2 to v.2.0.3
#### Introducing *Clusters' usernames*
Clusters' usernames is a new feature of Cumulus, where your users can specify their "username" in URL. See documentation for more info about the feature.

While installing this version Cumulus will by default copy Clusters' slugs to their usernames so by default usernames will be seeded and everything should work out of the box if you enable using usernames.

#### `ClusterSlug` becomes `ClusterUniq`
`ClusterSlug` property from Cumulus components becomes `ClusterUniq`. That is because it can be either slug or username. It depends on the setting in General settings tab in Backend Settings.

The only thing you have to change is `ClusterSlug` to `ClusterUniq` in all places you have been using it directly. Those places are:
* layouts and pages in themes using Cumulus,
* components that have been using `clusterSlug` param,
* external methods that used components' `clusterSlug` param.

As a consequence method `defineClusterSlug` becomes `defineClusterUniq`.

#### `cluster` and `clusterData` variables injected to page by `CumulusGuard` have changed
`cluster` variable so far has been actually cluster's slug. This was misleading convention that had to be changed. Right now `cluster` is object of current cluster model, while `clusterData` variable is removed.

### from v.1.x.x to v.2.0.0
It is big. I know. It is funny in technology that after you create something it does not make sense after you work with it for some time. This is what happened to modules and some conventions we used in versions 1.x.x. Sorry about the amount of changes, but we hope our plugin will be much better and usable after the upgrade.

#### Database changes
> **Make backup before proceeding.**

In the beginning of Cumulus we did not know some October's and Laravel's conventions. While designing and developing Cumulus we used our own experience and ideas. During this time we get familiar with October's naming suggestions. As a consequence in version 2.0.0 we decided to change a few names.

##### Cluster full_name becomes name
`Full_name` from `clusters` table becomes name.

##### Primary keys in Cumulus
In version 1.x.x we were using `cluster_id`, `module_id` and `plan_id` as a primary keys. From now all of them will become `id`.

##### Drop modules
`initbiz_cumuluscore_modules` and `initbiz_cumuluscore_plan_module` tables will be dropped during upgrade to 2.0.0. Because of that the relation between your plans and modules will be lost. You should create a backup of `initbiz_cumuluscore_plan_modules` and `initbiz_cumuluscore_modules` if you want to review them after upgrade.

In most cases it should be easy to restore them as modules were whole plugins. Only plans and their relations with modules have to be restored in feature convention.

#### Modules becomes features
The biggest change in Cumulus v.2 concerns modules. We noticed, that it was not enough for plugin to register only one feature (since modules were actually features of system). This leaded us to plugin registration file, where now plugins can register as many features as they want to (more info in documentation).

Methods from `ClusterRepository` that concerns modules will right now use features. It applies to almost every "module" word in methods and attributes names. What is more modules used slugs while features use codes. So every time where we were talking about module slug, right now it is about feature code.

##### Modify modules
Before updating to v.2 **you will have to ensure you register features** as described in documentation for all of your modules.

What is more, **you have to remove the initial migration** previously created by `create:module` command:
1. remove file named `register_initbiz_cumulus_module.php`
1. remove line running it in `version.yaml` file (at the beginning)

##### `ModuleGuard` becomes `FeatureGuard`
The responsibility of `ModuleGuard` component was to ensure that plan has access to specified module and return 403 (Forbidden access) if it does not. The responsibility of `FeatureGuard` is the same but it checks if plan has access to any of features specified in component configuration.

**Access to only one feature is enough to enter the page.**

##### Command `create:module` removed
As a consequence the command `create:module` is removed. If you want to create something similar then create normal OctoberCMS plugin using `create:plugin` command and by adding `registerCumulusFeatures` method (details in documentation).

#### `Settings` model becomes `AutoAssignSettings`
If you have used `Settings` model somewhere in your code than you will have to change its name to `AutoAssignSettings`.

Because of that you will have to reconfigure autoassign in settings or update `initbiz_cumuluscore_settings` row code to `initbiz_cumuluscore_autoassignsettings` in `system_settings` table.

#### `Menu` and `MenuItem` components removed
From version 2.0.0 we decided to use [RainLab.Pages](https://octobercms.com/plugin/rainlab-pages) to build menus. It is powerful, supported and extendable way to build menus.

#### Cumulus Plus users
If you are using Cumulus Plus extension make sure you change permissions from module name to feature code in "permissions".
