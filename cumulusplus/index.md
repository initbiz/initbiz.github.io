# Cumulus Plus - Extend your Cumulus Core based app
![Cumulus Plus banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusplus/assets/images/cumulus-plus-banner.png)

## Introduction

This plugin extends the [Cumulus Core](https://octobercms.com/plugin/initbiz-cumuluscore) with:

* component for creating resizable, movable and customizable cluster's dashboard page,
* component for creating tabbed cluster's settings page,
* component for managing cluster details with a built-in method checking if the Cluster's username is unique,
* model for storing user's preferences,
* controller for protecting files relations basing on a cluster.

Read the sections below for more information.

[//]: # (Documentation)

## Combined component general concept

Using this plugin you can create a dashboard and a settings panel using components you already have or those newly created. The only thing you have to do is to register the dashboard and settings components (see sections below) in your plugin registration file (`Plugin.php`).

After you register all your dashboard components you do not have to embed all of them on the dashboard page. You can embed only one component (`ClusterDashboard`) which will embed all of your components and render them in cards. The same applies to the `ClusterSettings` component which will embed all the settings components and render them in tabs.

![Cumulus Plus combined component](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusplus/assets/images/combined-component.png)

## Dashboard component

![Cumulus Plus dashboard page](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusplus/assets/images/screenshot1.png)

In order to register your component as a dashboard component you have to use `registerCumulusDashboards` method in your `Plugin.php` file:

    public function registerComponents()
    {
        return [
            'Initbiz\ExamplePlugin\Components\ProjectStatus'  =>  'projectStatus'
        ];
    }

    public function registerCumulusDashboards()
    {
        return [
            'projectStatus' => [
                'permissions' => 'initbiz.exampleplugin.read_project_status', // feature to restrict visibility, may be array
                'height'      => 1, // Default height of the box
                'width'       => 12, // Default width of the box
                'order'       => 100, // Default order in cluster dashboard, lower first
            ]
        ];
    }

The key of the array is the name of the component (from `registerComponents` method). In the example above we have a component registered as `projectStatus`.

The grid in the dashboard is 12-columns, so in this example, the box will be full width.

You can bind to `initbiz.cumulusplus.beforeDashboardRender` event if you want to manipulate the parameters dynamically.

By default `ClusterDashboard` uses [gridstack.js](https://github.com/gridstack/gridstack.js). As a consequence, you have to have [jQuery](https://jquery.com/) included in your project. By default, it uses [Bootstrap 3](https://getbootstrap.com/) syntax as well, so if you want to use the default views files you have to have Bootstrap included as well.

## Settings component

![Cumulus Plus settings page](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusplus/assets/images/screenshot2.png)

In order to register your component as the settings component you have to use the `registerCumulusSettings` method in your `Plugin.php` file:


    public function registerComponents()
    {
        return [
            'Initbiz\ExamplePlugin\Components\ExampleSettings'  =>  'myFeatureSettings'
        ];
    }

    public function registerCumulusSettings()
    {
        return [
            'myFeatureSettings' => [
                'tab'         => 'initbiz.exampleplugin::lang.settings.tab_label', // Tab registration
                'permissions' => 'initbiz.exampleplugin.myfeature', // feature to restrict visibility
                'order'       => 100, // order in cluster settings page, lower first, default: 500
            ]
        ];
    }

The key of the array is the name of the component in `registerComponents` method. In the example above we have a component registered as `myFeatureSettings`.

> You define order only for components, tab order will be inherited by the most important component in the tab.

You can bind to `initbiz.cumulusplus.beforeSettingsRender` event if you want to manipulate the parameters dynamically.

The `ClusterSettings` component by default uses [Bootstrap 3](https://getbootstrap.com/) tabs, so if you want to use the default views files you should have Bootstrap 3 included in your project.

By default, tabs are named as you translate it and their IDs are slugs of the translations. Moreover, CumulusPlus by default adds functionality to go to the tab using #tab-id in URL.

## `UserPreference` model

`UserPreference` model is designed to keep the user's custom preferences. You can use `set` and `get` methods to get and set currently logged in user preferences.

For example:

    use Initbiz\CumulusPlus\Models\UserPreference;

    ...

    UserPreference::set('locale', 'en');

    $locale = UserPreference::get('locale');

You can also use methods `setWithCluster` and `getWithCluster`. They are designed to keep the user's preferences with the cluster. For example, we can save a user's dashboard layout for the currently selected cluster:

    use Initbiz\CumulusPlus\Models\UserPreference;

    ...

    UserPreference::setWithCluster('dashboard-layout', $layout);

    $dashboardLayout = UserPreference::getWithCluster('dashboard-layout');

## Files protected for clusters

Another feature that Cumulus Plus is giving you is managing file relations in such a way that only the cluster that owns the parent model can download the file. It works the same way as protected files in backend (when `public` is set to `false`).

The only thing you have to do is to define the file relation like that:

    public $attachMany = [
        'attachments' => [
            'Initbiz\CumulusPlus\Models\File',
            'public' => false,
        ]
    ];

As you see, the only difference is the model class. Defining the `public` to `false` will automatically change the behavior of generating links and allowing access to them.

## Overriding settings and dashboard components views in theme

To override the views of settings and dashboard components you have to use the parent's component's alias as a prefix. So if you embed `ClusterDashboard` component on the page and `WelcomeMessage` component as a child component then you have to create `clusterdashboardwelcomemessage` directory in your `partials` directory since this will be the true alias of the child component.