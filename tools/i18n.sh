#!/bin/bash

lang=en
chrome=$( which chrome )

if [ "x${chrome}" == "x" ]; then
  chrome=$( which google-chrome )
fi

if [ "x${chrome}" == "x" ]; then
  chrome=$( which chromium-browser )
fi

if [ "x${chrome}" == "x" ]; then
  chrome=$( which chromium )
fi

echo Availables locales for Mastodon Share
echo
ls ../src/common/_locales -b
echo

read -p "Please set a locale code [en]: " lang

export LANGUAGE=${lang}.UTF-8
rm -rf /tmp/chrome-profile-${lang}

${chrome} --lang=${lang} --user-data-dir=/tmp/chrome-profile-${lang} --load-extension=${PWD}/../build/chrome
