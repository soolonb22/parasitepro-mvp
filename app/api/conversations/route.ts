import { NextRequest, NextResponse } from 'next/server'
import type { Conversation } from '@/types/chat'

/**
 * GET /api/conversations
 * Returns the current user's conversation history from Postgres.
 *
 * Database schema (Railway PostgreSQL):
 *   conversations (
 *     id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
 *     title       TEXT NOT NULL DEFAULT 'New Chat',
 *     preview     TEXT,
 *     category    TEXT,
 *     saved       BOOLEAN DEFAULT FALSE,
 *     created_at  TIMESTAMPTZ DEFAULT NOW(),
 *     updated_at  TIMESTAMPTZ DEFAULT NOW()
 *   )
 *   messages (
 *     id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *     conversation_id  UUID REFERENCES conversations(id) ON DELETE CASCADE,
 *     role             TEXT CHECK (role IN ('user','assistant','system')),
 *     content          TEXT NOT NULL,
 *     urgency          TEXT,
 *     source_chunk_ids JSONB,    -- IDs from pgvector similarity search
 *     created_at       TIMESTAMPTZ DEFAULT NOW()
 *   )
 *
 * Vector DB note:
 *   Each assistant message is generated with RAG context injected from a
 *   pgvector table: parasite_knowledge (id, content, embedding vector(1536))
 *   The API route /api/chat runs: SELECT content FROM parasite_knowledge
 *   ORDER BY embedding <=> query_embedding LIMIT 5
 *   before calling the LLM, and logs used chunk IDs to messages.source_chunk_ids.
 */

// ─── Mock data (replace with real DB query) ──────────────────────────────────
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Pinworm symptoms in kids',
    preview: 'What are the signs my child might have pinworm?',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 28),
    messageCount: 6,
    category: 'children',
    saved: true,
  },
  {
    id: 'conv-2',
    title: 'Post-Bali stomach issues',
    preview: "I've been to Bali and have had cramps for 3 weeks",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    messageCount: 8,
    category: 'travel',
    saved: false,
  },
  {
    id: 'conv-3',
    title: 'Circular rash after bushwalk',
    preview: 'Red itchy ring-shaped rash appeared after camping',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // yesterday
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
    messageCount: 4,
    category: 'skin',
    saved: false,
  },
  {
    id: 'conv-4',
    title: 'Dog worms and family risk',
    preview: 'My dog has roundworms — can we catch it?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    messageCount: 5,
    category: 'pets',
    saved: true,
  },
  {
    id: 'conv-5',
    title: 'White threads in stool',
    preview: 'Found white string-like things in stool sample',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    messageCount: 9,
    category: 'stool',
    saved: false,
  },
  {
    id: 'conv-6',
    title: 'Queensland wet season risks',
    preview: 'What parasites should I watch for in QLD wet season?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    messageCount: 3,
    category: 'general',
    saved: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    // TODO: Extract userId from session/JWT
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // TODO: Replace with real DB query:
    // const conversations = await db.query(
    //   `SELECT c.*, COUNT(m.id) as message_count
    //    FROM conversations c
    //    LEFT JOIN messages m ON m.conversation_id = c.id
    //    WHERE c.user_id = $1
    //    ORDER BY c.updated_at DESC
    //    LIMIT 50`,
    //   [session.user.id]
    // )

    const searchParams = request.nextUrl.searchParams
    const savedOnly = searchParams.get('saved') === 'true'

    const conversations = savedOnly
      ? MOCK_CONVERSATIONS.filter((c) => c.saved)
      : MOCK_CONVERSATIONS

    return NextResponse.json({ conversations, total: conversations.length })
  } catch (error) {
    console.error('GET /api/conversations error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, firstMessage } = await request.json()

    // TODO: Real DB insert:
    // const result = await db.query(
    //   `INSERT INTO conversations (user_id, title, preview, created_at, updated_at)
    //    VALUES ($1, $2, $3, NOW(), NOW())
    //    RETURNING *`,
    //   [session.user.id, title || 'New Chat', firstMessage?.slice(0, 120)]
    // )

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: title || 'New Chat',
      preview: firstMessage?.slice(0, 120) || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      messageCount: 0,
      category: 'general',
      saved: false,
    }

    return NextResponse.json({ conversation: newConversation }, { status: 201 })
  } catch (error) {
    console.error('POST /api/conversations error:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}
