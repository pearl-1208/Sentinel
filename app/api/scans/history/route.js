import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma.js';

export async function GET() {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: { startedAt: 'desc' },
      take: 50,
      include: {
        findings: true,
      },
    });

    const formattedHistory = scans.map((s) => {
      const criticalCount = s.findings.filter((f) => f.severity === 'critical').length;
      const highCount = s.findings.filter((f) => f.severity === 'high').length;
      const mediumCount = s.findings.filter((f) => f.severity === 'medium').length;
      const lowCount = s.findings.filter((f) => f.severity === 'low').length;

      // Risk score algorithm (0 - 100)
      const rawScore = (criticalCount * 25) + (highCount * 15) + (mediumCount * 5) + (lowCount * 2);
      const riskScore = Math.min(100, rawScore);

      return {
        id: s.id,
        targetUrl: s.targetUrl,
        status: s.status,
        startedAt: s.startedAt,
        finishedAt: s.finishedAt,
        durationSeconds: s.finishedAt ? Math.round((new Date(s.finishedAt) - new Date(s.startedAt)) / 1000) : 0,
        totalFindings: s.findings.length,
        criticalCount,
        highCount,
        mediumCount,
        lowCount,
        riskScore,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        scans: formattedHistory,
      },
    });
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve scan history records',
          details: error.message,
        },
      },
      { status: 500 }
    );
  }
}
