// Netlify Function: checks the submitted PIN against an environment variable.
// The real PIN never gets sent to the browser — only true/false comes back.
//
// Setup: in Netlify, go to Site configuration > Environment variables and add:
//   Key:   LOCK_PIN
//   Value: 050621   (or whatever 6-digit PIN you want)
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let pin;
  try {
    ({ pin } = JSON.parse(event.body || '{}'));
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'bad request' }) };
  }

  const correctPin = process.env.LOCK_PIN;

  if (!correctPin) {
    // Misconfiguration on the Netlify side — fail closed, not open.
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'server not configured' }) };
  }

  const match = typeof pin === 'string' && pin === correctPin;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: match })
  };
};
