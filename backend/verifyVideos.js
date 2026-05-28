require('dotenv').config()
const axios = require('axios')

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

// Every single video from the seed script, organized by course
const ALL_VIDEOS = [
  // Fullstack Web Development
  { course: 'Fullstack Web Development', module: 'Internet & Web Fundamentals', url: 'https://www.youtube.com/watch?v=hJHvdBlSxug' },
  { course: 'Fullstack Web Development', module: 'HTML5 Essentials', url: 'https://www.youtube.com/watch?v=mU6anWqZJcc' },
  { course: 'Fullstack Web Development', module: 'CSS3 & Responsive Design', url: 'https://www.youtube.com/watch?v=1PnVor36_40' },
  { course: 'Fullstack Web Development', module: 'JavaScript Fundamentals', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' },
  { course: 'Fullstack Web Development', module: 'Advanced JavaScript', url: 'https://www.youtube.com/watch?v=R9I85RhI7Cg' },
  { course: 'Fullstack Web Development', module: 'Git & GitHub', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
  { course: 'Fullstack Web Development', module: 'Node.js Backend Development', url: 'https://www.youtube.com/watch?v=Oe421EPjeBE' },
  { course: 'Fullstack Web Development', module: 'Express.js APIs', url: 'https://www.youtube.com/watch?v=SccSCuHhOw0' },
  { course: 'Fullstack Web Development', module: 'PostgreSQL Databases', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
  { course: 'Fullstack Web Development', module: 'Authentication & Security', url: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
  { course: 'Fullstack Web Development', module: 'React Frontend Development', url: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
  { course: 'Fullstack Web Development', module: 'State Management', url: 'https://www.youtube.com/watch?v=35lXWvCuM8o' },
  { course: 'Fullstack Web Development', module: 'Deployment & DevOps', url: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
  { course: 'Fullstack Web Development', module: 'Real-World Fullstack Project', url: 'https://www.youtube.com/watch?v=5PdEmeOpJVQ' },
  // Python Programming
  { course: 'Python Programming', module: 'Python Setup & Syntax', url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
  { course: 'Python Programming', module: 'Variables & Data Types', url: 'https://www.youtube.com/watch?v=khKv-8q7YmY' },
  { course: 'Python Programming', module: 'Conditional Logic', url: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk' },
  { course: 'Python Programming', module: 'Loops & Functions', url: 'https://www.youtube.com/watch?v=OnDr4J2UXSA' },
  { course: 'Python Programming', module: 'Lists, Tuples & Dictionaries', url: 'https://www.youtube.com/watch?v=W8KRzm-HUcc' },
  { course: 'Python Programming', module: 'File Handling', url: 'https://www.youtube.com/watch?v=Uh2ebFW8OYM' },
  { course: 'Python Programming', module: 'Object-Oriented Programming', url: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM' },
  { course: 'Python Programming', module: 'Error Handling', url: 'https://www.youtube.com/watch?v=NIWwJbo-9_8' },
  { course: 'Python Programming', module: 'Modules & Packages', url: 'https://www.youtube.com/watch?v=CqvZ3vGoGs0' },
  { course: 'Python Programming', module: 'APIs & Requests', url: 'https://www.youtube.com/watch?v=tb8gHvYlCFs' },
  { course: 'Python Programming', module: 'Databases with Python', url: 'https://www.youtube.com/watch?v=C0y6FhGZq9s' },
  { course: 'Python Programming', module: 'Automation Scripts', url: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
  { course: 'Python Programming', module: 'Data Analysis Basics', url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8' },
  { course: 'Python Programming', module: 'Final Project', url: 'https://www.youtube.com/watch?v=DLn3jOsNRVE' },
  // UI/UX Design
  { course: 'UI/UX Design', module: 'Design Principles', url: 'https://www.youtube.com/watch?v=9tKbJ9q0jDE' },
  { course: 'UI/UX Design', module: 'Color Theory', url: 'https://www.youtube.com/watch?v=Qj1FK8n7WgY' },
  { course: 'UI/UX Design', module: 'Typography', url: 'https://www.youtube.com/watch?v=klXUk68QxQM' },
  { course: 'UI/UX Design', module: 'Wireframing', url: 'https://www.youtube.com/watch?v=qpH7-KFWZRI' },
  { course: 'UI/UX Design', module: 'User Research', url: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
  { course: 'UI/UX Design', module: 'User Personas', url: 'https://www.youtube.com/watch?v=u44pBnAn7cM' },
  { course: 'UI/UX Design', module: 'Information Architecture', url: 'https://www.youtube.com/watch?v=OJLfjgVlwDo' },
  { course: 'UI/UX Design', module: 'Figma Fundamentals', url: 'https://www.youtube.com/watch?v=Cx2dkpBxst8' },
  { course: 'UI/UX Design', module: 'Prototyping', url: 'https://www.youtube.com/watch?v=-sAAa-CCOcg' },
  { course: 'UI/UX Design', module: 'Mobile Design', url: 'https://www.youtube.com/watch?v=0cKBR9swyD8' },
  { course: 'UI/UX Design', module: 'Web App Design', url: 'https://www.youtube.com/watch?v=fiVlM4MdlZY' },
  { course: 'UI/UX Design', module: 'Design Systems', url: 'https://www.youtube.com/watch?v=EK-pHkc5EL4' },
  { course: 'UI/UX Design', module: 'Usability Testing', url: 'https://www.youtube.com/watch?v=BrDozqeSZOQ' },
  { course: 'UI/UX Design', module: 'Portfolio Creation', url: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
  // Graphic Design
  { course: 'Graphic Design', module: 'Introduction to Design', url: 'https://www.youtube.com/watch?v=YqQx75OPRa0' },
  { course: 'Graphic Design', module: 'Photoshop Basics', url: 'https://www.youtube.com/watch?v=pFyOznL9UvA' },
  { course: 'Graphic Design', module: 'Illustrator Basics', url: 'https://www.youtube.com/watch?v=Ib8UBwu3yGA' },
  { course: 'Graphic Design', module: 'Branding Fundamentals', url: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
  { course: 'Graphic Design', module: 'Logo Design', url: 'https://www.youtube.com/watch?v=WoPrbTZkLg8' },
  { course: 'Graphic Design', module: 'Typography', url: 'https://www.youtube.com/watch?v=yAuUDyUC-GM' },
  { course: 'Graphic Design', module: 'Social Media Design', url: 'https://www.youtube.com/watch?v=3pU9YgqNkqk' },
  { course: 'Graphic Design', module: 'Poster Design', url: 'https://www.youtube.com/watch?v=ly8xWeSqQxY' },
  { course: 'Graphic Design', module: 'Print Design', url: 'https://www.youtube.com/watch?v=3V1zQcM0EAM' },
  { course: 'Graphic Design', module: 'Color Psychology', url: 'https://www.youtube.com/watch?v=x0smqFjvcRk' },
  { course: 'Graphic Design', module: 'Packaging Design', url: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
  { course: 'Graphic Design', module: 'Freelancing for Designers', url: 'https://www.youtube.com/watch?v=fXxJ7aYZ5bU' },
  { course: 'Graphic Design', module: 'Client Communication', url: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
  { course: 'Graphic Design', module: 'Final Branding Project', url: 'https://www.youtube.com/watch?v=QrLi9op6v8k' },
  // Digital Marketing
  { course: 'Digital Marketing', module: 'Marketing Fundamentals', url: 'https://www.youtube.com/watch?v=bixR-KIJKYM' },
  { course: 'Digital Marketing', module: 'Branding & Positioning', url: 'https://www.youtube.com/watch?v=sO4te2QNsHY' },
  { course: 'Digital Marketing', module: 'Social Media Marketing', url: 'https://www.youtube.com/watch?v=I2pwcBoosXw' },
  { course: 'Digital Marketing', module: 'Content Marketing', url: 'https://www.youtube.com/watch?v=5mCAlE3tKqk' },
  { course: 'Digital Marketing', module: 'SEO Fundamentals', url: 'https://www.youtube.com/watch?v=MYE6T_gd7H0' },
  { course: 'Digital Marketing', module: 'Google Ads', url: 'https://www.youtube.com/watch?v=Nx2T0RhKFck' },
  { course: 'Digital Marketing', module: 'Facebook & Instagram Ads', url: 'https://www.youtube.com/watch?v=Z7ntGQ4BnFI' },
  { course: 'Digital Marketing', module: 'Email Marketing', url: 'https://www.youtube.com/watch?v=BC0AhPXmaCk' },
  { course: 'Digital Marketing', module: 'Copywriting', url: 'https://www.youtube.com/watch?v=LApwP9P3QCg' },
  { course: 'Digital Marketing', module: 'Analytics & Tracking', url: 'https://www.youtube.com/watch?v=RL61_OnYwco' },
  { course: 'Digital Marketing', module: 'Funnel Building', url: 'https://www.youtube.com/watch?v=BN7SIGqg9Dk' },
  { course: 'Digital Marketing', module: 'Affiliate Marketing', url: 'https://www.youtube.com/watch?v=zP3LDqFSgjs' },
  { course: 'Digital Marketing', module: 'E-commerce Marketing', url: 'https://www.youtube.com/watch?v=3j2uVczYjfE' },
  { course: 'Digital Marketing', module: 'Marketing Campaign Project', url: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
  // Cybersecurity Fundamentals
  { course: 'Cybersecurity Fundamentals', module: 'Cybersecurity Basics', url: 'https://www.youtube.com/watch?v=U_P23SqHqDc' },
  { course: 'Cybersecurity Fundamentals', module: 'Networking Fundamentals', url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
  { course: 'Cybersecurity Fundamentals', module: 'Operating Systems Security', url: 'https://www.youtube.com/watch?v=Gj4yvDwM4Ck' },
  { course: 'Cybersecurity Fundamentals', module: 'Encryption Basics', url: 'https://www.youtube.com/watch?v=AQDCe585Lnc' },
  { course: 'Cybersecurity Fundamentals', module: 'Web Security', url: 'https://www.youtube.com/watch?v=WlmKwIe9z1Q' },
  { course: 'Cybersecurity Fundamentals', module: 'Authentication Systems', url: 'https://www.youtube.com/watch?v=2KhQINj1bMI' },
  { course: 'Cybersecurity Fundamentals', module: 'Ethical Hacking', url: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ' },
  { course: 'Cybersecurity Fundamentals', module: 'Vulnerability Assessment', url: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
  { course: 'Cybersecurity Fundamentals', module: 'Malware Analysis', url: 'https://www.youtube.com/watch?v=7d9Kj4RSXxA' },
  { course: 'Cybersecurity Fundamentals', module: 'Security Tools', url: 'https://www.youtube.com/watch?v=PDk7hGbDDyo' },
  { course: 'Cybersecurity Fundamentals', module: 'Incident Response', url: 'https://www.youtube.com/watch?v=AvfsoCgE4Yk' },
  { course: 'Cybersecurity Fundamentals', module: 'Cloud Security', url: 'https://www.youtube.com/watch?v=jYtUJKsAVb0' },
  { course: 'Cybersecurity Fundamentals', module: 'Security Best Practices', url: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
  { course: 'Cybersecurity Fundamentals', module: 'Capstone Security Audit', url: 'https://www.youtube.com/watch?v=l3hHXzhJPSA' },
  // Data Science
  { course: 'Data Science', module: 'Data Science Overview', url: 'https://www.youtube.com/watch?v=X3paOmcrTjQ' },
  { course: 'Data Science', module: 'Python for Data Science', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI' },
  { course: 'Data Science', module: 'Data Cleaning', url: 'https://www.youtube.com/watch?v=8f97aHAClhA' },
  { course: 'Data Science', module: 'Data Visualization', url: 'https://www.youtube.com/watch?v=a9UrKTVEeZA' },
  { course: 'Data Science', module: 'Statistics Fundamentals', url: 'https://www.youtube.com/watch?v=xxpc-HPKN28' },
  { course: 'Data Science', module: 'Pandas & NumPy', url: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
  { course: 'Data Science', module: 'SQL for Data Analysis', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  { course: 'Data Science', module: 'Exploratory Data Analysis', url: 'https://www.youtube.com/watch?v=5NcbVYhQJvw' },
  { course: 'Data Science', module: 'Machine Learning Basics', url: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI' },
  { course: 'Data Science', module: 'Regression Models', url: 'https://www.youtube.com/watch?v=Wq4asSJhvjY' },
  { course: 'Data Science', module: 'Classification Models', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
  { course: 'Data Science', module: 'Model Evaluation', url: 'https://www.youtube.com/watch?v=85dtiMz9tJI' },
  { course: 'Data Science', module: 'Real-World Datasets', url: 'https://www.youtube.com/watch?v=uEGj5O_riFQ' },
  { course: 'Data Science', module: 'Final Data Project', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // Machine Learning
  { course: 'Machine Learning', module: 'Introduction to ML', url: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI' },
  { course: 'Machine Learning', module: 'Python & ML Libraries', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
  { course: 'Machine Learning', module: 'Data Preprocessing', url: 'https://www.youtube.com/watch?v=GEn7YdM28a0' },
  { course: 'Machine Learning', module: 'Supervised Learning', url: 'https://www.youtube.com/watch?v=Wq4asSJhvjY' },
  { course: 'Machine Learning', module: 'Unsupervised Learning', url: 'https://www.youtube.com/watch?v=Ev8Yl4jj9Ag' },
  { course: 'Machine Learning', module: 'Regression', url: 'https://www.youtube.com/watch?v=Wq4asSJhvjY' },
  { course: 'Machine Learning', module: 'Classification', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
  { course: 'Machine Learning', module: 'Clustering', url: 'https://www.youtube.com/watch?v=4b5d3oF6PQ8' },
  { course: 'Machine Learning', module: 'Neural Networks', url: 'https://www.youtube.com/watch?v=aircAruvnKk' },
  { course: 'Machine Learning', module: 'Deep Learning Basics', url: 'https://www.youtube.com/watch?v=VyWAvY2CF9c' },
  { course: 'Machine Learning', module: 'Model Optimization', url: 'https://www.youtube.com/watch?v=85dtiMz9tJI' },
  { course: 'Machine Learning', module: 'AI Ethics', url: 'https://www.youtube.com/watch?v=vgUWKXVxPnQ' },
  { course: 'Machine Learning', module: 'Deployment of ML Models', url: 'https://www.youtube.com/watch?v=b5F667g1yCk' },
  { course: 'Machine Learning', module: 'Final AI Project', url: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' },
  // Mobile App Development
  { course: 'Mobile App Development', module: 'Mobile Development Overview', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
  { course: 'Mobile App Development', module: 'React Native Basics', url: 'https://www.youtube.com/watch?v=ur6I5m2nTvk' },
  { course: 'Mobile App Development', module: 'UI Components', url: 'https://www.youtube.com/watch?v=Hf4MJH0jDb4' },
  { course: 'Mobile App Development', module: 'Navigation Systems', url: 'https://www.youtube.com/watch?v=OmQCU-3KPms' },
  { course: 'Mobile App Development', module: 'State Management', url: 'https://www.youtube.com/watch?v=35lXWvCuM8o' },
  { course: 'Mobile App Development', module: 'APIs & Networking', url: 'https://www.youtube.com/watch?v=D-JNxF8xIBw' },
  { course: 'Mobile App Development', module: 'Authentication', url: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
  { course: 'Mobile App Development', module: 'Local Storage', url: 'https://www.youtube.com/watch?v=ZkAB8E3L0bc' },
  { course: 'Mobile App Development', module: 'Firebase Integration', url: 'https://www.youtube.com/watch?v=kmR6n9YQ3Yk' },
  { course: 'Mobile App Development', module: 'Push Notifications', url: 'https://www.youtube.com/watch?v=2VxoYqIxErc' },
  { course: 'Mobile App Development', module: 'Performance Optimization', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'Mobile App Development', module: 'App Publishing', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
  { course: 'Mobile App Development', module: 'Monetization Strategies', url: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
  { course: 'Mobile App Development', module: 'Final Mobile App', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // Cloud Computing
  { course: 'Cloud Computing', module: 'Cloud Fundamentals', url: 'https://www.youtube.com/watch?v=k1RI5locZE4' },
  { course: 'Cloud Computing', module: 'AWS Basics', url: 'https://www.youtube.com/watch?v=3hLmDS179YE' },
  { course: 'Cloud Computing', module: 'Virtual Machines', url: 'https://www.youtube.com/watch?v=wX7Tz0S9C5E' },
  { course: 'Cloud Computing', module: 'Storage Systems', url: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
  { course: 'Cloud Computing', module: 'Networking in Cloud', url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
  { course: 'Cloud Computing', module: 'Docker Containers', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE' },
  { course: 'Cloud Computing', module: 'Kubernetes Basics', url: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
  { course: 'Cloud Computing', module: 'CI/CD Pipelines', url: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
  { course: 'Cloud Computing', module: 'Serverless Computing', url: 'https://www.youtube.com/watch?v=2LQ0B8WmFvw' },
  { course: 'Cloud Computing', module: 'Monitoring & Logging', url: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
  { course: 'Cloud Computing', module: 'Cloud Security', url: 'https://www.youtube.com/watch?v=jYtUJKsAVb0' },
  { course: 'Cloud Computing', module: 'Scalability Concepts', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'Cloud Computing', module: 'Cost Optimization', url: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
  { course: 'Cloud Computing', module: 'Cloud Deployment Project', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // Software Engineering
  { course: 'Software Engineering', module: 'Software Development Lifecycle', url: 'https://www.youtube.com/watch?v=i-QyW8D3ei0' },
  { course: 'Software Engineering', module: 'Requirements Engineering', url: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
  { course: 'Software Engineering', module: 'System Design', url: 'https://www.youtube.com/watch?v=Y-Gl4REyeqs' },
  { course: 'Software Engineering', module: 'Version Control', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
  { course: 'Software Engineering', module: 'Clean Code Principles', url: 'https://www.youtube.com/watch?v=RR_dQ4sBSwM' },
  { course: 'Software Engineering', module: 'Testing Fundamentals', url: 'https://www.youtube.com/watch?v=Jv2uxzhPFl4' },
  { course: 'Software Engineering', module: 'Agile Methodologies', url: 'https://www.youtube.com/watch?v=Z9QbYZh1YXY' },
  { course: 'Software Engineering', module: 'APIs & Integrations', url: 'https://www.youtube.com/watch?v=GZvSYJDk-us' },
  { course: 'Software Engineering', module: 'Database Design', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
  { course: 'Software Engineering', module: 'DevOps Basics', url: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
  { course: 'Software Engineering', module: 'Security Principles', url: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
  { course: 'Software Engineering', module: 'Scalability Concepts', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'Software Engineering', module: 'Team Collaboration', url: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
  { course: 'Software Engineering', module: 'Enterprise Software Project', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // Game Development
  { course: 'Game Development', module: 'Introduction to Game Development', url: 'https://www.youtube.com/watch?v=gB1F9G0JXOo' },
  { course: 'Game Development', module: 'Unity Fundamentals', url: 'https://www.youtube.com/watch?v=XtQMytORBmM' },
  { course: 'Game Development', module: 'C# Basics', url: 'https://www.youtube.com/watch?v=GhQdlIFylQ8' },
  { course: 'Game Development', module: 'Game Physics', url: 'https://www.youtube.com/watch?v=F0B3DAlz5Cg' },
  { course: 'Game Development', module: 'Character Controllers', url: 'https://www.youtube.com/watch?v=_QajrabyTJc' },
  { course: 'Game Development', module: 'Animations', url: 'https://www.youtube.com/watch?v=JeZkctmoBPw' },
  { course: 'Game Development', module: 'Game UI', url: 'https://www.youtube.com/watch?v=HwdweCXUjHo' },
  { course: 'Game Development', module: 'Audio Systems', url: 'https://www.youtube.com/watch?v=6OT43pvUyfY' },
  { course: 'Game Development', module: 'AI for Games', url: 'https://www.youtube.com/watch?v=T1GIPEqbN6Y' },
  { course: 'Game Development', module: 'Multiplayer Basics', url: 'https://www.youtube.com/watch?v=1BdBdP5sMYo' },
  { course: 'Game Development', module: 'Mobile Optimization', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'Game Development', module: 'Publishing Games', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
  { course: 'Game Development', module: 'Monetization', url: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
  { course: 'Game Development', module: 'Final Game Project', url: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' },
  // Business & Entrepreneurship
  { course: 'Business & Entrepreneurship', module: 'Entrepreneurial Mindset', url: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
  { course: 'Business & Entrepreneurship', module: 'Business Models', url: 'https://www.youtube.com/watch?v=IP0cUBWTgpY' },
  { course: 'Business & Entrepreneurship', module: 'Market Research', url: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
  { course: 'Business & Entrepreneurship', module: 'Branding', url: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
  { course: 'Business & Entrepreneurship', module: 'Financial Basics', url: 'https://www.youtube.com/watch?v=7j7LQeKZLro' },
  { course: 'Business & Entrepreneurship', module: 'Sales Fundamentals', url: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
  { course: 'Business & Entrepreneurship', module: 'Digital Business', url: 'https://www.youtube.com/watch?v=3j2uVczYjfE' },
  { course: 'Business & Entrepreneurship', module: 'Customer Acquisition', url: 'https://www.youtube.com/watch?v=BN7SIGqg9Dk' },
  { course: 'Business & Entrepreneurship', module: 'Operations Management', url: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
  { course: 'Business & Entrepreneurship', module: 'Business Automation', url: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
  { course: 'Business & Entrepreneurship', module: 'Leadership Skills', url: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
  { course: 'Business & Entrepreneurship', module: 'Pitching Investors', url: 'https://www.youtube.com/watch?v=QrLi9op6v8k' },
  { course: 'Business & Entrepreneurship', module: 'Scaling Strategies', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'Business & Entrepreneurship', module: 'Startup Business Plan', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // Stock Market Investing
  { course: 'Stock Market Investing', module: 'Investing Fundamentals', url: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8' },
  { course: 'Stock Market Investing', module: 'Stock Market Basics', url: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo' },
  { course: 'Stock Market Investing', module: 'Fundamental Analysis', url: 'https://www.youtube.com/watch?v=4Hw0nWryiQY' },
  { course: 'Stock Market Investing', module: 'Technical Analysis', url: 'https://www.youtube.com/watch?v=eynxyoKgpng' },
  { course: 'Stock Market Investing', module: 'Risk Management', url: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
  { course: 'Stock Market Investing', module: 'Portfolio Building', url: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
  { course: 'Stock Market Investing', module: 'Value Investing', url: 'https://www.youtube.com/watch?v=4Hw0nWryiQY' },
  { course: 'Stock Market Investing', module: 'Growth Investing', url: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo' },
  { course: 'Stock Market Investing', module: 'Dividend Investing', url: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8' },
  { course: 'Stock Market Investing', module: 'Trading Psychology', url: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
  { course: 'Stock Market Investing', module: 'Financial Statements', url: 'https://www.youtube.com/watch?v=7j7LQeKZLro' },
  { course: 'Stock Market Investing', module: 'Economic Indicators', url: 'https://www.youtube.com/watch?v=4Hw0nWryiQY' },
  { course: 'Stock Market Investing', module: 'Long-Term Wealth Strategies', url: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8' },
  { course: 'Stock Market Investing', module: 'Investment Portfolio Project', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // Cryptocurrency & Blockchain
  { course: 'Cryptocurrency & Blockchain', module: 'Blockchain Fundamentals', url: 'https://www.youtube.com/watch?v=yubzJw0uiE4' },
  { course: 'Cryptocurrency & Blockchain', module: 'Bitcoin Basics', url: 'https://www.youtube.com/watch?v=1YAz5DRoJeA' },
  { course: 'Cryptocurrency & Blockchain', module: 'Ethereum Ecosystem', url: 'https://www.youtube.com/watch?v=IsXvoYeJxKA' },
  { course: 'Cryptocurrency & Blockchain', module: 'Wallets & Security', url: 'https://www.youtube.com/watch?v=2KhQINj1bMI' },
  { course: 'Cryptocurrency & Blockchain', module: 'Smart Contracts', url: 'https://www.youtube.com/watch?v=pWGLtjG-F5c' },
  { course: 'Cryptocurrency & Blockchain', module: 'DeFi Fundamentals', url: 'https://www.youtube.com/watch?v=17QRFlml4pA' },
  { course: 'Cryptocurrency & Blockchain', module: 'NFTs Explained', url: 'https://www.youtube.com/watch?v=NNQLJcJEzv0' },
  { course: 'Cryptocurrency & Blockchain', module: 'Trading Basics', url: 'https://www.youtube.com/watch?v=eynxyoKgpng' },
  { course: 'Cryptocurrency & Blockchain', module: 'On-Chain Analysis', url: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
  { course: 'Cryptocurrency & Blockchain', module: 'Tokenomics', url: 'https://www.youtube.com/watch?v=IP0cUBWTgpY' },
  { course: 'Cryptocurrency & Blockchain', module: 'Crypto Risk Management', url: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
  { course: 'Cryptocurrency & Blockchain', module: 'Web3 Applications', url: 'https://www.youtube.com/watch?v=wHTcrmhVtoA' },
  { course: 'Cryptocurrency & Blockchain', module: 'Blockchain Careers', url: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
  { course: 'Cryptocurrency & Blockchain', module: 'Final Blockchain Project', url: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' },
  // Video Editing & Content Creation
  { course: 'Video Editing & Content Creation', module: 'Content Creation Fundamentals', url: 'https://www.youtube.com/watch?v=5mCAlE3tKqk' },
  { course: 'Video Editing & Content Creation', module: 'Storytelling', url: 'https://www.youtube.com/watch?v=LApwP9P3QCg' },
  { course: 'Video Editing & Content Creation', module: 'Camera Basics', url: 'https://www.youtube.com/watch?v=3pU9YgqNkqk' },
  { course: 'Video Editing & Content Creation', module: 'Lighting Techniques', url: 'https://www.youtube.com/watch?v=ly8xWeSqQxY' },
  { course: 'Video Editing & Content Creation', module: 'Audio Recording', url: 'https://www.youtube.com/watch?v=6OT43pvUyfY' },
  { course: 'Video Editing & Content Creation', module: 'Adobe Premiere Pro', url: 'https://www.youtube.com/watch?v=Hls3Tp7JS8E' },
  { course: 'Video Editing & Content Creation', module: 'Motion Graphics', url: 'https://www.youtube.com/watch?v=JeZkctmoBPw' },
  { course: 'Video Editing & Content Creation', module: 'Short-Form Content', url: 'https://www.youtube.com/watch?v=3pU9YgqNkqk' },
  { course: 'Video Editing & Content Creation', module: 'YouTube Growth', url: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
  { course: 'Video Editing & Content Creation', module: 'TikTok & Reels Strategy', url: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
  { course: 'Video Editing & Content Creation', module: 'Thumbnail Design', url: 'https://www.youtube.com/watch?v=WoPrbTZkLg8' },
  { course: 'Video Editing & Content Creation', module: 'Monetization Strategies', url: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
  { course: 'Video Editing & Content Creation', module: 'Personal Branding', url: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
  { course: 'Video Editing & Content Creation', module: 'Final Content Project', url: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' },
  // SQL & Database Management
  { course: 'SQL & Database Management', module: 'Database Fundamentals', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
  { course: 'SQL & Database Management', module: 'SQL Syntax', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  { course: 'SQL & Database Management', module: 'SELECT Queries', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  { course: 'SQL & Database Management', module: 'Filtering & Sorting', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  { course: 'SQL & Database Management', module: 'JOIN Operations', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  { course: 'SQL & Database Management', module: 'Aggregation Functions', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  { course: 'SQL & Database Management', module: 'Subqueries', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  { course: 'SQL & Database Management', module: 'Database Design', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
  { course: 'SQL & Database Management', module: 'Indexing', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
  { course: 'SQL & Database Management', module: 'Transactions', url: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
  { course: 'SQL & Database Management', module: 'PostgreSQL Administration', url: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
  { course: 'SQL & Database Management', module: 'Database Security', url: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
  { course: 'SQL & Database Management', module: 'Performance Optimization', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'SQL & Database Management', module: 'Final Database Project', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // DevOps Engineering
  { course: 'DevOps Engineering', module: 'Linux Fundamentals', url: 'https://www.youtube.com/watch?v=Gj4yvDwM4Ck' },
  { course: 'DevOps Engineering', module: 'Networking Basics', url: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
  { course: 'DevOps Engineering', module: 'Git & Version Control', url: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
  { course: 'DevOps Engineering', module: 'CI/CD Pipelines', url: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
  { course: 'DevOps Engineering', module: 'Docker', url: 'https://www.youtube.com/watch?v=3c-iBn73dDE' },
  { course: 'DevOps Engineering', module: 'Kubernetes', url: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
  { course: 'DevOps Engineering', module: 'Infrastructure as Code', url: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
  { course: 'DevOps Engineering', module: 'Monitoring Systems', url: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
  { course: 'DevOps Engineering', module: 'Logging Systems', url: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
  { course: 'DevOps Engineering', module: 'AWS DevOps', url: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
  { course: 'DevOps Engineering', module: 'Security Automation', url: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
  { course: 'DevOps Engineering', module: 'Scaling Infrastructure', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'DevOps Engineering', module: 'Production Deployment', url: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
  { course: 'DevOps Engineering', module: 'DevOps Pipeline Project', url: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' },
  // Freelancing & Remote Work
  { course: 'Freelancing & Remote Work', module: 'Freelancing Fundamentals', url: 'https://www.youtube.com/watch?v=fXxJ7aYZ5bU' },
  { course: 'Freelancing & Remote Work', module: 'Finding Clients', url: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
  { course: 'Freelancing & Remote Work', module: 'Portfolio Building', url: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
  { course: 'Freelancing & Remote Work', module: 'Proposal Writing', url: 'https://www.youtube.com/watch?v=LApwP9P3QCg' },
  { course: 'Freelancing & Remote Work', module: 'Pricing Strategies', url: 'https://www.youtube.com/watch?v=IP0cUBWTgpY' },
  { course: 'Freelancing & Remote Work', module: 'Communication Skills', url: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
  { course: 'Freelancing & Remote Work', module: 'Time Management', url: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
  { course: 'Freelancing & Remote Work', module: 'Contracts & Payments', url: 'https://www.youtube.com/watch?v=7j7LQeKZLro' },
  { course: 'Freelancing & Remote Work', module: 'Personal Branding', url: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
  { course: 'Freelancing & Remote Work', module: 'LinkedIn Optimization', url: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
  { course: 'Freelancing & Remote Work', module: 'Remote Productivity', url: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
  { course: 'Freelancing & Remote Work', module: 'Scaling Freelance Income', url: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
  { course: 'Freelancing & Remote Work', module: 'Building an Agency', url: 'https://www.youtube.com/watch?v=QrLi9op6v8k' },
  { course: 'Freelancing & Remote Work', module: 'Freelance Business Project', url: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' },
  // AI Tools & Prompt Engineering
  { course: 'AI Tools & Prompt Engineering', module: 'Introduction to AI', url: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI' },
  { course: 'AI Tools & Prompt Engineering', module: 'Understanding LLMs', url: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
  { course: 'AI Tools & Prompt Engineering', module: 'Prompt Engineering Basics', url: 'https://www.youtube.com/watch?v=jC4v5AS4RIM' },
  { course: 'AI Tools & Prompt Engineering', module: 'Advanced Prompting', url: 'https://www.youtube.com/watch?v=jC4v5AS4RIM' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Content Creation', url: 'https://www.youtube.com/watch?v=5mCAlE3tKqk' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Coding', url: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI for Design', url: 'https://www.youtube.com/watch?v=WoPrbTZkLg8' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI Automation Workflows', url: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI Research Techniques', url: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI Chatbots', url: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
  { course: 'AI Tools & Prompt Engineering', module: 'Building AI Agents', url: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' },
  { course: 'AI Tools & Prompt Engineering', module: 'AI Ethics & Risks', url: 'https://www.youtube.com/watch?v=vgUWKXVxPnQ' },
  { course: 'AI Tools & Prompt Engineering', module: 'Monetizing AI Skills', url: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
  { course: 'AI Tools & Prompt Engineering', module: 'Final AI Automation Project', url: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' }
]

function extractYoutubeId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function verifyAll() {
  console.log('🔍 Verifying all 280 videos using YouTube Data API...\n')

  const broken = []
  const working = []
  let checked = 0
  const total = ALL_VIDEOS.length

  for (const video of ALL_VIDEOS) {
    checked++
    const videoId = extractYoutubeId(video.url)

    if (!videoId) {
      broken.push({ ...video, reason: 'Invalid URL format' })
      process.stdout.write(`[${checked}/${total}] ❌ ${video.course} — ${video.module} (bad URL)\n`)
      continue
    }

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'id,snippet,status',
          id: videoId,
          key: YOUTUBE_API_KEY
        }
      })

      const item = response.data.items?.[0]

      if (!item) {
        broken.push({ ...video, reason: 'Video not found / deleted / private' })
        process.stdout.write(`[${checked}/${total}] ❌ ${video.course} — ${video.module} (not found)\n`)
      } else if (item.status.embeddable === false) {
        broken.push({ ...video, reason: 'Embedding disabled by uploader' })
        process.stdout.write(`[${checked}/${total}] ⚠️  ${video.course} — ${video.module} (embedding disabled)\n`)
      } else {
        working.push(video)
        process.stdout.write(`[${checked}/${total}] ✅ ${video.course} — ${video.module}\n`)
      }
    } catch (err) {
      broken.push({ ...video, reason: `API error: ${err.message}` })
      process.stdout.write(`[${checked}/${total}] ❌ ${video.course} — ${video.module} (API error)\n`)
    }

    // Small delay to avoid hitting rate limits
    await new Promise(r => setTimeout(r, 50))
  }

  // Summary
  console.log('\n========================================')
  console.log('📊 VERIFICATION SUMMARY')
  console.log('========================================')
  console.log(`Total videos checked: ${total}`)
  console.log(`✅ Working: ${working.length}`)
  console.log(`❌ Broken: ${broken.length}`)
  console.log(`📈 Success rate: ${Math.round((working.length / total) * 100)}%\n`)

  if (broken.length > 0) {
    console.log('🚨 BROKEN VIDEOS — NEED REPLACEMENT:\n')
    const byCourse = {}
    broken.forEach(b => {
      if (!byCourse[b.course]) byCourse[b.course] = []
      byCourse[b.course].push({ module: b.module, url: b.url, reason: b.reason })
    })

    for (const [course, videos] of Object.entries(byCourse)) {
      console.log(`📛 ${course} (${videos.length} broken):`)
      videos.forEach(v => {
        console.log(`   ❌ ${v.module}`)
        console.log(`      URL: ${v.url}`)
        console.log(`      Reason: ${v.reason}`)
      })
      console.log('')
    }

    console.log(`\n📝 Total broken: ${broken.length} videos across ${Object.keys(byCourse).length} courses`)
    console.log('   Run the fix script to replace these with working alternatives.\n')
  } else {
    console.log('🎉 All videos are valid and embeddable!\n')
  }
}

verifyAll()
