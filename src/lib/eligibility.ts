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

export function compareGrades(gradeA: string, gradeB: string): boolean {
  const valA = GRADE_VALUES[gradeA.toUpperCase()] || 0;
  const valB = GRADE_VALUES[gradeB.toUpperCase()] || 0;
  return valA >= valB;
}

export function checkEligibility(
  minRequirementsJson: string,
  kcseMeanGrade: string,
  subjectGradesJson: string
): EligibilityResult {
  const checks: EligibilityCheck[] = [];
  let eligible = true;

  try {
    const requirements = JSON.parse(minRequirementsJson);
    const applicantGrades = JSON.parse(subjectGradesJson);

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
