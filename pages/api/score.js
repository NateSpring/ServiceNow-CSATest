import { google } from 'googleapis';

export default async (req, res) => {
    try {
        const target = ['https://www.googleapis.com/auth/spreadsheets'];
        const jwt = new google.auth.JWT(
            process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            null,
            (process.env.GOOGLE_SHEETS_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
            target
        );

        const sheets = google.sheets({ version: 'v4', auth: jwt });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'score'
        });

        const rows = response.data.values;

        let person = req.body.person
        let location, currentScore;

        if (person == 'Nate') {
            location = 'B2'
            currentScore = parseInt(rows[1][1])
        } else if (person == 'Reid') {
            location = 'B3'
            currentScore = parseInt(rows[1][2])
        }

        currentScore += 10;

        const res = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: `score!${location}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[`${currentScore}`]],
            }
        })

        // console.log(res)


        if (rows.length) {
            return rows.map((row) => ({
                title: row[0],
                description: row[1],
            }));
        }
    } catch (err) {
        console.log(err);
    }

    return [];
}
