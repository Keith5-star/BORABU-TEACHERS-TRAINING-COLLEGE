import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.admissionLetter.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.ticketMessage.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.programme.deleteMany({});

  console.log('Seeding Borabu TTC teacher education programmes...');
  
  // 1. DPTE (Diploma in Primary Teacher Education)
  const dpte = await prisma.programme.create({
    data: {
      name: 'Diploma in Primary Teacher Education (DPTE)',
      code: 'DPTE',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({
        meanGrade: 'C',
        subjects: {
          english: 'C',
          kiswahili: 'C',
          mathematics: 'C'
        }
      }),
      intakeCapacity: 200,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([
        { semester: 'Year 1 Term 1', tuition: 35000, boarding: 20000, activity: 3000, total: 58000 },
        { semester: 'Year 1 Term 2', tuition: 30000, boarding: 18000, activity: 2000, total: 50000 },
        { semester: 'Year 2 Term 1', tuition: 35000, boarding: 20000, activity: 3000, total: 58000 },
        { semester: 'Year 2 Term 2', tuition: 30000, boarding: 18000, activity: 2000, total: 50000 },
        { semester: 'Year 3 Term 1', tuition: 35000, boarding: 20000, activity: 3000, total: 58000 },
        { semester: 'Year 3 Term 2', tuition: 30000, boarding: 18000, activity: 2000, total: 50000 }
      ])
    }
  });

  // 2. DECTE (Diploma in Early Childhood Teacher Education)
  const decte = await prisma.programme.create({
    data: {
      name: 'Diploma in Early Childhood Teacher Education (DECTE)',
      code: 'DECTE',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({
        meanGrade: 'C',
        subjects: {}
      }),
      intakeCapacity: 150,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([
        { semester: 'Year 1 Term 1', tuition: 32000, boarding: 20000, activity: 3000, total: 55000 },
        { semester: 'Year 1 Term 2', tuition: 28000, boarding: 18000, activity: 2000, total: 48000 },
        { semester: 'Year 2 Term 1', tuition: 32000, boarding: 20000, activity: 3000, total: 55000 },
        { semester: 'Year 2 Term 2', tuition: 28000, boarding: 18000, activity: 2000, total: 48000 },
        { semester: 'Year 3 Term 1', tuition: 32000, boarding: 20000, activity: 3000, total: 55000 },
        { semester: 'Year 3 Term 2', tuition: 28000, boarding: 18000, activity: 2000, total: 48000 }
      ])
    }
  });

  // 3. CECTE (Certificate in Early Childhood Teacher Education)
  const cecte = await prisma.programme.create({
    data: {
      name: 'Certificate in Early Childhood Teacher Education (CECTE)',
      code: 'CECTE',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({
        meanGrade: 'C-',
        subjects: {}
      }),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([
        { semester: 'Year 1 Term 1', tuition: 25000, boarding: 20000, activity: 3000, total: 48000 },
        { semester: 'Year 1 Term 2', tuition: 22000, boarding: 18000, activity: 2000, total: 42000 },
        { semester: 'Year 2 Term 1', tuition: 25000, boarding: 20000, activity: 3000, total: 48000 },
        { semester: 'Year 2 Term 2', tuition: 22000, boarding: 18000, activity: 2000, total: 42000 }
      ])
    }
  });

  console.log('Seeding users...');
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Admin@1234', salt);
  const officerPasswordHash = bcrypt.hashSync('Officer@1234', salt);
  const studentPasswordHash = bcrypt.hashSync('Student@1234', salt);

  const superAdmin = await prisma.user.create({
    data: {
      fullName: 'Super Admin',
      email: 'superadmin@borabuttc.ac.ke',
      phone: '+254711223344',
      passwordHash: adminPasswordHash,
      role: 'super_admin',
      isVerified: true
    }
  });

  const officer = await prisma.user.create({
    data: {
      fullName: 'Nancy Kemunto (Admissions Registrar)',
      email: 'officer@borabuttc.ac.ke',
      phone: '+254722334455',
      passwordHash: officerPasswordHash,
      role: 'admissions_officer',
      isVerified: true
    }
  });

  const applicant1 = await prisma.user.create({
    data: {
      fullName: 'Kevin Omwamba',
      email: 'student@gmail.com',
      phone: '+254733445566',
      passwordHash: studentPasswordHash,
      role: 'applicant',
      isVerified: true,
      mailingAddress: 'P.O. Box 45, Nyansiongo',
      kinName: 'Peter Omwamba',
      kinPhone: '+254799887766',
      kinRelation: 'Father'
    }
  });

  const applicant2 = await prisma.user.create({
    data: {
      fullName: 'John Doe',
      email: 'john.doe@gmail.com',
      phone: '+254744556677',
      passwordHash: studentPasswordHash,
      role: 'applicant',
      isVerified: true,
      mailingAddress: 'P.O. Box 92, Keroka',
      kinName: 'Mary Doe',
      kinPhone: '+254788776655',
      kinRelation: 'Mother'
    }
  });

  const applicant3 = await prisma.user.create({
    data: {
      fullName: 'Jane Smith',
      email: 'jane.smith@gmail.com',
      phone: '+254755667788',
      passwordHash: studentPasswordHash,
      role: 'applicant',
      isVerified: true,
      mailingAddress: 'P.O. Box 12, Chepilat',
      kinName: 'Samuel Smith',
      kinPhone: '+254777665544',
      kinRelation: 'Guardian'
    }
  });

  console.log('Seeding applications...');
  
  // 1. Draft application for Kevin -> DPTE
  await prisma.application.create({
    data: {
      userId: applicant1.id,
      programmeId: dpte.id,
      status: 'draft',
      personalDetails: JSON.stringify({
        dob: '2005-05-15',
        gender: 'Male',
        idNumber: '40123456',
        county: 'Nyamira',
        subCounty: 'Borabu',
        address: 'P.O. Box 45, Nyansiongo',
        nextOfKinName: 'Peter Omwamba',
        nextOfKinPhone: '+254799887766',
        nextOfKinRelation: 'Father'
      }),
      kcseIndexNo: '40732101001',
      kcseYear: 2024,
      kcseMeanGrade: 'C',
      subjectGrades: JSON.stringify({
        english: 'C',
        kiswahili: 'C',
        mathematics: 'C',
        biology: 'C-',
        history: 'B',
      }),
    }
  });

  // 2. Submitted application for John -> CECTE (Eligibility Passed)
  const appJohn = await prisma.application.create({
    data: {
      userId: applicant2.id,
      programmeId: cecte.id,
      status: 'submitted',
      personalDetails: JSON.stringify({
        dob: '2004-10-20',
        gender: 'Male',
        idNumber: '39223344',
        county: 'Kisii',
        subCounty: 'Masaba South',
        address: 'P.O. Box 92, Keroka',
        nextOfKinName: 'Mary Doe',
        nextOfKinPhone: '+254788776655',
        nextOfKinRelation: 'Mother'
      }),
      kcseIndexNo: '40711202005',
      kcseYear: 2023,
      kcseMeanGrade: 'C-',
      subjectGrades: JSON.stringify({
        english: 'C-',
        kiswahili: 'C',
        mathematics: 'D+',
        physics: 'D',
        geography: 'C+',
      }),
      eligibilityResult: JSON.stringify({
        eligible: true,
        programme: 'CECTE',
        checks: [
          { rule: 'Minimum KCSE Mean Grade of C-', passed: true, detail: 'Applicant Mean Grade is C-' }
        ],
        message: 'You provisionally meet the minimum entry requirements. Final admission is subject to verification of your certificates.'
      }),
      submittedAt: new Date(),
    }
  });

  await prisma.document.createMany({
    data: [
      { applicationId: appJohn.id, type: 'id_copy', fileName: 'national_id.pdf', fileUrl: '/uploads/mock_id.pdf', verified: false },
      { applicationId: appJohn.id, type: 'kcse_cert', fileName: 'kcse_slip.pdf', fileUrl: '/uploads/mock_kcse.pdf', verified: false },
      { applicationId: appJohn.id, type: 'photo', fileName: 'passport_photo.png', fileUrl: '/uploads/mock_photo.png', verified: false }
    ]
  });

  // 3. Admitted application for Jane -> DECTE (Admission Letter Issued)
  const appJane = await prisma.application.create({
    data: {
      userId: applicant3.id,
      programmeId: decte.id,
      status: 'letter_issued',
      personalDetails: JSON.stringify({
        dob: '2005-02-12',
        gender: 'Female',
        idNumber: '41122334',
        county: 'Nyamira',
        subCounty: 'Borabu',
        address: 'P.O. Box 12, Chepilat',
        nextOfKinName: 'Samuel Smith',
        nextOfKinPhone: '+254777665544',
        nextOfKinRelation: 'Guardian'
      }),
      kcseIndexNo: '40732101015',
      kcseYear: 2024,
      kcseMeanGrade: 'C+',
      subjectGrades: JSON.stringify({
        english: 'B-',
        kiswahili: 'C+',
        mathematics: 'C',
        chemistry: 'C',
        cre: 'A-',
      }),
      eligibilityResult: JSON.stringify({
        eligible: true,
        programme: 'DECTE',
        checks: [
          { rule: 'Minimum KCSE Mean Grade of C', passed: true, detail: 'Applicant Mean Grade is C+' }
        ],
        message: 'You provisionally meet the minimum entry requirements. Final admission is subject to verification of your certificates.'
      }),
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      reviewedById: officer.id,
      reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      reviewNotes: 'Academic credentials verified. Approved for immediate admission.',
    }
  });

  await prisma.document.createMany({
    data: [
      { applicationId: appJane.id, type: 'id_copy', fileName: 'jane_id.pdf', fileUrl: '/uploads/mock_id.pdf', verified: true },
      { applicationId: appJane.id, type: 'jane_kcse.pdf', fileName: 'jane_kcse.pdf', fileUrl: '/uploads/mock_kcse.pdf', verified: true },
      { applicationId: appJane.id, type: 'photo', fileName: 'jane_photo.png', fileUrl: '/uploads/mock_photo.png', verified: true }
    ]
  });

  const serial = 'BORABU/2026/DECTE/00001';
  await prisma.admissionLetter.create({
    data: {
      applicationId: appJane.id,
      serialNumber: serial,
      pdfUrl: `/api/letters/download/${serial}`,
      reportingDate: '2026-09-07',
      generatedById: officer.id,
      issuedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.notification.create({
    data: {
      userId: applicant3.id,
      channel: 'email',
      subject: 'Admission Letter Issued - Borabu Teachers Training College',
      message: `Dear Jane Smith, Congratulations! Your application for the Diploma in Early Childhood Teacher Education (DECTE) has been approved. Your admission letter serial number is ${serial}. You can download it from your portal dashboard.`,
      status: 'sent'
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: officer.id,
      action: 'approve_application',
      entity: 'Application',
      entityId: appJane.id
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
