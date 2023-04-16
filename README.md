
# Mail Reaper 9000
Mail Reaper 9000 is an Gmail inbox management tool with the ability to automatically label and archive emails according to a user-defined set of rules that describe to how to identify individual threads and what operations to perform on them.

Its main routine can be scheduled via Google Apps Script triggers at any interval supported by that platform.

If you like the idea of staying organized with filters but prefer to see emails (shipping receipts, Trello notifications, newsletters, etc) first land in your inbox, this tool is for you.

## Setup
### Requirements
Mail Reaper runs in the Google Apps Script runtime, but requires Node with global installations of `yarn` and `clasp` to build and push its compiled script to GAS. Recommended versions for development are node v19.6.0, yarn v1.17.3, and clasp v2.4.2 or greater. The installation was developed to run in `zsh` but should also work in `sh` and `bash`.

### Installation
1. Verify node, yarn, and clasp installations:
```
$ node -v
v19.6.0
$ yarn -v
1.17.3
$ clasp -v
2.4.2
```

2. Enable the Google Apps Script API for the Google account associated with your inbox [here](https://script.google.com/home/usersettings).

3. Clone the project repo:
```
git clone git@github.com:jamescarney3/mail-reaper-9k.git
```

4. Run the install script:
```
$ cd mail-reaper-9k
$ sh ./scripts/install.sh
```

5. If this is a new instance, follow the prompts, electing to create a new Sheets document for rule definitions and logging. If you have an existing Sheets document you'd like to use with Mail Reaper or would prefer to configure rule definitions in the source code, do not create a new Sheets document one and see the Advanced Configuration section of this guide (coming soon).

6. If you chose to create a new Sheets document, the install script will push a build containing the `setupDataSheet` function to the project and open the GAS console. Manually run the function and note the log output. It will include the url of the created Sheets document (open it) and its ID. Input the logged ID at the next prompt and close the GAS console window.

7. `clasp` will now run a build with the main script, push it to GAS, and open the console again. You should see a script with one function (`execute`). In order to execute the function, you must enable the Gmail API service from the left menu. Click the "+" button next to "Services", find "Gmail API" in the list, select it, and click the "Add" button.

8. Run the `execute` function manually to approve permissions. You may now add schedule triggers from the left menu in the GAS console.

9. If you plan to develop the project locally (e.g. if you want to use any of the advanced configs or define rules in the source), this is a good time to refresh the `appsscript.json` manifest. The version in the build directory won't reflect that you've enabled the Gmail API service until you pull down a new snapshot with `clasp`, but it will overwrite the enabled services each time you push with it. If you prefer not to have to re-enable the service each time you push, pull the remote version by running:
```
sh ./scripts/refresh-manifest.sh
```

## Configuration
[[ coming soon ]]

## Advanced Configuration
[[ coming soon ]]

## Troubleshooting
### Clasp fails during installation
During installation, you may see this output from clasp:

> `User has not enabled the Apps Script API. Enable it by visiting https://script.google.com/home/usersettings then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.`

This probably means you either skipped installation step 2 or that Google is still processing your settings change. Ensure the Apps Script API is [enabled](https://script.google.com/home/usersettings), and if it is wait a few minutes and try again.

### Anything Else
If at any point during the installation process something else breaks, just start over. I tried to make the scripting as robust as I could but shell scripting is hard. I promise none of it writes anything to storage outside of the project directory; just nuke it and run it back. If it happens more than once, feel free to open an issue on the project and/or start praying I guess.
