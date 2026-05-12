export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

async function handleContact(request, env) {
  try {
    const formData = await request.formData();

    // Honeypot — silently discard
    if (formData.get('_gotcha')) {
      return Response.json({ ok: true });
    }

    // Require Turnstile token
    const token = formData.get('cf-turnstile-response');
    if (!token) {
      return Response.json({ error: 'CAPTCHA required.' }, { status: 400 });
    }

    // Verify with Cloudflare
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip })
    });

    const verify = await verifyRes.json();
    if (!verify.success) {
      return Response.json({ error: 'CAPTCHA verification failed. Please try again.' }, { status: 400 });
    }

    return Response.json({ ok: true });

  } catch (err) {
    return Response.json({ error: 'Server error.' }, { status: 500 });
  }
}
