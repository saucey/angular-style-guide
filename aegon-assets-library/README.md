# Aegon assets library

The library will host the Assets files and folders required for cXstudio Drupal projects and Technical Library.

# Icon font

If you want to add icons to the font library, this is how you should do it:

- go to https://icomoon.io/app/
- import your font from assets-library/fonts/aegon_icons.svg
- import the svg's for new icons to your set
- select all icons from your set and click the "export font" button
- make sure (before you export the font files) that your font name is set to "aegon_icons"
- replace the font files in assets-library/fonts/ with the new files
- commit and push and you can use the new icons in your css!

In structions for using the font icons in your css:

- go to sass-library/helpers/_variables.scss
- there you will find a section with $font_icons_* variables
- lookup the unicode for the icon you want to use (in aegon_icons.svg) and add it to the list of variables
- add a logical className for your icon in sass-library/base/_icons.scss, like this:

.icon-myiconname:before {
    content: '\eXXX'; <-- replace XXX with your unicode
}

- that's it, now you can use 'icon-myiconname' as a class in your html