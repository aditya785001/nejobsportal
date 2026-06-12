/**
 * Posts all scraped content from assamcareer.com into our site via the API.
 * No links to assamcareer.com are used — only official notification links.
 */
const BASE = "http://localhost:3000/api";

interface PostResult {
  pillar: string;
  title: string;
  status: number;
  ok: boolean;
  data?: any;
  error?: string;
}

async function postJson(url: string, body: any): Promise<PostResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(`  ❌ ${url} -> ${res.status}: ${JSON.stringify(data).slice(0, 500)}`);
    }
    return { pillar: url.split("/").pop()!, title: body.titleEn || body.schemeName || body.examName, status: res.status, ok: res.ok, data };
  } catch (err: any) {
    console.error(`  💥 ${url} -> ${err.message}`);
    return { pillar: url.split("/").pop()!, title: body.titleEn || body.schemeName || body.examName, status: 0, ok: false, error: err.message };
  }
}

async function main() {
  const results: PostResult[] = [];

  // ════════════════════════════════════════════════════════════════
  // 1. ASSAM D.EL.ED. ADMISSION 2026  (Admission)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/admissions`, {
    titleEn: "Assam D.El.Ed. Admission 2026 – Eligibility Criteria & Online Apply For SCERT PET",
    titleAs: "",
    slug: "assam-d-el-ed-admission-2026-scert-pet",
    institution: "SCERT, Assam",
    course: "Diploma in Elementary Education (D.El.Ed.)",
    duration: "2 Years",
    seats: 4150,
    feeStructure: { tuition: 600, application: 600 },
    eligibility: `Candidates must be a permanent resident of Assam. The applicant must have passed Higher Secondary (+2) or its equivalent examination from recognized Boards/Councils with at least 50% marks in aggregate. For SC/ST/ST(H) category there will be relaxation of 5% marks. Age: 18 to 34 years as on 1st July 2026.`,
    process: `Interested candidates may apply online at scertpet.co.in. Steps:
1. Visit the official website scertpet.co.in
2. Click on "New Registration" and complete registration
3. Login and fill personal and educational details
4. Upload required documents (photograph, signature, certificates)
5. Pay application fee of Rs. 600/- online
6. Submit and take printout of application form`,
    contentEn: `State Council of Educational Research and Training (SCERT), Assam has released the official notification for admission into 2-Year Diploma in Elementary Education (D.El.Ed.) Course for the session 2026-2028. The course will be conducted in NCTE recognized Teacher Education Institutes (DIET/CTE/Normal School/BTC/Pvt. TEls) of the state.

Pre-Entry Test (PET) 2026 will be conducted for selection. Total intake capacity is 4150 seats across 64 Teacher Education Institutions.

Exam Pattern of PET 2026:
- Total Marks: 100
- Time: 2 hours
- Type: MCQ (100 questions)
- Negative Marking: 0.25 marks per wrong answer

Section I: General English (10 marks), General Knowledge (15 marks), Reasoning (10 marks)
Section II: General Mathematics (15 marks), General Science & EVS (15 marks), Social Science (20 marks), Language (15 marks)`,
    importantDates: [
      { label: "Application Start", date: "2026-05-21" },
      { label: "Last Date", date: "2026-06-10" },
      { label: "Admit Card Release", date: "2026-07-05" },
      { label: "Pre-Entry Test (PET)", date: "2026-07-12" },
      { label: "Result Declaration", date: "2026-07-27" },
    ],
    portalUrl: "https://scertpet.co.in",
    state: "Assam",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 2. ASSAM ITI ADMISSION 2026  (Admission)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/admissions`, {
    titleEn: "Assam ITI Admission 2026 – Eligibility Criteria & Application Form",
    titleAs: "",
    slug: "assam-iti-admission-2026",
    institution: "Directorate of Employment and Craftsmen Training (DECT), Assam",
    course: "ITI Courses (NCVT & SCVT Trades)",
    duration: "1-2 Years",
    seats: null,
    feeStructure: { application: 0, tuition: 600 },
    eligibility: `Minimum qualification: 8th pass (for some trades) or 10th pass (for most trades). 12th pass with Science for Semiconductor Technician trade. Age: Minimum 14 years as on 1st July 2026. Various trades available including Electrician, Fitter, Welder, COPA, Mechanic Diesel, etc.`,
    process: `Apply online at itiassam.nic.in:
1. Visit www.itiassam.nic.in and click on "New Candidate Registration"
2. Login with Application Number & Password
3. Fill personal and educational details
4. Upload required documents
5. Submit online application form
6. Report to nearest Govt. ITI for document verification
7. Fill choices for e-counselling`,
    contentEn: `Directorate of Employment and Craftsmen Training (DECT), Assam has released the official ITI admission notification 2026 for admission into Government and private ITIs of Assam for the session 2026-2027. Admission available for NCVT/CoE trades, SCVT trades, SCVT under IMC, NCVT under IMC under Craftsman Training Scheme.

Trades offered include: Electrician, Fitter, Welder, Mechanic Motor Vehicle, COPA, Draughtsman Civil, Electronics Mechanic, Refrigeration & AC Technician, IoT Technician, AI Programming Assistant, Drone Technician, and many more.

Selection is based on online e-counselling after document verification.`,
    importantDates: [
      { label: "Registration Start", date: "2026-05-26" },
      { label: "Last Date", date: "2026-06-11" },
      { label: "Document Verification", date: "2026-05-26" },
      { label: "1st e-Counselling Allotment", date: "2026-06-22" },
    ],
    portalUrl: "https://itiassam.nic.in",
    state: "Assam",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 3. GAUHATI UNIVERSITY B.ED ADMISSION 2026  (Admission)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/admissions`, {
    titleEn: "Gauhati University B.Ed Admission 2026 – GUBEDCET Online Form",
    titleAs: "",
    slug: "gauhati-university-bed-admission-2026",
    institution: "Gauhati University",
    course: "Bachelor of Education (B.Ed.)",
    duration: "2 Years",
    seats: 3800,
    feeStructure: { application: 2000 },
    eligibility: `Passed BA/BSc/B.Com or MA/MSc/M.Com or equivalent from a recognised university with at least 50% marks (45% for SC/ST/OBC/PWD).`,
    process: `Apply online at the GUBEDCET portal:
1. Visit the official GUBEDCET application portal
2. Click "New User? Register Here"
3. Login and fill all personal and educational details
4. Upload required documents
5. Pay application fee of Rs. 2000/- online
6. Submit and take printout`,
    contentEn: `Gauhati University conducts Gauhati University B.Ed. Common Entrance Test (GUBEDCET) for admission into the 2-year Bachelor of Education (B.Ed.) course for academic year 2026-2027.

GUBEDCET Exam Pattern:
- Total Questions: 100 MCQs
- Total Marks: 400
- Duration: 2 hours
- Marking: +4 for correct, -1 for wrong
- Cutoff: 80 marks (UR), 60 marks (Reserved)

Syllabus: General English (100 marks), General Knowledge (120 marks), Reasoning & Numerical Ability (80 marks), Current Indian Education (60 marks), Ethics & Teaching Aptitude (40 marks)

Exam centres available across 14 locations in Assam including Guwahati, Nagaon, Jorhat, Tezpur, Dibrugarh, and more.`,
    importantDates: [
      { label: "Application Start", date: "2026-06-12" },
      { label: "Last Date", date: "2026-06-22" },
      { label: "GUBEDCET Exam", date: "2026-07-19" },
    ],
    portalUrl: "https://gauhati.ac.in",
    state: "Assam",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 4. GAUHATI UNIVERSITY PG ADMISSION 2026  (Admission)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/admissions`, {
    titleEn: "Gauhati University PG Admission 2026 – Online Apply For GU PGET",
    titleAs: "",
    slug: "gauhati-university-pg-admission-2026",
    institution: "Gauhati University",
    course: "MA, MCom, MSc & Other Interdisciplinary Programmes",
    duration: "2 Years",
    seats: null,
    feeStructure: { application: 800 },
    eligibility: `Candidates must be a FYUGP/Graduate with minimum 24 Credits in respective subject/s (Traditional Programmes) with Major/Honours or Regular Course. Candidates appearing in 6th Semester exams are also eligible for provisional admission.`,
    process: `Apply online at Gauhati University admission portal:
1. Visit the official GU admission portal
2. Click on Online Application Form
3. Enter credentials and upload documents
4. Pay Rs. 800/- per subject (max 3 subjects)
5. Submit and take printout`,
    contentEn: `Gauhati University has released the official notification for PG Admission 2026. The university has launched its online Post Graduation (PG) admission portal for various PG Programmes including Arts (MA), Science (MSc) and Commerce (MCom).

GU PGET 2026 Details:
- Mode: Offline (MCQ)
- Questions: 100 MCQs
- Duration: 2 Hours
- Negative Marking: 0.25 marks per wrong answer

Each applicant may apply for maximum three programmes: One Traditional Programme and up to Two Interdisciplinary Programmes.

Exam centres available across 18 locations including Gauhati University, MC College Barpeta, DHSK College Dibrugarh, JB University Jorhat, and centres in Shillong, Kohima, Aizawl, Imphal, Agartala, Siliguri, and Itanagar.`,
    importantDates: [
      { label: "Application Start", date: "2026-06-06" },
      { label: "Last Date", date: "2026-06-15" },
      { label: "Admit Card Release", date: "2026-06-20" },
      { label: "GU PGET Exam", date: "2026-07-03" },
      { label: "Merit List Publication", date: "2026-07-20" },
      { label: "Classes Commence", date: "2026-08-05" },
    ],
    portalUrl: "https://gauhati.ac.in",
    state: "Assam",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 5. AVFU GUWAHATI ADMISSION 2026  (Admission)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/admissions`, {
    titleEn: "AVFU Guwahati Admission 2026 – Eligibility Criteria & Application Form",
    titleAs: "",
    slug: "avfu-guwahati-admission-2026",
    institution: "Assam Veterinary and Fishery University, Khanapara, Guwahati",
    course: "Undergraduate and Postgraduate Degree Programmes (B.V.Sc. & A.H., B.F.Sc., M.V.Sc., M.F.Sc., Ph.D.)",
    duration: "5.5 Years (BVSc), 4 Years (BFSc), 2 Years (MVSc/MFSc)",
    seats: 160,
    feeStructure: { application: 1500 },
    eligibility: `B.V.Sc. & A.H.: 10+2 with Biology, Chemistry, Physics & English with 50% marks (47.5% for SC/ST).
B.F.Sc.: 10+2 with Biology, Chemistry, Physics & English with 50% marks (40% for SC/ST).
Age: Minimum 17 years as on 01-08-2026.`,
    process: `Apply online at the AAU/AVFU admission portal:
1. Visit the official admission portal
2. Complete registration process
3. Login and fill personal and educational details
4. Upload required documents
5. Pay application fee of Rs. 1500/- online
6. Submit and take printout
Selection based on Common Entrance Test (CBT) score.`,
    contentEn: `Assam Veterinary and Fishery University, Khanapara, Guwahati has released the AVFU Official Admission Notification for the 2026-2027 session. The university offers UG and PG programmes in Veterinary Science and Fishery Science.

Courses offered:
- B.V.Sc. & A.H. (5.5 years) - 160 seats (100 at Khanapara + 60 at Lakhimpur)
- B.F.Sc. (8 semesters) - 50 seats at College of Fisheries, Raha
- M.V.Sc. (4 semesters)
- M.F.Sc. (4 semesters)
- Ph.D. (6 semesters)

The Common Entrance Test (CET-UG-AAU 2026) will be a Computer Based Test (CBT) of 2 hours duration with 160 MCQs (40 each from Physics, Chemistry, Botany and Zoology).`,
    importantDates: [
      { label: "Application Start", date: "2026-05-01" },
      { label: "Last Date", date: "2026-06-10" },
    ],
    portalUrl: "https://www.aau.ac.in",
    state: "Assam",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 6. DIVYANGJAN SCHOLARSHIP 2026  (Scholarship)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/scholarships`, {
    titleEn: "Divyangjan Scholarship 2026 – Pre-Matric & Post-Matric Scholarship For Students With Disabilities",
    titleAs: "",
    slug: "divyangjan-scholarship-2026",
    schemeName: "Divyangjan Scholarship 2026 – National Scholarship for Persons with Disabilities",
    provider: "Department of Persons with Disabilities (DEPwD), Ministry of Social Justice & Empowerment, Govt. of India",
    amount: "Pre-Matric: Up to Rs. 6,000/- per annum; Post-Matric: Up to Rs. 25,000/- per annum; Top Class: Full tuition + living expenses",
    duration: "1 Year (renewable)",
    eligibility: `Only Indian citizens with benchmark disability (40% or more) having valid disability certificate. 
Pre-Matric: Students of Class IX & X
Post-Matric: Students at post-matriculation level up to Post-Graduation
Top Class Education: Graduate and Post-Graduate degree/diploma in notified institutes
Income Ceiling: Pre/Post-Matric: Rs. 2.5 lakhs per annum; Top Class: Rs. 8 lakhs per annum`,
    applicationProcess: `Apply online through National Scholarship Portal (NSP) at scholarships.gov.in:
1. Visit www.scholarships.gov.in
2. Click on One-Time Registration
3. Register with required details
4. Login and fill Online Application Form
5. Upload required documents (if scholarship amount > Rs. 50,000/-)
6. Submit application and take printout`,
    contentEn: `Directorate of Social Justice & Empowerment, Assam has released the official notification for three types of scholarships for students with disabilities for the academic year 2026-2027. These centrally sponsored schemes are offered by the Department of Persons with Disabilities (DEPwD), Ministry of Social Justice & Empowerment, Govt. of India through the National Scholarship Portal.

Features:
- Pre-Matric: 25,000 slots for Class IX & X students
- Post-Matric: 17,000 slots for XI, XII, Diploma, Bachelor's, Master's
- Top Class Education: 300 slots for graduate/postgraduate in notified institutes
- National Fellowship: For M.Phil/PhD in Indian universities
- National Overseas: For Master's/PhD abroad
- Free Coaching: For competitive exam preparation

Not more than two disabled children of the same parents are entitled to receive benefits.`,
    importantDates: [
      { label: "Application Start", date: "2026-06-01" },
      { label: "Last Date (Pre-Matric)", date: "2026-08-31" },
      { label: "Last Date (Post-Matric & Others)", date: "2026-10-31" },
      { label: "Institution Level Verification", date: "2026-11-15" },
    ],
    portalUrl: "https://scholarships.gov.in",
    state: "AllIndia",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 7. CBSE CTET NOTIFICATION 2026  (Exam Prep)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/exam-prep`, {
    titleEn: "CBSE CTET Notification 2026 – Online Apply For CTET September, 2026",
    titleAs: "",
    slug: "cbse-ctet-notification-2026",
    exam: "CTET",
    category: "Examination",
    author: "NEJobsPortal Team",
    contentEn: `The Central Board of Secondary Education (CBSE) has released the official notification for the Central Teacher Eligibility Test (CTET), September 2026 - the 22nd edition of CTET.

CTET Details:
- Exam Date: 6th September 2026
- Mode: Offline (Pen & Paper)
- Languages: 27 languages
- Exam Centres in Assam: Dibrugarh, Guwahati, Silchar
- Validity of CTET Certificate: Lifetime
- Last Date: 10th June 2026

Eligibility for Classes I-V (Paper I):
- Senior Secondary with 50% marks + 2-year D.El.Ed, OR
- Senior Secondary with 50% marks + 4-year B.El.Ed, OR
- Graduation with 50% + B.Ed

Eligibility for Classes VI-VIII (Paper II):
- Graduation + 2-year D.El.Ed, OR
- Graduation with 50% + B.Ed, OR
- Senior Secondary with 50% + 4-year B.El.Ed

Application Fee:
- General/OBC-NCL: Rs. 1000/- (single paper), Rs. 1200/- (both papers)
- SC/ST/PWD: Rs. 500/- (single paper), Rs. 600/- (both papers)

Exam Pattern:
Paper I (Classes I-V): 150 MCQs, 150 marks, 2.5 hours
- Child Development & Pedagogy: 30
- Mathematics: 30
- Environmental Studies: 30
- Language I: 30
- Language II: 30

Paper II (Classes VI-VIII): 150 MCQs, 150 marks, 2.5 hours
- Child Development & Pedagogy: 30
- Mathematics & Science OR Social Studies: 60
- Language I: 30
- Language II: 30

How to Apply:
1. Visit ctet.nic.in
2. Click on Online Application Form
3. Register and fill personal/educational details
4. Upload photograph and signature
5. Pay examination fee online
6. Submit and take printout

Important Dates:
- Application Start: 11th May 2026
- Last Date: 10th June 2026
- Correction Window: 15th-18th June 2026
- Admit Card: 2 days before exam
- Exam Date: 6th September 2026
- Result: By end of October 2026 (Tentative)`,
    hashtags: ["CTET", "CBSE", "Teaching", "Teacher Eligibility Test", "Central Government"],
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 8. ASSAM UNIVERSITY RECRUITMENT 2026  (Job)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/jobs`, {
    titleEn: "Assam University Recruitment 2026 – 124 Faculty Posts (Professor, Associate Professor, Assistant Professor)",
    titleAs: "",
    slug: "assam-university-recruitment-2026-faculty",
    department: "Assam University, Silchar",
    state: "Assam",
    category: "StateGovt",
    jobType: "FullTime",
    selectionType: "Interview",
    totalVacancies: 124,
    payScale: "Professor: Rs. 1,44,200 - 2,18,200; Associate Professor: Rs. 1,31,400 - 2,17,100; Assistant Professor: Rs. 57,700 - 1,82,400",
    qualification: `Professor: Ph.D. degree with minimum 10 years teaching/research experience and significant publications.
Associate Professor: Ph.D. with minimum 8 years experience and good publication record.
Assistant Professor: Master's degree with NET/SLET/SET or Ph.D. as per UGC Regulations.`,
    ageLimit: "As per UGC norms",
    lastDate: "2026-07-10",
    applicationUrl: "https://www.aus.ac.in",
    fee: { general: 1000, obc: 1000, sc: 500, st: 500, pwd: 500, female: 500 },
    howToApplyEn: `Interested and eligible candidates may apply online at Assam University Recruitment Portal. Steps:
1. Visit official website and click Register Now
2. Fill personal and educational details
3. Upload required documents
4. Pay application fee (UR/OBC/EWS: Rs. 1000/-, SC/ST/PWD/Women: Rs. 500/-)
5. Submit form and take printout
6. Send hard copy to: Deputy Registrar, Room No # 103, Raja Rammohan Ray Administrative Building, Assam University, Silchar, Pin-788011, Cachar, Assam`,
    howToApplyAs: "",
    summaryEn: `Assam University, Silchar has released an employment notification for recruitment of 124 Faculty vacancies in the cadre of Professor (34 posts), Associate Professor (39 posts), and Assistant Professor (51 posts) at both Silchar and Diphu campus.`,
    contentEn: `Assam University, Silchar has released an employment notification for the recruitment of 124 Faculty Vacancy in the cadre of Professor, Associate Professor, and Assistant Professor in various departments.

Post-wise vacancies:
- Professor: 34 posts (Regular: 22, Backlog: 11, Leave: 1)
- Associate Professor: 39 posts (Regular: 25, Backlog: 13, Leave: 1)
- Assistant Professor: 51 posts (Regular: 43, Backlog: 0, Leave: 8)

Candidates must fulfill UGC/University norms. Apply online before 10th July 2026.`,
    importantDates: [
      { label: "Application Start", date: "2026-06-06" },
      { label: "Last Date", date: "2026-07-10" },
    ],
    notificationPdfUrl: "https://www.aus.ac.in",
    notificationDate: "2026-06-06",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 9. GNRC MEDISHOP RECRUITMENT 2026  (Job - Private)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/jobs`, {
    titleEn: "GNRC Medishop Recruitment 2026 – Pharmacist & Store Manager @ Majuli",
    titleAs: "",
    slug: "gnrc-medishop-recruitment-2026",
    department: "GNRC Medishop Private Limited",
    state: "Assam",
    category: "Private",
    jobType: "FullTime",
    selectionType: "Interview",
    totalVacancies: 2,
    payScale: "Up to Rs. 12,000/- per month",
    qualification: `Pharmacist: B.Pharma or D.Pharma with registration, minimum 1 year experience in pharmacy/medical store.
Store Manager: Minimum 1-2 years experience in Retail, Pharmacy, FMCG, or Supermarket operations.`,
    ageLimit: "Not specified",
    lastDate: "2026-06-14",
    applicationUrl: "https://www.gnrcmedishop.com",
    fee: { general: 0, obc: 0, sc: 0, st: 0, pwd: 0, female: 0 },
    howToApplyEn: `Interested and eligible candidates may send their updated CV through Email or WhatsApp:
Email: hr@gnrcmedishop.com
WhatsApp: 9707025821
Only shortlisted candidates will be contacted.`,
    howToApplyAs: "",
    summaryEn: `GNRC Medishop Private Limited has released an employment notification for recruitment of 2 posts - Pharmacist (1 post) and Store Manager (1 post) under Franchise payroll at Majuli, Assam.`,
    contentEn: `GNRC Medishop Private Limited has released an employment notification for the recruitment of 2 posts under Franchise payroll at Majuli, Assam.

1. Pharmacist (1 post)
- Qualification: B.Pharma or D.Pharma with registration
- Experience: Minimum 1 year in pharmacy/medical store
- Remuneration: Up to Rs. 12,000/-
- Responsibilities: Dispense medicines, maintain inventory, process billing, ensure compliance

2. Store Manager (1 post)
- Qualification: Graduate
- Experience: 1-2 years in Retail/Pharmacy/FMCG operations
- Remuneration: Up to Rs. 12,000/-
- Responsibilities: Store operations, team supervision, inventory management, sales targets

Preference will be given to applicants from Majuli and nearby locations.`,
    importantDates: [
      { label: "Last Date", date: "2026-06-14" },
    ],
    notificationDate: "2026-06-07",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 10. SSC CGL RECRUITMENT 2026  (Job)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/jobs`, {
    titleEn: "SSC CGL Recruitment 2026 – Online Apply For 12256 Group B & C Posts",
    titleAs: "",
    slug: "ssc-cgl-recruitment-2026",
    department: "Staff Selection Commission (SSC)",
    state: "AllIndia",
    category: "CentralGovt",
    jobType: "FullTime",
    selectionType: "WrittenExam",
    totalVacancies: 12256,
    payScale: "Pay Level 4 to Level 8 (Rs. 25,500 - 81,100 to Rs. 47,600 - 1,51,100)",
    qualification: `Bachelor's Degree from a recognized University. For Junior Statistical Officer: Bachelor's Degree with at least 60% Marks in Mathematics at 12th level or Statistics as one of the subjects at degree level.`,
    ageLimit: "18-27 years to 18-30 years depending on post. Relaxation: SC/ST: 5 years, OBC: 3 years, PwD: 10-15 years",
    lastDate: "2026-06-22",
    applicationUrl: "https://ssc.gov.in",
    fee: { general: 100, obc: 100, sc: 0, st: 0, pwd: 0, female: 0 },
    howToApplyEn: `Interested candidates may apply online at SSC official website. Steps:
1. Visit ssc.gov.in and click on CGL Application Form
2. Complete registration and login
3. Fill personal, educational, and other details
4. Upload photograph, signature, and documents
5. Pay fee (General/OBC: Rs. 100/-, SC/ST/Women: Nil)
6. Submit and take printout`,
    howToApplyAs: "",
    summaryEn: `Staff Selection Commission (SSC) has released the official notification of Combined Graduate Level (CGL) Examination 2026 for recruitment of approximately 12256 Group B and Group C posts in various Ministries/Departments of Government of India.`,
    contentEn: `Staff Selection Commission (SSC) has released the official notification of Combined Graduate Level (CGL) Examination 2026 for recruitment of approximately 12256 Group B and Group C posts.

Posts include: Assistant Audit Officer, Assistant Accounts Officer, Assistant Section Officer, Inspector, Sub Inspector, Inspector of Posts, Statistical Investigator, Office Superintendent, Auditor, Accountant, Tax Assistant, Postal Assistant, Sorting Assistant, etc.

Exam Pattern:
Tier-I (Computer Based):
- General Intelligence & Reasoning: 25 Qs (50 marks)
- General Awareness: 25 Qs (50 marks)
- Quantitative Aptitude: 25 Qs (50 marks)
- English Comprehension: 25 Qs (50 marks)
- Total: 100 Qs (200 marks), 1 hour
- Negative marking: 0.50 marks per wrong answer

Tier-II (Computer Based):
- Paper-I: Compulsory for all posts
- Paper-II: For JSO and Statistical Investigator posts only

Exam Centres in Northeast: Itanagar, Dibrugarh, Guwahati, Jorhat, Silchar, Tezpur, Dimapur, Kohima, Shillong, Imphal, Churachandpur, Ukhrul, Agartala, Aizwal

Application Dates:
- Start: 21st May 2026
- Last Date: 22nd June 2026
- Tier-I Exam: August-September 2026
- Tier-II Exam: December 2026`,
    importantDates: [
      { label: "Application Start", date: "2026-05-21" },
      { label: "Last Date", date: "2026-06-22" },
      { label: "Tier-I Exam", date: "2026-08-01" },
      { label: "Tier-II Exam", date: "2026-12-01" },
    ],
    notificationPdfUrl: "https://ssc.gov.in",
    notificationDate: "2026-05-21",
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 11. APSC CCE ADMIT CARD 2026  (Result - Admit Card)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/results`, {
    titleEn: "APSC CCE Admit Card 2026 – Check List Of Eligible Candidates",
    titleAs: "",
    slug: "apsc-cce-admit-card-2026",
    examName: "APSC Combined Competitive Examination (CCE) 2025",
    resultType: "ADMIT_CARD",
    declaringBody: "Assam Public Service Commission (APSC)",
    state: "Assam",
    declarationDate: "2026-06-08",
    pdfUrl: "https://apsc.nic.in",
    summaryEn: `APSC has released the list of eligible candidates for CCE (Preliminary) Examination, 2025. The prelims exam will be held on 5th July 2026 and admit card will be available from 15th June 2026.`,
    contentEn: `Assam Public Service Commission (APSC) released the official exam schedule of Combined Competitive (Preliminary) Examination, 2025. As per the notification, Prelims of CCE, 2025 will be held on 5th July 2026 (Sunday) across 35 District Headquarters of the state.

Key Details:
- Advertisement No.: Advt. No. 01/2026
- No of posts: 78 posts
- Date of exam: 5th July 2026
- Admit card release: 15th June 2026
- Type: Preliminary exam (Objective type)

Exam Programme:
- 5th July, 10 AM-12 PM: General Studies-I (200 marks)
- 5th July, 2 PM-4 PM: General Studies-II (200 marks)

Negative marking: One-fourth mark deducted for wrong answers.

Exam Centres: 35 District Headquarters across Assam including Guwahati, Dibrugarh, Jorhat, Silchar, Tezpur, Nagaon, and all other district HQs.

How to Download Admit Card:
1. Visit apsc.nic.in
2. Click on CCE Admit Card link
3. Enter Application ID/Roll Number and Date of Birth
4. Download and print admit card`,
    whatsNext: `After Prelims:
1. Results of Prelims will be announced
2. Qualified candidates will appear for Mains Examination
3. Shortlisted candidates will appear for Interview/Viva-Voce`,
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 12. NEET ADMIT CARD 2026  (Result - Admit Card)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/results`, {
    titleEn: "NEET Admit Card 2026 – Check NEET UG Exam City Details",
    titleAs: "",
    slug: "neet-admit-card-2026",
    examName: "NEET UG 2026",
    resultType: "ADMIT_CARD",
    declaringBody: "National Testing Agency (NTA)",
    state: "AllIndia",
    declarationDate: "2026-06-08",
    pdfUrl: "https://neet.nta.nic.in",
    summaryEn: `NTA is shortly going to release the NEET Admit Card for re-examination of NEET-UG 2026. The NEET 2026 re-exam is scheduled for 21st June 2026.`,
    contentEn: `National Testing Agency (NTA) is shortly going to release the NEET Admit Card for re-examination of National Eligibility cum Entrance Test (NEET)-UG 2026 exam.

NEET UG Details:
- Exam Date: 21st June 2026 (Sunday)
- Timing: 02:00 PM to 05:15 PM
- Duration: 180 minutes
- Mode: Pen & Paper (Offline)
- Total Questions: 180 MCQs
- Total Marks: 720 (4 marks per correct answer)
- Negative Marking: 1 mark per wrong answer

Subjects: Physics (45 Qs, 180 marks), Chemistry (45 Qs, 180 marks), Biology - Botany & Zoology (90 Qs, 360 marks)

Languages available: English, Hindi, Assamese, Bengali, Gujarati, Kannada, Malayalam, Marathi, Odia, Punjabi, Tamil, Telugu, Urdu

How to Download Admit Card:
1. Visit neet.nta.nic.in
2. Click on NEET Admit Card Link
3. Enter Application Number & Date of Birth
4. Download and print admit card

Previous exam (3rd May 2026) was cancelled. Re-exam scheduled for 21st June 2026.`,
    whatsNext: `After NEET UG 2026:
1. Results will be announced by NTA
2. NEET score used for MBBS/BDS/BAMS/BSMS/BUMS/BHMS admissions
3. Counselling conducted by MCC and state authorities`,
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // 13. SPECIAL ASSAM TET ADMIT CARD 2026  (Result - Admit Card)
  // ════════════════════════════════════════════════════════════════
  results.push(await postJson(`${BASE}/results`, {
    titleEn: "Special Assam TET 2026 – Download Special TET Admit Card From 12th June",
    titleAs: "",
    slug: "special-assam-tet-2026-admit-card",
    examName: "Special Assam Teacher Eligibility Test (TET) 2026",
    resultType: "ADMIT_CARD",
    declaringBody: "State Level Empowered Committee, TET, Govt. of Assam",
    state: "Assam",
    declarationDate: "2026-06-07",
    pdfUrl: "https://tet.assam.gov.in",
    summaryEn: `State Level Empowered Committee, TET, Govt. of Assam has released the admit card notification for Special Assam TET 2026. Admit cards will be available from 12th June 2026. Exam will be held on 28th June 2026 for Lower Primary and Upper Primary level.`,
    contentEn: `State Level Empowered Committee, TET, Govt. of Assam has released the official notification of Special Assam Teacher Eligibility Test (TET)-2026 for Lower Primary and Upper Primary level for the Bodo, Garo, Manipuri and Hmar medium.

Special TET Details:
- Exam Date: 28th June 2026
- Admit Card Release: 12th June 2026, 11 AM onwards
- Duration: 2 Hours 30 Minutes per paper
- Type: OMR based, MCQ
- Total Questions: 150 MCQs per paper
- No negative marking
- Qualifying Marks: 60% (90/150) for General, 55% (83/150) for Reserved

Medium of Exam: Assamese, Bengali, Bodo, English

TET Certificate Validity: Lifetime

Paper I (LP - Classes I to V): Child Development & Pedagogy (30), Language I (30), Language II-English (30), Mathematics (30), Environmental Studies (30)

Paper II (UP - Classes VI to VIII): Child Development & Pedagogy (30), Language I (30), Language II-English (30), Mathematics & Science OR Social Studies (60)

Exam Fee:
- General: Rs. 550/- per paper
- SC/ST/OBC/MOBC: Rs. 450/- per paper
- PWD (PH): Rs. 300/- per paper

How to Download Admit Card:
1. Visit the official TET website
2. Click on TET Admit Card link (available from 12th June)
3. Enter Application Number and Date of Birth
4. Download and print admit card`,
    whatsNext: `After Special TET 2026:
1. Qualified candidates eligible for teacher recruitment in elementary level schools
2. Recruitment process for LP and UP level teachers will follow`,
    status: "PENDING_REVIEW",
  }));

  // ════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════
  console.log("\n========== POSTING RESULTS ==========");
  for (const r of results) {
    const icon = r.ok ? "✅" : "❌";
    console.log(`${icon} [${r.pillar}] ${r.title}`);
    console.log(`   Status: ${r.status} | ${r.ok ? "OK" : "FAILED"} ${r.error ? "- " + r.error : ""}`);
    if (r.data?.error) console.log(`   Error: ${r.data.error}`);
  }
  console.log("======================================");
}

main().catch(console.error);
