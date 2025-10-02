export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*"); // o especifica tu frontend exacto
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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
