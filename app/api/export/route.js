import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const scanId = searchParams.get('scanId');
    const format = searchParams.get('format') || 'json';

    if (!scanId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PARAM', message: 'scanId query parameter is required' } },
        { status: 400 }
      );
    }

    const scan = await prisma.scan.findUnique({
      where: { id: scanId },
      include: { findings: true },
    });

    if (!scan) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Scan record not found' } },
        { status: 404 }
      );
    }

    const reportData = {
      platform: 'Sentinel Cyber Assessment Engine',
      version: 'Phase 2.0',
      exportedAt: new Date().toISOString(),
      assessment: {
        scanId: scan.id,
        targetUrl: scan.targetUrl,
        status: scan.status,
        startedAt: scan.startedAt,
        finishedAt: scan.finishedAt,
        durationSeconds: scan.finishedAt ? Math.round((new Date(scan.finishedAt) - new Date(scan.startedAt)) / 1000) : 0,
      },
      summaryMetrics: {
        totalFindings: scan.findings.length,
        critical: scan.findings.filter((f) => f.severity === 'critical').length,
        high: scan.findings.filter((f) => f.severity === 'high').length,
        medium: scan.findings.filter((f) => f.severity === 'medium').length,
        low: scan.findings.filter((f) => f.severity === 'low').length,
      },
      vulnerabilities: scan.findings.map((f) => {
        let parsedEvidence = f.evidence;
        try {
          parsedEvidence = JSON.parse(f.evidence);
        } catch (e) {}

        return {
          id: f.id,
          title: f.title,
          checkId: f.checkId,
          category: f.category,
          severity: f.severity,
          cweId: f.cweId || 'CWE-693',
          referenceScore: f.referenceScore,
          affectedComponent: f.affectedComponent,
          description: f.description,
          stepsToReproduce: f.stepsToReproduce,
          businessImpact: f.businessImpact,
          remediation: f.remediation,
          evidence: parsedEvidence,
        };
      }),
    };

    if (format === 'json') {
      return new NextResponse(JSON.stringify(reportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="sentinel-assessment-${scan.id}.json"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'EXPORT_FAILED', message: error.message } },
      { status: 500 }
    );
  }
}
