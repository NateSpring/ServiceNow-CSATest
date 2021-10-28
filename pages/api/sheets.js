import { google } from 'googleapis';

export async function getSheetData() {
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
            range: 'csa', // sheet name
        });

        console.log(response.data)

        const rows = response.data.values;
        if (rows.length) {
            return rows.map((row) => ({
                question: row[0],
                options: row[1],
                answer: row[2]
            }));
        }
    } catch (err) {
        console.log(err);
    }
    return [];
}
