import { google } from 'googleapis';

export async function getScore() {
    try {
        const target = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
        const jwt = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            null,
            (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            target
        );

        const sheets = google.sheets({ version: 'v4', auth: jwt });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'score', // sheet name
        });

        const rows = response.data.values;
        if (rows.length) {

            return rows.map((row) => ({
                person: row[0],
                score: row[1],
            }));
        }
    } catch (err) {
        console.log(err);
    }
    return [];
}
