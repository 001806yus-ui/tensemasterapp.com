import { jsPDF } from 'jspdf';
import { UserProgressState } from '../types';
import { ALL_12_TENSES } from '../data/tensesData';

export interface PDFExportOptions {
  includeFormulas?: boolean;
  includeDiagnostic?: boolean;
}

export function generateProgressPDF(
  userState: UserProgressState,
  overallMastery: number,
  options: PDFExportOptions = { includeFormulas: true, includeDiagnostic: true }
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primaryIndigo = [79, 70, 229]; // #4F46E5
  const slate900 = [15, 23, 42]; // #0F172A
  const slate600 = [71, 85, 105]; // #475569
  const emeraldGreen = [16, 185, 129]; // #10B981
  const amberOrange = [245, 158, 11]; // #F59E0B
  const slateLight = [241, 245, 249]; // #F1F5F9

  let currentY = 18;

  // 1. Header Band
  doc.setFillColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
  doc.rect(margin, currentY, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('TENSEMASTER - INFORME OFICIAL DE PROGRESO', margin + 6, currentY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Acreditación y Diagnóstico de Competencia en los 12 Tiempos Verbales en Inglés', margin + 6, currentY + 16);

  currentY += 28;

  // 2. Student Info Card
  doc.setFillColor(slateLight[0], slateLight[1], slateLight[2]);
  doc.roundedRect(margin, currentY, contentWidth, 26, 3, 3, 'F');

  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Estudiante: ${userState.userName || 'Estudiante'}`, margin + 6, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  
  const todayFormatted = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  doc.text(`Fecha de emisión: ${todayFormatted}`, margin + 6, currentY + 14);
  doc.text(`Plan: ${userState.subscription.isPro ? 'Membresía Pro (Acceso Total)' : 'Acceso Básico'}`, margin + 6, currentY + 20);

  // Stats boxes on right of student info
  const statBoxX = margin + contentWidth - 75;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(statBoxX, currentY + 4, 32, 18, 2, 2, 'F');
  doc.roundedRect(statBoxX + 36, currentY + 4, 34, 18, 2, 2, 'F');

  // Stat 1: Dominio
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
  doc.text(`${overallMastery}%`, statBoxX + 16, currentY + 12, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Dominio Global', statBoxX + 16, currentY + 18, { align: 'center' });

  // Stat 2: Racha & XP
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text(`${userState.streakDays}d / ${userState.totalXP} XP`, statBoxX + 53, currentY + 12, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('Racha activa y XP', statBoxX + 53, currentY + 18, { align: 'center' });

  currentY += 32;

  // 3. Diagnostic Result Summary (if available)
  if (options.includeDiagnostic && userState.diagnosticResult) {
    const diag = userState.diagnosticResult;
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'F');
    doc.setDrawColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, contentWidth, 20, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(primaryIndigo[0], primaryIndigo[1], primaryIndigo[2]);
    doc.text(`Nivel Inicial Diagnosticado: ${diag.cefrLevel} (${diag.score}/${diag.totalQuestions} aciertos - ${diag.percentage}%)`, margin + 5, currentY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    const feedbackLines = doc.splitTextToSize(diag.summaryFeedback, contentWidth - 10);
    doc.text(feedbackLines, margin + 5, currentY + 12);

    currentY += 25;
  }

  // 4. Section: Desglose de los 12 Tiempos Verbales
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('Matriz y Desglose de los 12 Tiempos Verbales', margin, currentY + 2);

  currentY += 6;

  // Table header
  doc.setFillColor(slate900[0], slate900[1], slate900[2]);
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('TIEMPO VERBAL', margin + 4, currentY + 4.8);
  doc.text('GRUPO', margin + 48, currentY + 4.8);
  doc.text('ESTADO', margin + 74, currentY + 4.8);
  doc.text('PUNTUACIÓN', margin + 104, currentY + 4.8);
  doc.text('FÓRMULA CLAVE', margin + 130, currentY + 4.8);

  currentY += 7;

  // Table rows
  ALL_12_TENSES.forEach((tense, idx) => {
    const prog = userState.tenseProgress[tense.id];
    const isMastered = prog?.status === 'mastered';
    const isInProgress = prog?.status === 'in-progress' || prog?.status === 'completed';
    const score = prog?.score || 0;

    const rowBg = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 252];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, currentY, contentWidth, 8, 'F');

    // Tense Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(tense.name, margin + 4, currentY + 5.2);

    // Group
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    const groupName = tense.group === 'present' ? 'Presente' : tense.group === 'past' ? 'Pasado' : 'Futuro';
    doc.text(groupName, margin + 48, currentY + 5.2);

    // Status
    if (isMastered) {
      doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('Dominado ✓', margin + 74, currentY + 5.2);
    } else if (isInProgress) {
      doc.setTextColor(amberOrange[0], amberOrange[1], amberOrange[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('En Progreso', margin + 74, currentY + 5.2);
    } else {
      doc.setTextColor(slate600[0], slate600[1], slate600[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('Por Iniciar', margin + 74, currentY + 5.2);
    }

    // Score
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(slate900[0], slate900[1], slate900[2]);
    doc.text(`${score}%`, margin + 106, currentY + 5.2);

    // Formula key preview
    doc.setFontSize(7);
    doc.setTextColor(slate600[0], slate600[1], slate600[2]);
    const formulaSnippet = tense.formula.affirmative.length > 36 
      ? tense.formula.affirmative.substring(0, 34) + '...' 
      : tense.formula.affirmative;
    doc.text(formulaSnippet, margin + 130, currentY + 5.2);

    currentY += 8;
  });

  currentY += 6;

  // 5. Anti-Burnout / Personalized Recommendation Box
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(slate900[0], slate900[1], slate900[2]);
  doc.text('Plan de Hábitos Anti-Agobio (Micro-Dosis de 5 minutos al día):', margin + 5, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slate600[0], slate600[1], slate600[2]);
  doc.text('1. No intentes memorizar los 12 tiempos en una sola tarde: un tiempo cada 2-3 días consolida la memoria a largo plazo.', margin + 5, currentY + 11);
  doc.text('2. Usa el simulador con micrófono para activar la memoria muscular de tu aparato fonador en inglés.', margin + 5, currentY + 16);
  doc.text('3. Tu protector de racha (Streak Freeze) te resguarda ante imprevistos para no romper tu impulso.', margin + 5, currentY + 21);

  currentY += 28;

  // 6. Security & Official Hash Footer
  const hashId = `TM-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 18, margin + contentWidth, pageHeight - 18);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`ID de Verificación: ${hashId} · Generado automáticamente por TenseMaster App`, margin, pageHeight - 12);
  doc.text(`Página 1 de 1 · Certificado compatible con CV y portafolio de idiomas`, margin + contentWidth, pageHeight - 12, { align: 'right' });

  // Save the PDF file
  const sanitizedName = (userState.userName || 'Estudiante').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`TenseMaster_Reporte_Progreso_${sanitizedName}.pdf`);
}
