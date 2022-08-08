import { google } from "googleapis";
import * as dotenv from "dotenv";
dotenv.config();
const SHEETS_API_KEY = process.env["SHEETS_API_KEY"];
const SPREADSHEET_ID = process.env["SPREADSHEET_ID"];

function listInfo() {
  const sheets = google.sheets("v4");
  // key=Spreadsheet roles, value=Discord roles
  const OFFICER_ROLES = new Map(
    Object.entries({
      "Hard-coded-role": "President",
      "Board, Internal": "Board Officer",
      "Board, External": "Board Officer",
      AI: "AI Officer",
      Cyber: "Cyber Officer",
      Design: "Design Officer",
      "Game Studio": "Studio Officer",
      Hack: "Hack Officer",
      ICPC: "ICPC Officer",
      "Teach LA": "Teach LA Officer",
      W: "ACM-W Officer",
    })
  );

  // Get roles from google sheets
  sheets.spreadsheets.values.batchGet(
    {
      spreadsheetId: SPREADSHEET_ID,
      ranges: ["Officers!A:A", "Officers!I:I"],
      key: SHEETS_API_KEY,
    },
    (err: any, res) => {
      if (err) {
        console.error(err);
        return new Map<string, string[]>();
      }

      // Check roles and discordTags are there
      const rows = res?.data.valueRanges;
      if (!rows || rows.length === 0) {
        console.log("No data found.");
        return new Map<string, string[]>();
      } else {
        const roles = rows[0].values;
        const discordTags = rows[1].values;
        if (!roles || !discordTags) {
          console.log("Error fetching values");
          return new Map<string, string[]>();
        }

        // Initialize output
        const rowsLength = roles.length;
        let currRole = undefined;
        let output: Map<string, string[]> = new Map();
        for (const role of OFFICER_ROLES) {
          output.set(role[1], []);
        }
        // Hard code President role
        const presidentDiscordTag = discordTags[1][0];
        output.set("President", [presidentDiscordTag]);
        // Add discord tags to output dict
        // Update currRole when we read an officer role
        for (let i = 2; i < rowsLength; i++) {
          const currTag = discordTags[i][0];
          const currSheetRole = roles[i][0];

          if (OFFICER_ROLES.has(currSheetRole)) {
            currRole = OFFICER_ROLES.get(currSheetRole);
          } else {
            if (!currRole) {
              console.log("error getting roles");
              return new Map<string, string[]>();
            }

            if (currTag && currTag !== "") {
              output.get(currRole)?.push(currTag);
            }
          }
        }
        // TODO: Make it so that it goes through the discord bot to actually update everyone's roles!
        const outputMap = Array.from(output.entries());
        console.log(outputMap);
        //console.log(output);
        //return output;
      }
    }
  );
}

listInfo();
