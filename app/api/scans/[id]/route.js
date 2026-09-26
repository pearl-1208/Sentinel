import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma.js';
import dataset from '@/lib/dataset.json';

// Dataset index map for quick lookup
const datasetMap = new Map();
dataset.forEach((item) => {
  if (item.cweId) datasetMap.set(item.cweId, item);
  if (item.checkId) datasetMap.set(item.checkId, item);
});

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: {
        findings: {
          orderBy: [
            { severity: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });

    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
    }

    // Parse evidence JSON safely and enrich with dataset metadata
    const parsedFindings = scan.findings.map((f) => {
      let parsedEvidence = f.evidence;
      try {
        parsedEvidence = JSON.parse(f.evidence);
      } catch (e) {
        // Keep raw string if parsing fails
      }

      // Lookup matching canonical benchmark finding from dataset.json
      const canonical = dataset.find(
        (item) =>
          item.cweId === f.cweId ||
          item.checkId === f.checkId ||
          (f.title && item.title.toLowerCase().includes(f.title.toLowerCase().slice(0, 15)))
      );

      return {
        ...f,
        cweId: f.cweId || canonical?.cweId || 'CWE-693',
        evidence: parsedEvidence,
        patchSnippet: canonical?.patchSnippet || null,
        mitreTactic: canonical?.mitreTactic || null,
        mitreTechnique: canonical?.mitreTechnique || null,
        owaspCategory: canonical?.owaspCategory || null,
        nistMapping: canonical?.nistMapping || null,
        iso27001: canonical?.iso27001 || null,
      };
    });

    return NextResponse.json({
      scan: {
        id: scan.id,
        targetUrl: scan.targetUrl,
        status: scan.status,
        startedAt: scan.startedAt,
        finishedAt: scan.finishedAt,
      },
      findings: parsedFindings,
    });
  } catch (error) {
    console.error('Error fetching scan:', error);
    return NextResponse.json(
      { error: 'Internal server error while retrieving scan', details: error.message },
      { status: 500 }
    );
  }
}
