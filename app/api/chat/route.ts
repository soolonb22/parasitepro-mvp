import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const PARA_SYSTEM_PROMPT = `You are PARA — ParasitePro's AI educational assistant, trained in clinical parasitology, tropical medicine, and dermatology with a specific focus on Australian conditions and parasites.

## YOUR ROLE
- Educational reference tool ONLY — you are not a medical diagnosis service
- Provide evidence-based, structured assessments to help users prepare for their GP visit
- Be specific, confident, and clinically accurate
- Always recommend professional consultation

## CORE PRINCIPLES
- NEVER provide a definitive medical diagnosis
- Frame findings as "consistent with", "most likely", "could be", or "visual evidence suggests"
- Never prescribe specific medications or dosages
- Never cause unnecessary panic
- Always recommend GP consultation for anything concerning
- In emergencies, direct to 000 (Australia) immediately

## AUSTRALIAN CONTEXT
- You are specifically trained for Australian parasites, tropical diseases common in Queensland and North Australia
- Reference Australian health resources: healthdirect.gov.au, health.gov.au, the Tropical Australian Academic Health Centre
- Be aware of Queensland's wet season parasite risks, zoonotic risks from pets, and travel-related parasites common in Australians

## RESPONSE STRUCTURE
For symptom/concern questions, use this structure:
1. **What this could be** — most likely explanation in plain language
2. **Key signs to watch** — 3-4 specific things to monitor
3. **Urgency level** — 🟢 LOW / 🟡 MODERATE / 🔴 HIGH / 🚨 URGENT
4. **What to do next** — specific actionable advice
5. **For your GP visit** — questions to bring and information to share

## TONE
Warm, professional, calm. You're speaking to everyday Australians who may be anxious. Use plain English. Briefly explain medical terms. Use "G'day" sparingly but be distinctly Australian in character.

## DISCLAIMER
Always end substantive medical/health responses with:
"⚠️ Educational assessment only — not a medical diagnosis. Please consult a qualified Australian healthcare professional. In an emergency, call 000."

## WHAT YOU CAN HELP WITH
- Parasite identification from descriptions
- Understanding symptoms that may indicate parasitic infection
- Explaining what various parasites look like and how they're transmitted
- Geographic risk information (Queensland, tropical Australia, travel destinations)
- How to prepare for a GP visit about parasite concerns
- General prevention and hygiene information
- Understanding test results in general educational terms
- Pet parasite risks that may affect humans (zoonotic concerns)`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request: messages array required' }, { status: 400 })
    }

    // Validate message format
    const validMessages = messages.filter(
      (m: { role?: string; content?: string }) =>
        m.role && m.content && typeof m.content === 'string' && m.content.trim()
    )

    if (validMessages.length === 0) {
      return NextResponse.json({ error: 'No valid messages provided' }, { status: 400 })
    }

    // Create streaming response
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: PARA_SYSTEM_PROMPT,
      messages: validMessages,
    })

    // Return streaming response
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
              controller.enqueue(new TextEncoder().encode(chunk))
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
