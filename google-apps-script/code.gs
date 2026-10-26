// Nilaga & Dinu wedding – RSVP and Wishes collector
// https://docs.google.com/spreadsheets/d/18bCf003WBbG18fmWLkKYkz2Fq4Ra4o0PzFXHLRWeb7U/edit
const SPREADSHEET_ID = '18bCf003WBbG18fmWLkKYkz2Fq4Ra4o0PzFXHLRWeb7U';

const SHEETS = {
  RSVP: {
    name: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Phone Number', 'Number of Guests', 'Attending', 'Dietary Restrictions / Requests'],
    widths: [170, 200, 150, 140, 120, 320],
  },
  WISH: {
    name: 'Wishes',
    headers: ['Timestamp', 'Name', 'Wishes / Blessing'],
    widths: [170, 200, 520],
  },
};

const HEADER_BG = '#8B1E2F';
const HEADER_TEXT = '#FFFFFF';

// Run this once from the Apps Script editor (select "setupSheets" and click Run)
// to create both tabs with formatted headers.
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(SHEETS).forEach(function (key) {
    prepareSheet_(ss, SHEETS[key]);
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = parsePayload_(e);
    const sheetKey = String(payload.sheet || '').toUpperCase();
    const config = SHEETS[sheetKey];

    if (!config) {
      return jsonResponse_({ ok: false, error: 'Invalid sheet. Use RSVP or WISH.' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = prepareSheet_(ss, config);

    if (sheetKey === 'RSVP') {
      const attendance = String(payload.attendance || '').toLowerCase();
      sheet.appendRow([
        new Date(),
        clean_(payload.name),
        clean_(payload.phone || payload.email),
        clean_(payload.guests),
        attendance === 'yes' ? 'Joyfully Accept' : attendance === 'no' ? 'Regretfully Decline' : clean_(payload.attendance),
        clean_(payload.dietaryRestrictions),
      ]);
    } else {
      sheet.appendRow([
        new Date(),
        clean_(payload.name),
        clean_(payload.message),
      ]);
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Nilaga & Dinu wedding form endpoint is running.',
  });
}

function prepareSheet_(ss, config) {
  let sheet = ss.getSheetByName(config.name);
  if (!sheet) {
    sheet = ss.insertSheet(config.name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(config.headers);
    sheet.getRange(1, 1, 1, config.headers.length)
      .setFontWeight('bold')
      .setBackground(HEADER_BG)
      .setFontColor(HEADER_TEXT)
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);
    config.widths.forEach(function (width, i) {
      sheet.setColumnWidth(i + 1, width);
    });
    sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm');
    sheet.getRange(2, config.headers.length, sheet.getMaxRows() - 1, 1).setWrap(true);
  }

  return sheet;
}

// Prevents values starting with = + - @ from being run as spreadsheet formulas.
function clean_(value) {
  const text = String(value == null ? '' : value).trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function parsePayload_(e) {
  const params = e && e.parameter ? e.parameter : {};

  if (Object.keys(params).length > 0) {
    return params;
  }

  const contents = e && e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) {
    return {};
  }

  if (contents.indexOf('=') !== -1 && contents.indexOf('{') !== 0) {
    return parseQueryString_(contents);
  }

  try {
    return JSON.parse(contents);
  } catch (_error) {
    return {};
  }
}

function parseQueryString_(query) {
  const out = {};
  const pairs = String(query).split('&');

  for (let i = 0; i < pairs.length; i++) {
    const part = pairs[i];
    if (!part) continue;

    const idx = part.indexOf('=');
    const rawKey = idx >= 0 ? part.slice(0, idx) : part;
    const rawValue = idx >= 0 ? part.slice(idx + 1) : '';
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    out[key] = value;
  }

  return out;
}

function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
