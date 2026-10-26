## Connect RSVP & Wishes to Google Sheets

Sheet: https://docs.google.com/spreadsheets/d/18bCf003WBbG18fmWLkKYkz2Fq4Ra4o0PzFXHLRWeb7U/edit

1. Open the Google Sheet and go to Extensions > Apps Script.
2. Delete everything in Code.gs and paste the full code from google-apps-script/code.gs. Save.
3. In the function dropdown at the top, select setupSheets and click Run.
   Approve the permission prompt (Advanced > Go to project > Allow).
   This creates two tabs with maroon header rows:
   - RSVP: Timestamp | Full Name | Phone Number | Number of Guests | Attending | Dietary Restrictions / Requests
   - Wishes: Timestamp | Name | Wishes / Blessing
4. Click Deploy > New deployment > gear icon > Web app.
   - Execute as: Me
   - Who has access: Anyone
5. Click Deploy and copy the Web App URL (ends with /exec).
6. In the project root, create a file named .env containing:

   VITE_GOOGLE_APPS_SCRIPT_URL=YOUR_WEB_APP_URL

7. Restart the dev server (npm run dev). For the live site, add the same
   VITE_GOOGLE_APPS_SCRIPT_URL environment variable in your hosting settings
   (e.g. Vercel > Project > Settings > Environment Variables) and redeploy.

Notes:
- If you change code.gs later, use Deploy > Manage deployments > Edit > New version,
  so the URL stays the same.
- Opening the Web App URL in a browser should show:
  {"ok":true,"message":"Nilaga & Dinu wedding form endpoint is running."}
