import { NextRequest, NextResponse } from 'next/server'
import type { AnalysisReport } from '@/types/analyzer'

/**
 * GET  /api/reports          — list user's saved reports (paginated)
 * POST /api/reports          — save/update a report (toggle saved flag)
 *
 * GET  /api/reports/[id]     — get a single report
 * DELETE /api/reports/[id]   — delete a report
 */

// Mock reports for development — replace with real DB queries
const MOCK_REPORTS: Partial<AnalysisReport>[] = [
  {
    id: 'rpt-001',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    sampleType: 'stool',
    inputSummary: 'Found white thread-like segments in stool, about 5mm long…',
    urgencyLevel: 'moderate',
    saved: true,
    primaryFinding: {
      commonName: 'Tapeworm (possible proglottids)',
      scientificName: 'Taenia spp.',
      description: 'The description is consistent with tapeworm segments passed in stool.',
    },
    confidence: 'moderate',
    creditsUsed: 1,
  },
  {
    id: 'rpt-002',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    sampleType: 'skin',
    inputSummary: 'Linear red track on foot after walking barefoot at park…',
    urgencyLevel: 'high',
    saved: false,
    primaryFinding: {
      commonName: 'Cutaneous Larva Migrans (CLM)',
      scientificName: 'Ancylostoma braziliense',
      description: 'The description and pattern are consistent with hookworm larva migrans.',
    },
    confidence: 'high',
    creditsUsed: 1,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const savedOnly = searchParams.get('saved') === 'true'

    // TODO: Real DB query
    // const session = await getServerSession(authOptions)
    // const reports = await db.query(
    //   `SELECT id, sample_type, input_summary, urgency_level, primary_finding->>'commonName' as finding_name,
    //           saved, created_at, credits_used
    //    FROM reports WHERE user_id=$1 ${savedOnly ? 'AND saved=true' : ''}
    //    ORDER BY created_at DESC LIMIT 20`,
    //   [session.user.id]
    // )

    const reports = savedOnly ? MOCK_REPORTS.filter((r) => r.saved) : MOCK_REPORTS

    return NextResponse.json({ reports, total: reports.length })
  } catch {
    return NextResponse.json({ error: 'Failed to load reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { reportId, saved } = await request.json()

    if (!reportId) {
      return NextResponse.json({ error: 'reportId required' }, { status: 400 })
    }

    // TODO: Real DB update
    // await db.query('UPDATE reports SET saved=$1 WHERE id=$2 AND user_id=$3', [saved, reportId, session.user.id])

    console.log(`Report ${reportId} saved=${saved}`)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }
}
