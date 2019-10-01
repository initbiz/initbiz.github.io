# Cumulus Plus - Add dashboard and settings pages within seconds in your Cumulus based app
![Cumulus Plus banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusplus/assets/images/cumulus-plus-banner.png)

## Introduction

This plugin extends the [Cumulus Core](https://octobercms.com/plugin/initbiz-cumuluscore) with three components:
1. `CumulusDashboard`
1. `CumulusSettings`
1. `UpdateCluster`

`UpdateCluster` is a typical frontend component to manage cluster details with built-in method checking if the Cluster's username is unique.

`CumulusDashboard` and `CumulusSettings` work similar. When you embed any of it on a page it's like you would embed all of the `dashboard` or `settings` components at once.

![Cumulus Plus combined component](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/cumulusplus/assets/images/combined-component.png)

Using this plugin you can create nice looking dashboard and settings panel in seconds using components you already have or those newly created.

[//]: # (Documentation)

## Dashboard component

In order to register your component as a dashboard component you have to use `registerCumulusDashboards` method in your `Plugin.php` file:


    public function registerComponents()
    {
        return [
            'Initbiz\ExamplePlugin\Components\ExampleDashboard'  =>  'myFeatureDashboard'
        ];
    }

    public function registerCumulusDashboards()
    {
        return [
            'myFeatureDashboard' => [
                'permissions' => 'initbiz.exampleplugin.myfeature', //slug of feature to restrict visibility
                'height'      => 1, //Height of the box
                'width'       => 12, //Width of the box
                'order'       => 100, //order in cluster dashboard, lower first, default: 500
            ]
        ];
    }


The key of the array is the name of the component (from `registerComponents` method). In the example above we have component registered as `myFeatureDashboard`.

The grid in the dashboard is 12-columns, so in this example, the box will be full width. By now boxes are positioned automatically.

If you want to manipulate other components parameters before passing them to the views you can use `initbiz.cumulusplus.beforeDashboardRender` event. It passes the definitions of all the components by reference.

> `ClusterDashboard` component uses [grid-stack](https://github.com/gridstack/gridstack.js). As a consequence, you have to have [jQuery](https://jquery.com/) included in your project. What is more, by default it uses [Bootstrap 3](https://getbootstrap.com/) syntax, so if you want to use the default views files you have to have Bootstrap 3 included as well.

## Settings component

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
                'tab'         => 'initbiz.exampleplugin::lang.settings.tab_label', //Tab registration
                'permissions' => 'initbiz.exampleplugin.myfeature', //slug of feature to restrict visibility
                'order'       => 100, //order in cluster settings page, lower first, default: 500
            ]
        ];
    }


The key of the array is the name of the component in `registerComponents` method. In the example above we have component registered as `myFeatureSettings`.

You define order only for components, tab order will be inherited by the most important component in the tab.

If you want to manipulate other components parameters before passing them to views you can use `initbiz.cumulusplus.beforeSettingsRender` event. It passes definitions of all components by reference.

> The `ClusterSettings` component by default uses [Bootstrap 3](https://getbootstrap.com/) tabs, so if you want to use the default views files you should have Bootstrap 3 included in your project.

By default, tabs are named as you translate it and their IDs are slugs of the translations. Moreover, CumulusPlus by default adds functionality to go to the tab using #tab-id in URL.

## Hints

### Overriding views
To override the views of settings and dashboard components you have to use the parent's component's alias as a prefix.

This way if you embed `ClusterDashboard` component on the page and `WelcomeMessage` component as a child then you have to create `clusterdashboardwelcomemessage` directory in your `partials` directory, since this will be the alias of the plugin.

## TODO / Feature plans
* Cumulus settings model that stores Cumulus settings in one place
* Drag & Drop dashboard
