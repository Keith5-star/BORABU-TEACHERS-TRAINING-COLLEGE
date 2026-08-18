import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

export interface AdmissionLetterData {
  applicantName: string;
  email: string;
  phone: string;
  kcseIndexNo: string;
  kcseMeanGrade: string;
  programmeName: string;
  programmeCode: string;
  reportingDate: string;
  feesSummary: { semester: string; total: number }[];
}

export async function generateAdmissionLetterPdf(
  serialNumber: string,
  data: AdmissionLetterData
): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const serialSafe = serialNumber.replace(/\//g, '_');
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/${serialSafe}`;
  
  // Generate QR Code
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });

  // Page dimensions: 210mm x 297mm
  
  // --- Header / Letterhead ---
  doc.setFillColor(30, 41, 59); // Dark blue header bar
  doc.rect(0, 0, 210, 8, 'F');

  doc.setTextColor(30, 41, 59);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('BORABU TECHNICAL TRAINING INSTITUTE', 15, 22);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('P.O. BOX 9 - 40506, Kebirigo, Kenya  |  Tel: 0746 211 764 | 0727 433 205', 15, 27);
  doc.text('Email: info@borabutti.ac.ke  |  Website: www.borabutti.ac.ke', 15, 32);

  // Decorative blue line
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.8);
  doc.line(15, 36, 195, 36);

  // --- Reference & Date ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(`Ref: ${serialNumber}`, 15, 44);
  
  const currentDate = new Date().toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('Helvetica', 'normal');
  doc.text(`Date: ${currentDate}`, 150, 44);

  // --- Address Block ---
  doc.text('TO:', 15, 53);
  doc.setFont('Helvetica', 'bold');
  doc.text(data.applicantName.toUpperCase(), 15, 58);
  doc.setFont('Helvetica', 'normal');
  doc.text(`Email: ${data.email}`, 15, 63);
  doc.text(`Phone: ${data.phone}`, 15, 68);
  doc.text(`KCSE Index No: ${data.kcseIndexNo}`, 15, 73);

  // --- Letter Title ---
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('RE: PROVISIONAL ADMISSION LETTER', 15, 84);
  doc.line(15, 86, 92, 86); // underline title

  // --- Body Text ---
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  
  const bodyParagraph1 = 
    `I am pleased to inform you that you have been offered provisional admission to Borabu Technical Training Institute (BTTI) to pursue a course of study leading to a ${data.programmeName}.`;
  const splitPara1 = doc.splitTextToSize(bodyParagraph1, 180);
  doc.text(splitPara1, 15, 93);

  let currentY = 93 + splitPara1.length * 5;

  const bodyParagraph2 = 
    `This offer is made based on the provisional academic results submitted in your online application. It is subject to verification of your national identification card, birth certificate, and official KCSE certificate/result slips upon reporting.`;
  const splitPara2 = doc.splitTextToSize(bodyParagraph2, 180);
  doc.text(splitPara2, 15, currentY);

  currentY += splitPara2.length * 5 + 4;

  // --- Course Details Table ---
  doc.setFillColor(241, 245, 249);
  doc.rect(15, currentY, 180, 24, 'F');
  
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('PROGRAMME:', 20, currentY + 6);
  doc.setFont('Helvetica', 'normal');
  doc.text(data.programmeName, 60, currentY + 6);

  // Deduce course duration
  const nameLower = data.programmeName.toLowerCase();
  const codeUpper = data.programmeCode.toUpperCase();
  let durationStr = '3 Years';
  if (nameLower.includes('3 months') || ['CAP', 'CSPV', 'CMR'].includes(codeUpper)) {
    durationStr = '3 Months';
  } else if (nameLower.includes('artisan') || ['AEIW', 'AWF', 'AFD', 'ACP', 'APL', 'AMA'].includes(codeUpper)) {
    durationStr = '1 Year';
  } else if (nameLower.includes('certificate') || nameLower.includes('community health') || ['CIT', 'CEEE-P', 'CEEE-T', 'CSCM', 'CHRM', 'CCOM', 'CBM', 'CSS', 'CTA', 'CACC', 'CFM', 'CHR-IT', 'DCH', 'CAE', 'CWF', 'CFD', 'CCP', 'CBT', 'CWT', 'CPL', 'CSW'].includes(codeUpper)) {
    durationStr = '2 Years';
  }

  doc.setFont('Helvetica', 'bold');
  doc.text('DURATION:', 20, currentY + 12);
  doc.setFont('Helvetica', 'normal');
  doc.text(durationStr, 60, currentY + 12);

  doc.setFont('Helvetica', 'bold');
  doc.text('REPORTING DATE:', 20, currentY + 18);
  doc.setFont('Helvetica', 'normal');
  doc.text(new Date(data.reportingDate).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }), 60, currentY + 18);

  currentY += 28 + 4;

  // --- Fee Structure Section ---
  doc.setFont('Helvetica', 'bold');
  doc.text('First Year Financial Summary (Fees structure in KES):', 15, currentY);
  currentY += 5;

  // Draw table header
  doc.setFillColor(30, 41, 59);
  doc.setTextColor(255, 255, 255);
  doc.rect(15, currentY, 180, 6, 'F');
  doc.text('Semester Term', 20, currentY + 4.5);
  doc.text('Tuition Fee', 80, currentY + 4.5);
  doc.text('Boarding/Admin', 120, currentY + 4.5);
  doc.text('Total (KES)', 160, currentY + 4.5);
  
  currentY += 6;
  doc.setTextColor(51, 65, 85);
  doc.setFont('Helvetica', 'normal');

  // Fill fee rows
  data.feesSummary.forEach((fee) => {
    doc.rect(15, currentY, 180, 6);
    doc.text(fee.semester, 20, currentY + 4.5);
    doc.text(`${Math.round(fee.total * 0.7).toLocaleString()}`, 80, currentY + 4.5);
    doc.text(`${Math.round(fee.total * 0.3).toLocaleString()}`, 120, currentY + 4.5);
    doc.text(`${fee.total.toLocaleString()}`, 160, currentY + 4.5);
    currentY += 6;
  });

  currentY += 5;

  // --- Sign-off and QR code ---
  doc.setFont('Helvetica', 'normal');
  doc.text('Yours faithfully,', 15, currentY);
  
  currentY += 6;
  doc.setFont('Helvetica', 'bold');
  doc.text('NANCY KEMUNTO', 15, currentY);
  doc.setFont('Helvetica', 'normal');
  doc.text('Institute Registrar (Admissions)', 15, currentY + 5);

  // Add signature stamp drawing
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.rect(15, currentY + 8, 45, 12);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.setFontSize(8);
  doc.text('APPROVED & STAMPED', 18, currentY + 12);
  doc.text('BORABU BTTI REGISTRAR', 18, currentY + 16);

  // Embed QR Code
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.text('Verify authenticity here:', 140, currentY);
  doc.addImage(qrDataUrl, 'PNG', 140, currentY + 2, 28, 28);
  doc.text(serialSafe, 140, currentY + 32);

  // --- Footer ---
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 289, 210, 8, 'F');

  // Save to disk with serverless safe fallback
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  try {
    const lettersDir = path.join(process.cwd(), 'public', 'letters');
    if (!fs.existsSync(lettersDir)) {
      fs.mkdirSync(lettersDir, { recursive: true });
    }
    const pdfPath = path.join(lettersDir, `${serialSafe}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    return `/letters/${serialSafe}.pdf`;
  } catch (fsErr) {
    // In serverless read-only environments, return base64 Data URI
    return `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
  }
}

export interface PaymentReceiptData {
  applicantName: string;
  email: string;
  phone: string;
  programmeName: string;
  paymentMethod: string;
  paymentReference: string;
  amount: number;
  date: Date;
}

export async function generatePaymentReceiptPdf(
  receiptNumber: string,
  data: PaymentReceiptData
): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const serialSafe = receiptNumber.replace(/\//g, '_');
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify/payment_${serialSafe}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });

  // Header banner
  doc.setFillColor(30, 41, 59); // Dark blue
  doc.rect(0, 0, 210, 8, 'F');

  doc.setTextColor(30, 41, 59);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('BORABU TECHNICAL TRAINING INSTITUTE', 15, 22);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('P.O. BOX 9 - 40506, Kebirigo, Kenya', 15, 27);
  doc.text('Email: info@borabutti.ac.ke  |  Tel: 0746 211 764 | 0727 433 205', 15, 31);

  doc.setDrawColor(20, 184, 166); // Teal accent line
  doc.setLineWidth(0.6);
  doc.line(15, 35, 195, 35);

  // Title
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text('OFFICIAL PAYMENT RECEIPT', 15, 45);

  // Receipt details table / box
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 50, 180, 75, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, 50, 180, 75);

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Receipt Number:', 22, 58);
  doc.setFont('Helvetica', 'normal');
  doc.text(receiptNumber, 65, 58);

  doc.setFont('Helvetica', 'bold');
  doc.text('Date of Payment:', 22, 66);
  doc.setFont('Helvetica', 'normal');
  doc.text(data.date.toLocaleString('en-KE'), 65, 66);

  doc.setFont('Helvetica', 'bold');
  doc.text('Applicant Name:', 22, 74);
  doc.setFont('Helvetica', 'normal');
  doc.text(data.applicantName, 65, 74);

  doc.setFont('Helvetica', 'bold');
  doc.text('Email / Phone:', 22, 82);
  doc.setFont('Helvetica', 'normal');
  doc.text(`${data.email} / ${data.phone}`, 65, 82);

  doc.setFont('Helvetica', 'bold');
  doc.text('Applied Programme:', 22, 90);
  doc.setFont('Helvetica', 'normal');
  doc.text(data.programmeName, 65, 90);

  doc.setFont('Helvetica', 'bold');
  doc.text('Payment Method:', 22, 98);
  doc.setFont('Helvetica', 'normal');
  doc.text(data.paymentMethod.toUpperCase(), 65, 98);

  doc.setFont('Helvetica', 'bold');
  doc.text('Transaction Ref:', 22, 106);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(37, 99, 235); // Blue color
  doc.text(data.paymentReference, 65, 106);
  doc.setTextColor(30, 41, 59);

  doc.setFont('Helvetica', 'bold');
  doc.text('Amount Paid:', 22, 114);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(20, 184, 166); // Teal for amount
  doc.setFontSize(11);
  doc.text(`KES ${data.amount.toLocaleString()}.00`, 65, 114);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);

  // Stamp box
  doc.setDrawColor(20, 184, 166);
  doc.setLineWidth(0.5);
  doc.rect(15, 135, 45, 12);
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(8);
  doc.text('PAYMENT RECEIVED', 18, 139);
  doc.text('AUTOMATICALLY VERIFIED', 18, 143);

  // QR Code
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.text('Scan to verify payment:', 140, 135);
  doc.addImage(qrDataUrl, 'PNG', 140, 137, 28, 28);
  doc.text(serialSafe, 140, 167);

  // Footer
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 289, 210, 8, 'F');

  // Save to disk with serverless safe fallback
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  try {
    const receiptsDir = path.join(process.cwd(), 'public', 'receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }
    const pdfPath = path.join(receiptsDir, `${serialSafe}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    return `/receipts/${serialSafe}.pdf`;
  } catch (fsErr) {
    return `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
  }
}

export interface ApplicationSummaryData {
  applicantName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  idNumber: string;
  county: string;
  guardianContact: string;
  kcseIndexNo: string;
  kcseYear: number;
  kcseMeanGrade: string;
  subjectGrades: Record<string, string>;
  programmeName: string;
  programmeCode: string;
  secondaryProgrammeName?: string;
  paymentReference: string;
  paymentStatus: string;
  submittedAt: Date;
}

export async function generateApplicationSummaryPdf(
  applicationId: string,
  data: ApplicationSummaryData
): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const serialSafe = `summary_${applicationId.slice(0, 8)}`;
  
  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 210, 8, 'F');

  doc.setTextColor(30, 41, 59);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('BORABU TECHNICAL TRAINING INSTITUTE', 15, 22);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('APPLICATION SUMMARY RECEIPT  |  REGISTRY OFFICE', 15, 27);

  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.6);
  doc.line(15, 30, 195, 30);

  // Applicant Info Block
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('1. Personal Details', 15, 38);
  doc.setLineWidth(0.2);
  doc.line(15, 40, 195, 40);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Full Name: ${data.applicantName}`, 15, 46);
  doc.text(`ID/Passport No: ${data.idNumber}`, 110, 46);
  doc.text(`Email Address: ${data.email}`, 15, 52);
  doc.text(`Telephone: ${data.phone}`, 110, 52);
  doc.text(`Date of Birth: ${data.dob}`, 15, 58);
  doc.text(`Gender: ${data.gender}`, 110, 58);
  doc.text(`County of Residence: ${data.county}`, 15, 64);
  doc.text(`Next of Kin Phone: ${data.guardianContact}`, 110, 64);

  // Academic Details Block
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. Academic Particulars & Grades', 15, 74);
  doc.line(15, 76, 195, 76);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`KCSE Index Number: ${data.kcseIndexNo}`, 15, 82);
  doc.text(`Examination Year: ${data.kcseYear}`, 110, 82);
  doc.text(`KCSE Mean Grade: ${data.kcseMeanGrade}`, 15, 88);

  // Subject grades
  doc.setFont('Helvetica', 'bold');
  doc.text('Subject Grades Grid:', 15, 96);
  doc.setFont('Helvetica', 'normal');
  
  let subjectsX = 15;
  let subjectsY = 102;
  Object.entries(data.subjectGrades).forEach(([sub, grade]) => {
    const name = sub.charAt(0).toUpperCase() + sub.slice(1);
    doc.rect(subjectsX, subjectsY, 42, 7);
    doc.setFont('Helvetica', 'bold');
    doc.text(name, subjectsX + 2, subjectsY + 5);
    doc.setFont('Helvetica', 'normal');
    doc.text(grade, subjectsX + 32, subjectsY + 5);
    subjectsX += 45;
    if (subjectsX > 160) {
      subjectsX = 15;
      subjectsY += 9;
    }
  });

  // Programme Choice & Payment
  const blockY = subjectsY + 15;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. Programme Preferences & Payment', 15, blockY);
  doc.line(15, blockY + 2, 195, blockY + 2);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Primary Preference: ${data.programmeName} (${data.programmeCode})`, 15, blockY + 8);
  if (data.secondaryProgrammeName) {
    doc.text(`Secondary Preference: ${data.secondaryProgrammeName}`, 15, blockY + 14);
  }
  doc.text(`Fee Charged: KES 1,000.00 (Non-Refundable)`, 15, blockY + 20);
  doc.text(`Payment Reference: ${data.paymentReference} (${data.paymentStatus.toUpperCase()})`, 15, blockY + 26);
  doc.text(`Submitted On: ${data.submittedAt.toLocaleString('en-KE')}`, 15, blockY + 32);

  // Info box
  doc.setFillColor(241, 245, 249);
  doc.rect(15, blockY + 38, 180, 16, 'F');
  doc.setFont('Helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('Status: UNDER REGISTRY REVIEW', 20, blockY + 44);
  doc.setFont('Helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Admissions panel will review document copies against KNEC parameters. Do not resubmit.', 20, blockY + 50);

  // Footer
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 289, 210, 8, 'F');

  // Save with serverless safe fallback
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  try {
    const receiptsDir = path.join(process.cwd(), 'public', 'receipts');
    if (!fs.existsSync(receiptsDir)) {
      fs.mkdirSync(receiptsDir, { recursive: true });
    }
    const pdfPath = path.join(receiptsDir, `${serialSafe}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    return `/receipts/${serialSafe}.pdf`;
  } catch (fsErr) {
    return `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
  }
}

