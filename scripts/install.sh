echo installing Mail Reaper 9000
clasp login
clasp create --title "Mail Reaper 9000" --type standalone
yarn install
yarn run build
clasp push
clasp open
