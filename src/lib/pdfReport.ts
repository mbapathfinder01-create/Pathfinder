import { jsPDF } from 'jspdf';
import { autoTable, type UserOptions } from 'jspdf-autotable';
import { careersFor } from '../data/careers';
import { COMPANIES } from '../data/companies';
import { strengthInsights, summarizeSwot, weaknessPlans } from '../engine/insights';
import { calculateRecommendations } from '../engine/recommend';
import type { StudentProfile } from '../types';

const BRAND: [number, number, number] = [79, 70, 229];
const MARGIN = 14;
const TEXT_WIDTH = 180;

/** jsPDF's built-in Helvetica has no ₹ glyph, so rupee amounts are written as "Rs." in the PDF. */
const pdfSafe = (text: string) => text.replace(/₹/g, 'Rs. ');

type DocWithTable = jsPDF & { lastAutoTable?: { finalY?: number } };

export const reportFileName = (profile: StudentProfile) =>
  `MBA_Pathfinder_Report_${(profile.name || 'student').replace(/\s+/g, '_')}.pdf`;

/** Builds the PDF and triggers a browser download. */
export function downloadReport(profile: StudentProfile): void {
  buildReport(profile).save(reportFileName(profile));
}

/** Builds the multi-section career roadmap PDF. */
export function buildReport(profile: StudentProfile): jsPDF {
  const doc = new jsPDF() as DocWithTable;
  const recs = calculateRecommendations(profile);
  const top = recs[0];
  const swot = summarizeSwot(profile);
  const weaknesses = weaknessPlans(profile);
  const strengths = strengthInsights(profile);
  let y = 18;

  const table = (opts: UserOptions) => {
    autoTable(doc, { margin: { left: MARGIN, right: MARGIN }, ...opts });
    y = doc.lastAutoTable?.finalY ?? y;
  };
  const heading = (text: string) => {
    // Breathing room above every section heading, except at the top of a fresh page.
    if (y > 22) y += 3;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(text, MARGIN, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
  };
  const paragraph = (text: string, lineHeight = 4, x = MARGIN) => {
    const lines = doc.splitTextToSize(pdfSafe(text), TEXT_WIDTH);
    doc.text(lines, x, y);
    y += lines.length * lineHeight;
  };
  const pageBreakIf = (limit: number) => {
    if (y > limit) {
      doc.addPage();
      y = 20;
    }
  };

  // Header band
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, 210, 36, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MBA Pathfinder — Career Roadmap Report', MARGIN, 16);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, MARGIN, 25);
  y = 46;
  doc.setTextColor(17, 24, 39);

  heading('1. Student Profile');
  table({
    startY: y,
    theme: 'grid',
    body: [
      ['Name', profile.name || '—'],
      ['Email', profile.email || '—'],
      ['Mobile', profile.mobile || '—'],
      ['Gender', profile.gender || '—'],
      ['City', profile.city || '—'],
      ['Background', profile.background || '—'],
      ['SSC / HSC / Grad', `${profile.ssc}% / ${profile.hsc}% / ${profile.graduation}%`],
      ['Experience', profile.workExperience + (profile.yearsOfExperience ? ` (${profile.yearsOfExperience} y)` : '')],
      ['Preferred Location', profile.preferredCity || '—'],
      ['Career Goal', profile.careerGoal || '—'],
    ],
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45 } },
  });
  y += 8;

  heading('2. SWOT Analysis');
  table({
    startY: y,
    theme: 'grid',
    body: [
      ['Strengths', `${swot.S}/100`, 'Your internal positive attributes'],
      ['Weaknesses', `${swot.W}/100`, 'Areas to improve'],
      ['Opportunities', `${swot.O}/100`, 'External favorable trends'],
      ['Threats', `${swot.T}/100`, 'External risks to plan for'],
      ['Net Balance', `${swot.net > 0 ? '+' : ''}${swot.net}`, 'Positive = favorable starting position'],
    ],
    styles: { fontSize: 9, cellPadding: 2.5 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 30 } },
  });
  y += 8;

  if (strengths.length > 0) {
    heading('3. How to Leverage Your Strengths');
    y -= 1;
    for (const s of strengths) {
      paragraph(
        `• ${s.strength}: recommended for ${s.recommendedSpecs.join(', ') || 'multiple tracks'}; roles: ${s.suggestedRoles.join(', ') || '—'}`,
        4.5,
      );
    }
    y += 4;
  }

  if (weaknesses.length > 0) {
    pageBreakIf(240);
    heading('4. Weakness Improvement Plan');
    for (const w of weaknesses) {
      pageBreakIf(250);
      doc.setFont('helvetica', 'bold');
      doc.text(`Area: ${w.area}`, MARGIN, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      paragraph(`Impact: ${w.impact}`);
      paragraph(`Actions: ${w.actions.join('; ')}`);
      if (w.certification) {
        doc.text(`Certification: ${w.certification}`, MARGIN, y);
        y += 4;
      }
      y += 2;
    }
  }

  pageBreakIf(220);
  heading('5. Top Recommended Specializations');
  table({
    startY: y,
    theme: 'striped',
    head: [['Rank', 'Specialization', 'Fit %', 'Placement Readiness']],
    body: recs.slice(0, 3).map((r, i) => [`${i + 1}`, r.spec.name, `${r.confidence}%`, `${r.placementReadiness}%`]),
    styles: { fontSize: 10, cellPadding: 3.5 },
    headStyles: { fillColor: BRAND, textColor: 255 },
  });
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Why ${top.spec.name}?`, MARGIN, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  for (const reason of top.reasoning.slice(0, 4)) paragraph(`• ${reason}`, 4, MARGIN + 2);
  y += 3;

  pageBreakIf(230);
  heading('6. Recommended Industries & Job Roles');
  doc.text('Industries:', MARGIN, y);
  y += 4;
  for (const ind of top.recommendedIndustries) {
    doc.text(`  • ${ind}`, MARGIN, y);
    y += 4;
  }
  y += 2;
  doc.text('Job Roles:', MARGIN, y);
  y += 4;
  for (const role of top.suitableCareers) {
    doc.text(`  • ${role}`, MARGIN, y);
    y += 4;
  }
  y += 2;
  paragraph(`Certifications: ${top.suggestedCerts.join(', ')}`);
  y += 1;

  pageBreakIf(220);
  heading(`7. Location-Based Opportunities${profile.preferredCity ? ` (${profile.preferredCity})` : ''}`);
  const companies = COMPANIES.filter(
    (c) => c.departments.includes(top.key) && (!profile.preferredCity || c.city === profile.preferredCity),
  ).slice(0, 12);
  if (companies.length > 0) {
    table({
      startY: y,
      theme: 'grid',
      head: [['Company', 'Industry', 'City']],
      body: companies.map((c) => [c.name, c.industry, c.city]),
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: BRAND, textColor: 255 },
    });
    y += 5;
  } else {
    doc.text('Expand preferred city to see more opportunities.', MARGIN, y);
    y += 5;
  }

  pageBreakIf(220);
  heading('8. Career Development Roadmap');
  table({
    startY: y,
    theme: 'striped',
    head: [['Role', 'Salary', 'Growth', 'Top Cities']],
    body: careersFor(top.key)
      .slice(0, 5)
      .map((c) => [c.title, pdfSafe(c.avgSalary), c.growth, c.cities.slice(0, 3).join(', ')]),
    styles: { fontSize: 8.5, cellPadding: 3 },
    headStyles: { fillColor: BRAND, textColor: 255 },
  });

  doc.addPage();
  y = 20;
  heading('9. Skill Gap Analysis');
  if (top.skillGaps.length) {
    for (const gap of top.skillGaps) {
      doc.text(`• ${gap} — needs improvement for ${top.spec.shortName}`, MARGIN, y);
      y += 4;
    }
  } else {
    doc.text(`Excellent! No major skill gaps identified for ${top.spec.shortName}.`, MARGIN, y);
    y += 4;
  }
  y += 3;
  doc.text(`Placement Readiness Score: ${top.placementReadiness}/100`, MARGIN, y);
  y += 4;
  doc.text(`Confidence Score: ${top.confidence}%`, MARGIN, y);

  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('MBA Pathfinder — AI-driven specialization & career guidance.', MARGIN, 287);

  return doc;
}
