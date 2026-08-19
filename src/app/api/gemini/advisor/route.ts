import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const BTTC_KNOWLEDGE_BASE = `
You are the official Borabu Teachers Training College (BTTC) Academic & Admissions AI Advisor.
Location: Nyamira County, Kenya (Near Kebirigo Town, Alight at Nyangoge off Kisii - Kericho highway).
Postal Address: P.O. BOX 9 - 40506, Kebirigo.
Contact Phone: 0746 211 764 / 0727 433 205.
Email: info@borabuttc.ac.ke

KEY ACADEMIC PROGRAMMES & ENTRY REQUIREMENTS:
1. Diploma in Primary Teacher Education (DPTE) - CBC Curriculum:
   - Duration: 3 Years (including Practicum/Teaching Practice).
   - Minimum Requirement: KCSE Mean Grade C (Plain) or equivalent.
   - Subject cluster guidelines: C in English, Kiswahili, Mathematics, and at least one Science (Biology/Physics/Chemistry) or Humanities.
   - For Visually/Hearing/Physically impaired students: Mean Grade C- (Minus) with subject waivers as per KNEC/Ministry guidelines.
   - Output: Certified Primary School Educator eligible for immediate TSC (Teachers Service Commission) registration.

2. Diploma in Early Childhood Teacher Education (DECTE):
   - Duration: 3 Years.
   - Minimum Requirement: KCSE Mean Grade C (Plain).
   - Specialization: Competency-Based Early Years and Pre-Primary Education pedagogy, child psychology, learning materials production.

3. Upgrade Diploma in Primary Teacher Education (UDPTE) / Upgrade Diploma in Early Childhood Teacher Education (UDECTE):
   - Duration: 1 to 2 Years (Flexible Modular/Holiday sessions).
   - Requirement: Certified P1 Certificate holders or ECDE Certificate holders seeking to transition to CBC Diploma level for promotion & TSC compliance.

4. Diploma in Secondary Teacher Education (DSTE - Junior Secondary School Option):
   - Minimum Requirement: KCSE Mean Grade C+ (Plus), with C+ in two teaching specialization subjects.
   - Duration: 3 Years.

5. Certificate in Early Childhood Development & Education (ECDE):
   - Minimum Requirement: KCSE Mean Grade D+ (Plus) or D (Plain) with recognized bridging.
   - Duration: 1 to 2 Years.

FEES STRUCTURE & PAYMENT METHODS:
- Tuition Fees: Approx KES 28,000 to KES 34,500 per term depending on residential/boarding status.
- Government-sponsored (KUCCPS) students receive tuition subsidies as per Ministry capitation.
- Application / Processing Fee: KES 1,000 (Non-refundable).
- Payment Channels:
  - M-Pesa STK Push / Paybill: Paybill Business No: 522123, Account: BTTC-[Applicant ID / Name]
  - Bank Deposit: Co-operative Bank of Kenya, Account Number: 01129482716400, Account Name: Borabu Teachers Training College.

ADMISSIONS & APPLICATION PROCESS:
1. Register an account with Email & Phone on the BTTC Portal.
2. Select desired programme (Primary, Early Childhood, Upgrade, or Certificate).
3. Fill personal information, KNEC KCSE Index number, and subject grades.
4. Upload scanned National ID/Birth Certificate, KCSE Result Slip/Certificate, and passport photo.
5. Pay KES 1,000 application fee via M-Pesa STK Push or upload Bank slip.
6. Submit for admissions officer review.
7. Download verified Official Admission Letter with QR code verification.

REGISTRAR SUPPORT DESK & HOTLINE:
- For issues or assistance regarding: Admission letters, Deferment letters, DPTE Applications, DSTE Applications, School-based applications, SNE (Special Needs Education), Upgrading courses, or Unsuccessful applications:
  Direct Line / WhatsApp: 0101930121
- KUCCPS Placement Notice: If the applicant missed placement under KUCCPS, they should make a direct application immediately by calling or WhatsApping the registrar at 0101930121.

TONE & INSTRUCTIONS:
- Be warm, encouraging, authoritative, and concise.
- Structure responses with clean bullet points and clear steps.
- Offer actionable next steps for the applicant (e.g. where to apply, fee verification, or program selection).
`;

function getFallbackResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('letter') || q.includes('deferment') || q.includes('dste') || q.includes('sne') || q.includes('unsuccessful') || q.includes('kuccps') || q.includes('registrar') || q.includes('support') || q.includes('0101930121')) {
    return `### 📞 Registrar & Admissions Support Desk\n\nFor any questions or issues regarding:\n- **Admission Letters** / **Deferment Letters**\n- **DPTE / DSTE / SNE Applications**\n- **School-Based Applications** / **Upgrading Courses**\n- **Unsuccessful Applications**\n\n📢 **KUCCPS Direct Applications:** If you missed placement under KUCCPS, this is the right time to make a direct application to Borabu TTC.\n\n👉 **Contact the Registrar directly (Call or WhatsApp):**\n- **Phone:** **0101930121**\n- **WhatsApp Link:** [Chat on WhatsApp](https://wa.me/254101930121)`;
  }

  if (q.includes('dpte') || q.includes('primary') || (q.includes('c plain') && q.includes('qualif'))) {
    return `### 🎓 Diploma in Primary Teacher Education (DPTE) Requirements\n\n- **Minimum KCSE Grade:** **C (Plain)**\n- **Subject Guidelines:** Grade C in English, Kiswahili, Mathematics, and one Science/Humanities subject.\n- **Duration:** 3 Years (including Teaching Practice/Practicum).\n- **TSC Registration:** Graduates are qualified for direct registration with the Teachers Service Commission (TSC) under the Competency-Based Curriculum (CBC).\n\n👉 *You can start your online application immediately by choosing DPTE in the portal dashboard!*`;
  }

  if (q.includes('decte') || q.includes('ecde') || q.includes('early child')) {
    return `### 👶 Diploma in Early Childhood Teacher Education (DECTE)\n\n- **Minimum KCSE Grade:** **C (Plain)** for direct entry Diploma; **D+ (Plus)** for Certificate in ECDE.\n- **Duration:** 3 Years for Diploma; 1-2 Years for Certificate.\n- **Focus:** Child psychology, foundational CBC literacy/numeracy, creative arts, and inclusive pre-primary pedagogy.\n\n👉 *We also offer Upgrade Diplomas (UDECTE) for existing Certificate holders.*`;
  }

  if (q.includes('upgrade') || q.includes('p1')) {
    return `### 📈 Upgrade Diplomas (UDPTE & UDECTE)\n\n- **Target Applicants:** Practicing teachers holding P1 certificates or ECDE Certificates wishing to upgrade to CBC Diploma level.\n- **Duration:** 1 to 2 Years (Modular / Holiday mode available).\n- **Benefit:** Meets the latest Ministry of Education & TSC compliance requirements for primary & junior secondary career progression.`;
  }

  if (q.includes('fee') || q.includes('cost') || q.includes('mpesa') || q.includes('pay') || q.includes('bank')) {
    return `### 💳 BTTC Fees & Payment Channels\n\n- **Application Fee:** **KES 1,000** (Payable during application submit via STK Push or Bank Slip).\n- **Term Tuition:** Approx **KES 28,000 – KES 34,500** per term (varies by boarding/day status).\n\n**Official Payment Channels:**\n1. **M-Pesa STK Push:** Integrated directly inside your application wizard (Step 5).\n2. **M-Pesa Paybill:** Business No: **522123**, Account: \`BTTC-[Your Name/ID]\`\n3. **Bank Deposit:** Co-operative Bank, Acc: **01129482716400**, Borabu Teachers Training College.`;
  }

  if (q.includes('document') || q.includes('upload') || q.includes('require')) {
    return `### 📁 Required Documents for Application\n\n1. **KCSE Result Slip or Certificate** (Clear PDF or JPG/PNG image).\n2. **National ID Card** (or Birth Certificate for applicants under 18).\n3. **Recent Passport-size Photograph** (White/plain background).\n4. **Leaving Certificate** (Secondary school).\n5. *(For Upgrade applicants)* Previous P1 or ECDE Certificate.\n\n👉 *You can upload files in Step 4 of the application wizard.*`;
  }

  return `### 👋 Welcome to Borabu Teachers Training College (BTTC)!\n\nBTTC is an accredited public teacher education institution situated in Nyamira County, Kenya. We offer:\n- **Diploma in Primary Teacher Education (DPTE)** (Min: KCSE C Plain)\n- **Diploma in Early Childhood Teacher Education (DECTE)** (Min: KCSE C Plain)\n- **Upgrade Diplomas (UDPTE / UDECTE)** for P1/ECDE teachers\n- **Diploma in Secondary Teacher Education (DSTE)** for Junior Secondary\n\n**How can I assist your admissions journey today?**\n- Check your qualification eligibility\n- Learn about tuition fees and hostel accommodation\n- Step-by-step guidance on submitting your online application`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return high-fidelity fallback response when API key is not configured
      const reply = getFallbackResponse(message);
      return NextResponse.json({ reply, source: 'knowledge_base' });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const conversationContext = Array.isArray(history) && history.length > 0
      ? history.slice(-4).map((h: { role: string; content: string }) => `${h.role === 'user' ? 'User' : 'Advisor'}: ${h.content}`).join('\n')
      : '';

    const promptText = `
${conversationContext ? `Recent conversation context:\n${conversationContext}\n` : ''}
Applicant Question: ${message}

Provide a helpful, precise, and encouraging response based on Borabu Teachers Training College guidelines. Use markdown formatting with bolding and bullet points. Keep it concise (under 250 words).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: BTTC_KNOWLEDGE_BASE,
      },
    });

    const reply = response.text || getFallbackResponse(message);

    return NextResponse.json({ reply, source: 'gemini' });
  } catch (error: any) {
    console.error('Gemini Advisor Error:', error);
    // Fallback gracefully so applicant experience is never disrupted
    const reply = getFallbackResponse('admissions');
    return NextResponse.json({ reply, source: 'fallback' });
  }
}
