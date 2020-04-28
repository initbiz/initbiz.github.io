# Let's Rent - Run your rental office using OctoberCMS
![Let's rent banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/letsrent-banner.png)

## Introduction
Let's rent plugin is a plugin for running rental office in OctoberCMS. It is just an abstraction to be extended by another plugin which will provide concrete models to be rented. If you want to run a car rental you should definitely look at the extension for this plugin: [Initbiz.LetsRentCars](https://octobercms.com/plugin/initbiz-letsrentcars).

## Features
1. check availability for the rentable models,
1. disallow rental start and end dates in working hours or allow as an extra paid,
1. add extra paid locations for pick-ups,
1. enable rentals for minutes, hours, days, weeks or months,
1. configure buffer before and after every rental,
1. configure buffer for rentals from now,
1. fully translatable interface integrated with [RainLab.Translate](https://octobercms.com/plugin/rainlab-translate),
1. easy to extend, Octoberish design and API.

## Third party dependencies
By default the plugin uses amazing:

1. [SweetAlert 2](https://sweetalert2.github.io/),
1. [Flatpickr](https://flatpickr.js.org/),
1. [Select2](https://select2.org/).

[//]: # (Documentation)

## Orders
Orders can be created using `CreateOrder` component as well as backend controller but there are little differences between those two. While creating order using component, dates are strictly validated. When you create an order in the backend, dates has to be set wisely. Rentables will still be filtered by availability but dates can be set even in the past. It's just for the convenience of the employees of the rental.

### Order price
In every rental office there have to defined such constants:
1. minimum period for the rental (whether it is 15 minutes, 1 hour, 1 day and so on),
1. buffer for all rentals.

![Time spans settings](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/settings-time-spans.png)

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

### Marking an order as paid
It is recommended to use `markAsPaid` method from the `Order` model. The method will save current date as `paid_at` and fire event `initbiz.letsrent.markAsPaid` with the order as a parameter.

## Rentables
Rentables are models that can be rent using Let's rent plugin. By design all rentable models will be attached to the order using dynamic polymorphic many to many relation and be rendered as a tab in the `Orders` controller.

The availability of the models for the given spans of time will be automatically filtered using `Rentable` behavior.

## Registering rentables
They have to be registered in the plugin's registration file using `registerRentables` method.

For example:

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

> By default relation's config does not have to be specified, it will get default of the `columns.yaml` and `fields.yaml`.

In this example there is a `Car` model in the `Let's Rent Cars` plugin that can be rented using the plugin.

Registering the model as a rentable will make a few things:

1. extend the model to implement Rentable behavior (described below),
1. extend the model to implement MoneyFields ([Initbiz.Money](https://octobercms.com/plugin/initbiz-money)) behavior,
1. attach automatically `morphToMany` relation between the model and the `Order` model

As a consequence, the model has to have `currency_id` and `amount` columns in the database:
1. amount - unsigned integer nullable
1. currency_id - unsigned integer nullable

### Rentable model filters
If you want to give the list of rentables ability to filter the records, you can define `rentableFilters` property of the model. For example:

    public $rentableFilters = [
        'brand' => [
            'label' => 'initbiz.letsrentcars::lang.car.filter.brand'
        ],
    ];

Using the codes from the variable, `RentableList` component will look for the attribute in the query string (GET) and enable them in scope if the value is proper.

For every filter you should also define method get options method like so:

    public function getBrandOptions()
    {
        return [
            'renault' => 'Renault',
            'audi'    => 'Audi',
            'bmw'     => 'BMW',
        ];
    }

This way you will be ready for the backend dropdowns and for the filters list to be built.

### `Rentable` behavior
Implementing the behavior will automatically define dynamic 'price' attribute for columns `amount` and `currency_id`.

### Disabled models
Rentable models can support disabling feature.

    public $supportDisabling = true;

Ensure you have boolean `is_enabled` column in the model's database table.

This will make it possible to use `enabled()` scope on the model and automatically make disabled models invisible for queries.

## Categories
Categories are meant to be used by the plugins extending Let's rent.

![Category list](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/category-list.png)

They are created just for convenience of the rental office employees.

## Components
### `RentableList`
This component will render a list of rentables. The only thing you have to do is to select the rentable model from the list in component's inspector.

By default the list will have links with URLs to the page with `RentableDetails` to show the particular rentable.

> **Using the car rental example, using this component you can render a list of cars**

The component will automatically embed the `OrderInfo` component and make use of it to automatically filter the list using the query string parameters.

The component also supports AJAXly updated list of filtered elements.

### `RentableDetails`
This component will inject the particular rentable object in the page.

> **Using the car rental example, using this component you can render details of the selected cars**

### `RentForm`
The component will render a typical rental form with such parameters:
1. Start time,
1. End time,
1. Start location,
1. End location.

Locations will be seeded from the settings and if they are extra paid, than the option will have this specified in the parenthesis.

Start and end time will be set to the closest possible time by default and it will be treated as the minimum date in the frontend. If the page remember the state of the inputs and the date is to early, the alert will be returned:

![Start date alert](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/start-date-alert.png)

### `CreateOrder`
Using this component you users can create orders. It is getting the order parameters from the query string to initally prepare order:

1. `rentable` - code of the rentable being ordered,
1. `slugs` - slugs of the rentables in the format `slug-1,slug-2`,
1. `starttime`,
1. `endtime`,
1. `startlocation`,
1. `endlocation`,

### `OrderInfo`
The component in most cases is used by other components to prepare the order using the query string parameters.

By default it is rendering booking information of the current order, hidden inputs that keep the parameters and displays button if no order is specified.

### `OrderList`
When user creates order, its ID is kept in a cookie. The list of user's orders can be rendered using this component.

The component can be rendered in a few modes:

* modal
* dropdown
* select input
* list
* button

Button mode is designed to be only a link to page that shows list of orders. In this case you should embed the component with a different mode on that page.

### `OrderSummary`
The component renders details of the order from URL parameter. `onRun` it checks if the user has access to display the order and aborts if not.

The component gives two AJAX handlers:

1. `onTransfer`
1. `onCashOnDelivery`

The `onTransfer` handler gets `orderId` from `POST` and redirects to `paymentPage` property with order ID in parameter. It is designed to process payments whatever way you want.

The `onCashOnDelivery` handler ensures is user can modify the order and if so, sets `payment_status` to `cash_on_delivery`. It is meant to be used by the client who want to inform rental office that he/she wants to pay on delivery.

## Settings
### Working hours
You can specify working hours for every week day.

![Working hours](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/settings-working-hours.png)

What is more, you can forbid rentals in non working hours or if you like enable but add specified amount of money to the order automatically.

### Locations
You can manage pick up locations from the settings and specify amount of money to be added to the order on select the location.

> **Remember to keep the same code for multiple languages**

Paid locations will render the amount in the rent form and backend controller options.

![Locations](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/settings-locations.png)

## Time spans
The settings are meant to be set before making the app production ready. They refer to the order price described in the beginning of the document.

![Time spans settings](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrent/assets/images/settings-time-spans.png)

### Buffer before creating order
The setting describe the time that has to lapse from the time of creating the order for the rentable models to be ready.

For example if someone wants to create order on Monday at 8:00 a.m. for 8 hours buffer he/she will be able to do that at 4 p.m.

You can override the default behavior using the `initbiz.letsrent.orderAfterDateNormalization` event.

The following code will make it possible to rent something at the beginning of the next working day:

    Event::listen('initbiz.letsrent.orderAfterDateNormalization', function ($order) {
        $startsAtNormalized = Session::get('initbiz.letsrent.starts_at_normalized');
        $endsAtNormalized = Session::get('initbiz.letsrent.ends_at_normalized');

        if ($startsAtNormalized || $endsAtNormalized) {
            $settings = Settings::instance();
            $closestWorkingDay = $settings->getClosestWorkingDay();
            $hours = $settings->getWorkingHours($closestWorkingDay->dayOfWeek);
            $closestOpening = Carbon::parse($closestWorkingDay->format('Y-m-d') . $hours['from']);
            $order->starts_at = $closestOpening;
            $order->ends_at = $closestOpening->modify('+' . $settings->get('count') . ' ' . $settings->get('period'));
        }
    });

## TODO / Future features
1. User registration out of the box