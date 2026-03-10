export async function generateCaption({
  topic,
  platform,
  tone,
  niche,
  hashtags,
  emoji,
}: {
  topic: string
  platform: 'ig' | 'tt'
  tone: string
  niche: string
  hashtags: boolean
  emoji: boolean
}): Promise<string> {
  const platformName = platform === 'ig' ? 'Instagram' : 'TikTok'
  const toneMap: Record<string, string> = {
    casual: 'casual e próximo',
    inspirador: 'inspirador e motivacional',
    engraçado: 'engraçado e divertido',
    profissional: 'profissional e informativo',
    viral: 'viral e chamativo',
  }

  const prompt = `Você é um especialista em marketing digital para criadores de conteúdo brasileiros.

Crie uma legenda para ${platformName} com as seguintes características:
- Assunto/ideia do post: ${topic}
- Nicho do creator: ${niche}
- Tom desejado: ${toneMap[tone] || tone}
- ${hashtags ? 'Inclua hashtags relevantes em português e inglês' : 'NÃO inclua hashtags'}
- ${emoji ? 'Use emojis de forma estratégica' : 'NÃO use emojis'}
- A legenda deve ser autêntica, engajante e adequada para o público brasileiro
- Para ${platformName}: ${platform === 'tt' ? 'curta e direta, máximo 150 caracteres antes das hashtags, linguagem jovem e dinâmica' : 'pode ser mais longa, use quebras de linha, chame para ação no final'}

Responda APENAS com a legenda pronta, sem explicações, sem aspas, sem prefixos como "Legenda:".`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await res.json()
  if (data.error) throw new Error(data.error.message || 'Erro na geração')
  return data.content?.[0]?.text || ''
}
