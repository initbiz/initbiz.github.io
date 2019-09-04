# PDF Generator -
![PDF Generator banner](https://raw.githubusercontent.com/initbizlab/initbizlab.github.io/master/pdfgenerator/assets/images/pdfgenerator-banner.png)

## Introduction

PdfGenerator plugin is a OctoberCMS plugin allow to generate pdf from twig template. It uses [knplabs/snappy](https://github.com/knplabs/snappy).

### Yet another PDF generator?
Yes, we decided to write another PDF generator. But this one differs a little from all out there.
1. Firstly, it uses [`wkhtmltopdf`](https://wkhtmltopdf.org/) (which is awesome and simple)
1. Secondly, it is simplified as much as possible for OctoberCMS (no special requirements and messy code)
1. Thirdly, it is created to generate PDFs for frontend users and return them in **OctoberCMS's AJAX** (using routing that is almost transparent to user).

[//]: # (Documentation)

## How to
### Configure environment
After installing you should be ready to go, but in a lot of cases you will have to set an absolute path to executable binary of `wkhtmltopdf` in backend settings.

Sometimes you may wish to customize it more:
 * tokenizing - if you want to add pseudorandom 15 chars token to local filename. It does not affect downloaded filename so is set to `true` by default
 * directory where generated PDF files will be stored, `temp_path()` by default
 * removing PDFs files right after sending to user, `true` by default
 * removing files older than specified amount of seconds, two days by default

### Quick start
Here you have an example `onDownloadPdf` AJAX handler that generates PDF and downloads PDF by October's AJAX framework. As simple as that:

    use Initbiz\Pdfgenerator\Classes\PdfGenerator;

    ...

    /*
     * OctoberCMS AJAX handler to download PDF
     */
    public function onDownloadPdf()
        $pdfGenerator = new PdfGenerator();

        //Set absolute path of the Twig layout
        $pdfGenerator->layout = plugins_path().'/initbiz/exampleplugin/views/pdf/pdflayout.htm';

        //Set filename for downloaded file
        $pdfGenerator->filename = "my-pdf";

        //Set data which will be sent to the layout
        $pdfGenerator->data = ['viewData' => 'Value of viewData'];

        $pdfGenerator->generatePdf();

        return $pdfGenerator->downloadPdf();
    }


### More fancy start :)
The plugin comes with a `PdfLayout` class that can be injected to `PdfGenerator`. The above example using the class will look as follows:

    use Initbiz\Pdfgenerator\Classes\PdfGenerator;
    use Initbiz\ExamplePlugin\PdfLayouts\ExampleLayout;
    ...

    /*
     * OctoberCMS AJAX handler to download PDF
     */
    public function onDownloadPdf()
        //Set data which will be injected to the layout
        $data = ['viewData' => 'Value of viewData'];

        $layout = new ExampleLayout($data);

        $pdfGenerator = new PdfGenerator($layout);

        $pdfGenerator->filename = "my-pdf";

        $pdfGenerator->generatePdf();

        return $pdfGenerator->downloadPdf();
    }


It is a little cleaner, but take a look at the `ExampleLayout` class:

    use Initbiz\Pdfgenerator\Classes\PdfLayout;

    class ExampleLayout extends PdfLayout
    {
        public function prepareData($data)
        {
            parent::prepareData($data);

            $this->data['logo'] = $this->assetsPath.'/img/logo.png';
            $this->data['mdicss'] = $this->assetsPath.'/css/materialdesignicons.min.css';

            $this->data['fonts'] = [
                1 => [
                    'name' => 'Material Design Icons',
                    'src'  => $this->assetsPath.'/fonts/mdi/materialdesignicons-webfont.svg',
                    'format' => 'svg'
                ],
            ];
        }
    }
and the files structure of our `PdfLayouts` directory:

```
    PdfLayouts
    ├── examplelayout
    │   ├── assets
    │   │   ├── css
    │   │   │   └── materialdesignicons.min.css
    │   │   ├── fonts
    │   │   │   └── mdi
    │   │   │       └── materialdesignicons-webfont.svg
    │   │   └── img
    │   │       └── logo.png
    │   └── default.htm
    └── ExampleLayout.php
```

As you can see it is a very OctoberCMS styled format. Just create a class and corresponding directory with lower-cased name.

It is a great way of organizing your PDF layouts with all assets they need to have included. Still keeping it as simple as possible, but not simpler :).

## Troubleshooting and pro tips

### Pro tip #1: fonts format
While working with PDFs you probably will want to beautify them as much as possible. They will be displaying images, custom fonts or icons.
But sometimes `wkhtmltopdf` messes up a little.

#### Artifacts in rounded letters (O, B, P, R etc...)
If you have included font using `TrueType` (`ttf`), than try to change it to `OpenType` (`otf`). If you do not have the file, than look for online converters. They are doing it pretty well.

#### Material Design Icons and Adobe Reader
If you add `Material Design Icons` (probably MDI are not the only case) Adobe Reader can have problems with reading the PDF (error 135). In this case you should change `MDI` to svg version as in above example. Then they appear as normal images.

## Future plans
* Managing layouts from CLI or backend settings
* Looking for assets in shared directories