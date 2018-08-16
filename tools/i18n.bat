:start
@echo off

cls
set lang=en

echo Availables locales for Mastodon Share
echo.
dir ..\src\_locales /B
echo.

set /p lang="Please set a locale code [en]: "

chrome --lang=%lang% --user-data-dir=%TMP%\chrome-profile-%lang% --load-extension=%cd%\..\build\chrome\
goto start