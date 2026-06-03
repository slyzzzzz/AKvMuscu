export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { systemPrompt, userPrompt, prompt } = req.body || {};
    const finalPrompt = userPrompt || prompt || "Génère un programme de musculation.";

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: systemPrompt || "Tu es Kael, un coach sportif intelligent.",
          },
          {
            role: "user",
            content: finalPrompt,
          },
        ],
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: data.error?.message || "Erreur OpenAI",
      });
    }

    return res.status(200).json({
      text: data.output_text,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
