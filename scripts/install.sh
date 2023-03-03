echo installing Mail Reaper 9000
clasp login
clasp create --title "Mail Reaper 9000" --type standalone
touch .env
read -p "set EXAMPLE_ENV_VAR:" example_env_var
echo "EXAMPLE_ENV_VAR=$example_env_var" >> .env
yarn install
yarn run build
clasp push
clasp open
