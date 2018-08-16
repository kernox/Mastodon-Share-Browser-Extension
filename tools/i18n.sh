#!/bin/bash

lang=en

echo Availables locales for Mastodon Share
echo
ls ../src/_locales -b
echo

read -p "Please set a locale code [en]: " lang

chrome --lang=$lang --user-data-dir=/tmp/chrome-profile-$lang --load-extension=$PWD/../build/chrome