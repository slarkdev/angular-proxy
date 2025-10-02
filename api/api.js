export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://optisteel.vercel.app"); // o '*' si estás en desarrollo
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const backendBase = 'https://optisteel.ingaria.com';
  const proxyPath = req.url.replace(/^\/api/, '');
  const targetUrl = `${backendBase}${proxyPath}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
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
