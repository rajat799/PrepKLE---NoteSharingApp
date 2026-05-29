import re
import json

raw_text = """BCA
Sem1
01Operating Systems
02Discrete Mathematical Structures
03Computer Organization and Architecture
04Problem Solving using C
05Python Programming
06Web Technology
07Professional Communication
08Corporate Communication Skills
Sem 2
01Linear Algebra and Graph Theory
02Database Management Systems
03Data Structures and Algorithms
04Software Engineering
05Data Structures and Algorithms Lab
06Database Management Systems Lab
07Problem-Solving and Analytical Skills
Sem 3
01Computer Networks
02Applied Statistics
03Object-Oriented Programming using Java
04Full Stack Web Development
05Data Mining and Analytics
06Computer Networks Lab
07Arithmetical Thinking and Analytical Reasoning
Sem 4
01Programming with C# and .Net
02Software Testing
03Professional Aptitude and Logical Reasoning
04Machine Learning
05DevOps Lab
06Minor Project-1
07Industry Readiness and Leadership Skills
Sem 5
01Cloud Computing
02Information Security
03Big Data Analytics
04Professional Elective-1
05Professional Elective-2
06Minor Project-2
Sem 6
01Professional Elective-3
02Professional Elective-4
03Capstone Project
04Industry Training
05Industry Project

MBA
Sem 1
01Organizational Theory & Practice
02Micro and Macro Business Environment
03Accounting for Managers
04Business Research Methods
05Marketing Management
06Business Statistics and Probability
07Business Communication
08Industry Experience Phase - I

Sem2
Business Data Analytics
02Entrepreneurship Development
03Financial Management
04Human Resource Management
05Operations Management
06Gen AI for Managers
07Digital Marketing for Rural Business
08Managerial Communication and Aptitude
09Industry Experience Phase – II
10Business Intelligence and Analytics Phase - I
11Business Venture Phase – I

Sem 3
01Strategic Management
02Elective I – IV
03Summer Internship
04Climate Change & Sustainability Management
05Industry Experience Phase – III
06Business Intelligence and Analytics Phase - II
07Business Venture Phase – II
08Research Experience Phase – I
09Social Entrepreneurship Phase – I

Sem 4
01Legal Aspects of Business
02Supply Chain Management
03Corporate Dissertation
04Elective I – IV
05Research Experience – Phase - II
06Social Entrepreneurship – Phase – II



MCA
Sem 101Data Structures using C
02Database Management System
03Computer Networks
04Mathematical Thinking & Logical Reasoning
05Web Technology
06Data Structures Lab
07DBMS Lab
08Python Programming
09Critical Thinking and Problem Solving Skills


Sem 2
01OOPS using Java
02Data Mining
03Software Engineering
04Cloud Computing
05Design and Analysis of Algorithms
06Operating Systems
07Java Programming Lab
08Mini Project-1
09Communication and Leadership Skills

Sem 3 
01Machine Learning
02Big Data Analytics
03Programming using C# with .Net
04Elective-1
05Elective-2
06C# .NET Lab
07Advanced JAVA Programming Lab
08Minor Project-2
Sem 4
01Capstone Project Work
02Professional Certification
03Elective-3 (MOOC)
04Elective-4 (MOOC)

Civil
Sem1 
01Introduction to Calculus
02Engineering Chemistry
03Basic Electrical and Electronics Engineering
04Basic Mechanical Engineering
05Professional Communication
06C programming for problem solving
07Design Thinking for Social Innovation

Sem2
01Differential Equations and Applications
02Engineering Physics
03Engineering Mechanics
04Problem Solving with Data Structures
05Computer Aided Engineering Drawing
06Engineering Exploration

Sem3
01Linear Algebra
02Building Technology and Services
03Surveying
04Mechanics of Fluids
05Mechanics of Materials
06Survey Practice – I
07Material Testing Lab
08Building Engineering Drawing
09Corporate Communication

Sem 4
01Applied Probability and Statistics
02Structural Analysis-I
03Water and Wastewater Engineering
04Concrete Technology
05Construction Project Management
06Hydrology & Irrigation Engineering
07Problem Solving and Analysis
08Survey Practice – II
09Concrete Laboratory
10Generative AI for Civil Engineering

Sem 5
01Structural Analysis-II
02Geotechnical Engineering
03Design of RCC Structures
04Transportation Engineering
05Construction Economics & Management
06Arithmetical Thinking and Analytical Reasoning
07Highway Engineering Laboratory
08Environmental Engineering Laboratory
09Computer Aided Design Lab
10Mini Project - Applied Sustainability in Civil Engineering

Sem 6
01Design of Steel Structures
02Estimation and Costing
03Program Elective -1
04Professional Aptitude & Logical Reasoning
05Industry Readiness and Leadership Skills
06Geotechnical Engineering laboratory
07Construction Engineering & Management Laboratory
08Design Studio - Steel and RC Structures
09Minor Project

Sem 7 
01Pre-Stressed Concrete
02Program Elective -2
03Program Elective -3
04Program Elective -4
05Program Elective -5
06Construction Management Workshop
07CIPE / EVS (Audit)
08Senior Design Project

Sem 8
01Program Elective - 6
02Open Elective – 1
03Internship Training
04Capstone Project / Internship Project
Mech
SEM 1 and Sem 2
Humanities and Social Sciences
Basic Sciences (Physics, Chemistry,
Mathematics)
Engineering Sciences
Professional Core Courses + SS
Professional Elective Courses
Open Electives
Mini/ Minor project
Project and Seminar
Sem 3
Statistics and Integral Transforms
Mechanics of Materials
Manufacturing Processes
Engineering Thermodynamics
Control Systems
Manufacturing Processes Lab
Control Systems Lab
Machine Drawing Lab
Corporate Communication
Sem 4
Numerical Methods and Partial Differential Equations
Fundamentals of Machine Design
Machines & Mechanisms
Engineering Materials
Mechatronics
Microcontroller & Interfacing
Microcontroller & Interfacing Lab
Machines & Mechanisms Lab
Engineering Materials Lab
Problem Solving & Analysis
Sem 5
Design of Machine Elements
Finite Element Methods
Programming Industrial Automation
Systems
Program Elective-I
CAD Modeling & PLM Lab
Automation Lab
FEM Lab
Mini Project
Arithmetical Thinking & Analytical Reasoning
Sem 6
Professional Aptitude & Logical Reasoning
Fluid Mechanics & Hydraulic Machines
Metrology and Quality Engineering
Mechatronics System Design
Program Elective - 2
Metrology and Quality Engineering Lab
Minor Project
Industry Readiness & Leadership Skills
Sem 7
IC Engines
Thermal Engineering Lab
Program Elective — 4
Program Elective - 5
Senior Design Project
CIPE/EVS
Sem 8
Program Elective - 6
Open Elective
Internship — Training (Optional In place of 1 &2)
Capstone Project / Internship – Project
ECE
Sem 1 & Sem 2
01Multivariable Calculus
02Engineering Chemistry
03Problem Solving with Data Structures
04Engineering Exploration
05Basic Electronics
06Basic Mechanical Engineering
07Professional Communication

Sem 3
01Integral Transforms and Statistics
02Corporate Communication
03Circuit Analysis
04Analog Electronic Circuits
05Digital Circuits
06Signals & Systems
07Digital Circuits Lab
08Analog Electronic Circuits Lab
09Microcontroller Architecture & Programming
10C Programming (Diploma)

Sem 4
01Linear Algebra & Partial Differential Equations
02Problem Solving & Analysis
03Electromagnetic Fields and Waves
04Linear Integrated Circuits
05Control Systems
06ARM Processor & Applications
07Digital System Design Using Verilog
08Data Acquisition and Controls Lab
09ARM Microcontroller Lab
10Data Structure Applications Lab
11Data Structure Using C Lab (Diploma)

Sem 5
Arithmetical Thinking & Analytical Reasoning
02CMOS VLSI Circuits
03Communication System
04Digital Signal Processing
05Operating System & Embedded Systems Design
06Machine Learning
07RTOS Lab
08CMOS VLSI Circuits Lab
09Mini Project

Sem 6
01Professional Aptitude and Logical Reasoning
02Industry Readiness & Leadership Skills
03Automotive Electronics
04Computer Communication Networks I
05PSE Elective 1
06Computer Communication Networks I Lab
07Automotive Electronics Lab
08Minor Project - I
09Minor Project - II

Sem 7
01Advanced Communication Networks
02PSE Elective 2
03PSE Elective 3
04PSE Elective 4
05PSE Elective 5
06Senior Design Project
07CIPE

Sem 8
01PSE Elective 6
02Open Elective 1
03Internship - Training
04Internship - Project
05Project Work

CS
sem 1
01Single Variable Calculus
02Engineering Physics
03Engineering Mechanics
04C Programming for Problem Solving
06Basic Electrical Engineering
07Design Thinking for Social Innovation

Sem2
01Multivariable Calculus
02Engineering Chemistry
03Problem Solving with Data Structures
04Engineering Exploration
05Basic Electronics

Sem 3
01Graph Theory and Linear Algebra/ Graph Theory and Calculus
02Discrete Mathematical Structures
03Computer Organization and Architecture
04Data Structures and Algorithms
05Database Management System
06Database Applications Lab
07Corporate Communication

Sem 4
01Applied Statistics with R/ Vectors and Linear Algebra
02Microcontroller: Programming and Interfacing
03Object-Oriented Programming
04Principles of Compiler Design
05Operating System Principles and Programming
06Exploratory Data Analysis
07Object Oriented Programming Lab
08Problem Solving & Analysis

Sem 5
01Software Engineering
02Computer Networks-1
03System Software
04Machine Learning
05Web Technologies Lab
06System Software Lab
07Mini Project
08Professional Elective-1
09Arithmetical Thinking & Analytical Reasoning
10Statistics and Probability

Sem 6
01Computer Networks-2
02Cloud Computing
03Professional Elective-2
04Professional Elective-3
05Computer Networks Lab
06Minor Project-1
07Minor Project-2
08Industry Readiness & Leadership Skills (Audit)
09Professional Aptitude & Logical Reasoning (Audit)

Sem 7
01Big Data & Analytics
02Information Security
03Professional Elective-4
04Professional Elective-5
05Senior Design Project
06CIPE
07Minor Project

Sem 8
01Big Data & Analytics
02Information Security
03Professional Elective-4
04Professional Elective-5
05Senior Design Project
06CIPE
07Minor Project
08Professional Elective-6
09Open Elective
10Capstone Project 20ECSW402 / Industry Project
11Industry Training
CS-AI
🎓 CS-AI Curriculum (Semester-wise)
📘 Semester 1
•	18ECSP101 → C Programming for Problem Solving 
•	18EECF101 → Basic Electronics 
•	18EMAB101 → Single Variable Calculus 
•	21EPHP101 → Applied Physics Lab 
•	22ECRP101 → Engineering Exploration 
•	22EMEF101 → Basic Mechanical Engineering 
•	22EPHB101 → Engineering Physics 
________________________________________
📘 Semester 2
•	15ECVF101 → Engineering Mechanics 
•	15EHSH101 → Professional Communication 
•	18ECSP102 → Problem Solving with Data Structures 
•	18EEEF101 → Basic Electrical Engineering 
•	18EMAB102 → Multivariable Calculus 
•	20EHSP101 → Design Thinking for Social Innovation 
•	23ECHB102 → Engineering Chemistry 
________________________________________
📘 Semester 3
•	22ECAC204 → Database Management System 
•	22ECAP201 → Database Application Lab 
•	24ECAC201 → Discrete Mathematical Structures 
•	24ECAC202 → Computer Organization and Architecture 
•	24ECAC203 → Design and Analysis of Algorithms 
•	24ECAP202 → Algorithms Lab 
•	24EHSA201 → Corporate Communication 
•	24EMAB208 → Linear Algebra 
________________________________________
📘 Semester 4
•	22ECAC209 → Principles of Compiler Design 
•	24ECAC206 → Microcontroller Programming and Interfacing 
•	24ECAC207 → Object Oriented Programming 
•	24ECAC208 → Operating System Principles and Programming 
•	24ECAC210 → Exploratory Data Analysis 
•	24ECAP206 → Object Oriented Programming Lab 
•	24EHSA202 → Problem Solving and Analysis 
•	24EMAB209 → Probability and Statistics 
________________________________________
📘 Semester 5
•	22ECAC301 → Software Engineering 
•	22ECAC303 → Machine Learning 
•	22ECAP302 → Computer Networks Lab 
•	22ECAP303 → Machine Learning Lab 
•	22ECAW301 → Mini Project 
•	23EHSA303 → Arithmetical Thinking and Analytical Reasoning 
•	24ECAC302 → Computer Networks 
•	24ECAC308 → Internet of Things 
•	24ECAE336 → Computer Vision 
•	24ECAP304 → Web Technologies Lab 
________________________________________
📘 Semester 6
•	24ECAC305 → Deep Learning 
•	24ECAC306 → Embedded Intelligent Systems 
•	24ECAC307 → Natural Language Processing and Gen AI 
•	24ECSE320 → Applied Computational Medicine 
•	24ECAE322 → Informatica - Intelligent Data Mgmt. Cloud 
•	24ECAE317 → Cloud Computing 

•	24ECAE339 → Blockchain and Distributed Ledgers 
•	23ECAE335 → DevOps and MLOps 
•	24ECAW304 → Minor Project 
•	16EHSC301 → Professional Aptitude & Logical Reasoning 
•	23EHSA304 → Industry Readiness & Leadership Skills
Sem 7
01Big Data & Analytics
02Information Security
03Professional Elective-4
04Professional Elective-5
05Senior Design Project

Sem 8
01Professional Elective-6
02Open Elective
03Capstone Project 20ECSW402 / Industry Project
04Industry Training
EEE
Sem 1
01Single Variable Calculus
02Engineering Physics
03Engineering Mechanics
04C Programming for Problem Solving
06Basic Electrical Engineering
07Social Innovation
08Engineering Physics Lab

Sem 2
01Multivariable Calculus
02Engineering Chemistry
03Problem Solving with Data Structures
04Engineering Exploration
05Basic Electronics
06Basic Mechanical Engg.
07Professional Communication

Sem 3
01Integral Transforms and Statistics
02Corporate Communication
03Circuit Analysis
04Analog Electronic Circuits
05Electrical Power Generation, Transmission & Distribution
06Digital Circuits
07Analog Electronics Laboratory
08Digital Circuits Laboratory
09Microcontroller Architecture & Programming

Sem 4
01Linear Algebra and Partial Differential equations
02Problem Solving Analysis
03ARM Processor & Applications
04Linear Control Systems
05Electrical Machines
06Signals & Systems
07Power Electronics
08ARM Microcontroller Lab
09Digital System Design using Verilog
10Data Structure Applications Lab
11Data Structure Using C Lab (Diploma)

Sem 5
01Arithmetical Thinking & Analytical Reasoning
02Power System Analysis & Stability
03OS & Embedded Systems
04Linear Integrated Circuits
05Machine Learning
06Digital Signal Processing
07Electric Drives & Control
08RTOS Lab
09Machines Lab
10Data acquisition and controls Lab
11Data Structure Applications Lab
12Mini project

Sem 6
01Professional Aptitude and Logical reasoning
02Industry Readiness & Leadership Skills
03Automotive Electronics
04CMOS VLSI Circuits
05Program Elective 1
06Object Oriented Programming using C++
07Program Elective 2
08Battery Management Systems
09Modelling and Analysis of Hybrid Electrical Energy Systems
10Power Electronics & Drives lab
11Automotive Electronics Lab
12CMOS VLSI Lab
13Minor Project
14Data Structure Using C Lab (Diploma)
	
Sem 7
01Power System Operation & Control
02Program Elective 3
03Program Elective 4
04Program Elective 5
05Project
06HSC 4 (CIPE/EVS)
07Relay and High Voltage Engineering lab

Sem 8
01Program Elective 6
02Industry Internship
03Open Elective
04Project

Bio medical
Semester I
Single Variable Calculus
Engineering Physics
Engineering Mechanics
C Programming for Problem solving
Basic Electrical Engineering
Social Innovation
Engineering Physics Lab
Semester II
Multivariable Calculus
Engineering Chemistry
Problem Solving with Data Structruture
Engineering Exploration
Basic Electronics
Basic Mechanical Engg.
Professional Communication
Sem 3
Semester Ill
Integral Transforms and Statistics
Circuit Analysis
Analog Electronic Circuits
Digital Circuits
Electronic Instrumentation and
Measurements
Digital Circuits Lab
Analog Electronic Circuits Lab
Microcontroller Architecture & Programming
C Programming (Dip)
Corporate Communication
Calculus and Integral Transforms (Dip)
Sem 4
Linear Algebra &Partial Differential
Equations
Signal Conditioning and Data acquisition
Biomedical Instrumentation
Human Anatomy and Physiology
ARM Processor & Applications
ARM Microcontroller Lab
Biomedical Instrumentation Lab
Signal Conditioning and Data acquisition Lab
Data Structure Using C Lab(Diploma)
Vector Calculus Differential Equations(Diploma)
Problem Solving & Analysis
Sem 5
Fundamentals of Signals and DSP
Clinical Instrumentation
Therapeutic Devices
Operating System and Embedded Systems Design
Mini Project
Clinical Instrumentation Lab.
Real Time Operating Systems Lab
Arithmetical Thinking and Analytical Reasoning
Sem 6
Biomedical DSP
Medical Image Processing
Professional Elective-Ol
Professional Elective-02
Biomedical DSP Lab
Medical Image Processing Lab
Machine Learning
Minor Project
Industry Readiness and Leadership Skills
Semester VII
PCl 7: Medical Imaging Systems
PSE Elective 3
PSE Elective 4
PSE Elective 5
P3: Senior Design Project
CIPE
Semester VIII
PSE Elective 6
Open Elective 1
Capstone Project Work
Chemical
Sem1 & Sem 2
Humanities and Social Sciences
Basic Sciences (Physics, Chemistry,
Mathematics)
Engineering Sciences
Professional Core Courses + SS
Professional Elective Courses
Open Electives
Mini/ Minor project
Project and Seminar
Sem 3
Course - Semester Ill
Statistics & Integral Transforms
Momentum Transfer
Particulate Technology
Material & Energy Balance Calculations
Chemical Process Industries
Momentum Transfer Lab
Particulate Technology Lab
Computer-Aided Drawing Lab.
Corporate Communication
Sem 4
Numerical methods, Linear Algebra and
Partial differential equations
Industrial Pollution Control
Process Heat Transfer
Chemical Engineering Thermodynamics
Material Science & Engineering
Computer-based Chemical Calculations
Process Heat Transfer Lab.
Technical Chemistry Lab.
Problem Solving & Analysis
Sem 5
Process Engineering Economics & Plant
Design
Computer Applications, Modelling &
Simulation
Bioprocess Engineering
Mass Transfer - I
Chemical Reaction Engineering -
Mini Project
Computer Applications & Simulation Lab.
Pollution Control Lab.
Arithmetical Thinking & Analytical Reasoning
 Sem 6
Chemical Reaction Engineering - II
Mass Transfer - II
Program Elective - 01
Program Elective - 02
Professional Aptitude & Logical Reasoning
Minor Project
Chemical Reaction Engineering Lab
Mass Transfer Lab
Industry Readiness and Leadership Skills
Sem 7
Process Equipment Design & Drawing
Process Control & 110T
Program Elective - 03
Program Elective - 04
Program Elective - 05
Humanities — 02 (CIPE & EVS)
Senior Design Project
Process Control Lab
Sem 8
Program Elective
Open Elective
Capstone Project
Internship-Training
Internship-Project
"""

lines = raw_text.split('\n')
branches = ["BCA", "MBA", "MCA", "Civil", "Mech", "ECE", "CS", "CS-AI", "EEE", "Bio medical", "Chemical"]

# We will build a dictionary to store course data
branch_sem_courses = {}
current_branch = None
current_semesters = []

for line in lines:
    line = line.strip()
    if not line or line.startswith("___") or line.startswith("🎓"):
        continue
    
    # Check if branch
    if line in branches or line == "Bio medical" or line == "Mech":
        if line == "CS":
            current_branch = "CSE"
        elif line == "Bio medical":
            current_branch = "Biomedical"
        elif line == "Mech":
            current_branch = "Mechanical"
        else:
            current_branch = line
        continue
    
    # Check if sem
    sem_match = re.search(r'Sem(ester)?\s*(\d+|I{1,3}|IV|V|VI|VII|VIII)(?:\s*(?:and|&)\s*Sem(ester)?\s*(\d+))?', line, re.IGNORECASE)
    if sem_match and (line.lower().startswith('sem') or 'sem' in line.lower() or 'course - sem' in line.lower() or 'semester' in line.lower() or line.startswith('📘 Semester')):
        # Handle cases like 'Sem 101Data Structures using C'
        if re.match(r'Sem\s*101', line, re.IGNORECASE):
            current_semesters = ["1"]
            # Process the course part
            course_name = line.replace("Sem 101", "").strip()
            if course_name:
                key = f"{current_branch}|1"
                if key not in branch_sem_courses:
                    branch_sem_courses[key] = []
                branch_sem_courses[key].append({"code": "", "name": course_name})
            continue

        sems = []
        sem1_str = sem_match.group(2).upper()
        if sem1_str == 'I' or sem1_str == 'ILL': sems.append("1") 
        elif sem1_str == 'ILL': sems.append("3")
        # Let's just extract digits
        digits = re.findall(r'\d+', line)
        if 'Ill' in line or 'III' in line:
            sems = ["3"]
        elif digits:
            sems = [str(d) for d in digits if int(d) <= 8]
        
        # Mapping roman numerals
        roman_to_int = {'I': '1', 'II': '2', 'III': '3', 'IV': '4', 'V': '5', 'VI': '6', 'VII': '7', 'VIII': '8'}
        for word in line.split():
            if word.upper() in roman_to_int and roman_to_int[word.upper()] not in sems:
                sems.append(roman_to_int[word.upper()])

        if sems:
            current_semesters = sems
        continue
    
    # If not branch or sem, it's a course.
    if current_branch and current_semesters:
        # Check if CS-AI format
        code = ""
        name = line
        
        # CS-AI bullet point format
        bullet_match = re.search(r'•\s*([A-Z0-9\-]+)\s*→\s*(.*)', line)
        if bullet_match:
            code = bullet_match.group(1).strip()
            name = bullet_match.group(2).strip()
        else:
            # Check for leading numbers like 01, 02
            leading_num = re.search(r'^\d{2}\s*(.*)', line)
            if leading_num:
                name = leading_num.group(1).strip()
            # Some like "06C programming for problem solving"
            elif re.search(r'^\d{2}(.*)', line):
                name = re.search(r'^\d{2}(.*)', line).group(1).strip()
                
            # strip leading bullet if any
            name = name.lstrip('•').strip()

        if name:
            for sem in current_semesters:
                key = f"{current_branch}|{sem}"
                if key not in branch_sem_courses:
                    branch_sem_courses[key] = []
                # deduplicate
                if not any(c['name'] == name for c in branch_sem_courses[key]):
                    branch_sem_courses[key].append({"code": code, "name": name})

out = "export const BRANCH_SEM_COURSES: Record<string, Course[]> = {\n"
for key, courses in branch_sem_courses.items():
    out += f'  "{key}": [\n'
    for c in courses:
        # escape quotes
        cname = c["name"].replace('"', '\\"')
        ccode = c["code"]
        out += f'    {{ code: "{ccode}", name: "{cname}" }},\n'
    out += '  ],\n'
out += "};\n"

out_semesters = "export const BRANCH_SEMESTERS: Record<string, string[]> = {\n"
branches_found = set(k.split('|')[0] for k in branch_sem_courses.keys())
for b in branches_found:
    sems = sorted(list(set(k.split('|')[1] for k in branch_sem_courses.keys() if k.startswith(b+"|"))), key=int)
    sems_str = ", ".join(f'"{s}"' for s in sems)
    out_semesters += f'  "{b}": [{sems_str}],\n'
out_semesters += "};\n"

with open("courses_gen.txt", "w", encoding="utf-8") as f:
    f.write(out_semesters + "\n" + out)

