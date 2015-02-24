# Aegon scripts library

The library will host all scripts files and folders required for cXstudio Drupal projects and Technical Library.

## Drupal notes

There are three additionals folders under **./vendor** that we need to care:

* **./vendor/from_misc**: The **./misc** proprietary Drupal folder is synced here at 7.34 Drupal's version. There are only js files, without any images or CSS files and jQuery UI folder is missed on purpose, since we have an updated copy according the Drupal's **jquery_update** module, and at moment we are not using any jQuery UI in the [Aegon technical design library](https://bitbucket.org/cxstudio/aegon-technical-design-library);
* **./vendor/from_modules**: All extra files taken from Drupal's modules that we want test it, should be included here;
* **./vendor/from_themes**: All extra files taken from Drupal's themes that we want test it, should be included here.
