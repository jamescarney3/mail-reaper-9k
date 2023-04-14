#!/bin/sh

PROJECT_DIR=$(dirname $(dirname $(realpath "$0")))
BUILD_DIR="$PROJECT_DIR/build"
CONSTANTS_CONFIG_FILE="$PROJECT_DIR/src/configs/constants-initializer.ts"
RULES_DATA_FILE="$PROJECT_DIR/src/data/rules-data.ts"

RESET="\n\033[0m"
RED="\033[31m"
GREEN="\033[32m"

echo "${RED}installing Mail Reaper 9000${RESET}";

yarn install

# login to clasp and create a project
clasp login
clasp create --title "Mail Reaper 9000" --type standalone --rootDir "$BUILD_DIR"
# puts the generated config file where clasp can find it
mv "$BUILD_DIR/.clasp.json" "$PROJECT_DIR"

# create/overwrite .env file
: > .env

# add user-supplied env vars to .env file and conditionally whack configs
while true; do
  echo $GREEN
  read -p $'enter user email (required): ' email
  echo $RESET

  if [ ! -z $email ]
  then
    echo "USER_EMAIL=$email" >> .env

    break
  else
    echo "invalid input";
  fi
done

while true; do
  echo $GREEN
  read -n1 -p $'create new Google Sheets document for rules and logs? [y/N]: ' do_setup
  echo $RESET

  case $do_setup in
    [yY])
      # build in setup mode, push to GAS, then open
      yarn run build:setup
      clasp push
      clasp open

      printf "%s\n" \
        "Mail Reaper has built and pushed a data sheet setup script to the" \
        "Google Apps Script console. Manually run the \`setupDataSheet\`" \
        "function to print the ID of the created Sheets document in the GAS" \
        "execution log and make and enter it below" \
        ""

      echo $GREEN
      read -p $'enter Sheets document ID (required): ' sheets_id
      echo $RESET
      echo "RULES_SHEET_ID=$sheets_id" >> .env
      echo "RESULTS_SHEET_ID=$sheets_id" >> .env

      RULES_SOURCE_SHEETS="RULES_SOURCE: RulesSourceString = 'sheets doc'"
      RULES_SOURCE_MODULE="RULES_SOURCE: RulesSourceString = 'data module'"

      sed "s/$RULES_SOURCE_MODULE/$RULES_SOURCE_SHEETS/" $CONSTANTS_CONFIG_FILE \
        > "$CONSTANTS_CONFIG_FILE.tmp" \
        && mv "$CONSTANTS_CONFIG_FILE.tmp" $CONSTANTS_CONFIG_FILE

      LOG_REPORT_DATA_ON="LOG_REPORT_DATA: LogReportDataOption = true"
      LOG_REPORT_DATA_OFF="LOG_REPORT_DATA: LogReportDataOption = false"

      sed "s/$LOG_REPORT_DATA_OFF/$LOG_REPORT_DATA_ON/" $CONSTANTS_CONFIG_FILE \
        > "$CONSTANTS_CONFIG_FILE.tmp" \
        && mv "$CONSTANTS_CONFIG_FILE.tmp" $CONSTANTS_CONFIG_FILE

      yarn run build
      clasp push

      printf "%s\n" \
        "Mail Reaper is configured. You can now define rules in the Mail" \
        "Reaper Rules sheet in the created Sheets doc and create triggers" \
        "to run the main function in the GAS console." \
        "" \
        "See the Configuration section of the project README.md file for" \
        "more information about enabling, disabling, and customizing" \
        "including rule definitions, logging, and digest emails."

      break
    ;;
    [nN])
      yarn run build
      clasp push
      clasp open

      printf "%s\n" \
        "Mail Reaper will load rules from the src/data/rules-data.ts file." \
        "To add or change rules, run a Webpack build after editing the" \
        "exported array and use clasp to push the new build to Google Apps" \
        "Script. Any triggers will be preserved but execute with the new" \
        "updated build." \
        "" \
        "Mail Reaper will not write any logs directly, but will still send" \
        "a digest email each time the main script runs" \
        "" \
        "See the Configuration section of the project README.md file for" \
        "more information about enabling, disabling, and customizing" \
        "including rule definitions, logging, and digest emails."

      break
    ;;
    *)
      echo "invalid input";
    ;;
  esac
done
