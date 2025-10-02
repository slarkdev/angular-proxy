export default async function handler(req, res) {
  const path = req.url.replace(/^\/api/, '');
  const url = `https://optisteel.ingaria.com${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: ['POST', 'PUT', 'PATCH'].includes(req.method)
        ? JSON.stringify(req.body || await readBody(req))
        : undefined,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch {
    res.status(500).json({ error: 'Error al conectar con optisteel.ingaria.com' });
  }
}

async function readBody(req) {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return JSON.parse(Buffer.concat(buffers).toString());
}