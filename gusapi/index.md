# GusApi - Use GUS API to get information from REGON in your project. 
![GusApi banner](https://raw.githubusercontent.com/initbizlab/initbizlab.github.io/master/gusapi/assets/images/gusapi-banner.png)

## Introduction

Gus Api plugin is an OctoberCMS plugin allowing to use [johnzuk/GusApi](https://github.com/johnzuk/GusApi) library.

The library is based on official REGON SOAP api.

[//]: # (Documentation)

### Documentation
If you want to connect to testing version, then install plugin and you are ready to go.

If you want to connect to production, ensure you have:
* `APP_ENV` in you `.env` file set to `production`
* entered your key in backend settings.

#### Example usage

    use Initbiz\GusApi\Classes\GusApi;
    
    //...
    
    $gus = new GusApi();
    
    //With Laravel accent ;)
    $initbiz = collect($gus->getByNip('8661738221'))->first();

### Troubleshooting
Right now installing plugin from Marketplace does not pull `vendor` with original `GusApi` dependencies. So for now you have to download [`composer.json`](https://github.com/initbizlab/oc-gusapi-plugin/blob/master/composer.json) file to `plugins/initbiz/gusapi` directory and in project root run `composer update gusapi/gusapi`.

It is probably a bug in OctoberCMS's Marketplace. It was reported, but waits for October team to take action.