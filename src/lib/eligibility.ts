export interface EligibilityCheck {
  rule: string;
  passed: boolean;
  detail: string;
}

export interface EligibilityResult {
  eligible: boolean;
  checks: EligibilityCheck[];
  message: string;
}

export const GRADE_VALUES: Record<string, number> = {
  'A': 12,
  'A-': 11,
  'B+': 10,
  'B': 9,
  'B-': 8,
  'C+': 7,
  'C': 6,
  'C-': 5,
  'D+': 4,
  'D': 3,
  'D-': 2,
  'E': 1,
};

export function getGradePoints(grade: string): number {
  if (!grade) return 0;
  return GRADE_VALUES[grade.trim().toUpperCase()] || 0;
}

export function compareGrades(gradeA: string, gradeB: string): boolean {
  const valA = getGradePoints(gradeA);
  const valB = getGradePoints(gradeB);
  return valA >= valB;
}

export function getGradeDifference(applicantGrade: string, requiredGrade: string): number {
  const valA = getGradePoints(applicantGrade);
  const valB = getGradePoints(requiredGrade);
  return valA - valB;
}

export interface DetailedSubjectRequirement {
  subjectKey: string;
  label: string;
  isMeanGrade: boolean;
  requiredGrade: string;
  applicantGrade: string;
  passed: boolean;
  status: 'passed' | 'failed' | 'missing';
  difference: number;
  explanation: string;
}

export function getDetailedRequirementBreakdown(
  minRequirements: any,
  kcseMeanGrade: string,
  subjectGrades: Record<string, string>
): {
  overallEligible: boolean;
  items: DetailedSubjectRequirement[];
  summary: {
    totalRequired: number;
    passedCount: number;
    failedCount: number;
    missingCount: number;
  };
} {
  const items: DetailedSubjectRequirement[] = [];
  let reqs: any = minRequirements;

  if (typeof reqs === 'string') {
    try {
      reqs = JSON.parse(reqs);
    } catch {
      reqs = {};
    }
  }

  let applicantSubs = subjectGrades || {};
  if (typeof applicantSubs === 'string') {
    try {
      applicantSubs = JSON.parse(applicantSubs);
    } catch {
      applicantSubs = {};
    }
  }

  // 1. Mean Grade item
  const requiredMean = (reqs && reqs.meanGrade) ? reqs.meanGrade : 'C';
  const meanGradeClean = (kcseMeanGrade || '').trim().toUpperCase();
  
  if (!meanGradeClean) {
    items.push({
      subjectKey: 'mean_grade',
      label: 'KCSE Mean Grade',
      isMeanGrade: true,
      requiredGrade: requiredMean,
      applicantGrade: 'Not Provided',
      passed: false,
      status: 'missing',
      difference: -12,
      explanation: `Minimum required mean grade is ${requiredMean}. No mean grade entered.`,
    });
  } else {
    const passed = compareGrades(meanGradeClean, requiredMean);
    const diff = getGradeDifference(meanGradeClean, requiredMean);
    let explanation = '';
    if (diff > 0) {
      explanation = `Exceeds minimum ${requiredMean} by +${diff} grade step${diff > 1 ? 's' : ''}`;
    } else if (diff === 0) {
      explanation = `Meets minimum requirement of ${requiredMean} exactly`;
    } else {
      explanation = `Below minimum requirement of ${requiredMean} (${Math.abs(diff)} step${Math.abs(diff) > 1 ? 's' : ''} deficit)`;
    }

    items.push({
      subjectKey: 'mean_grade',
      label: 'KCSE Mean Grade',
      isMeanGrade: true,
      requiredGrade: requiredMean,
      applicantGrade: meanGradeClean,
      passed,
      status: passed ? 'passed' : 'failed',
      difference: diff,
      explanation,
    });
  }

  // 2. Specific Cluster Subjects
  const subjectMap: Record<string, string> = {
    english: 'English Language',
    kiswahili: 'Kiswahili',
    mathematics: 'Mathematics (Alt A/B)',
    science: 'Science / Biology / Physical Sciences',
    humanities: 'Humanities (History / Geo / CRE / IRE)',
    biology: 'Biology',
    chemistry: 'Chemistry',
    physics: 'Physics',
    cre: 'Christian Religious Education',
    ire: 'Islamic Religious Education',
    history: 'History & Government',
    geography: 'Geography',
    agriculture: 'Agriculture',
    business: 'Business Studies',
  };

  if (reqs && reqs.subjects && typeof reqs.subjects === 'object') {
    for (const [subKey, minGradeVal] of Object.entries(reqs.subjects)) {
      const normalizedKey = subKey.toLowerCase().trim();
      const label = subjectMap[normalizedKey] || (subKey.charAt(0).toUpperCase() + subKey.slice(1));
      const requiredGrade = (minGradeVal as string) || 'C';
      const rawApplicantGrade = applicantSubs[normalizedKey] || applicantSubs[subKey];
      const applicantGradeClean = rawApplicantGrade ? rawApplicantGrade.trim().toUpperCase() : '';

      if (!applicantGradeClean) {
        items.push({
          subjectKey: normalizedKey,
          label,
          isMeanGrade: false,
          requiredGrade,
          applicantGrade: 'Not Provided',
          passed: false,
          status: 'missing',
          difference: -12,
          explanation: `Required ${requiredGrade} or higher. Grade was not entered.`,
        });
      } else {
        const passed = compareGrades(applicantGradeClean, requiredGrade);
        const diff = getGradeDifference(applicantGradeClean, requiredGrade);
        let explanation = '';
        if (diff > 0) {
          explanation = `Exceeds minimum ${requiredGrade} by +${diff} grade step${diff > 1 ? 's' : ''}`;
        } else if (diff === 0) {
          explanation = `Meets minimum requirement of ${requiredGrade} exactly`;
        } else {
          explanation = `Deficit of ${Math.abs(diff)} grade step${Math.abs(diff) > 1 ? 's' : ''} (Got ${applicantGradeClean}, required ${requiredGrade})`;
        }

        items.push({
          subjectKey: normalizedKey,
          label,
          isMeanGrade: false,
          requiredGrade,
          applicantGrade: applicantGradeClean,
          passed,
          status: passed ? 'passed' : 'failed',
          difference: diff,
          explanation,
        });
      }
    }
  }

  let passedCount = 0;
  let failedCount = 0;
  let missingCount = 0;

  for (const item of items) {
    if (item.status === 'passed') passedCount++;
    else if (item.status === 'failed') failedCount++;
    else if (item.status === 'missing') missingCount++;
  }

  const overallEligible = items.length > 0 && failedCount === 0 && missingCount === 0;

  return {
    overallEligible,
    items,
    summary: {
      totalRequired: items.length,
      passedCount,
      failedCount,
      missingCount,
    },
  };
}

export function checkEligibility(
  minRequirementsInput: string | Record<string, any>,
  kcseMeanGrade: string,
  subjectGradesInput: string | Record<string, any>
): EligibilityResult {
  const checks: EligibilityCheck[] = [];
  let eligible = true;

  try {
    const requirements = typeof minRequirementsInput === 'string'
      ? JSON.parse(minRequirementsInput || '{}')
      : (minRequirementsInput || {});
      
    const applicantGrades = typeof subjectGradesInput === 'string'
      ? JSON.parse(subjectGradesInput || '{}')
      : (subjectGradesInput || {});

    // 1. Check Mean Grade
    const requiredMean = requirements.meanGrade || 'D+';
    const meanPassed = compareGrades(kcseMeanGrade, requiredMean);
    
    checks.push({
      rule: `Minimum KCSE Mean Grade of ${requiredMean}`,
      passed: meanPassed,
      detail: `Your Mean Grade is ${kcseMeanGrade}`,
    });

    if (!meanPassed) {
      eligible = false;
    }

    // 2. Check Subject Grades
    if (requirements.subjects) {
      for (const [subject, minGrade] of Object.entries(requirements.subjects)) {
        const subName = subject.charAt(0).toUpperCase() + subject.slice(1);
        const applicantGrade = applicantGrades[subject.toLowerCase()];

        if (!applicantGrade) {
          checks.push({
            rule: `Grade of ${minGrade} or above in ${subName}`,
            passed: false,
            detail: `Grade not provided for ${subName}`,
          });
          eligible = false;
        } else {
          const subjectPassed = compareGrades(applicantGrade, minGrade as string);
          checks.push({
            rule: `Grade of ${minGrade} or above in ${subName}`,
            passed: subjectPassed,
            detail: `Your grade is ${applicantGrade}`,
          });
          if (!subjectPassed) {
            eligible = false;
          }
        }
      }
    }
  } catch (error) {
    console.error('Eligibility check processing error:', error);
    return {
      eligible: false,
      checks: [
        {
          rule: 'System validation check',
          passed: false,
          detail: 'Failed to process academic requirements structure.',
        },
      ],
      message: 'An error occurred while evaluating your academic eligibility. Please contact support.',
    };
  }

  const message = eligible
    ? 'Congratulations! You provisionally meet the minimum entry requirements. Final admission is subject to verification of your physical documents.'
    : 'You do not meet the minimum requirements for this programme. Please review the grade criteria or consider selecting another course.';

  return { eligible, checks, message };
}
