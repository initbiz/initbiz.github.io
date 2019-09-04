# Power Components - Create forms and lists in frontend the way you love from backend (but with overriding views ;) ) 
![Power Components banner](https://raw.githubusercontent.com/initbizlab/initbizlab.github.io/master/powercomponents/assets/images/powercomponents-banner.png)

## Introduction

So you want to write tests in OctoberCMS using Selenium 2?

Using the `Ui2TestCase` class from this plugin this should be much easier. What is more you do not have to download Selenium bin, since it is included in the package.

[//]: # (Documentation)

## How-to
### System requirements
1. Java 8 installed in default location of your platform (for example `/usr/bin/java` for linux)
1. Driver of the browser you want to use for tests (for example [ChromeDriver](http://chromedriver.chromium.org/getting-started))

> **Note for Linux users**
>
> Installing Chromium from your package manager should install ChromeDriver for you

> **Note for Mac users**
>
> You probably will have to link newer version of Java to your default path as described [here](https://stackoverflow.com/a/14875241)

### Installation
1. Install plugin:
  1. from [OctoberCMS Marketplace](https://octobercms.com/plugin/initbiz-selenium2tests),
  1. clone the code from GitHub into `/plugins/initbiz/selenium2tests` directory or
  1. install using Composer `composer require initbiz/oc-selenium2tests-plugin`
1. Go to `/plugins/initbiz/selenium2tests`
1. Copy `selenium.php.example` to `selenium.php` and configure your environment

**You can also create `selenium.php` file in your root directory, which will be read when the one in plugin's directory does not exist**

### Testing OctoberCMS basics
It is a good practice not to use the same DB for testing and developing purposes.

In order to configure different database for testing purposes create directory `testing` in `config` directory and copy `database.php` to the newly created directory. Then change the default connection as you wish.

After that if you use `APP_ENV=testing` in your `.env` file, configuration from `testing` directory will be used.

## Writing tests in Selenium 2
There are example tests in `tests/example` directory that use `Ui2TestCase` class.

### Traits
There are some useful methods in traits `SeleniumHelpers` and `OctoberSeleniumHelpers`. `SeleniumHelpers` was mostly based on `Modelizer/Laravel-Selenium`.

The documentation in code is self explaining, see [here](https://github.com/initbizlab/oc-selenium2tests-plugin/tree/master/traits).

## Running tests
First of all, you have to run Selenium 2 standalone server which is included in the package. In order to start Selenium 2 server go to `<project_root>/plugins/initbiz/selenium2tests` and run `java -jar selenium.jar`.

You are ready to run tests using PHPUnit from OctoberCMS's `vendor/bin/phpunit`.

You can keep test files wherever you want, but `.gitignore` of the plugin will exclude all files from `/tests` except those in `/tests/examples`.

### Browser in headless mode
#### Using 'Desired capabilities'
If you want to run browser in headless mode, you can use 'desired capabilities' feature of your browser driver.

For example if you want to run ChromeDriver in headless mode you have to add that line to your `selenium.php` file:

```
define('TEST_SELENIUM_CAPABILITIES', ['goog:chromeOptions' => ['args' => ['--headless']]]);
```

#### Using `xvfb`
If you are a Linux user you can use `xvfb` to run browser in background.

In this case you have to run Selenium server using line similar to this:

```
DISPLAY=:1 xvfb-run -s "-screen 0 1366x768x24" java -jar plugins/initbiz/selenium2tests/selenium.jar
```

## Troubleshooting

### `phpunit` and `phpunit-selenium` version

Depending on version of `phpunit` and `phpunit-selenium` some typical errors may occur.

While working with the default `phpunit` and `phpunit-selenium` in OctoberCMS you can get `must be an instance of Exception, instance of Error given` error. The problem is with the old version `phpunit` and `phpunit-selenium` extension used by OctoberCMS.

It works best when you set in your root `composer.json` file versions as follows:

```
"require-dev": {
   ...
   "phpunit/phpunit": ">5.7",
   "phpunit/phpunit-selenium": "~4.1"
}
```
And run `composer update`.