# Selenium 2 Tests - Write tests using Selenium 2 with Dusk support 
![Selenium 2 Tests banner](https://raw.githubusercontent.com/initbiz/initbiz.github.io/master/selenium2tests/assets/images/selenium2tests-banner.png)

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
1. You can use three methods to install the plugin:
  1. from [OctoberCMS Marketplace](https://octobercms.com/plugin/initbiz-selenium2tests),
  1. clone the code from GitHub into `/plugins/initbiz/selenium2tests` directory or
  1. install using Composer `composer require --dev initbiz/oc-selenium2tests-plugin`
1. Add `"laravel/dusk": "^2.0"` to your `require-dev` section in `composer.json` file
1. Go to `/plugins/initbiz/selenium2tests`
1. Copy `selenium.php.example` to `selenium.php` and configure your environment

**You can also create `selenium.php` file in your root directory, which will be read when the one in plugin's directory does not exist**

### Testing OctoberCMS basics
It is a good practice not to use the same DB for testing and developing purposes.

In order to configure different database for testing purposes create directory `testing` in `config` directory and copy `database.php` to the newly created directory. Then change the default connection as you wish.

After that if you use `APP_ENV=testing` in your `.env` file, configuration from `testing` directory will be used.

## Writing tests in Selenium 2
There are example tests in `tests/example` directory that use `Ui2TestCase` class.

## Running tests
First of all, you have to run Selenium 2 standalone server which is included in the package. In order to start Selenium 2 server go to `<project_root>/plugins/initbiz/selenium2tests` and run `java -jar selenium.jar`.

You are ready to run tests using PHPUnit from OctoberCMS's `vendor/bin/phpunit`.

You can keep test files wherever you want, but `.gitignore` of the plugin will exclude all files from `/tests` except those in `/tests/examples`.

### Browser options (like headless mode)
If you want to for example run browser in headless mode, you can add that line to your `selenium.php` file:

    define('TEST_SELENIUM_BROWSER_OPTIONS', ['--headless']);
