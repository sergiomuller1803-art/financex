export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY não configurada.' });

  const { messages, system, max_tokens } = req.body;

  const contents = [];
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += '\n' + m.content;
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }
  if (contents.length > 0 && contents[0].role === 'model') contents.shift();
  if (contents.length === 0) contents.push({ role: 'user', parts: [{ text: 'Olá' }] });

  const body = {
    contents,
    generationConfig: { maxOutputTokens: max_tokens || 1000 },
  };
  if (system) {
    body.systemInstruction = { parts: [{ text: system }] };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.error?.message ||
      'Erro ao obter resposta.';
    res.status(200).json({ content: [{ text }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
