export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  if (req.headers["x-secret"] !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const body = req.body

  if (!body.slug || !body.title || !body.content) {
    return res.status(400).json({ error: "Missing required fields: slug, title, content" })
  }

  try {
    const response = await fetch(
      "https://api.github.com/repos/Apexium-Dev/systemlink-publisher/dispatches",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `token ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_type: "publish-article",
          client_payload: body,
        }),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      return res.status(500).json({ error: `GitHub API error: ${text}` })
    }

    return res.status(200).json({ success: true, message: "Article queued — will be live in ~60 seconds." })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
