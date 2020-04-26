# Let's Rent - Rental software for OctoberCMS
![Let's rent banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/letsrent-banner.png)

## Introduction

If you are about to run a car rental you should definitely look at the extension for this plugin: [Initbiz.LetsRentCars](https://octobercms.com/plugin/initbiz-letsrentcars).

## Features
1. check availability for the rentable models,
1. disallow rental start and end dates in working hours or allow as an extra paid,
1. add extra paid locations for pick-ups,
1. enable rentals for minutes, hours, days, weeks or months,
1. configure buffer before and after every rental,
1. configure buffer for rentals from now,
1. fully translatable interface integrated with [RainLab.Translate](https://octobercms.com/plugin/rainlab-translate),
1. easy to extend, Octoberish design and API.

[//]: # (Documentation)

## Orders
Orders can be created using `CreateOrder` component as well as backend controller but there are little differences between those two. While creating order using component, dates are strictly validated. When you create an order in the backend, dates has to be set wisely. Rentables will still be filtered by availability but dates can be set even in the past. It's just for the convenience of the employees of the rental.

### Price
First of all, in every rental there have to defined such constants:
1. minimum period for the rental (whether is 15 minutes, 1 hour, 1 day and so on),
1. buffer for all rentals.

> For example, when we have car rental, we would like to have minimum period of one day and for example 2 hours of buffer between rentals to prepare cars.

Every price of the rentable models define price for the defined period.

> In the car rental example where our minimal rental period is one day, in the rental models we give prices for one day.

To calculate the price for the rentable model, by default the `Order` model is running `getPriceCalculatedFor` method which is defined in the `Rentable` behavior. The method by default is multipling the given price by the count of periods. If you want to give custom logic for the model, you can override the method in the rentable model.

### Status and payment status
Payment statuses are:
1. `not_paid`,
1. `paid`,
1. `cash_on_delivery`

Statuses are:
1. `draft`,
1. `ordered`,
1. `in_progress`,
1. `cancelled`,
1. `closed`

All of them are defined in the `Order` model and are translated to display nicely for clients.

### Additional charges
All additional charges for the order can be added using `setAdditionalCharge` method. By default there are for in use:
1. Pickup location extra paid,
1. Return location extra paid,
1. Pickup hour extra paid,
1. Return hour extra paid.

## Rentables

Rentables are models that can be rent using Let's rent plugin. They have to be registered in the plugin's registration file like so:

    public function registerRentables()
    {
        return [
            'cars' => [
                'class'       => 'Initbiz\LetsRentCars\Models\Car',
                'label'       => 'initbiz.letsrentcars::lang.rentables.cars_label',
                'description' => 'initbiz.letsrentcars::lang.rentables.cars_description',
                'relationConfigs' => [
                    'view' => [
                        'list' => '$/initbiz/letsrentcars/models/car/view-columns.yaml',
                        'recordUrl' => '/initbiz/letsrentcars/cars/update/:id',
                    ],
                    'manage' => [
                        'list' => '$/initbiz/letsrentcars/models/car/view-columns.yaml',
                        'recordUrl' => '/initbiz/letsrentcars/cars/update/:id',
                        'filter' => '$/initbiz/letsrentcars/controllers/cars/config_filter.yaml',
                    ]
                ]
            ]
        ];
    }

In this example there is a `Car` model in the `Let's Rent Cars` plugin that can be rented using the plugin.

Registering the model as a rentable will make a few things:

1. extend the model to implement Rentable behavior (described below),
1. extend the model to implement MoneyFields ([Initbiz.Money](https://octobercms.com/plugin/initbiz-money)) behavior,
1. attach automatically `morphToMany` relation between the model and the `Order` model

As a consequence, the model has to have `currency_id` and `amount` columns in the database:
1. amount - unsigned integer nullable
1. currency_id - unsigned integer nullable

### `Rentable` behavior

it will automatically make your model implement moneyfields and define dynamic 'price' attribute for columns amount and currency_id

required amount and currency_id and cannot have price - this will be a combination of those two

use supportDisabling

add is_enabled column

Add custom addresses and prices for them. Store it in `additional_charges`. Extend the logic with custom km price with mapquest.

## Components

## Settings
### Working hours
You can specify working hours for every week day.