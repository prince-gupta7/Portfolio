import type { 
  ProjectItem, 
  ExperienceItem, 
  CertificationItem, 
  AchievementItem, 
  SkillItem,
  QuickStat,
  SocialLink 
} from '../types';

export const personalInfo = {
  name: "Prince Kumar",
  titles: [
    "Python & C Programmer",
    "B.Tech CSE Undergrad @ LPU",
    "Web Designer (HTML & CSS)",
    "DBMS & Database Enthusiast",
    "Cybersecurity & Tech Explorer"
  ],
  tagline: "Crafting structured software with Python & C, responsive web pages with HTML & CSS, and database solutions.",
  bioShort: "Computer Science & Engineering student at Lovely Professional University (CGPA: 8.04). Proficient in Python, C, HTML, CSS, DBMS, Cybersecurity Basics, Git & GitHub.",
  aboutDetailed: [
    "I am a Computer Science & Engineering undergraduate at Lovely Professional University (CGPA: 8.04) focused on core programming, responsive web design, and database management.",
    "My skillset centers around Python, C programming, semantic HTML, modern CSS styling, Database Management Systems (DBMS / MySQL), and version control with Git & GitHub.",
    "With verified certifications from Infosys (Cybersecurity Workshop, Basic of Python) and AWS (Getting Started with DevOps on AWS), alongside 100+ coding problems solved on online platforms, I pride myself on strong fundamental problem solving and continuous learning."
  ],
  email: "princegupta67427@gmail.com",
  phone: "+91 7739647003",
  location: "Saharsa, Bihar - 852201, India",
  university: "Lovely Professional University (LPU), Phagwara, Punjab",
  degree: "Bachelor of Technology (B.Tech) - Computer Science and Engineering (CGPA: 8.04)",
  status: "Available for Internships & Junior Engineering Roles",
  resumeUrl: "#resume-viewer",
  avatarUrl: "/profile.jpg", // Prince Kumar - Developer Portrait
};

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/prince-gupta7",
    icon: "Github",
    label: "Explore repositories on GitHub",
    color: "#24292e"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/prince-gupta-b115582b8/",
    icon: "Linkedin",
    label: "Connect with Prince Kumar on LinkedIn",
    color: "#0a66c2"
  },
  {
    name: "Email",
    url: "mailto:princegupta67427@gmail.com",
    icon: "Mail",
    label: "Send an email to princegupta67427@gmail.com",
    color: "#ea4335"
  },
  {
    name: "Phone",
    url: "tel:+917739647003",
    icon: "Phone",
    label: "Call Prince Kumar (+91 7739647003)",
    color: "#25d366"
  },
  {
    name: "Online Coding",
    url: "https://github.com/prince-gupta7",
    icon: "Code2",
    label: "View 100+ Coding Problems Solved",
    color: "#00ea64"
  }
];

export const quickStats: QuickStat[] = [
  {
    label: "Academic CGPA",
    value: "8.04 CGPA",
    subtext: "Lovely Professional University",
    icon: "GraduationCap"
  },
  {
    label: "Core Languages",
    value: "Python & C",
    subtext: "Structured & OOP Programming",
    icon: "Briefcase"
  },
  {
    label: "Certifications",
    value: "3 Verified",
    subtext: "Infosys & AWS Certified",
    icon: "Award"
  },
  {
    label: "Problem Solving",
    value: "100+ Solved",
    subtext: "Online Coding Platforms",
    icon: "Flame"
  }
];

export const aboutCards = [
  {
    title: "Programming in Python & C",
    icon: "Code",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
    description: "Solid foundation in procedural and object-oriented programming with Python and C, focusing on clean algorithms, data structures, and logic."
  },
  {
    title: "Web Design (HTML & CSS)",
    icon: "Layout",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    description: "Creating clean, responsive, and visually appealing web pages using semantic HTML, modern CSS layouts, Flexbox, and CSS Grid."
  },
  {
    title: "DBMS & Databases",
    icon: "Database",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    description: "Understanding relational database management concepts (DBMS), SQL querying, normalization, and relational schema structuring."
  },
  {
    title: "Cybersecurity & Git",
    icon: "ShieldCheck",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    description: "Familiar with cybersecurity fundamentals and best practices (Infosys certified), along with version control workflows using Git and GitHub."
  }
];

export const skillsData: SkillItem[] = [
  // Programming Languages
  { name: "Python", category: "programming", level: "Advanced", icon: "FileCode", highlight: true, description: "Object-oriented scripting, control logic, data structures & algorithmic solutions" },
  { name: "C Language", category: "programming", level: "Proficient", icon: "FileTerminal", highlight: true, description: "Structured programming, procedural logic, pointers & memory concepts" },

  // Web Development
  { name: "HTML", category: "web", level: "Advanced", icon: "Layout", highlight: true, description: "Semantic web structure, accessibility landmarks, clean HTML document markup" },
  { name: "CSS", category: "web", level: "Advanced", icon: "Palette", highlight: true, description: "Responsive layouts, Flexbox, CSS Grid, custom keyframes & modern UI styling" },

  // Database & Core CS
  { name: "DBMS", category: "core-cs", level: "Proficient", icon: "DatabaseZap", highlight: true, description: "Database Management Systems fundamentals, ACID properties, normalization & ER diagrams" },
  { name: "MySQL / SQL", category: "core-cs", level: "Proficient", icon: "Database", highlight: true, description: "Relational database queries, data manipulation, table joins & constraints" },

  // Security & Cloud
  { name: "Cybersecurity (Basics)", category: "cloud", level: "Intermediate", icon: "ShieldCheck", highlight: true, description: "Network defense principles, threat awareness & security hygiene (Infosys Certified)" },

  // Tools & Version Control
  { name: "Git", category: "tools", level: "Proficient", icon: "GitBranch", highlight: true, description: "Version control workflows, staging, commit history, branching & merges" },
  { name: "GitHub", category: "tools", level: "Proficient", icon: "Github", highlight: true, description: "Remote repository hosting, project documentation & open-source collaboration" },

  // Soft Skills
  { name: "Problem Solving", category: "soft-skills", level: "Advanced", icon: "Lightbulb", highlight: true, description: "Systematic analytical breakdown of complex algorithmic challenges and bugs" },
  { name: "Team Collaboration", category: "soft-skills", level: "Advanced", icon: "UsersRound", highlight: true, description: "Effective interpersonal communication and collaborative peer project development" },
  { name: "Time Management", category: "soft-skills", level: "Advanced", icon: "Clock", highlight: true, description: "Prioritizing project tasks, structured study routines, and meeting deadlines" },
  { name: "Adaptability", category: "soft-skills", level: "Advanced", icon: "Zap", highlight: true, description: "Fast learning curve for emerging technologies, tools, and programming concepts" }
];

export const projectsData: ProjectItem[] = [
  {
    id: "aura-plan-productivity",
    title: "Aura Plan — Personal Productivity & Study Management Web App",
    tagline: "All-in-one student productivity web application with task management, Pomodoro focus sessions, journaling, and study music.",
    category: "web",
    featured: true,
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1000",
    overview: "Developed an all-in-one productivity web application integrating task management, Pomodoro focus sessions, journaling, study music, and productivity tracking into a unified platform. Designed around a student-focused workflow to eliminate context switching.",
    problem: "Students and developers frequently switch between multiple disjointed applications for planning daily tasks, timing focused study sessions, writing reflection journals, and tracking weekly productivity trends.",
    solution: "Engineered Aura Plan — a comprehensive web application designed with modular architecture and reusable components. Features an interactive dashboard to organize tasks, track focused study time, maintain journals, and visualize productivity trends with theme switching.",
    features: [
      "All-in-one productivity suite: task management, Pomodoro focus timer, journaling, and study music",
      "Interactive dashboard enabling users to organize daily tasks, track focused study time, and visualize productivity trends",
      "Responsive and customizable UI with theme switching and intuitive navigation for a distraction-free experience",
      "Applied modular architecture and clean components to maintain a scalable and maintainable codebase",
      "Student-focused workflow reducing the need to switch between separate applications for planning, study, and reflection"
    ],
    technologies: ["HTML", "CSS", "JavaScript", "DBMS", "Git", "GitHub"],
    developmentProcess: [
      "Analyzed student study routines and structured user journeys for planning and reflection.",
      "Designed responsive UI layouts with HTML semantic elements and modern CSS styling.",
      "Implemented task state tracking and Pomodoro timer mechanics.",
      "Maintained structured version control commits using Git and GitHub."
    ],
    challenges: [
      "Seamlessly synchronizing Pomodoro timer states with active task progress without lag.",
      "Designing clean relational data structures for tasks, journal entries, and study time logs."
    ],
    futureImprovements: [
      "Add automated data export to CSV and PDF formats.",
      "Incorporate personalized study performance charts."
    ],
    githubUrl: "https://github.com/prince-gupta7",
    liveUrl: "https://github.com/prince-gupta7"
  },
  {
    id: "devpulse-portfolio",
    title: "Responsive Developer Portfolio & Interactive Theme Studio",
    tagline: "Ultra-modern responsive portfolio showcasing projects, verified credentials, and customizable theme studio.",
    category: "web",
    featured: true,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
    overview: "A responsive developer portfolio featuring a live theme studio, multi-mode particle canvas background, interactive CLI terminal, and downloadable printable CV matching Prince Kumar's background.",
    problem: "Static resumes fail to provide interactive previews or illustrate attention to clean UI/UX and styling detail.",
    solution: "Engineered a responsive website using modern HTML, CSS, and clean modular component architecture with live color customization and accessible controls.",
    features: [
      "Live Theme Customizer with 9 curated presets and custom RGB color pickers",
      "Interactive Developer CLI Terminal with shell commands and theme switching",
      "Printable & downloadable digital CV modal with accurate formatting",
      "High performance responsive layout across mobile, tablet, and desktop screens"
    ],
    technologies: ["HTML", "CSS", "JavaScript", "Git", "GitHub"],
    developmentProcess: [
      "Structured data models for resume, education, projects, certifications, and skills.",
      "Built dynamic CSS custom property bridges and live palette selectors.",
      "Engineered multi-style ParticleBackground (Mesh, Matrix Rain, Starfield, Glowing Orbs).",
      "Tested responsive viewports and verified 100% build validity."
    ],
    challenges: [
      "Dynamic real-time CSS variable interpolation across all UI cards.",
      "Smooth 60fps canvas particle rendering with cursor interaction."
    ],
    futureImprovements: [
      "Add a personal blog/articles section for programming notes.",
      "Include interactive database schema visualizer."
    ],
    githubUrl: "https://github.com/prince-gupta7",
    liveUrl: "https://github.com/prince-gupta7"
  },
  {
    id: "dsa-practice-suite",
    title: "AlgoMaster — 100+ Coding Problems Practice Suite",
    tagline: "Comprehensive repository of 100+ solved algorithmic and data structure problems in Python and C.",
    category: "python",
    featured: true,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
    overview: "A structured collection of over 100+ solved programming problems covering essential data structures (Arrays, Strings, Linked Lists, Stacks, Queues, Trees) and algorithms (Sorting, Searching, Recursion) implemented in Python and C.",
    problem: "Mastering competitive coding and software engineering fundamentals requires disciplined daily problem solving with optimal logic.",
    solution: "Practiced and documented 100+ solutions with detailed comments, complexity analysis, and clean procedural code.",
    features: [
      "100+ solved programming challenges on online coding platforms",
      "Solutions implemented in Python and C",
      "Coverage of core data structures: Arrays, Strings, Sorting & Searching",
      "Step-by-step documentation of logic and execution steps"
    ],
    technologies: ["Python", "C Language", "Data Structures", "Algorithms", "Problem Solving"],
    developmentProcess: [
      "Followed systematic topic-wise learning roadmap in Python and C.",
      "Analyzed edge cases and optimized space-time trade-offs.",
      "Refactored code for high readability and modular functions."
    ],
    challenges: [
      "Handling memory pointers and dynamic allocation safely in C.",
      "Writing pythonic and clean algorithmic solutions."
    ],
    futureImprovements: [
      "Add interactive visualizer for sorting algorithms.",
      "Expand problem set to include advanced tree and graph problems."
    ],
    githubUrl: "https://github.com/prince-gupta7",
    liveUrl: "https://github.com/prince-gupta7"
  }
];

export const experienceData: ExperienceItem[] = [
  {
    id: "lpu-btech",
    institution: "Lovely Professional University",
    role: "Bachelor of Technology - Computer Science and Engineering",
    period: "Aug 2026 - Present",
    type: "education",
    location: "Phagwara, Punjab",
    badge: "CGPA: 8.04",
    description: "Pursuing Bachelor of Technology in Computer Science & Engineering with strong academic performance (CGPA: 8.04). Focusing on programming fundamentals, database management systems (DBMS), web technologies, and cybersecurity.",
    responsibilities: [
      "Core Coursework: Python, C Programming, Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Web Design.",
      "Developed Aura Plan — personal study and productivity web app with task tracking, Pomodoro timers, and journaling.",
      "Solved 100+ algorithmic problems across online coding platforms during regular practice and learning."
    ],
    technologies: ["Python", "C", "HTML", "CSS", "DBMS", "MySQL", "Git", "GitHub"],
    highlights: [
      "Maintained strong 8.04 CGPA in B.Tech CSE."
    ]
  },
  {
    id: "sr-dps-12th",
    institution: "Sr Delhi Public School",
    role: "Higher Secondary Education (Class XII)",
    period: "May 2022 - Mar 2023",
    type: "education",
    location: "Saharsa, Bihar",
    badge: "Percentage: 70.4%",
    description: "Completed Higher Secondary education with 70.4% score, building strong core foundations in Mathematics, Physics, Chemistry, and Computer Science fundamentals.",
    responsibilities: [
      "Studied core science and mathematical foundations for computer science.",
      "Practiced introductory programming logic and structured problem solving."
    ],
    technologies: ["Mathematics", "Physics", "Computer Science", "Problem Solving"],
    highlights: [
      "Scored 70.4% in Higher Secondary Board Examination."
    ]
  },
  {
    id: "sns-sansthan-10th",
    institution: "SNS Sansthan khadipur, Saharsa",
    role: "Secondary Education (Class X)",
    period: "Jun 2021 - Mar 2022",
    type: "education",
    location: "Saharsa, Bihar",
    badge: "Percentage: 89.6%",
    description: "Completed Secondary Schooling with high academic distinction (89.6%), demonstrating strong discipline, analytical aptitude, and academic excellence.",
    responsibilities: [
      "Graduated with top academic standing across core academic subjects.",
      "Participated actively in mathematics competitions and science exhibitions."
    ],
    technologies: ["Mathematics", "Science", "Analytical Thinking"],
    highlights: [
      "Secured 89.6% in Secondary Board Examinations."
    ]
  }
];

export const certificationsData: CertificationItem[] = [
  {
    id: "cert-cybersecurity-infosys",
    name: "Joined Cybersecurity Workshop",
    issuer: "Infosys",
    issueDate: "Feb, 2026",
    credentialId: "INFOSYS-CYBER-2026",
    verificationUrl: "https://infyspringboard.onwingspan.com",
    icon: "ShieldCheck",
    skills: ["Cybersecurity (Basics)", "Network Defense", "Threat Awareness", "System Security"],
    category: "security"
  },
  {
    id: "cert-python-infosys",
    name: "Basic of Python",
    issuer: "Infosys",
    issueDate: "Mar, 2026",
    credentialId: "INFOSYS-PY-2026",
    verificationUrl: "https://infyspringboard.onwingspan.com",
    icon: "FileCode",
    skills: ["Python Programming", "Control Structures", "Data Types", "Functions", "Scripting"],
    category: "programming"
  },
  {
    id: "cert-devops-aws",
    name: "Getting Started with DevOps on AWS",
    issuer: "AWS (Amazon Web Services)",
    issueDate: "May 2025",
    credentialId: "AWS-DEVOPS-2025",
    verificationUrl: "https://aws.amazon.com",
    icon: "Cloud",
    skills: ["DevOps", "AWS Cloud Basics", "CI/CD Foundations", "Infrastructure Basics"],
    category: "cloud"
  }
];

export const achievementsData: AchievementItem[] = [
  {
    id: "achieve-100-problems",
    title: "100+ Coding Problems Solved",
    category: "Coding",
    issuer: "Online Coding Platforms",
    date: "2026",
    description: "Solved more than 100+ programming problems on online coding platforms during regular practice and learning, mastering algorithmic techniques in Python and C.",
    metric: "100+ Problems",
    badgeIcon: "Code2",
    tags: ["Python", "C", "DSA", "Problem Solving"]
  },
  {
    id: "achieve-academic-excellence",
    title: "High Academic Performance (89.6% & 8.04 CGPA)",
    category: "Academic",
    issuer: "LPU & SNS Sansthan",
    date: "2021 - Present",
    description: "Achieved 89.6% in 10th Secondary Board examinations and maintaining an 8.04 CGPA in B.Tech Computer Science and Engineering at Lovely Professional University.",
    metric: "8.04 CGPA / 89.6%",
    badgeIcon: "Trophy",
    tags: ["Academic Excellence", "B.Tech CSE", "LPU"]
  },
  {
    id: "achieve-aura-plan",
    title: "Engineered Aura Plan Productivity Web App",
    category: "Leadership",
    issuer: "Personal Showcase",
    date: "July 2026 - Aug 2026",
    description: "Developed Aura Plan — an all-in-one productivity and study management web application with Pomodoro timers, task tracking, and journaling.",
    metric: "Web Project",
    badgeIcon: "Sparkles",
    tags: ["HTML", "CSS", "JavaScript", "DBMS"]
  }
];

export const terminalHelpCommands = [
  { cmd: "help", desc: "List all available CLI commands" },
  { cmd: "ninja", desc: "Play Fruit Ninja Game (Webcam Hand Tracking AR & Mouse)" },
  { cmd: "whoami", desc: "Display quick summary about Prince Kumar" },
  { cmd: "about", desc: "Print full bio, background, and career goals" },
  { cmd: "skills", desc: "List exact skills (Python, C, HTML, CSS, DBMS, Git, etc.)" },
  { cmd: "projects", desc: "Display showcase software (Aura Plan & more)" },
  { cmd: "experience", desc: "Show academic milestones & education (LPU, DPS, SNS)" },
  { cmd: "certs", desc: "List verified certifications (Infosys, AWS)" },
  { cmd: "contact", desc: "Print email, phone, LinkedIn, and GitHub links" },
  { cmd: "cat resume.txt", desc: "Print formatted CV text" },
  { cmd: "clear", desc: "Clear terminal history" },
  { cmd: "theme [name|list|random|custom]", desc: "Switch theme preset or open customizer" },
  { cmd: "sudo", desc: "Try elevated privileges (Easter egg)" }
];
