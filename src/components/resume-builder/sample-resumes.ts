import type { ResumeData, TemplateId } from "./types";

export interface SampleResume {
  id: TemplateId;
  label: string;
  data: ResumeData;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  // ── 1. Government ──────────────────────────────────────────────
  {
    id: "govt",
    label: "Government Job (APSC/SSC)",
    data: {
      photo: "",
      personalInfo: {
        fullName: "Pranab Kumar Borah",
        email: "pranab.borah@email.com",
        phone: "+91-98765-43210",
        address: "Dispur, Guwahati, Assam - 781006",
        linkedin: "linkedin.com/in/pranab-borah",
        website: "",
        title: "IAS Aspirant | APSC Candidate",
        summary:
          "Dedicated civil services aspirant with strong analytical and administrative skills. Cleared APSC Combined Competitive Examination prelims with top percentile. Proven track record in public service and community development initiatives across rural Assam.",
      },
      education: [
        {
          id: "edu_1",
          degree: "M.A. in Political Science",
          institution: "Gauhati University",
          location: "Guwahati, Assam",
          startDate: "2020",
          endDate: "2022",
          grade: "78%",
          description:
            "Specialized in Public Administration and Indian Polity. Dissertation on 'Decentralized Governance in Assam'.",
        },
        {
          id: "edu_2",
          degree: "B.A. (Honours) in Political Science",
          institution: "Cotton University",
          location: "Guwahati, Assam",
          startDate: "2017",
          endDate: "2020",
          grade: "8.2 CGPA",
          description:
            "Active member of the Debating Society and Model UN Club. Secured 1st place in inter-college quiz on Indian Constitution.",
        },
        {
          id: "edu_3",
          degree: "Higher Secondary (Arts)",
          institution: "Salt Brook Academy",
          location: "Dibrugarh, Assam",
          startDate: "2015",
          endDate: "2017",
          grade: "85%",
          description: "Major: Political Science, Economics, History",
        },
      ],
      experience: [
        {
          id: "exp_1",
          title: "Block Development Officer (Probationary)",
          company: "Government of Assam",
          location: "Majuli, Assam",
          startDate: "Jan 2023",
          endDate: "Present",
          current: true,
          description:
            "Overseeing implementation of rural development schemes including MGNREGA and PMAY-G. Coordinated with 12 gram panchayats for efficient fund utilization. Achieved 95%+ scheme completion rate within financial year.",
        },
        {
          id: "exp_2",
          title: "Research Assistant",
          company: "Assam Institute of Public Administration",
          location: "Guwahati, Assam",
          startDate: "Jun 2022",
          endDate: "Dec 2022",
          current: false,
          description:
            "Conducted policy research on e-governance initiatives in Northeast India. Co-authored 2 reports published in the institute's quarterly journal. Assisted in organizing 3 state-level workshops on digital administration.",
        },
      ],
      skills: [
        { id: "sk_1", name: "Public Administration", level: "advanced", category: "Management" },
        { id: "sk_2", name: "Policy Analysis", level: "advanced", category: "Technical" },
        { id: "sk_3", name: "MS Office Suite", level: "expert", category: "Software" },
        { id: "sk_4", name: "Assamese & English Typing", level: "expert", category: "Technical" },
        { id: "sk_5", name: "Data Analysis", level: "intermediate", category: "Technical" },
        { id: "sk_6", name: "Report Writing", level: "advanced", category: "Soft Skills" },
        { id: "sk_7", name: "Leadership & Team Coordination", level: "advanced", category: "Soft Skills" },
      ],
      certifications: [
        {
          id: "cert_1",
          name: "Certification in Public Policy & Governance",
          issuer: "IIM Bangalore (SWAYAM)",
          date: "2023",
          url: "",
        },
        {
          id: "cert_2",
          name: "Diploma in Rural Development",
          issuer: "NIRD, Hyderabad",
          date: "2022",
          url: "",
        },
      ],
      languages: [
        { id: "lang_1", name: "Assamese", proficiency: "native" },
        { id: "lang_2", name: "English", proficiency: "fluent" },
        { id: "lang_3", name: "Hindi", proficiency: "fluent" },
        { id: "lang_4", name: "Bengali", proficiency: "intermediate" },
      ],
      projects: [
        {
          id: "proj_1",
          name: "Digital Literacy Drive for Rural Women",
          description:
            "Led a team of 15 volunteers to train 200+ rural women in Majuli on basic digital skills including UPI payments, government portal navigation, and smartphone usage. Recognized by the District Administration.",
          technologies: "Digital Literacy, Community Outreach",
          url: "",
        },
      ],
      references: "",
    },
  },

  // ── 2. Banking & Finance ────────────────────────────────────────
  {
    id: "banking",
    label: "Banking & Finance (PO/Manager)",
    data: {
      photo: "",
      personalInfo: {
        fullName: "Anjali Sharma",
        email: "anjali.sharma@email.com",
        phone: "+91-87654-32109",
        address: "Uzan Bazar, Guwahati, Assam - 781001",
        linkedin: "linkedin.com/in/anjali-sharma-bank",
        website: "",
        title: "Banking Professional | IBPS PO | SBI Specialist",
        summary:
          "Results-driven banking professional with 5+ years of experience in retail banking, credit analysis, and branch operations. Cleared IBPS PO and SBI Clerk exams. Proven track record in achieving branch targets and delivering exceptional customer service in competitive markets.",
      },
      education: [
        {
          id: "edu_1",
          degree: "MBA in Finance",
          institution: "IIM Shillong",
          location: "Shillong, Meghalaya",
          startDate: "2018",
          endDate: "2020",
          grade: "3.6/4.0 GPA",
          description:
            "Specialized in Corporate Finance and Investment Management. Completed summer internship at HDFC Bank's treasury division.",
        },
        {
          id: "edu_2",
          degree: "B.Com (Honours)",
          institution: "Dibrugarh University",
          location: "Dibrugarh, Assam",
          startDate: "2015",
          endDate: "2018",
          grade: "85%",
          description:
            "Major in Accounting & Finance. Recipient of the University Gold Medal for academic excellence.",
        },
      ],
      experience: [
        {
          id: "exp_1",
          title: "Assistant Manager (Retail Banking)",
          company: "State Bank of India",
          location: "Guwahati, Assam",
          startDate: "Mar 2021",
          endDate: "Present",
          current: true,
          description:
            "Managing daily branch operations with a portfolio of ₹50Cr+ in deposits. Led cross-selling initiatives achieving 120% of annual target for mutual funds and insurance products. Reduced customer complaint resolution time by 40% through process automation. Supervising a team of 8 staff members.",
        },
        {
          id: "exp_2",
          title: "Credit Analyst",
          company: "HDFC Bank Ltd.",
          location: "Guwahati, Assam",
          startDate: "Aug 2020",
          endDate: "Feb 2021",
          current: false,
          description:
            "Performed credit appraisal for SME and retail loan applications worth ₹25Cr. Analyzed financial statements, cash flows, and collateral valuation. Maintained NPA ratio below 1% through diligent risk assessment.",
        },
        {
          id: "exp_3",
          title: "Probationary Officer (Trainee)",
          company: "Indian Bank",
          location: "Jorhat, Assam",
          startDate: "Jun 2017",
          endDate: "May 2018",
          current: false,
          description:
            "Completed rotational training across all banking verticals including deposits, advances, forex, and digital banking. Achieved 100% target for Pradhan Mantri Jan Dhan Yojana enrollments during the training period.",
        },
      ],
      skills: [
        { id: "sk_1", name: "Credit Analysis & Risk Assessment", level: "expert", category: "Technical" },
        { id: "sk_2", name: "Financial Statement Analysis", level: "expert", category: "Technical" },
        { id: "sk_3", name: "Branch Operations Management", level: "advanced", category: "Management" },
        { id: "sk_4", name: "Tally ERP & Banking Software", level: "advanced", category: "Software" },
        { id: "sk_5", name: "Regulatory Compliance (RBI/IRDA)", level: "advanced", category: "Technical" },
        { id: "sk_6", name: "Customer Relationship Management", level: "expert", category: "Soft Skills" },
        { id: "sk_7", name: "Team Leadership & Training", level: "advanced", category: "Management" },
      ],
      certifications: [
        {
          id: "cert_1",
          name: "Certified Credit Professional (CCP)",
          issuer: "Indian Institute of Banking & Finance",
          date: "2022",
          url: "",
        },
        {
          id: "cert_2",
          name: "JAIIB / CAIIB",
          issuer: "Indian Institute of Banking & Finance",
          date: "2023",
          url: "",
        },
      ],
      languages: [
        { id: "lang_1", name: "English", proficiency: "fluent" },
        { id: "lang_2", name: "Hindi", proficiency: "fluent" },
        { id: "lang_3", name: "Assamese", proficiency: "native" },
        { id: "lang_4", name: "Bengali", proficiency: "intermediate" },
      ],
      projects: [
        {
          id: "proj_1",
          name: "Digital Banking Awareness Campaign",
          description:
            "Designed and executed a 3-month campaign to increase digital adoption among rural customers. Resulted in 45% increase in mobile banking registrations and 60% reduction in counter transactions for participating branches.",
          technologies: "Digital Banking, Financial Literacy",
          url: "",
        },
      ],
      references: "",
    },
  },

  // ── 3. IT & Tech ────────────────────────────────────────────────
  {
    id: "it",
    label: "IT & Technology (Developer)",
    data: {
      photo: "",
      personalInfo: {
        fullName: "Rohit Das",
        email: "rohit.das@email.com",
        phone: "+91-70023-45678",
        address: "Beltola, Guwahati, Assam - 781028",
        linkedin: "linkedin.com/in/rohit-das-dev",
        website: "rohitdas.dev",
        title: "Full-Stack Developer | MERN | Cloud Enthusiast",
        summary:
          "Innovative Full-Stack Developer with 4+ years of experience building scalable web applications. Proficient in React, Node.js, TypeScript, and cloud services. Passionate about creating impactful digital solutions for Northeast India's growing tech ecosystem.",
      },
      education: [
        {
          id: "edu_1",
          degree: "B.Tech in Computer Science & Engineering",
          institution: "National Institute of Technology, Silchar",
          location: "Silchar, Assam",
          startDate: "2017",
          endDate: "2021",
          grade: "8.6 CGPA",
          description:
            "Major in Software Engineering. Published research paper on 'Optimizing React Performance' in IEEE conference. Won 2nd place at Smart India Hackathon for developing a disaster management platform.",
        },
        {
          id: "edu_2",
          degree: "Higher Secondary (Science)",
          institution: "Delhi Public School, Dibrugarh",
          location: "Dibrugarh, Assam",
          startDate: "2015",
          endDate: "2017",
          grade: "92%",
          description: "Major: Physics, Chemistry, Mathematics, Computer Science",
        },
      ],
      experience: [
        {
          id: "exp_1",
          title: "Senior Software Engineer",
          company: "Techify Solutions Pvt. Ltd.",
          location: "Bengaluru, KA (Remote from Guwahati)",
          startDate: "Jan 2023",
          endDate: "Present",
          current: true,
          description:
            "Architected and built a SaaS platform serving 10K+ users using React, Next.js, and PostgreSQL. Migrated legacy REST APIs to GraphQL, reducing payload size by 60%. Led a team of 4 junior developers through sprint planning and code reviews. Implemented CI/CD pipelines reducing deployment time by 80%.",
        },
        {
          id: "exp_2",
          title: "Full-Stack Developer",
          company: "NorthEast Digital Solutions",
          location: "Guwahati, Assam",
          startDate: "Jun 2021",
          endDate: "Dec 2022",
          current: false,
          description:
            "Developed an e-commerce platform for local artisans with payment gateway integration. Built RESTful APIs using Node.js/Express with MongoDB. Reduced page load time by 45% through code splitting and lazy loading. Collaborated with UI/UX team to implement responsive designs.",
        },
      ],
      skills: [
        { id: "sk_1", name: "React / Next.js / TypeScript", level: "expert", category: "Technical" },
        { id: "sk_2", name: "Node.js / Express / GraphQL", level: "expert", category: "Technical" },
        { id: "sk_3", name: "PostgreSQL / MongoDB / Redis", level: "advanced", category: "Technical" },
        { id: "sk_4", name: "AWS (EC2, S3, Lambda)", level: "advanced", category: "Technical" },
        { id: "sk_5", name: "Docker / Kubernetes", level: "intermediate", category: "Technical" },
        { id: "sk_6", name: "Git / CI-CD Pipelines", level: "advanced", category: "Software" },
        { id: "sk_7", name: "System Design & Architecture", level: "advanced", category: "Management" },
        { id: "sk_8", name: "Agile / Scrum", level: "advanced", category: "Management" },
      ],
      certifications: [
        {
          id: "cert_1",
          name: "AWS Solutions Architect – Associate",
          issuer: "Amazon Web Services",
          date: "2023",
          url: "",
        },
        {
          id: "cert_2",
          name: "Meta Front-End Developer Professional Certificate",
          issuer: "Meta (Coursera)",
          date: "2022",
          url: "",
        },
      ],
      languages: [
        { id: "lang_1", name: "English", proficiency: "fluent" },
        { id: "lang_2", name: "Assamese", proficiency: "native" },
        { id: "lang_3", name: "Hindi", proficiency: "fluent" },
      ],
      projects: [
        {
          id: "proj_1",
          name: "NEJobsPortal.in",
          description:
            "Built a comprehensive jobs and education portal for Northeast India with resume builder, exam calendar, and daily quiz features. Serves 50K+ monthly active users with real-time job scraping and personalized recommendations.",
          technologies: "Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS",
          url: "",
        },
        {
          id: "proj_2",
          name: "Open-Source Component Library",
          description:
            "Published a React component library for rapid UI development with 15+ accessible, themeable components. Received 500+ GitHub stars and adopted by 3 organizations.",
          technologies: "React, TypeScript, Rollup, Storybook",
          url: "",
        },
      ],
      references: "",
    },
  },

  // ── 4. Teaching & Academic ──────────────────────────────────────
  {
    id: "teaching",
    label: "Teaching & Academic (Professor)",
    data: {
      photo: "",
      personalInfo: {
        fullName: "Dr. Nabanita Saikia",
        email: "nabanita.saikia@email.com",
        phone: "+91-94351-23456",
        address: "Jayanagar, Guwahati, Assam - 781022",
        linkedin: "linkedin.com/in/dr-nabanita-saikia",
        website: "",
        title: "Assistant Professor | Researcher | PhD in Education",
        summary:
          "Accomplished academician with 8+ years of teaching and research experience in higher education. Published 15+ research papers in UGC-listed journals. Passionate about curriculum development, educational technology, and mentoring research scholars in Northeast India.",
      },
      education: [
        {
          id: "edu_1",
          degree: "Ph.D. in Education",
          institution: "Tezpur University",
          location: "Tezpur, Assam",
          startDate: "2015",
          endDate: "2019",
          grade: "Awarded",
          description:
            "Thesis: 'Impact of Digital Pedagogy on Student Engagement in Higher Education Institutions of Assam.' Published 4 papers from the doctoral research. Received UGC Junior Research Fellowship.",
        },
        {
          id: "edu_2",
          degree: "M.Ed. (Masters in Education)",
          institution: "Gauhati University",
          location: "Guwahati, Assam",
          startDate: "2013",
          endDate: "2015",
          grade: "82%",
          description:
            "Specialized in Educational Psychology and Curriculum Design. Gold medalist for academic excellence.",
        },
        {
          id: "edu_3",
          degree: "B.A. (Honours) in Education",
          institution: "Handique Girls' College",
          location: "Guwahati, Assam",
          startDate: "2010",
          endDate: "2013",
          grade: "8.5 CGPA",
          description: "Major in Education, Minor in Psychology and Sociology",
        },
      ],
      experience: [
        {
          id: "exp_1",
          title: "Assistant Professor (Senior Grade)",
          company: "Dibrugarh University",
          location: "Dibrugarh, Assam",
          startDate: "Aug 2019",
          endDate: "Present",
          current: true,
          description:
            "Teaching postgraduate courses in Educational Technology and Research Methodology. Supervising 4 PhD scholars and 12 MA dissertations annually. Designed 3 new elective courses adopted at the university level. Organized 2 national seminars with participation from 20+ universities.",
        },
        {
          id: "exp_2",
          title: "Guest Faculty",
          company: "Cotton University",
          location: "Guwahati, Assam",
          startDate: "Jan 2018",
          endDate: "Jul 2019",
          current: false,
          description:
            "Conducted lectures on Educational Psychology and Inclusive Education for B.Ed. program. Developed comprehensive course modules and assessment frameworks. Received the 'Best Teacher' award for 2 consecutive semesters.",
        },
        {
          id: "exp_3",
          title: "School Teacher (Secondary)",
          company: "St. Mary's Higher Secondary School",
          location: "Guwahati, Assam",
          startDate: "Jun 2015",
          endDate: "Dec 2017",
          current: false,
          description:
            "Taught Social Studies and English to grades 9-12. Introduced project-based learning methodology resulting in 25% improvement in student engagement scores. Coordinated the school's co-curricular and career counseling programs.",
        },
      ],
      skills: [
        { id: "sk_1", name: "Curriculum Development & Design", level: "expert", category: "Technical" },
        { id: "sk_2", name: "Educational Research Methodology", level: "expert", category: "Technical" },
        { id: "sk_3", name: "Academic Writing & Publishing", level: "expert", category: "Technical" },
        { id: "sk_4", name: "Statistical Analysis (SPSS, R)", level: "advanced", category: "Software" },
        { id: "sk_5", name: "Learning Management Systems", level: "advanced", category: "Software" },
        { id: "sk_6", name: "Mentoring & PhD Supervision", level: "advanced", category: "Management" },
        { id: "sk_7", name: "Public Speaking & Presenting", level: "expert", category: "Soft Skills" },
      ],
      certifications: [
        {
          id: "cert_1",
          name: "UGC-NET (Education)",
          issuer: "University Grants Commission",
          date: "2015",
          url: "",
        },
        {
          id: "cert_2",
          name: "Postgraduate Diploma in Educational Technology",
          issuer: "IIT Bombay (SWAYAM)",
          date: "2020",
          url: "",
        },
      ],
      languages: [
        { id: "lang_1", name: "Assamese", proficiency: "native" },
        { id: "lang_2", name: "English", proficiency: "fluent" },
        { id: "lang_3", name: "Hindi", proficiency: "fluent" },
        { id: "lang_4", name: "Sanskrit", proficiency: "intermediate" },
      ],
      projects: [
        {
          id: "proj_1",
          name: "Digital Pedagogy Workshop Series",
          description:
            "Conducted 10+ workshops across 6 colleges in Assam training 300+ faculty members on integrating digital tools into their teaching. Created a resource repository of 50+ lesson plans and video tutorials used by 1K+ educators.",
          technologies: "Educational Technology, Faculty Development",
          url: "",
        },
      ],
      references: "",
    },
  },

  // ── 5. Medical & Healthcare ───────────────────────────────────
  {
    id: "medical",
    label: "Medical & Healthcare (Doctor)",
    data: {
      photo: "",
      personalInfo: {
        fullName: "Dr. Ankur Barman",
        email: "dr.ankur.barman@email.com",
        phone: "+91-88765-43210",
        address: "Christian Basti, Guwahati, Assam - 781005",
        linkedin: "linkedin.com/in/dr-ankur-barman",
        website: "",
        title: "MBBS, MD (Internal Medicine) | General Physician",
        summary:
          "Compassionate and skilled physician with 6+ years of clinical experience in internal medicine. Expertise in diagnosing and managing complex medical conditions in resource-limited settings. Dedicated to improving healthcare access in rural Northeast India through telemedicine initiatives.",
      },
      education: [
        {
          id: "edu_1",
          degree: "MD in Internal Medicine",
          institution: "Assam Medical College & Hospital",
          location: "Dibrugarh, Assam",
          startDate: "2019",
          endDate: "2022",
          grade: "Distinction",
          description:
            "Specialized clinical training in internal medicine with rotations in cardiology, neurology, and pulmonology. Research thesis on 'Prevalence of Metabolic Syndrome in Urban Assam' published in JAPI.",
        },
        {
          id: "edu_2",
          degree: "MBBS",
          institution: "Gauhati Medical College & Hospital",
          location: "Guwahati, Assam",
          startDate: "2013",
          endDate: "2018",
          grade: "76%",
          description:
            "Clinical rotations across all major departments. Served as student coordinator for the Annual Health Camp reaching 5,000+ rural patients. Awarded 'Best Intern' for outstanding clinical performance.",
        },
      ],
      experience: [
        {
          id: "exp_1",
          title: "Senior Resident (Internal Medicine)",
          company: "Gauhati Medical College & Hospital",
          location: "Guwahati, Assam",
          startDate: "Jun 2022",
          endDate: "Present",
          current: true,
          description:
            "Managing 30+ inpatient cases daily in a 150-bed medicine ward. Supervising a team of 6 junior residents and 12 medical interns. Reduced average patient length of stay by 15% through evidence-based treatment protocols. Conducting weekly CME sessions for the department.",
        },
        {
          id: "exp_2",
          title: "Medical Officer",
          company: "Primary Health Centre, Boko",
          location: "Boko, Assam",
          startDate: "Oct 2018",
          endDate: "May 2019",
          current: false,
          description:
            "Provided primary healthcare to 40,000+ rural population with limited resources. Diagnosed and managed cases of malaria, tuberculosis, and hypertension. Established a teleconsultation link with GMCH for specialist referrals.",
        },
      ],
      skills: [
        { id: "sk_1", name: "Clinical Diagnosis & Patient Management", level: "expert", category: "Technical" },
        { id: "sk_2", name: "Emergency & Critical Care", level: "advanced", category: "Technical" },
        { id: "sk_3", name: "ECG & Imaging Interpretation", level: "advanced", category: "Technical" },
        { id: "sk_4", name: "Medical Research & Data Analysis", level: "advanced", category: "Technical" },
        { id: "sk_5", name: "Telemedicine & Digital Health", level: "intermediate", category: "Technical" },
        { id: "sk_6", name: "Team Leadership & Training", level: "advanced", category: "Management" },
        { id: "sk_7", name: "Patient Communication & Counseling", level: "expert", category: "Soft Skills" },
      ],
      certifications: [
        {
          id: "cert_1",
          name: "Advanced Cardiac Life Support (ACLS)",
          issuer: "American Heart Association",
          date: "2023",
          url: "",
        },
        {
          id: "cert_2",
          name: "Basic Life Support (BLS) Instructor",
          issuer: "Indian Resuscitation Council",
          date: "2022",
          url: "",
        },
      ],
      languages: [
        { id: "lang_1", name: "Assamese", proficiency: "native" },
        { id: "lang_2", name: "English", proficiency: "fluent" },
        { id: "lang_3", name: "Hindi", proficiency: "fluent" },
        { id: "lang_4", name: "Bodo", proficiency: "basic" },
      ],
      projects: [
        {
          id: "proj_1",
          name: "Rural Telemedicine Network",
          description:
            "Co-founded a telemedicine initiative connecting 5 PHCs in rural Assam with specialist doctors in Guwahati. Facilitated 2,000+ remote consultations and reduced patient travel costs by an estimated ₹15L annually.",
          technologies: "Telemedicine, Community Health",
          url: "",
        },
      ],
      references: "",
    },
  },

  // ── 6. Engineering & Technical ──────────────────────────────────
  {
    id: "engineering",
    label: "Engineering & Technical (Civil Engineer)",
    data: {
      photo: "",
      personalInfo: {
        fullName: "Manash Pratim Gogoi",
        email: "manash.gogoi@email.com",
        phone: "+91-80112-34567",
        address: "Tarun nagar, Jorhat, Assam - 785001",
        linkedin: "linkedin.com/in/manash-gogoi-engineer",
        website: "",
        title: "Civil Engineer | PWD Certified | Infrastructure Specialist",
        summary:
          "Experienced Civil Engineer with 7+ years in infrastructure project management, structural design, and site execution. Successfully delivered 15+ major projects including bridges, highways, and commercial buildings. Proficient in AutoCAD, STAAD.Pro, and project planning software.",
      },
      education: [
        {
          id: "edu_1",
          degree: "M.Tech in Structural Engineering",
          institution: "Indian Institute of Technology, Guwahati",
          location: "Guwahati, Assam",
          startDate: "2017",
          endDate: "2019",
          grade: "8.4 CGPA",
          description:
            "Specialized in earthquake-resistant structural design. Thesis on 'Seismic Performance of Steel-Concrete Composite Bridges in Northeast India.' Published research in Journal of Structural Engineering.",
        },
        {
          id: "edu_2",
          degree: "B.E. in Civil Engineering",
          institution: "Assam Engineering College",
          location: "Guwahati, Assam",
          startDate: "2013",
          endDate: "2017",
          grade: "8.1 CGPA",
          description:
            "Major in Structural and Geotechnical Engineering. President of the Civil Engineering Society. Organized the state-level technical symposium 'InfraConclave' with 500+ participants.",
        },
      ],
      experience: [
        {
          id: "exp_1",
          title: "Assistant Engineer (Civil)",
          company: "Public Works Department (PWD), Government of Assam",
          location: "Jorhat, Assam",
          startDate: "Mar 2020",
          endDate: "Present",
          current: true,
          description:
            "Supervising construction and maintenance of state highways and major district roads spanning 200+ km. Managed a project portfolio worth ₹80Cr including 3 major bridge constructions. Reduced project delays by 25% through optimized resource allocation and contractor coordination. Preparing detailed estimates, tender documents, and technical reports.",
        },
        {
          id: "exp_2",
          title: "Site Engineer",
          company: "NorthEast Infrastructure Pvt. Ltd.",
          location: "Guwahati, Assam",
          startDate: "Jul 2019",
          endDate: "Feb 2020",
          current: false,
          description:
            "Executed structural works for a 12-story commercial complex valued at ₹40Cr. Coordinated with architects, structural consultants, and subcontractors to ensure quality compliance. Implemented safety protocols resulting in zero accidents during the project duration.",
        },
      ],
      skills: [
        { id: "sk_1", name: "AutoCAD / Revit / STAAD.Pro", level: "expert", category: "Software" },
        { id: "sk_2", name: "Structural Analysis & Design", level: "expert", category: "Technical" },
        { id: "sk_3", name: "Project Planning (Primavera/MS Project)", level: "advanced", category: "Software" },
        { id: "sk_4", name: "Site Supervision & Quality Control", level: "expert", category: "Management" },
        { id: "sk_5", name: "Estimation & Costing", level: "advanced", category: "Technical" },
        { id: "sk_6", name: "GIS & Surveying", level: "intermediate", category: "Technical" },
        { id: "sk_7", name: "Contract Management & Tender Preparation", level: "advanced", category: "Management" },
      ],
      certifications: [
        {
          id: "cert_1",
          name: "Certified Structural Engineer",
          issuer: "Institution of Engineers (India)",
          date: "2021",
          url: "",
        },
        {
          id: "cert_2",
          name: "Project Management Professional (PMP)",
          issuer: "Project Management Institute",
          date: "2023",
          url: "",
        },
      ],
      languages: [
        { id: "lang_1", name: "Assamese", proficiency: "native" },
        { id: "lang_2", name: "English", proficiency: "fluent" },
        { id: "lang_3", name: "Hindi", proficiency: "fluent" },
      ],
      projects: [
        {
          id: "proj_1",
          name: "Bridges over River Dhansiri",
          description:
            "Led the structural design and site execution of two RCC bridges (45m and 60m span) connecting remote villages in Golaghat district. Completed 3 months ahead of schedule, saving ₹2Cr in project costs. The bridges now serve 10,000+ daily commuters.",
          technologies: "RCC Bridge Design, Hydrological Analysis",
          url: "",
        },
      ],
      references: "",
    },
  },

  // ── 7. Compact Classic (General) ─────────────────────────────
  {
    id: "general",
    label: "General Professional (Manager)",
    data: {
      photo: "",
      personalInfo: {
        fullName: "Priyanka Dasgupta",
        email: "priyanka.dasgupta@email.com",
        phone: "+91-99574-83102",
        address: "New Colony, Silchar, Assam - 788005",
        linkedin: "linkedin.com/in/priyanka-dasgupta",
        website: "priyankaportfolio.co",
        title: "Operations Manager | Business Development | 10+ Years Experience",
        summary:
          "Dynamic Operations Manager with a decade of experience driving business growth, streamlining processes, and leading cross-functional teams. Proven track record of increasing operational efficiency by 35% and growing revenue by 50% year-over-year. Adept at stakeholder management and data-driven decision making.",
      },
      education: [
        {
          id: "edu_1",
          degree: "PGDM (MBA Equivalent) in Operations",
          institution: "Indian Institute of Management, Calcutta",
          location: "Kolkata, WB",
          startDate: "2014",
          endDate: "2016",
          grade: "3.2/4.0 GPA",
          description:
            "Specialized in Operations and Supply Chain Management. Completed a summer project with Tata Motors on lean manufacturing implementation.",
        },
        {
          id: "edu_2",
          degree: "B.Com in Business Administration",
          institution: "Assam University",
          location: "Silchar, Assam",
          startDate: "2011",
          endDate: "2014",
          grade: "82%",
          description:
            "Major in Business Administration and Accounting. Active member of the Entrepreneurship Cell. Organized the annual business plan competition.",
        },
      ],
      experience: [
        {
          id: "exp_1",
          title: "Regional Operations Manager",
          company: "Airtel India",
          location: "Guwahati, Assam",
          startDate: "Jan 2020",
          endDate: "Present",
          current: true,
          description:
            "Managing operations across 8 districts in Northeast India with 200+ employees. Improved last-mile delivery efficiency by 40% through route optimization and automation. Drove customer satisfaction scores from 3.8 to 4.6/5.0. Managed annual P&L of ₹15Cr with consistent 12%+ margin improvement.",
        },
        {
          id: "exp_2",
          title: "Business Development Manager",
          company: "Flipkart India Pvt. Ltd.",
          location: "Guwahati, Assam",
          startDate: "Jun 2016",
          endDate: "Dec 2019",
          current: false,
          description:
            "Led market expansion into Tier-2 and Tier-3 cities across Northeast India, onboarding 500+ new seller partners. Grew regional GMV from ₹2Cr to ₹12Cr annually. Negotiated strategic partnerships with local logistics providers reducing delivery costs by 25%.",
        },
      ],
      skills: [
        { id: "sk_1", name: "Operations Strategy & Process Improvement", level: "expert", category: "Management" },
        { id: "sk_2", name: "P&L Management & Budgeting", level: "expert", category: "Management" },
        { id: "sk_3", name: "Data Analysis & Business Intelligence", level: "advanced", category: "Technical" },
        { id: "sk_4", name: "Stakeholder & Vendor Management", level: "expert", category: "Soft Skills" },
        { id: "sk_5", name: "Lean Six Sigma", level: "advanced", category: "Technical" },
        { id: "sk_6", name: "Microsoft Excel & Power BI", level: "expert", category: "Software" },
        { id: "sk_7", name: "Team Leadership & Talent Development", level: "expert", category: "Management" },
      ],
      certifications: [
        {
          id: "cert_1",
          name: "Six Sigma Green Belt",
          issuer: "KPMG India",
          date: "2019",
          url: "",
        },
        {
          id: "cert_2",
          name: "Certified ScrumMaster (CSM)",
          issuer: "Scrum Alliance",
          date: "2021",
          url: "",
        },
      ],
      languages: [
        { id: "lang_1", name: "Bengali", proficiency: "native" },
        { id: "lang_2", name: "English", proficiency: "fluent" },
        { id: "lang_3", name: "Assamese", proficiency: "fluent" },
        { id: "lang_4", name: "Hindi", proficiency: "fluent" },
      ],
      projects: [
        {
          id: "proj_1",
          name: "Digital Transformation of Last-Mile Operations",
          description:
            "Led the implementation of a real-time tracking and dispatch optimization system across 50+ delivery centers in Northeast India. Reduced delivery time by 30% and operational costs by ₹2.5Cr annually. The system was later adopted as a model for other regions.",
          technologies: "Process Automation, Logistics Tech, Change Management",
          url: "",
        },
      ],
      references: "",
    },
  },
];
