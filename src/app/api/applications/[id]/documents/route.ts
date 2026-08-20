/**
 * Security: CSRF Protected
 * All state-changing requests (POST, PUT, PATCH, DELETE) to this route are verified
 * against Origin, Referer, and Sec-Fetch-Site headers via middleware (src/middleware.ts)
 * and CSRF validation engine (src/lib/security.ts).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { scanAndVerifyDocument } from '@/lib/documentScanner';
import fs from 'fs';
import path from 'path';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'applicant') {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await params;

    // Check if application exists and belongs to user
    const application = await prisma.application.findUnique({
      where: { id },
      include: { programme: true, user: true },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
    }

    if (application.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    if (application.status !== 'draft') {
      return NextResponse.json(
        { error: 'You can only upload documents for drafts.' },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and document type (' + type + ') are required.' },
        { status: 400 }
      );
    }

    const allowedTypes = ['id_copy', 'kcse_cert', 'photo', 'birth_cert'];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid document type. Allowed: ' + allowedTypes.join(', ') },
        { status: 400 }
      );
    }

    // Size limit: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit.' },
        { status: 400 }
      );
    }

    // Extension verification
    const fileExtension = path.extname(file.name).toLowerCase();
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Automated Document Autoscan & Anti-Forgery Check
    const scanReport = scanAndVerifyDocument(type, file.name, buffer, {
      applicantName: application.user.fullName,
      enteredIndexNo: application.kcseIndexNo || undefined,
      enteredMeanGrade: application.kcseMeanGrade || undefined,
      programmeMinRequirement: application.programme.minGradeRequirement,
    });

    if (scanReport.antiForgeryStatus === 'REJECTED_FORGERY') {
      return NextResponse.json(
        {
          error: 'Document upload rejected: Anti-forgery or document category check failed. Please ensure the document is genuine and corresponds to the selected category.',
          scanReport,
        },
        { status: 422 }
      );
    }

    let fileUrl: string;
    try {
      // Ensure uploads directory exists if writable
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const uniqueFileName = `${id}_${type}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/${uniqueFileName}`;
    } catch (fsErr) {
      // Fallback for read-only serverless platforms (e.g. Vercel Lambda)
      const mimeType = file.type || 'application/octet-stream';
      fileUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    // Upsert document record (replace existing of same type if any)
    const existingDoc = await prisma.document.findFirst({
      where: { applicationId: id, type },
    });

    let document;
    if (existingDoc) {
      // Delete old file
      try {
        const oldPath = path.join(process.cwd(), 'public', existingDoc.fileUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.warn('Failed to delete old file:', err);
      }

      document = await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          fileName: file.name,
          fileUrl: fileUrl,
          verified: scanReport.verified,
          uploadedAt: new Date(),
        },
      });
    } else {
      document = await prisma.document.create({
        data: {
          applicationId: id,
          type,
          fileName: file.name,
          fileUrl,
          verified: scanReport.verified,
        },
      });
    }

    return NextResponse.json({
      message: scanReport.verified
        ? 'Document verified and auto-scanned successfully.'
        : 'Document uploaded. Auto-scanner noted items for registrar review.',
      document,
      scanReport,
    });
  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error during document upload.' },
      { status: 500 }
    );
  }
}
