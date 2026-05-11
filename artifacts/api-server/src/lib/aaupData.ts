export interface AllowedBranch {
  branch: string;
  minScore: number;
}

export interface AaupMajor {
  id: number;
  name: string;
  faculty: string;
  allowedBranches: AllowedBranch[];
  favoriteSubjects: string;
  skills: string;
  interests: string;
  personality: string;
  careerSectors: string;
  careerSpecializations: string;
}

export const AAUP_MAJORS: AaupMajor[] = [
  {
    "id": 1,
    "name": "Doctor of Medicine",
    "faculty": "Medicine",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 90
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Decision Making; Communication; Critical Thinking; Patience",
    "interests": "Helping People; Health; Science",
    "personality": "Caring; Responsible; Focused",
    "careerSectors": "Hospitals; Clinics; Medical Centers; NGOs",
    "careerSpecializations": "Physician; General Practitioner; Resident Doctor"
  },
  {
    "id": 2,
    "name": "Biomedical Sciences",
    "faculty": "Medicine",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      }
    ],
    "favoriteSubjects": "Biology; Chemistry; Research",
    "skills": "Lab Skills; Analysis; Observation; Research",
    "interests": "Science; Healthcare; Innovation",
    "personality": "Curious; Analytical",
    "careerSectors": "Laboratories; Research Centers; Pharma Companies",
    "careerSpecializations": "Biomedical Researcher; Lab Scientist"
  },
  {
    "id": 3,
    "name": "Doctor of Dental Surgery",
    "faculty": "Dentistry",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 85
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Precision; Hand Skills; Communication; Attention to Detail",
    "interests": "Health; Helping People",
    "personality": "Patient; Accurate",
    "careerSectors": "Dental Clinics; Hospitals; Private Practice",
    "careerSpecializations": "Dentist; Orthodontics; Dental Surgeon"
  },
  {
    "id": 4,
    "name": "Dental Technology",
    "faculty": "Dentistry",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      },
      {
        "branch": "Industrial",
        "minScore": 70
      },
      {
        "branch": "Literary",
        "minScore": 85
      }
    ],
    "favoriteSubjects": "Biology; Design; Chemistry",
    "skills": "Hand Skills; Creativity; Precision",
    "interests": "Healthcare; Dental Care",
    "personality": "Organized; Creative",
    "careerSectors": "Dental Labs; Clinics",
    "careerSpecializations": "Dental Technician; Prosthetic Designer"
  },
  {
    "id": 5,
    "name": "Medical Laboratory Sciences",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Lab Skills; Accuracy; Analysis",
    "interests": "Science; Diagnostics; Healthcare",
    "personality": "Precise; Logical",
    "careerSectors": "Hospitals; Labs; Blood Banks",
    "careerSpecializations": "Lab Technologist; Pathology Assistant"
  },
  {
    "id": 6,
    "name": "Physio-Therapy",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      }
    ],
    "favoriteSubjects": "Biology; Sports",
    "skills": "Communication; Rehabilitation; Patience",
    "interests": "Helping People; Sports; Health",
    "personality": "Energetic; Empathetic",
    "careerSectors": "Hospitals; Sports Centers; Rehab Clinics",
    "careerSpecializations": "Physiotherapist; Sports Rehab Specialist"
  },
  {
    "id": 7,
    "name": "Occupational Therapy",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      },
      {
        "branch": "Literary",
        "minScore": 85
      }
    ],
    "favoriteSubjects": "Biology; Psychology",
    "skills": "Communication; Problem Solving; Patience",
    "interests": "Helping People; Therapy; Community",
    "personality": "Caring; Patient",
    "careerSectors": "Hospitals; Centers; Schools",
    "careerSpecializations": "Occupational Therapist"
  },
  {
    "id": 8,
    "name": "Medical Imaging",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      }
    ],
    "favoriteSubjects": "Biology; Physics",
    "skills": "Technology Use; Observation; Accuracy",
    "interests": "Healthcare; Technology",
    "personality": "Focused; Calm",
    "careerSectors": "Hospitals; Radiology Centers",
    "careerSpecializations": "Radiographer; MRI Technician"
  },
  {
    "id": 9,
    "name": "Hearing and Speech - Audiology",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      },
      {
        "branch": "Industrial",
        "minScore": 70
      }
    ],
    "favoriteSubjects": "Biology; Physics",
    "skills": "Communication; Diagnosis; Patience",
    "interests": "Helping People; Health",
    "personality": "Caring; Focused",
    "careerSectors": "Hospitals; Speech Centers",
    "careerSpecializations": "Audiologist"
  },
  {
    "id": 10,
    "name": "Hearing and Speech - Speech Disorders",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      },
      {
        "branch": "Industrial",
        "minScore": 70
      }
    ],
    "favoriteSubjects": "Biology; Psychology",
    "skills": "Communication; Therapy Skills; Patience",
    "interests": "Helping People; Education",
    "personality": "Empathetic; Patient",
    "careerSectors": "Clinics; Schools; Centers",
    "careerSpecializations": "Speech Therapist"
  },
  {
    "id": 11,
    "name": "Environmental Sciences and Technology",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      },
      {
        "branch": "Agricultural",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Biology; Chemistry; Geography",
    "skills": "Research; Analysis; Field Work",
    "interests": "Environment; Science; Sustainability",
    "personality": "Curious; Responsible",
    "careerSectors": "NGOs; Municipalities; Labs",
    "careerSpecializations": "Environmental Specialist"
  },
  {
    "id": 12,
    "name": "Prosthetics and Orthotics",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      },
      {
        "branch": "Industrial",
        "minScore": 70
      }
    ],
    "favoriteSubjects": "Biology; Physics",
    "skills": "Precision; Design; Technical Skills",
    "interests": "Healthcare; Engineering",
    "personality": "Helpful; Accurate",
    "careerSectors": "Hospitals; Rehab Centers",
    "careerSpecializations": "Orthotics Specialist; Prosthetics Technician"
  },
  {
    "id": 13,
    "name": "Environmental Management and Recycling",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      },
      {
        "branch": "Agricultural",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Biology; Management",
    "skills": "Leadership; Planning; Problem Solving",
    "interests": "Environment; Business",
    "personality": "Responsible; Organized",
    "careerSectors": "Factories; Municipalities; NGOs",
    "careerSpecializations": "Recycling Manager; Environmental Officer"
  },
  {
    "id": 14,
    "name": "Nursing",
    "faculty": "Nursing",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 70
      },
      {
        "branch": "Literary",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Patient Care; Communication; Teamwork",
    "interests": "Helping People; Health",
    "personality": "Caring; Patient",
    "careerSectors": "Hospitals; Clinics; NGOs",
    "careerSpecializations": "Registered Nurse; ICU Nurse"
  },
  {
    "id": 15,
    "name": "Pharmacy",
    "faculty": "Pharmacy",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Accuracy; Communication; Analysis",
    "interests": "Medicine; Health; Science",
    "personality": "Responsible; Focused",
    "careerSectors": "Pharmacies; Hospitals; Drug Companies",
    "careerSpecializations": "Pharmacist; Clinical Pharmacist"
  },
  {
    "id": 16,
    "name": "Interior Architecture",
    "faculty": "Architecture and Arts",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Drawing; Design; Mathematics",
    "skills": "Creativity; Space Planning; Visualization",
    "interests": "Design; Decoration; Architecture",
    "personality": "Creative; Detail-Oriented",
    "careerSectors": "Design Offices; Furniture Companies; Construction Firms",
    "careerSpecializations": "Interior Designer; Space Planner"
  },
  {
    "id": 17,
    "name": "Virtual Reality Arts",
    "faculty": "Architecture and Arts",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Art; Computer; Design",
    "skills": "Creativity; 3D Modeling; Digital Design",
    "interests": "Technology; Media; Innovation",
    "personality": "Creative; Curious",
    "careerSectors": "Gaming Studios; Media Companies; Design Firms",
    "careerSpecializations": "VR Designer; Digital Artist"
  },
  {
    "id": 18,
    "name": "Industrial Product Design",
    "faculty": "Architecture and Arts",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Design; Physics; Art",
    "skills": "Creativity; Problem Solving; Sketching",
    "interests": "Products; Innovation; Engineering",
    "personality": "Innovative; Practical",
    "careerSectors": "Factories; Product Companies; Design Studios",
    "careerSpecializations": "Product Designer; Industrial Designer"
  },
  {
    "id": 19,
    "name": "Data Science - Statistics",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      },
      {
        "branch": "Agricultural",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Statistics; Computer",
    "skills": "Analysis; Programming; Logic",
    "interests": "Data; Research; Technology",
    "personality": "Analytical; Curious",
    "careerSectors": "Banks; Tech Firms; Research Centers",
    "careerSpecializations": "Data Analyst; Statistician"
  },
  {
    "id": 20,
    "name": "Data Science and Finance",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Economics; Computer",
    "skills": "Analysis; Financial Modeling; Programming",
    "interests": "Finance; Data; Business",
    "personality": "Analytical; Strategic",
    "careerSectors": "Banks; Fintech; Investment Firms",
    "careerSpecializations": "Financial Analyst; Quant Analyst"
  },
  {
    "id": 21,
    "name": "Data Science and Machine Learning",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      },
      {
        "branch": "Agricultural",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Computer",
    "skills": "Python; AI Modeling; Analysis",
    "interests": "AI; Innovation; Data",
    "personality": "Logical; Innovative",
    "careerSectors": "Tech Companies; Startups; Research Labs",
    "careerSpecializations": "ML Engineer; Data Scientist"
  },
  {
    "id": 22,
    "name": "Virtual Reality Sciences",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      },
      {
        "branch": "Agricultural",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Computer; Physics; Design",
    "skills": "Programming; 3D Design; Creativity",
    "interests": "Technology; Gaming",
    "personality": "Curious; Creative",
    "careerSectors": "Gaming; Education Tech; Media",
    "careerSpecializations": "VR Developer; XR Specialist"
  },
  {
    "id": 23,
    "name": "AI and Cybersecurity",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Computer",
    "skills": "Coding; Security Analysis; Problem Solving",
    "interests": "Security; Technology",
    "personality": "Alert; Logical",
    "careerSectors": "Security Firms; Banks; Government",
    "careerSpecializations": "Cybersecurity Analyst; AI Security Engineer"
  },
  {
    "id": 24,
    "name": "AI and Digital Media",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Computer; Media; Design",
    "skills": "AI Tools; Content Analysis; Creativity",
    "interests": "Media; Technology",
    "personality": "Creative; Adaptive",
    "careerSectors": "Media Agencies; Tech Firms",
    "careerSpecializations": "AI Media Specialist; Digital Strategist"
  },
  {
    "id": 25,
    "name": "AI and Innovation",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Computer; Business",
    "skills": "Creativity; Coding; Leadership",
    "interests": "Entrepreneurship; Technology",
    "personality": "Innovative; Ambitious",
    "careerSectors": "Startups; Innovation Centers",
    "careerSpecializations": "Innovation Manager; AI Consultant"
  },
  {
    "id": 26,
    "name": "AI and Financial Technology",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Economics; Computer",
    "skills": "Programming; Analytics; Finance",
    "interests": "Fintech; Banking",
    "personality": "Strategic; Analytical",
    "careerSectors": "Banks; Fintech Startups",
    "careerSpecializations": "Fintech Analyst; AI Finance Specialist"
  },
  {
    "id": 27,
    "name": "AI and Robotics",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Physics; Computer",
    "skills": "Programming; Robotics; Engineering",
    "interests": "Automation; Technology",
    "personality": "Curious; Technical",
    "careerSectors": "Factories; Robotics Firms",
    "careerSpecializations": "Robotics Engineer; Automation Specialist"
  },
  {
    "id": 28,
    "name": "AI and Public Relations",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Media; Computer",
    "skills": "Communication; Data Analysis; Strategy",
    "interests": "PR; Media; Technology",
    "personality": "Social; Smart",
    "careerSectors": "PR Agencies; Corporates",
    "careerSpecializations": "Digital PR Specialist"
  },
  {
    "id": 29,
    "name": "AI and Health Sciences",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Computer",
    "skills": "Data Analysis; AI Tools",
    "interests": "Health; Innovation",
    "personality": "Helpful; Analytical",
    "careerSectors": "Hospitals; Health Tech",
    "careerSpecializations": "Health Informatics Specialist"
  },
  {
    "id": 30,
    "name": "AI and Educational Technology",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Computer; Education",
    "skills": "Software Use; Instructional Design",
    "interests": "Education; Technology",
    "personality": "Patient; Creative",
    "careerSectors": "Schools; EdTech Companies",
    "careerSpecializations": "EdTech Specialist"
  },
  {
    "id": 31,
    "name": "Financial Engineering",
    "faculty": "AI and Data Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Economics",
    "skills": "Modeling; Statistics; Finance",
    "interests": "Finance; Analysis",
    "personality": "Logical; Strategic",
    "careerSectors": "Banks; Investment Firms",
    "careerSpecializations": "Risk Analyst; Financial Engineer"
  },
  {
    "id": 32,
    "name": "Primary Education",
    "faculty": "Arts and Education",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Arabic; English; Psychology",
    "skills": "Teaching; Communication; Patience",
    "interests": "Education; Children",
    "personality": "Patient; Caring",
    "careerSectors": "Schools; NGOs",
    "careerSpecializations": "Primary Teacher"
  },
  {
    "id": 33,
    "name": "Educational Administration",
    "faculty": "Arts and Education",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Management; Education",
    "skills": "Leadership; Planning; Communication",
    "interests": "Education Management",
    "personality": "Organized; Responsible",
    "careerSectors": "Schools; Ministries",
    "careerSpecializations": "School Principal; Education Officer"
  },
  {
    "id": 34,
    "name": "Languages",
    "faculty": "Arts and Education",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Arabic; English",
    "skills": "Writing; Communication; Translation",
    "interests": "Languages; Culture",
    "personality": "Social; Curious",
    "careerSectors": "Schools; Media; Translation Offices",
    "careerSpecializations": "Translator; Language Specialist"
  },
  {
    "id": 35,
    "name": "English Language",
    "faculty": "Arts and Education",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "English; Literature",
    "skills": "Speaking; Writing; Teaching",
    "interests": "Language; Communication",
    "personality": "Expressive; Social",
    "careerSectors": "Schools; Companies",
    "careerSpecializations": "English Teacher; Translator"
  },
  {
    "id": 36,
    "name": "Arabic and Media",
    "faculty": "Arts and Education",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Arabic; Media",
    "skills": "Writing; Editing; Communication",
    "interests": "Journalism; Language",
    "personality": "Expressive; Creative",
    "careerSectors": "Media; Schools",
    "careerSpecializations": "Journalist; Arabic Teacher"
  },
  {
    "id": 37,
    "name": "Social Researcher",
    "faculty": "Arts and Education",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Sociology; Psychology",
    "skills": "Research; Interviewing; Analysis",
    "interests": "Society; Community",
    "personality": "Curious; Patient",
    "careerSectors": "NGOs; Research Centers",
    "careerSpecializations": "Social Researcher"
  },
  {
    "id": 38,
    "name": "Teaching English",
    "faculty": "Arts and Education",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "English; Education",
    "skills": "Teaching; Presentation",
    "interests": "Education; Language",
    "personality": "Patient; Friendly",
    "careerSectors": "Schools; Institutes",
    "careerSpecializations": "English Teacher"
  },
  {
    "id": 39,
    "name": "Business Administration",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Economics",
    "skills": "Leadership; Planning; Communication",
    "interests": "Business; Management",
    "personality": "Organized; Ambitious",
    "careerSectors": "Companies; Banks",
    "careerSpecializations": "Business Manager"
  },
  {
    "id": 40,
    "name": "Operations Management - Hospitals",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Management",
    "skills": "Coordination; Planning",
    "interests": "Healthcare; Management",
    "personality": "Organized; Responsible",
    "careerSectors": "Hospitals; Health Firms",
    "careerSpecializations": "Operations Manager"
  },
  {
    "id": 41,
    "name": "Operations Management - MIS",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Computer; Management",
    "skills": "Analysis; Planning; Systems Thinking",
    "interests": "Business; Technology",
    "personality": "Organized; Analytical",
    "careerSectors": "Companies; Banks; IT Firms",
    "careerSpecializations": "MIS Specialist; Operations Analyst"
  },
  {
    "id": 42,
    "name": "Human Resources Management",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Management; Psychology",
    "skills": "Communication; Recruitment; Leadership",
    "interests": "People; Business",
    "personality": "Social; Responsible",
    "careerSectors": "Companies; NGOs; Corporates",
    "careerSpecializations": "HR Officer; Talent Specialist"
  },
  {
    "id": 43,
    "name": "Islamic Economics and Banking",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Economics; Mathematics; Islamic Studies",
    "skills": "Financial Analysis; Planning",
    "interests": "Banking; Finance",
    "personality": "Honest; Analytical",
    "careerSectors": "Islamic Banks; Finance Firms",
    "careerSpecializations": "Banking Officer; Finance Analyst"
  },
  {
    "id": 44,
    "name": "Marketing",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Business; Statistics",
    "skills": "Communication; Promotion; Analysis",
    "interests": "Brands; Sales; Media",
    "personality": "Creative; Social",
    "careerSectors": "Companies; Agencies",
    "careerSpecializations": "Marketing Specialist; Brand Manager"
  },
  {
    "id": 45,
    "name": "Financial and Banking Sciences",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Economics",
    "skills": "Accounting; Analysis; Finance",
    "interests": "Banking; Investments",
    "personality": "Logical; Strategic",
    "careerSectors": "Banks; Insurance; Finance Firms",
    "careerSpecializations": "Financial Analyst; Banking Officer"
  },
  {
    "id": 46,
    "name": "Accounting",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Business",
    "skills": "Accuracy; Reporting; Analysis",
    "interests": "Finance; Organization",
    "personality": "Detail-Oriented; Honest",
    "careerSectors": "Companies; Audit Firms; Banks",
    "careerSpecializations": "Accountant; Auditor"
  },
  {
    "id": 47,
    "name": "Land and Property Management",
    "faculty": "Business",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Geography; Law",
    "skills": "Negotiation; Valuation; Planning",
    "interests": "Real Estate; Management",
    "personality": "Practical; Organized",
    "careerSectors": "Real Estate Firms; Municipalities",
    "careerSpecializations": "Property Manager; Valuation Officer"
  },
  {
    "id": 48,
    "name": "Digital Business Management",
    "faculty": "Digital Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Business; Computer",
    "skills": "Leadership; Digital Tools; Analysis",
    "interests": "Technology; Business",
    "personality": "Adaptive; Strategic",
    "careerSectors": "Startups; Companies",
    "careerSpecializations": "Digital Manager"
  },
  {
    "id": 49,
    "name": "Digital Economy",
    "faculty": "Digital Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Economics; Computer",
    "skills": "Analysis; Planning; Data Skills",
    "interests": "Finance; Technology",
    "personality": "Analytical; Curious",
    "careerSectors": "Fintech; Government; Banks",
    "careerSpecializations": "Economic Analyst"
  },
  {
    "id": 50,
    "name": "Sensory Marketing",
    "faculty": "Digital Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Marketing; Psychology",
    "skills": "Creativity; Consumer Analysis",
    "interests": "Branding; Behavior",
    "personality": "Creative; Observant",
    "careerSectors": "Marketing Agencies; Retail",
    "careerSpecializations": "Consumer Experience Specialist"
  },
  {
    "id": 51,
    "name": "Digital Marketing",
    "faculty": "Digital Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Marketing; Computer",
    "skills": "SEO; Ads; Social Media",
    "interests": "Media; Sales",
    "personality": "Creative; Social",
    "careerSectors": "Agencies; Companies; E-commerce",
    "careerSpecializations": "Digital Marketer"
  },
  {
    "id": 52,
    "name": "Digital Health",
    "faculty": "Digital Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Computer",
    "skills": "Data Entry; Systems Use",
    "interests": "Health; Technology",
    "personality": "Helpful; Organized",
    "careerSectors": "Hospitals; Health Tech",
    "careerSpecializations": "Digital Health Officer"
  },
  {
    "id": 53,
    "name": "Digital Politics and Diplomacy",
    "faculty": "Digital Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Politics; Media",
    "skills": "Communication; Analysis",
    "interests": "Diplomacy; Media",
    "personality": "Strategic; Social",
    "careerSectors": "NGOs; Government; Embassies",
    "careerSpecializations": "Diplomatic Analyst"
  },
  {
    "id": 54,
    "name": "Electrical Engineering and Renewable Energy",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      },
      {
        "branch": "Industrial",
        "minScore": 80
      },
      {
        "branch": "IT",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Physics; Mathematics",
    "skills": "Circuit Design; Problem Solving",
    "interests": "Energy; Technology",
    "personality": "Logical; Innovative",
    "careerSectors": "Power Companies; Solar Firms",
    "careerSpecializations": "Electrical Engineer"
  },
  {
    "id": 55,
    "name": "Civil Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Mathematics; Physics",
    "skills": "Design; Calculation; Project Mgmt",
    "interests": "Buildings; Infrastructure",
    "personality": "Practical; Responsible",
    "careerSectors": "Construction Firms; Municipalities",
    "careerSpecializations": "Civil Engineer"
  },
  {
    "id": 56,
    "name": "Architectural Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      },
      {
        "branch": "Industrial",
        "minScore": 80
      },
      {
        "branch": "IT",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Mathematics; Drawing; Physics",
    "skills": "Design; Visualization",
    "interests": "Buildings; Design",
    "personality": "Creative; Practical",
    "careerSectors": "Architecture Firms",
    "careerSpecializations": "Architect Engineer"
  },
  {
    "id": 57,
    "name": "Telecommunications Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Physics; Mathematics; Computer",
    "skills": "Networking; Electronics",
    "interests": "Communication Tech",
    "personality": "Technical; Curious",
    "careerSectors": "Telecom Companies",
    "careerSpecializations": "Telecom Engineer"
  },
  {
    "id": 58,
    "name": "Public Safety Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      },
      {
        "branch": "Industrial",
        "minScore": 80
      },
      {
        "branch": "IT",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Physics; Chemistry",
    "skills": "Risk Analysis; Safety Planning",
    "interests": "Safety; Protection",
    "personality": "Responsible; Alert",
    "careerSectors": "Factories; Municipalities",
    "careerSpecializations": "Safety Engineer"
  },
  {
    "id": 59,
    "name": "Biomedical Equipment Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Physics; Biology; Mathematics",
    "skills": "Maintenance; Technical Repair",
    "interests": "Health; Devices",
    "personality": "Precise; Helpful",
    "careerSectors": "Hospitals; Medical Companies",
    "careerSpecializations": "Biomedical Engineer"
  },
  {
    "id": 60,
    "name": "Computer Systems Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Mathematics; Computer",
    "skills": "Programming; Hardware; Logic",
    "interests": "Technology",
    "personality": "Analytical; Curious",
    "careerSectors": "IT Firms; Tech Companies",
    "careerSpecializations": "Systems Engineer"
  },
  {
    "id": 61,
    "name": "Cybersecurity Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Mathematics; Computer",
    "skills": "PenTesting; Security Analysis",
    "interests": "Security; Technology",
    "personality": "Alert; Logical",
    "careerSectors": "Banks; Security Firms",
    "careerSpecializations": "Security Engineer"
  },
  {
    "id": 62,
    "name": "Mechatronics Engineering",
    "faculty": "Engineering",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 80
      },
      {
        "branch": "Industrial",
        "minScore": 80
      }
    ],
    "favoriteSubjects": "Mathematics; Physics; Computer",
    "skills": "Robotics; Mechanics; Programming",
    "interests": "Automation; Machines",
    "personality": "Innovative; Technical",
    "careerSectors": "Factories; Robotics Firms",
    "careerSpecializations": "Mechatronics Engineer"
  },
  {
    "id": 63,
    "name": "Multimedia Technology",
    "faculty": "IT",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Computer; Design",
    "skills": "Video Editing; Design; Programming",
    "interests": "Media; Technology",
    "personality": "Creative; Adaptive",
    "careerSectors": "Media Firms; Agencies",
    "careerSpecializations": "Multimedia Specialist"
  },
  {
    "id": 64,
    "name": "Computer Networks - Information Security",
    "faculty": "IT",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Computer; Mathematics",
    "skills": "Networking; Security; Troubleshooting",
    "interests": "IT; Security",
    "personality": "Logical; Alert",
    "careerSectors": "ISPs; Companies",
    "careerSpecializations": "Network Engineer"
  },
  {
    "id": 65,
    "name": "Computer Science",
    "faculty": "IT",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      },
      {
        "branch": "Agricultural",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Computer",
    "skills": "Programming; Algorithms",
    "interests": "Technology; Innovation",
    "personality": "Analytical; Curious",
    "careerSectors": "Software Firms; Startups",
    "careerSpecializations": "Software Developer"
  },
  {
    "id": 66,
    "name": "Computer Science - Game Development",
    "faculty": "IT",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Computer; Mathematics; Design",
    "skills": "Coding; Game Engines",
    "interests": "Gaming; Technology",
    "personality": "Creative; Logical",
    "careerSectors": "Gaming Studios",
    "careerSpecializations": "Game Developer"
  },
  {
    "id": 67,
    "name": "Computer Science - IT Minor",
    "faculty": "IT",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Computer; Mathematics",
    "skills": "Programming; Support",
    "interests": "Technology",
    "personality": "Flexible; Analytical",
    "careerSectors": "IT Departments",
    "careerSpecializations": "IT Specialist"
  },
  {
    "id": 68,
    "name": "Cybersecurity",
    "faculty": "IT",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      },
      {
        "branch": "Industrial",
        "minScore": 65
      },
      {
        "branch": "IT",
        "minScore": 65
      },
      {
        "branch": "Agricultural",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Computer; Mathematics",
    "skills": "Threat Analysis; Security Tools",
    "interests": "Security; Tech",
    "personality": "Alert; Focused",
    "careerSectors": "Banks; Companies",
    "careerSpecializations": "Cybersecurity Analyst"
  },
  {
    "id": 69,
    "name": "GIS",
    "faculty": "IT",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Geography; Computer",
    "skills": "Mapping; Data Analysis",
    "interests": "Maps; Planning",
    "personality": "Organized; Analytical",
    "careerSectors": "Municipalities; NGOs",
    "careerSpecializations": "GIS Specialist"
  },
  {
    "id": 70,
    "name": "Fiqh and Law",
    "faculty": "Law",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 75
      },
      {
        "branch": "Literary",
        "minScore": 75
      }
    ],
    "favoriteSubjects": "Law; Islamic Studies",
    "skills": "Argumentation; Research",
    "interests": "Justice; Society",
    "personality": "Responsible; Logical",
    "careerSectors": "Courts; Firms",
    "careerSpecializations": "Legal Advisor"
  },
  {
    "id": 71,
    "name": "Law",
    "faculty": "Law",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 75
      },
      {
        "branch": "Literary",
        "minScore": 75
      }
    ],
    "favoriteSubjects": "Law; History; Arabic",
    "skills": "Legal Research; Writing; Negotiation",
    "interests": "Justice; Society",
    "personality": "Logical; Responsible",
    "careerSectors": "Law Firms; Courts; Government",
    "careerSpecializations": "Lawyer; Legal Consultant"
  },
  {
    "id": 72,
    "name": "Law (English Track)",
    "faculty": "Law",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 75
      },
      {
        "branch": "Literary",
        "minScore": 75
      }
    ],
    "favoriteSubjects": "Law; English; History",
    "skills": "Legal Writing; Communication; Analysis",
    "interests": "International Law; Justice",
    "personality": "Analytical; Confident",
    "careerSectors": "International Firms; NGOs; Courts",
    "careerSpecializations": "Corporate Lawyer; Legal Translator"
  },
  {
    "id": 73,
    "name": "Modern Media - Digital Communication",
    "faculty": "Modern Media",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Media; English; Computer",
    "skills": "Communication; Content Creation; Presentation",
    "interests": "Media; Public Communication",
    "personality": "Social; Creative",
    "careerSectors": "Media Agencies; TV; Digital Platforms",
    "careerSpecializations": "Media Specialist; Content Creator"
  },
  {
    "id": 74,
    "name": "Modern Media - Digital Media",
    "faculty": "Modern Media",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Media; Design; Computer",
    "skills": "Editing; Social Media; Creativity",
    "interests": "Journalism; Technology",
    "personality": "Creative; Energetic",
    "careerSectors": "Media Firms; News Agencies",
    "careerSpecializations": "Digital Journalist; Media Producer"
  },
  {
    "id": 75,
    "name": "Public Relations",
    "faculty": "Modern Media",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Media; Business; Language",
    "skills": "Communication; Networking; Campaign Planning",
    "interests": "Public Image; Events",
    "personality": "Social; Persuasive",
    "careerSectors": "Corporates; NGOs; Agencies",
    "careerSpecializations": "PR Officer; Communications Manager"
  },
  {
    "id": 76,
    "name": "Technology and Society - Sustainable Development",
    "faculty": "Modern Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Geography; Biology; Technology",
    "skills": "Analysis; Project Planning; Research",
    "interests": "Sustainability; Community",
    "personality": "Responsible; Curious",
    "careerSectors": "NGOs; Municipalities; Development Agencies",
    "careerSpecializations": "Sustainability Officer"
  },
  {
    "id": 77,
    "name": "Technology and Society - Culture and Society",
    "faculty": "Modern Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Sociology; Technology; History",
    "skills": "Research; Writing; Critical Thinking",
    "interests": "Society; Culture",
    "personality": "Curious; Open-minded",
    "careerSectors": "NGOs; Research Centers; Media",
    "careerSpecializations": "Social Analyst"
  },
  {
    "id": 78,
    "name": "Technology Management and Entrepreneurship",
    "faculty": "Modern Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Business; Computer; Mathematics",
    "skills": "Leadership; Innovation; Planning",
    "interests": "Startups; Technology",
    "personality": "Ambitious; Innovative",
    "careerSectors": "Startups; Incubators; Companies",
    "careerSpecializations": "Entrepreneur; Innovation Manager"
  },
  {
    "id": 79,
    "name": "Optometry",
    "faculty": "Modern Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Physics",
    "skills": "Eye Testing; Precision; Communication",
    "interests": "Health; Vision Care",
    "personality": "Helpful; Accurate",
    "careerSectors": "Clinics; Optical Centers; Hospitals",
    "careerSpecializations": "Optometrist"
  },
  {
    "id": 80,
    "name": "Biological Sciences and Biotechnology",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Lab Skills; Research; Analysis",
    "interests": "Science; Genetics",
    "personality": "Curious; Analytical",
    "careerSectors": "Labs; Pharma; Universities",
    "careerSpecializations": "Biotechnologist; Researcher"
  },
  {
    "id": 81,
    "name": "Biological Sciences and Biotechnology - Education Minor",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Chemistry; Education",
    "skills": "Teaching; Research; Lab Skills",
    "interests": "Science; Education",
    "personality": "Patient; Curious",
    "careerSectors": "Schools; Labs",
    "careerSpecializations": "Biology Teacher; Lab Specialist"
  },
  {
    "id": 82,
    "name": "Chemistry",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Chemistry; Mathematics",
    "skills": "Experimentation; Analysis; Accuracy",
    "interests": "Science; Industry",
    "personality": "Logical; Precise",
    "careerSectors": "Labs; Factories; Pharma",
    "careerSpecializations": "Chemist"
  },
  {
    "id": 83,
    "name": "Chemistry - Education Minor",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Chemistry; Education",
    "skills": "Teaching; Experimentation",
    "interests": "Science; Education",
    "personality": "Patient; Organized",
    "careerSectors": "Schools; Labs",
    "careerSpecializations": "Chemistry Teacher"
  },
  {
    "id": 84,
    "name": "Mathematics and Statistics",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Mathematics; Statistics",
    "skills": "Problem Solving; Data Analysis",
    "interests": "Numbers; Research",
    "personality": "Logical; Analytical",
    "careerSectors": "Banks; Schools; Data Firms",
    "careerSpecializations": "Statistician; Analyst"
  },
  {
    "id": 85,
    "name": "Mathematics and Statistics - Education Minor",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Education",
    "skills": "Teaching; Analysis",
    "interests": "Numbers; Education",
    "personality": "Patient; Logical",
    "careerSectors": "Schools",
    "careerSpecializations": "Math Teacher"
  },
  {
    "id": 86,
    "name": "Mathematics and Statistics - Computer Minor",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Computer",
    "skills": "Programming; Analysis",
    "interests": "Technology; Numbers",
    "personality": "Analytical; Curious",
    "careerSectors": "IT Firms; Data Centers",
    "careerSpecializations": "Data Analyst; Programmer"
  },
  {
    "id": 87,
    "name": "Physics",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "Scientific",
        "minScore": 65
      }
    ],
    "favoriteSubjects": "Physics; Mathematics",
    "skills": "Calculation; Experimentation",
    "interests": "Science; Technology",
    "personality": "Curious; Logical",
    "careerSectors": "Labs; Schools; Industry",
    "careerSpecializations": "Physicist"
  },
  {
    "id": 88,
    "name": "Physics - Education Minor",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Physics; Education",
    "skills": "Teaching; Analysis",
    "interests": "Science; Education",
    "personality": "Patient; Logical",
    "careerSectors": "Schools",
    "careerSpecializations": "Physics Teacher"
  },
  {
    "id": 89,
    "name": "Physics - Computer Minor",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Physics; Computer",
    "skills": "Programming; Modeling",
    "interests": "Technology; Science",
    "personality": "Analytical; Curious",
    "careerSectors": "Tech Firms; Labs",
    "careerSpecializations": "Simulation Analyst"
  },
  {
    "id": 90,
    "name": "Applied Chemistry",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Chemistry; Biology",
    "skills": "Lab Work; Industrial Analysis",
    "interests": "Industry; Science",
    "personality": "Precise; Practical",
    "careerSectors": "Factories; Labs; Pharma",
    "careerSpecializations": "Applied Chemist"
  },
  {
    "id": 91,
    "name": "Forensic Biology",
    "faculty": "Science",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Investigation; Analysis; Observation",
    "interests": "Crime Science; Justice",
    "personality": "Detail-Oriented; Logical",
    "careerSectors": "Police Labs; Forensic Centers",
    "careerSpecializations": "Forensic Analyst"
  },
  {
    "id": 92,
    "name": "Sports Sciences",
    "faculty": "Sports Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Sports",
    "skills": "Coaching; Fitness Planning; Leadership",
    "interests": "Sports; Health",
    "personality": "Energetic; Motivating",
    "careerSectors": "Clubs; Gyms; Schools",
    "careerSpecializations": "Coach; Fitness Trainer"
  },
  {
    "id": 93,
    "name": "Respiratory Care",
    "faculty": "Allied Medical Sciences",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Chemistry",
    "skills": "Patient Care; Monitoring; Emergency Response",
    "interests": "Healthcare; Critical Care",
    "personality": "Calm; Caring",
    "careerSectors": "Hospitals; ICU; Clinics",
    "careerSpecializations": "Respiratory Therapist"
  },
  {
    "id": 94,
    "name": "Emergency and Ambulance",
    "faculty": "Intermediate College",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Health; First Aid",
    "skills": "Emergency Response; CPR; Patient Assessment; Teamwork",
    "interests": "Healthcare; Helping People; Emergency Care",
    "personality": "Calm; Responsible; Fast Decision Maker",
    "careerSectors": "Ambulance Services; Hospitals; Emergency Departments; NGOs",
    "careerSpecializations": "EMT; Paramedic; Emergency Technician"
  },
  {
    "id": 95,
    "name": "Beauty and Skin Care",
    "faculty": "Intermediate College",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Chemistry; Beauty Science",
    "skills": "Skin Care; Customer Service; Hygiene; Precision",
    "interests": "Beauty; Wellness; Personal Care",
    "personality": "Creative; Social; Detail-Oriented",
    "careerSectors": "Beauty Centers; Clinics; Salons; Wellness Centers",
    "careerSpecializations": "Skin Care Specialist; Beautician; Cosmetic Assistant"
  },
  {
    "id": 96,
    "name": "Occupational Health and Safety",
    "faculty": "Intermediate College",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Chemistry; Safety Science",
    "skills": "Risk Assessment; Inspection; Safety Planning; Reporting",
    "interests": "Safety; Industry; Public Health",
    "personality": "Responsible; Alert; Organized",
    "careerSectors": "Factories; Construction Sites; Companies; Municipalities",
    "careerSpecializations": "Safety Officer; HSE Assistant; Occupational Safety Technician"
  },
  {
    "id": 97,
    "name": "Real Estate Valuation",
    "faculty": "Intermediate College",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Mathematics; Geography; Economics",
    "skills": "Property Evaluation; Negotiation; Market Analysis",
    "interests": "Real Estate; Investment; Business",
    "personality": "Practical; Analytical; Organized",
    "careerSectors": "Real Estate Companies; Banks; Municipalities",
    "careerSpecializations": "Property Valuer; Real Estate Estimator"
  },
  {
    "id": 98,
    "name": "Mobile Applications",
    "faculty": "Intermediate College",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 50
      }
    ],
    "favoriteSubjects": "Mathematics; Computer; English",
    "skills": "Mobile Programming; UI Design; Problem Solving; Testing",
    "interests": "Technology; Apps; Innovation",
    "personality": "Logical; Creative; Curious",
    "careerSectors": "Software Companies; Freelancing; Startups",
    "careerSpecializations": "Mobile App Developer; Android Developer; iOS Assistant Developer"
  },
  {
    "id": 99,
    "name": "Dental Technology and Manufacturing",
    "faculty": "Intermediate College",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Chemistry; Design",
    "skills": "Precision Work; Dental Modeling; Hand Skills",
    "interests": "Healthcare; Dental Care; Manufacturing",
    "personality": "Accurate; Patient; Detail-Oriented",
    "careerSectors": "Dental Labs; Clinics; Hospitals",
    "careerSpecializations": "Dental Technician; Prosthetics Technician"
  },
  {
    "id": 100,
    "name": "Dental Assistant",
    "faculty": "Intermediate College",
    "allowedBranches": [
      {
        "branch": "All",
        "minScore": 0
      }
    ],
    "favoriteSubjects": "Biology; Health; Communication",
    "skills": "Chairside Assistance; Sterilization; Patient Care; Organization",
    "interests": "Dentistry; Helping People",
    "personality": "Friendly; Responsible; Organized",
    "careerSectors": "Dental Clinics; Hospitals; Private Centers",
    "careerSpecializations": "Dental Assistant; Clinic Assistant"
  }
] as const;

export const STREAM_TO_BRANCH: Record<string, string> = {
  scientific: 'Scientific',
  literary: 'Literary',
  industrial: 'Industrial',
  it: 'IT',
  agricultural: 'Agricultural',
  commercial: 'Literary',
  other: '',
};

export function canonicalBranch(stream: string): string {
  return STREAM_TO_BRANCH[stream.toLowerCase().trim()] ?? '';
}

/**
 * Returns only the AAUP majors the student is eligible for.
 * Majors without branch rules have been assigned {branch: 'All', minScore: 0} at
 * build time, so all 100 majors participate in eligibility filtering.
 * Returns an empty array only when the student's GPA is below every minimum
 * for every major in their branch; callers decide how to handle that.
 */
export function getEligibleMajors(stream: string, gpa: number): AaupMajor[] {
  const branch = canonicalBranch(stream);

  return AAUP_MAJORS.filter((major) =>
    major.allowedBranches.some(
      (b) =>
        (b.branch === 'All' || (branch !== '' && b.branch === branch)) &&
        gpa >= b.minScore,
    ),
  );
}

export function formatEligibleMajorsForPrompt(majors: AaupMajor[], branch: string): string {
  const lines: string[] = [];
  for (const m of majors) {
    const rule = m.allowedBranches.find((b) => b.branch === branch || b.branch === 'All');
    const minScore = rule ? rule.minScore : null;
    lines.push(
      JSON.stringify({
        name: m.name,
        faculty: m.faculty,
        minScore,
        skills: m.skills,
        interests: m.interests,
        careerSectors: m.careerSectors,
      }),
    );
  }
  return lines.join("\n");
}
