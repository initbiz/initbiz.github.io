# Let's Rent Cars - Car rental service for OctoberCMS
![Let's rent cars banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrentcars/assets/images/letsrentcars-banner.png)

## Introduction
> **IMPORTANT: The plugin requires [Let's rent](https://octobercms.com/plugin/initbiz-letsrent) plugin**

Let's rent cars is a plugin that gives fully featured car rental solution for [Let's rent](https://octobercms.com/plugin/initbiz-letsrent) based app.

[//]: # (Documentation)

## Creating orders
Employees of the rental should use backend to create orders while clients using `CreateCarsOrder` component described below. Creating the order in backend gives ability to add more than one car to the order as well as whatever accessory you want. They are only filtered by the periods and if they are not rented yet. While using the component you can rent only one car and add accessories that are assigned to the car. See `Accessories categories` section below.

The plugin registers two rentable models. `Car` and `Accessory`.

![Order car](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrentcars/assets/images/order-car.png)

### `CreateCarsOrder` component
The component `CreateCarsOrder` is just a wrapper for the `CreateOrder` component from [Let's rent](https://octobercms.com/plugin/initbiz-letsrent) plugin.

It displays the selected car as well as categories of accessories that can be attached (using the accessories categories described below).

You have to ensure that there is as much accessories as needed because to relation between accessory and order are typical polymorphic many to many. It is treated as normal rentable model, exact the same way as car.

## Settings
### Cars' attributes
In settings you can specify all details about cars in your rental:

![Car brands](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrentcars/assets/images/settings-car-brands.png)

1. Brands and models - as a repeater of repeaters with brands and models inside them,
1. Classes - like A, B, C etc.
1. Types - like SUV, Minivan etc.
1. Gearbox types - manual, automatic,
1. Door number - for example 2/3, 4/5,
1. Fuel types - like gas, diesel,
1. Seats - 5, 7 etc.

Every parameter has to be configured to the needs of the rental. The parameters will be used by the backend's dropdowns in cars as well as filters in the `RentableList` component.

All parameters except brand and models are translatable. Remember to use the same code for every language.

![Car types](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrentcars/assets/images/settings-car-types.png)

### Period discounts

![Period discounts](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrentcars/assets/images/settings-period-discounts.png)

Period discounts is the feature of the rental to give lower prices for longer rentals. In the screenshot above all rentals longer than 3 days will be 20% cheaper.

## Cars
In the backend you can manage cars in your rental using parameters from settings.

![Update car](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrentcars/assets/images/car-update.png)

The backend list of cars is filtrable by every parameter from settings.

### Accessories categories
Accessories categories in the car are categories of accessories that can be attached to the car. `CreateCarsOrder` works in such a way that you have to select the categories from which items can be attached to the car.

Let's say you have category of external navigations as an accessory to rent. If your car has navigation built in than it does not make sense to give external navigations to be rentable for the car.

## Accessories
Accessories are optional equipment for the car when being ordered. They use categories from Let's rent plugin.

![Create accessory](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/letsrentcars/assets/images/accessory-create.png)