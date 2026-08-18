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

  console.log('Seeding BTTI programmes...');
  await prisma.programme.create({
    data: {
      name: 'Diploma in Information Communication Technology',
      code: 'DICT',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Information Technology',
      code: 'CIT',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Computer Science',
      code: 'DCS',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Computer Programming',
      code: 'DCP',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Cyber Security',
      code: 'DCYB',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Animation and Digital Media',
      code: 'DADM',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Graphic Design',
      code: 'DGD',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Data Science',
      code: 'DDS',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Cloud Computing',
      code: 'DCC',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Artificial Intelligence and Robotics',
      code: 'DAIR',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Computer Application Packages',
      code: 'CAP',
      level: 'Short Course',
      duration: '3 Months',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Term 1', 'tuition': 4600, 'boarding': 0, 'activity': 0, 'total': 5400}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Electrical & Electronics Engineering (Power Option)',
      code: 'DEEE-P',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Electrical & Electronics Engineering (Telecommunication)',
      code: 'DEEE-T',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Mechatronic Engineering',
      code: 'DME',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Electrical & Electronics Engineering (Power Option)',
      code: 'CEEE-P',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Electrical & Electronics Engineering (Telecommunication)',
      code: 'CEEE-T',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Artisan Certificate in Electrical Installation & Wiring',
      code: 'AEIW',
      level: 'Artisan',
      duration: '1 Year',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Solar PV Technology',
      code: 'CSPV',
      level: 'Short Course',
      duration: '3 Months',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Term 1', 'tuition': 4600, 'boarding': 0, 'activity': 0, 'total': 5400}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Motor Rewinding',
      code: 'CMR',
      level: 'Short Course',
      duration: '3 Months',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Term 1', 'tuition': 4600, 'boarding': 0, 'activity': 0, 'total': 5400}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Supply Chain Management',
      code: 'DSCM',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Human Resource Management',
      code: 'DHRM',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Cooperative Management',
      code: 'DCOM',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Tax Administration',
      code: 'DTA',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Business Management',
      code: 'DBM',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Secretarial Studies (Office Administration)',
      code: 'DSS',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Fleet Management',
      code: 'DFM',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Accounting',
      code: 'DACC',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Accounting and Finance',
      code: 'DACF',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Supply Chain Management',
      code: 'CSCM',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Human Resource Management',
      code: 'CHRM',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Cooperative Management',
      code: 'CCOM',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Business Management',
      code: 'CBM',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Secretarial Studies (Office Administration)',
      code: 'CSS',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Tax Administration',
      code: 'CTA',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Accounting',
      code: 'CACC',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Fleet Management',
      code: 'CFM',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Health Records with IT',
      code: 'DHR-IT',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C Plain', 'subjects': {'english': 'C', 'biology': 'C-', 'mathematics': 'C-'}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Health Records and IT',
      code: 'CHR-IT',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {'english': 'C-', 'biology': 'D+', 'mathematics': 'D+'}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Community Health',
      code: 'DCH',
      level: 'Diploma',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Automotive Engineering',
      code: 'DAE',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Automotive Engineering',
      code: 'CAE',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Welding and Fabrication',
      code: 'CWF',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Artisan in Welding and Fabrication',
      code: 'AWF',
      level: 'Artisan',
      duration: '1 Year',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Fashion Design & Clothing Technology',
      code: 'DFD',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Fashion Design & Clothing Technology',
      code: 'CFD',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Artisan in Fashion Design & Clothing Technology',
      code: 'AFD',
      level: 'Artisan',
      duration: '1 Year',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Cosmetology (Hair Dressing & Beauty)',
      code: 'CCP',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Artisan in Cosmetology (Hair Dressing & Beauty)',
      code: 'ACP',
      level: 'Artisan',
      duration: '1 Year',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Building Technology',
      code: 'DBT',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Building Technology',
      code: 'CBT',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Wood Technology',
      code: 'CWT',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Plumbing',
      code: 'CPL',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Artisan in Plumbing',
      code: 'APL',
      level: 'Artisan',
      duration: '1 Year',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Artisan in Masonry',
      code: 'AMA',
      level: 'Artisan',
      duration: '1 Year',
      minGradeRequirement: JSON.stringify({'meanGrade': 'Open', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Social Work and Community Development',
      code: 'DSW',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Diploma in Community Development and Counselling',
      code: 'DCD',
      level: 'Diploma',
      duration: '3 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'C-', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 3 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 3 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });
  await prisma.programme.create({
    data: {
      name: 'Certificate in Social Work and Community Development',
      code: 'CSW',
      level: 'Certificate',
      duration: '2 Years',
      minGradeRequirement: JSON.stringify({'meanGrade': 'D Plain', 'subjects': {}}),
      intakeCapacity: 100,
      intakePeriod: 'September 2026',
      isActive: true,
      feesStructure: JSON.stringify([{'semester': 'Year 1 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 37895}, {'semester': 'Year 1 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}, {'semester': 'Year 2 Term 1', 'tuition': 33595, 'boarding': 0, 'activity': 0, 'total': 33595}, {'semester': 'Year 2 Term 2', 'tuition': 33594, 'boarding': 0, 'activity': 0, 'total': 33594}])
    }
  });

  // Fetch some seeded courses for applicant assignments
  const allProgs = await prisma.programme.findMany();
  const dictProg = allProgs.find(p => p.code === 'DICT')!;
  const citProg = allProgs.find(p => p.code === 'CIT')!;
  const dcsProg = allProgs.find(p => p.code === 'DCS')!;

  console.log('Seeding users...');
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('Admin@1234', salt);
  const officerPasswordHash = bcrypt.hashSync('Officer@1234', salt);
  const studentPasswordHash = bcrypt.hashSync('Student@1234', salt);

  const superAdmin = await prisma.user.create({
    data: {
      fullName: 'Super Admin',
      email: 'superadmin@borabutti.ac.ke',
      phone: '+254711223344',
      passwordHash: adminPasswordHash,
      role: 'super_admin',
      isVerified: true
    }
  });

  const officer = await prisma.user.create({
    data: {
      fullName: 'Nancy Kemunto (Admissions Registrar)',
      email: 'officer@borabutti.ac.ke',
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
  // 1. Draft application for Kevin -> DICT
  await prisma.application.create({
    data: {
      userId: applicant1.id,
      programmeId: dictProg.id,
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

  // 2. Submitted application for John -> CIT (Eligibility Passed)
  const appJohn = await prisma.application.create({
    data: {
      userId: applicant2.id,
      programmeId: citProg.id,
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
        programme: 'CIT',
        checks: [
          { rule: 'Minimum KCSE Mean Grade of D', passed: true, detail: 'Applicant Mean Grade is C-' }
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

  // 3. Admitted application for Jane -> DCS (Admission Letter Issued)
  const appJane = await prisma.application.create({
    data: {
      userId: applicant3.id,
      programmeId: dcsProg.id,
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
        programme: 'DCS',
        checks: [
          { rule: 'Minimum KCSE Mean Grade of C-', passed: true, detail: 'Applicant Mean Grade is C+' }
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
      { applicationId: appJane.id, type: 'kcse_cert', fileName: 'jane_kcse.pdf', fileUrl: '/uploads/mock_kcse.pdf', verified: true },
      { applicationId: appJane.id, type: 'photo', fileName: 'jane_photo.png', fileUrl: '/uploads/mock_photo.png', verified: true }
    ]
  });

  const serial = 'BORABU/2026/DCS/00001';
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
      subject: 'Admission Letter Issued - Borabu BTTI',
      message: `Dear Jane Smith, Congratulations! Your application for the Diploma in Computer Science (DCS) has been approved. Your admission letter serial number is ${serial}. You can download it from your portal dashboard.`,
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
