curr_date=$(date +"%Y-%m-%d_%H_%M_%S")
zip -r "~/iCloud/_____WORKBENCH.$curr_date.bak.zip" ./_____WORKBENCH -x "*.zip" -x "*.zip/*" -x "*/.git/*"
echo -e "\a"
