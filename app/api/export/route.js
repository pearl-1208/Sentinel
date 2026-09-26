import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma.js';
import dataset from '@/lib/dataset.json';

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

    const vulnerabilities = scan.findings.map((f) => {
      let parsedEvidence = f.evidence;
      try {
        parsedEvidence = JSON.parse(f.evidence);
      } catch (e) {}

      const canonical = dataset.find(
        (item) =>
          item.cweId === f.cweId ||
          item.checkId === f.checkId ||
          (f.title && item.title.toLowerCase().includes(f.title.toLowerCase().slice(0, 15)))
      );

      return {
        id: f.id,
        title: f.title,
        checkId: f.checkId,
        category: f.category,
        severity: f.severity,
        cweId: f.cweId || canonical?.cweId || 'CWE-693',
        referenceScore: f.referenceScore || canonical?.referenceScore || 'N/A',
        affectedComponent: f.affectedComponent,
        description: f.description,
        stepsToReproduce: f.stepsToReproduce,
        businessImpact: f.businessImpact,
        remediation: f.remediation,
        evidence: parsedEvidence,
        patchSnippet: canonical?.patchSnippet || null,
        mitreTactic: canonical?.mitreTactic || null,
        mitreTechnique: canonical?.mitreTechnique || null,
        owaspCategory: canonical?.owaspCategory || null,
      };
    });

    const reportData = {
      platform: 'Sentinel Cyber Assessment Platform',
      version: 'Phase 3.0 Enterprise Architecture',
      cisoAuditingBody: 'National Technical Research Organisation (NTRO)',
      category: 'Smart Automation — Comprehensive Cyber Security Assessment',
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
      vulnerabilities,
    };

    if (format === 'json') {
      return new NextResponse(JSON.stringify(reportData, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="sentinel-ciso-audit-${scan.id}.json"`,
        },
      });
    }

    if (format === 'cef') {
      const cefLines = vulnerabilities.map((v) => {
        const sevScore = v.severity === 'critical' ? 10 : v.severity === 'high' ? 8 : v.severity === 'medium' ? 5 : 2;
        return `CEF:0|NTRO-Sentinel|CyberAssessmentEngine|3.0|${v.cweId}|${v.title.slice(0, 48)}|${sevScore}|src=127.0.0.1 request=${v.affectedComponent} msg=${v.title} cs1=${v.category} cs1Label=Category`;
      }).join('\n');

      return new NextResponse(cefLines, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="sentinel-siem-${scan.id}.cef"`,
        },
      });
    }

    if (format === 'syslog') {
      const syslogLines = vulnerabilities.map((v) => {
        const pri = v.severity === 'critical' ? 131 : v.severity === 'high' ? 132 : v.severity === 'medium' ? 134 : 136;
        return `<${pri}>1 ${reportData.exportedAt} sentinel.ntro.gov SIEM 12048 ${v.id} [sentinel@ntro severity="${v.severity}" cwe="${v.cweId}"] ${v.title} on ${v.affectedComponent}`;
      }).join('\n');

      return new NextResponse(syslogLines, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="sentinel-syslog-${scan.id}.log"`,
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
