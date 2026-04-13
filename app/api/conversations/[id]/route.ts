import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage } from '@/types/chat'

type RouteContext = { params: { id: string } }

/**
 * GET /api/conversations/[id]
 * Returns full message history for a conversation.
 */
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params

    // TODO: Real DB query:
    // const messages = await db.query(
    //   `SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`,
    //   [id]
    // )

    // Mock: return a sample conversation
    const messages: ChatMessage[] = [
      {
        id: 'msg-1',
        role: 'user',
        content: "What are the signs my child might have pinworm?",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `**Pinworm (Enterobius vermicularis)** is the most common worm infection in Australian children — up to 1 in 3 school-age kids will have it at some point.

### Key Signs to Watch

- **Intense perianal itching**, especially at night when female worms migrate to lay eggs
- **Disturbed sleep** and unusual irritability in young children
- **Visible worms** — thin white threads (2–13mm) around the anus, especially first thing in the morning
- Occasionally: abdominal discomfort, teeth grinding, or bedwetting (in younger children)

### 🟡 MODERATE — Seek advice within 1–2 weeks

### What to Do Next

The **"sticky tape test"** is the standard diagnostic method: press clear tape around the anus in the morning before bathing, then take the tape to your GP for microscopy. This catches the eggs that adult worms deposit overnight.

Your GP can prescribe a single-dose antiparasitic (the whole household should be treated, as reinfection is very common in families).

### For Your GP Visit

Tell them: when symptoms started, whether other household members are affected, and whether your child attends school or daycare.

⚠️ Educational assessment only — not a medical diagnosis. Please consult a qualified Australian healthcare professional.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 28),
        urgency: 'moderate',
      },
    ]

    return NextResponse.json({ id, messages })
  } catch (error) {
    console.error(`GET /api/conversations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to load conversation' }, { status: 500 })
  }
}

/**
 * PATCH /api/conversations/[id]
 * Update title, saved state, or append messages.
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, saved, messages } = body

    // TODO: Real DB update:
    // if (title !== undefined || saved !== undefined) {
    //   await db.query(
    //     `UPDATE conversations SET title = COALESCE($1, title), saved = COALESCE($2, saved), updated_at = NOW() WHERE id = $3`,
    //     [title, saved, id]
    //   )
    // }
    // if (messages?.length) {
    //   const insertValues = messages.map((m: ChatMessage) =>
    //     `('${id}', '${m.role}', $${n++}, '${m.urgency || null}', NOW())`
    //   ).join(', ')
    //   await db.query(`INSERT INTO messages (conversation_id, role, content, urgency, created_at) VALUES ${insertValues}`, contents)
    // }

    console.log(`PATCH conversation ${id}:`, { title, saved, messageCount: messages?.length })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`PATCH /api/conversations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 })
  }
}

/**
 * DELETE /api/conversations/[id]
 * Hard delete a conversation and all its messages.
 */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = params

    // TODO: Real DB delete (messages cascade due to FK constraint):
    // await db.query(`DELETE FROM conversations WHERE id = $1`, [id])

    console.log(`Deleted conversation ${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`DELETE /api/conversations/${params.id} error:`, error)
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
  }
}
