# Updating Discord Roles with A Script!

Here's a script that we can run which will grab all of the officers' info and what roles they need for discord based off of the spreadsheet, then use the discord bot to update roles on discord!

## Grabbing Info from the Spreadsheet

With a valid Google API key and setting your .env with the requested fields, (SHEETS_API_KEY with our spreadsheet api key and SPREADSHEET_ID with our current officer information spreadsheet), you can simply run `yarn get-roles" to run our script to update officer roles within the discord!
