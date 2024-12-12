@echo off
setlocal enabledelayedexpansion

echo "Saving into ~/OneDrive/*"

:: Get current date and time
for /f "tokens=2 delims==" %%I in ('"wmic os get localdatetime /value"') do set datetime=%%I
set curr_date=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%_%datetime:~10,2%_%datetime:~12,2%

:: Create the zip file

powershell -command "Compress-Archive -Path './_____WORKBENCH' -DestinationPath '~/OneDrive/_____WORKBENCH.%curr_date%.bak.zip' -CompressionLevel Optimal -Force -Exclude '*.zip', '*.zip/*', '*/.git/*'"

:: Play a beep sound
echo ^G