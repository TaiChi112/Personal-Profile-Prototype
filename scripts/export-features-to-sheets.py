import os
import csv
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build

def export_to_sheets():
    # 1. Credentials & Setup
    SPREADSHEET_ID = os.environ.get('SPREADSHEET_ID')
    CREDENTIALS_FILE = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    
    if not SPREADSHEET_ID or not CREDENTIALS_FILE:
        print("Error: Please set SPREADSHEET_ID and GOOGLE_APPLICATION_CREDENTIALS environment variables.")
        return

    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    service = build('sheets', 'v4', credentials=creds)
    
    project_name = "Personal-Profile-Prototype"
    tab_title = f"{project_name} Features"
    
    # 2. Create a new tab
    sheet_metadata = service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
    sheets = sheet_metadata.get('sheets', '')
    
    # Check if tab exists, if not create it
    tab_exists = False
    sheet_id = None
    for sheet in sheets:
        if sheet.get("properties", {}).get("title") == tab_title:
            tab_exists = True
            sheet_id = sheet.get("properties", {}).get("sheetId")
            break
            
    if not tab_exists:
        requests = [{
            'addSheet': {
                'properties': {
                    'title': tab_title
                }
            }
        }]
        response = service.spreadsheets().batchUpdate(
            spreadsheetId=SPREADSHEET_ID,
            body={'requests': requests}
        ).execute()
        sheet_id = response['replies'][0]['addSheet']['properties']['sheetId']
        print(f"Created new tab: {tab_title}")
    else:
        print(f"Tab {tab_title} already exists. Updating it.")

    # 3. Read CSV data
    data = []
    with open('../features.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        for row in reader:
            data.append(row)

    # 4. Write data to the tab
    body = {
        'values': data
    }
    range_name = f"'{tab_title}'!A1:E"
    service.spreadsheets().values().update(
        spreadsheetId=SPREADSHEET_ID,
        range=range_name,
        valueInputOption='RAW',
        body=body
    ).execute()
    print("Data uploaded.")

    # 5. Apply Formatting (Bold headers, colored background, text wrap)
    format_requests = [
        # Format Header Row (Bold, Background Color, White Text)
        {
            "repeatCell": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": 0,
                    "endRowIndex": 1,
                    "startColumnIndex": 0,
                    "endColumnIndex": 5
                },
                "cell": {
                    "userEnteredFormat": {
                        "backgroundColor": {"red": 0.2, "green": 0.2, "blue": 0.2},
                        "textFormat": {"bold": True, "foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}}
                    }
                },
                "fields": "userEnteredFormat(backgroundColor,textFormat)"
            }
        },
        # Enable Text Wrapping for all cells
        {
            "repeatCell": {
                "range": {
                    "sheetId": sheet_id,
                    "startRowIndex": 0,
                    "endRowIndex": len(data),
                    "startColumnIndex": 0,
                    "endColumnIndex": 5
                },
                "cell": {
                    "userEnteredFormat": {
                        "wrapStrategy": "WRAP"
                    }
                },
                "fields": "userEnteredFormat.wrapStrategy"
            }
        },
        # Auto-resize columns
        {
            "autoResizeDimensions": {
                "dimensions": {
                    "sheetId": sheet_id,
                    "dimension": "COLUMNS",
                    "startIndex": 0,
                    "endIndex": 5
                }
            }
        }
    ]

    service.spreadsheets().batchUpdate(
        spreadsheetId=SPREADSHEET_ID,
        body={'requests': format_requests}
    ).execute()
    
    print("Formatting applied successfully.")

if __name__ == '__main__':
    export_to_sheets()
