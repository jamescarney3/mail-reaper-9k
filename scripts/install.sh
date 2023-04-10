#!/bin/sh

PROJECT_DIR=$(dirname $(dirname $(realpath "$0")))
BUILD_DIR="$PROJECT_DIR/build"
CONSTANTS_CONFIG_FILE="$PROJECT_DIR/src/configs/constants-initializer.ts"
RULES_DATA_FILE="$PROJECT_DIR/src/data/rules-data.ts"

RESET="\n\033[0m"
RED="\033[31m"
GREEN="\033[32m"
BLUE="\033[34m"

echo "${RED}installing Mail Reaper 9000${RESET}";

# login to clasp and create a project
clasp login
clasp create --title "Mail Reaper 9000" --type standalone --rootDir "$BUILD_DIR"
# puts the generated config file where clasp can find it
mv "$BUILD_DIR/.clasp.json" "$PROJECT_DIR"

# create/overwrite .env file
: > .env

# add user-supplied env vars to .env file and conditionally whack configs
echo $GREEN
read -p "enter user email (required):" email
echo $RESET
echo "USER_EMAIL=$email" >> .env

echo $GREEN
read -p "enter Sheets document ID to configure rules (optional):" rules_sheet_id
echo $RESET
echo "RULES_SHEET_ID=$rules_sheet_id" >> .env
RULES_SOURCE_SHEETS="RULES_SOURCE: RulesSourceString = 'sheets doc'"
RULES_SOURCE_MODULE="RULES_SOURCE: RulesSourceString = 'data module'"

if [ ! -z "$rules_sheet_id" ]
then
  # sed "s/RULES_SOURCE: RulesSourceString = 'sheets doc'/RULES_SOURCE: RulesSourceString = 'data module'/" $CONSTANTS_CONFIG_FILE
  sed "s/$RULES_SOURCE_MODULE/$RULES_SOURCE_SHEETS/" $CONSTANTS_CONFIG_FILE \
    > "$CONSTANTS_CONFIG_FILE.tmp" \
    && mv "$CONSTANTS_CONFIG_FILE.tmp" $CONSTANTS_CONFIG_FILE

  echo "Mail Reaper will look for rule definitions in a sheet named";
  echo "'Mail Reaper Rules' in this Sheets document:";
  echo "${BLUE}https://docs.google.com/spreadsheets/d/$rules_sheet_id${RESET}";
  echo "if it's already configured for use by Mail Reaper, no further";
  echo "action is required; if it doesn't exist or is not configured,";
  echo "see the project README file for setup instructions"
else
  sed "s/$RULES_SOURCE_SHEETS/$RULES_SOURCE_MODULE/" $CONSTANTS_CONFIG_FILE \
    > "$CONSTANTS_CONFIG_FILE.tmp" \
    && mv "$CONSTANTS_CONFIG_FILE.tmp" $CONSTANTS_CONFIG_FILE

  echo "using rules definitions from $RULES_DATA_FILE; the rules";
  echo "definition source can be configured later via this config";
  echo "file: ${BLUE}$CONSTANTS_CONFIG_FILE${RESET}";
fi
echo $GREEN
read -p "enter Sheets document ID to log results (optional):" results_sheet_id
echo $RESET
echo "RESULTS_SHEET_ID=$results_sheet_id" >> .env
LOG_REPORT_DATA_ON="LOG_REPORT_DATA: LogReportDataOption = true"
LOG_REPORT_DATA_OFF="LOG_REPORT_DATA: LogReportDataOption = false"

if [ ! -z "$results_sheet_id" ]
then
  sed "s/$LOG_REPORT_DATA_OFF/$LOG_REPORT_DATA_ON/" $CONSTANTS_CONFIG_FILE \
    > "$CONSTANTS_CONFIG_FILE.tmp" \
    && mv "$CONSTANTS_CONFIG_FILE.tmp" $CONSTANTS_CONFIG_FILE

  echo "Mail Reaper will log reports for each email it processes to"
  echo "a sheet named 'Mail Reaper Results' in this Sheets document:";
  echo "${BLUE}https://docs.google.com/spreadsheets/d/$results_sheet_id${RESET}";
  echo "if it's already configured for use by Mail Reaper, no further";
  echo "action is required; if it doesn't exist or is not configured,";
  echo "see the project README file for setup instructions"
else
  sed "s/$LOG_REPORT_DATA_ON/$LOG_REPORT_DATA_OFF/" $CONSTANTS_CONFIG_FILE \
    > "$CONSTANTS_CONFIG_FILE.tmp" \
    && mv "$CONSTANTS_CONFIG_FILE.tmp" $CONSTANTS_CONFIG_FILE

  echo "skipping logging in Google sheets; logging can be configured";
  echo "later in the constants config file: ${BLUE}$CONSTANTS_CONFIG_FILE${RESET}";
fi

# install dependencies and build main script
yarn install
yarn run build

# push compiled artifacts to GAS
clasp push
clasp open

echo "Mail Reaper requires that the Gmail API service be enabled in the";
echo "Apps Script console; please add the service and confirm below";
echo $GREEN
read -n1 -p "Gmail API service enabled? [y/n]:" answer
echo $RESET
case $answer in
  [yY])
    clasp pull
    # clasp/GAS will pull down a .js file but we don't need it here;
    # the webpack/ts-compiled .gs version is the authoritative one
    rm "${BUILD_DIR}/code.js"
    echo "Mail Reaper is ready for scheduling in GAS and local development";
    ;;
  [nN])
    echo "before running Mail Reaper, please enable the Gmail API service";
    echo "in the GAS console; if you wish to develop locally, you will likely";
    echo "also want to run \`clasp pull\` to update the appsscript.json file";
    echo "in the build directory to list the Gmail API service as a dependency -";
    echo "if you skip this step you'll need to re-enable the service each time";
    echo "you push a new build to GAS";
    ;;
esac
