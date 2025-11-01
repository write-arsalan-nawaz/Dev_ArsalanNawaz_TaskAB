import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

type Faq = { id: string; title: string; body: string };
type RespOk = { results: Array<{ id: string; title: string; snippet: string }>, summary?: string, sources?: string[] };
type RespErr = { error: string };

function scoreDoc(q: string, doc: Faq) {
  const text = (doc.title + " " + doc.body).toLowerCase();
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const t of tokens) {
    const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\b`, "g");
    const matches = text.match(re);
    if (matches) score += matches.length * 2;
    if (doc.title.toLowerCase().includes(t)) score += 1;
    if (doc.body.toLowerCase().includes(t)) score += 0.5;
  }
  return score;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<RespOk | RespErr>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { query } = req.body ?? {};
  if (!query || typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  const dataPath = path.join(process.cwd(), "data", "faqs.json");
  let faqs: Faq[] = [];
  try {
    const raw = fs.readFileSync(dataPath, "utf-8");
    faqs = JSON.parse(raw) as Faq[];
  } catch (err) {
    console.error("Failed to read faqs.json", err);
    return res.status(500).json({ error: "Server error reading dataset" });
  }

  const scored = faqs
    .map(doc => ({ doc, score: scoreDoc(query, doc) }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    return res.status(200).json({ results: [] , summary: "No matches found for your query. Try different keywords.", sources: []});
  }

  const top = scored.slice(0, 3);
  const results = top.map(({ doc }) => {
    // create a short snippet: first 120 chars of body
    const snippet = doc.body.length > 120 ? doc.body.slice(0, 117) + "..." : doc.body;
    return { id: doc.id, title: doc.title, snippet };
  });

  // Bonus: simple combined 2-sentence summary
  const combinedText = top.map(t => t.doc.title + ": " + t.doc.body).join(" ");
  const sentences = combinedText.split(/[.?!]\s+/).filter(Boolean);
  const summary = sentences.slice(0, 2).join(". ") + (sentences.length > 2 ? "." : "");

  const sources = top.map(t => t.doc.id);

  return res.status(200).json({ results, summary, sources });
}
