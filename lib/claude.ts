export async function generateCaption({
  topic, platform, tone, niche, hashtags, emoji,
}: {
  topic: string; platform: string; tone: string;
  niche: string; hashtags: boolean; emoji: boolean;
}): Promise<string> {
  const pName = platform === 'ig' ? 'Instagram' : 'TikTok'
  const toneMap: Record<string,string> = {
    casual:'casual e próximo', inspirador:'inspirador e motivacional',
    engraçado:'engraçado e divertido', profissional:'profissional e informativo', viral:'viral e chamativo',
  }
  const prompt = `Você é especialista em marketing digital para criadores brasileiros.\n\nCrie uma legenda para ${pName}:\n- Assunto: ${topic}\n- Nicho: ${niche}\n- Tom: ${toneMap[tone]||tone}\n- ${hashtags?'Inclua hashtags':'SEM hashtags'}\n- ${emoji?'Use emojis estrategicamente':'SEM emojis'}\n- ${platform==='tt'?'Curta, máx 150 chars antes das hashtags':'Pode ser mais longa, chame para ação no final'}\n\nResponda APENAS com a legenda, sem explicações.`
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model:'claude-sonnet-4-20250514', max_tokens:1000, messages:[{role:'user',content:prompt}] }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.content?.[0]?.text || ''
}
