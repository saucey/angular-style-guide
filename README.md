# Aegon SASS library

The library will host the SASS library required for cXstudio Drupal projects and Design Technical Library.


## Technical notes & guidelines

* Library doesn't require any file help or development project environment. It will be shared with repos listed below:
	* aegon-technical-design-library
	* aegon-drupal-base-theme
	* any other projects
* Don't use anymore vendor prefixes. They will be added by Autoprefixer as Grunt task inside father projects.


## First usage after git clone

* This library will be used as submodule ot other projects. Where added, please run also **bower install** in relative subfolder to create Bower dependencies as vendors/ folder.