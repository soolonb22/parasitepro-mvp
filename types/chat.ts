// ─── Core chat types shared across client and server ────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'

export type UrgencyLevel = 'low' | 'moderate' | 'high' | 'urgent' | null

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  /** Parsed urgency if PARA included a classification in this message */
  urgency?: UrgencyLevel
  /** Whether user has thumbed up/down */
  feedback?: 'positive' | 'negative' | null
  /** Optional: IDs of knowledge-base chunks used (from vector search) */
  sourceChunkIds?: string[]
}

export interface Conversation {
  id: string
  title: string
  /** Auto-generated from the first user message */
  preview: string
  createdAt: Date
  updatedAt: Date
  messageCount: number
  /** Tag inferred from conversation content */
  category?: ConversationCategory
  /** Whether the user has explicitly saved/starred this conversation */
  saved: boolean
}

export type ConversationCategory =
  | 'skin'
  | 'stool'
  | 'travel'
  | 'pets'
  | 'children'
  | 'general'
  | 'urgent'

export interface ConversationGroup {
  label: string
  conversations: Conversation[]
}

// ─── API request / response shapes ──────────────────────────────────────────

export interface SendMessageRequest {
  conversationId?: string
  messages: Array<{ role: MessageRole; content: string }>
  /**
   * Vector DB context will be injected server-side.
   * Client passes the user's raw query so the API can run similarity search
   * against the parasite knowledge base before calling the LLM.
   */
  query?: string
}

export interface SaveConversationRequest {
  conversationId: string
  title?: string
  messages: ChatMessage[]
}

export interface ConversationListResponse {
  conversations: Conversation[]
  total: number
}

// ─── Follow-up suggestion type ───────────────────────────────────────────────

export interface FollowUpSuggestion {
  label: string
  prompt: string
}

// ─── Urgency utilities ────────────────────────────────────────────────────────

export const URGENCY_MAP: Record<
  string,
  { level: UrgencyLevel; label: string; color: string; bg: string; emoji: string }
> = {
  '🟢': { level: 'low',      label: 'LOW',      color: 'text-green-700',  bg: 'bg-green-50 border-green-200',  emoji: '🟢' },
  '🟡': { level: 'moderate', label: 'MODERATE', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',  emoji: '🟡' },
  '🔴': { level: 'high',     label: 'HIGH',     color: 'text-red-700',    bg: 'bg-red-50 border-red-200',      emoji: '🔴' },
  '🚨': { level: 'urgent',   label: 'URGENT',   color: 'text-red-800',    bg: 'bg-red-100 border-red-300',     emoji: '🚨' },
}

export function parseUrgency(content: string): UrgencyLevel {
  if (content.includes('🚨')) return 'urgent'
  if (content.includes('🔴')) return 'high'
  if (content.includes('🟡')) return 'moderate'
  if (content.includes('🟢')) return 'low'
  return null
}

export function generateFollowUps(content: string): FollowUpSuggestion[] {
  const suggestions: FollowUpSuggestion[] = []

  if (content.toLowerCase().includes('gp') || content.toLowerCase().includes('doctor')) {
    suggestions.push({ label: 'What to tell my GP', prompt: 'What should I specifically say to my GP about this?' })
  }
  if (content.toLowerCase().includes('treatment') || content.toLowerCase().includes('antiparasitic')) {
    suggestions.push({ label: 'Treatment options', prompt: 'What kinds of treatments are typically used for this?' })
  }
  if (content.toLowerCase().includes('queensland') || content.toLowerCase().includes('australia')) {
    suggestions.push({ label: 'Local risk factors', prompt: 'Are there specific risk factors for this in Queensland?' })
  }
  if (content.toLowerCase().includes('child') || content.toLowerCase().includes('kid')) {
    suggestions.push({ label: 'Children\'s risk', prompt: 'How does this affect children specifically?' })
  }
  if (content.toLowerCase().includes('travel') || content.toLowerCase().includes('bali')) {
    suggestions.push({ label: 'Travel precautions', prompt: 'What precautions should I take when travelling to prevent this?' })
  }
  if (content.toLowerCase().includes('test') || content.toLowerCase().includes('stool')) {
    suggestions.push({ label: 'Testing explained', prompt: 'What tests would a GP order to confirm this?' })
  }

  // Always include a generic prevention follow-up
  if (suggestions.length < 2) {
    suggestions.push({ label: 'Prevention tips', prompt: 'How can I prevent this in the future?' })
  }

  return suggestions.slice(0, 3)
}
