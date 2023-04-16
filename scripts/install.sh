#!/bin/sh

PROJECT_DIR=$(dirname $(dirname $(realpath "$0")))
BUILD_DIR="$PROJECT_DIR/build"
CONSTANTS_CONFIG_FILE="$PROJECT_DIR/src/configs/constants-initializer.ts"
RULES_DATA_FILE="$PROJECT_DIR/src/data/rules-data.ts"

BLACK=$(tput setaf 0)
RED=$(tput setaf 1)
GREEN=$(tput setaf 2)
YELLOW=$(tput setaf 3)
NORMAL=$(tput sgr0)

echo "${RED}installing Mail Reaper 9000${NORMAL}";

yarn install

# login to clasp and create a project
clasp login
clasp create --title "Mail Reaper 9000" --type standalone --rootDir "$BUILD_DIR"
# puts the generated config file where clasp can find it
if [ -f "$BUILD_DIR/.clasp.json" ]; then
  mv "$BUILD_DIR/.clasp.json" "$PROJECT_DIR"
else
  exit 1
fi

# create/overwrite .env file
: > .env

# add user-supplied env vars to .env file and conditionally whack configs
while true; do
  echo $GREEN
  read -p $'enter user email (required): ' email
  echo $NORMAL

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
  echo $NORMAL

  case $do_setup in
    [yY])
      # build in setup mode, push to GAS, then open
      yarn run build:setup
      clasp push
      clasp open

      printf "%s\n" \
        "${YELLOW}" \
        "Mail Reaper has built and pushed a data sheet setup script to the" \
        "Google Apps Script console. Open the console and manually run the" \
        "\`setupDataSheet\` function to create a formatted Sheets document" \
        "and print the ID of the created Sheets document in the GAS" \
        "execution log." \
        "" \
        "Enter it at the prompt below." \
        "${NORMAL}"

      echo $GREEN
      read -p $'enter Sheets document ID (required): ' sheets_id
      echo $NORMAL
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
      clasp open

      printf "%s\n" \
        "${YELLOW}" \
        "Mail Reaper is configured. You can now define rules in the Mail" \
        "Reaper Rules sheet in the created Sheets doc and create triggers" \
        "to run the main function in the GAS console." \
        "" \
        "See the Configuration section of the project README.md file for" \
        "more information about enabling, disabling, and customizing" \
        "including rule definitions, logging, and digest emails." \
        "${NORMAL}"

      break
    ;;
    [nN])
      yarn run build
      clasp push
      clasp open

      printf "%s\n" \
        "${YELLOW}" \
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
        "including rule definitions, logging, and digest emails." \
        "${NORMAL}"

      break
    ;;
    *)
      echo "invalid input";
    ;;
  esac
done
