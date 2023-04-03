# Mastodon Share
A share button for Mastodon Social Network

## First usage
Go to the option panel of the plugin and set your Mastodon instance url.

## Features

#### Share pages on Mastodon
![Share pages](screenshots/share-pages.png)


#### Share a text selection on Mastodon
![Share a text selection](screenshots/share-selection-feature.png)


#### Share from Twitter to Mastodon

![Share from twitter](screenshots/share-from-twitter-feature.png)

### Automatic hashtags
When you share a page, hashtags has generated from page keywords

#### Configuration panel
![Configuration panel](screenshots/settings.png)


## Download the public extension

#### Google Chrome
https://chrome.google.com/webstore/detail/mastodon-share/ngkommdldcakheaeoafgakbbiinkohom?hl=fr

#### Mozilla Firefox
https://addons.mozilla.org/firefox/addon/mastodon-share/


## How to build the extension from sources
You need to have nodejs with npm installed
- Open command line console / terminal
- Set "npm install"
- Set "gulp"
- The extension is compiled for chrome and firefox and placed on "build" directory (do not use "src" directory to install the extension in your browser)

## How to help on translation

In tools directory launch i18n.bat / i18n.sh
  
![i18n tool](screenshots/terminal-i18n.jpg)
  
- Choose the locale you want to test (default is "en" for English)
- A chrome browser window opening in the selected lang.
- Test the extension
  
 You can edit the locales files in the "/src/_locales/" directory.
 





