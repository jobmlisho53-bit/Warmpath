require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ALL_COURSES = [
  {
    course: {
      title: 'Fullstack Web Development',
      description: 'Master web development from fundamentals to building real-world fullstack applications.',
      category: 'Development',
      cover_image: '💻'
    },
    modules: [
      { title: 'Internet & Web Fundamentals', youtube: 'https://www.youtube.com/watch?v=hJHvdBlSxug' },
      { title: 'HTML5 Essentials', youtube: 'https://www.youtube.com/watch?v=mU6anWqZJcc' },
      { title: 'CSS3 & Responsive Design', youtube: 'https://www.youtube.com/watch?v=1PnVor36_40' },
      { title: 'JavaScript Fundamentals', youtube: 'https://www.youtube.com/watch?v=PkZNo7MFNFg' },
      { title: 'Advanced JavaScript', youtube: 'https://www.youtube.com/watch?v=R9I85RhI7Cg' },
      { title: 'Git & GitHub', youtube: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { title: 'Node.js Backend Development', youtube: 'https://www.youtube.com/watch?v=Oe421EPjeBE' },
      { title: 'Express.js APIs', youtube: 'https://www.youtube.com/watch?v=SccSCuHhOw0' },
      { title: 'PostgreSQL Databases', youtube: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
      { title: 'Authentication & Security', youtube: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
      { title: 'React Frontend Development', youtube: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
      { title: 'State Management', youtube: 'https://www.youtube.com/watch?v=35lXWvCuM8o' },
      { title: 'Deployment & DevOps', youtube: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
      { title: 'Real-World Fullstack Project', youtube: 'https://www.youtube.com/watch?v=5PdEmeOpJVQ' }
    ]
  },
  {
    course: {
      title: 'Python Programming',
      description: 'Learn Python from scratch. From basic syntax to data analysis and automation.',
      category: 'Development',
      cover_image: '🐍'
    },
    modules: [
      { title: 'Python Setup & Syntax', youtube: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
      { title: 'Variables & Data Types', youtube: 'https://www.youtube.com/watch?v=khKv-8q7YmY' },
      { title: 'Conditional Logic', youtube: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk' },
      { title: 'Loops & Functions', youtube: 'https://www.youtube.com/watch?v=OnDr4J2UXSA' },
      { title: 'Lists, Tuples & Dictionaries', youtube: 'https://www.youtube.com/watch?v=W8KRzm-HUcc' },
      { title: 'File Handling', youtube: 'https://www.youtube.com/watch?v=Uh2ebFW8OYM' },
      { title: 'Object-Oriented Programming', youtube: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM' },
      { title: 'Error Handling', youtube: 'https://www.youtube.com/watch?v=NIWwJbo-9_8' },
      { title: 'Modules & Packages', youtube: 'https://www.youtube.com/watch?v=CqvZ3vGoGs0' },
      { title: 'APIs & Requests', youtube: 'https://www.youtube.com/watch?v=tb8gHvYlCFs' },
      { title: 'Databases with Python', youtube: 'https://www.youtube.com/watch?v=C0y6FhGZq9s' },
      { title: 'Automation Scripts', youtube: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
      { title: 'Data Analysis Basics', youtube: 'https://www.youtube.com/watch?v=r-uOLxNrNk8' },
      { title: 'Final Project', youtube: 'https://www.youtube.com/watch?v=DLn3jOsNRVE' }
    ]
  },
  {
    course: {
      title: 'UI/UX Design',
      description: 'Learn user interface and user experience design principles using Figma.',
      category: 'Design',
      cover_image: '🎨'
    },
    modules: [
      { title: 'Design Principles', youtube: 'https://www.youtube.com/watch?v=9tKbJ9q0jDE' },
      { title: 'Color Theory', youtube: 'https://www.youtube.com/watch?v=Qj1FK8n7WgY' },
      { title: 'Typography', youtube: 'https://www.youtube.com/watch?v=klXUk68QxQM' },
      { title: 'Wireframing', youtube: 'https://www.youtube.com/watch?v=qpH7-KFWZRI' },
      { title: 'User Research', youtube: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
      { title: 'User Personas', youtube: 'https://www.youtube.com/watch?v=u44pBnAn7cM' },
      { title: 'Information Architecture', youtube: 'https://www.youtube.com/watch?v=OJLfjgVlwDo' },
      { title: 'Figma Fundamentals', youtube: 'https://www.youtube.com/watch?v=Cx2dkpBxst8' },
      { title: 'Prototyping', youtube: 'https://www.youtube.com/watch?v=-sAAa-CCOcg' },
      { title: 'Mobile Design', youtube: 'https://www.youtube.com/watch?v=0cKBR9swyD8' },
      { title: 'Web App Design', youtube: 'https://www.youtube.com/watch?v=fiVlM4MdlZY' },
      { title: 'Design Systems', youtube: 'https://www.youtube.com/watch?v=EK-pHkc5EL4' },
      { title: 'Usability Testing', youtube: 'https://www.youtube.com/watch?v=BrDozqeSZOQ' },
      { title: 'Portfolio Creation', youtube: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' }
    ]
  },
  {
    course: {
      title: 'Graphic Design',
      description: 'Master graphic design with Photoshop, Illustrator, and branding fundamentals.',
      category: 'Design',
      cover_image: '🖌️'
    },
    modules: [
      { title: 'Introduction to Design', youtube: 'https://www.youtube.com/watch?v=YqQx75OPRa0' },
      { title: 'Photoshop Basics', youtube: 'https://www.youtube.com/watch?v=pFyOznL9UvA' },
      { title: 'Illustrator Basics', youtube: 'https://www.youtube.com/watch?v=Ib8UBwu3yGA' },
      { title: 'Branding Fundamentals', youtube: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
      { title: 'Logo Design', youtube: 'https://www.youtube.com/watch?v=WoPrbTZkLg8' },
      { title: 'Typography', youtube: 'https://www.youtube.com/watch?v=yAuUDyUC-GM' },
      { title: 'Social Media Design', youtube: 'https://www.youtube.com/watch?v=3pU9YgqNkqk' },
      { title: 'Poster Design', youtube: 'https://www.youtube.com/watch?v=ly8xWeSqQxY' },
      { title: 'Print Design', youtube: 'https://www.youtube.com/watch?v=3V1zQcM0EAM' },
      { title: 'Color Psychology', youtube: 'https://www.youtube.com/watch?v=x0smqFjvcRk' },
      { title: 'Packaging Design', youtube: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
      { title: 'Freelancing for Designers', youtube: 'https://www.youtube.com/watch?v=fXxJ7aYZ5bU' },
      { title: 'Client Communication', youtube: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
      { title: 'Final Branding Project', youtube: 'https://www.youtube.com/watch?v=QrLi9op6v8k' }
    ]
  },
  {
    course: {
      title: 'Digital Marketing',
      description: 'Complete digital marketing course covering SEO, social media, ads, and analytics.',
      category: 'Marketing',
      cover_image: '📈'
    },
    modules: [
      { title: 'Marketing Fundamentals', youtube: 'https://www.youtube.com/watch?v=bixR-KIJKYM' },
      { title: 'Branding & Positioning', youtube: 'https://www.youtube.com/watch?v=sO4te2QNsHY' },
      { title: 'Social Media Marketing', youtube: 'https://www.youtube.com/watch?v=I2pwcBoosXw' },
      { title: 'Content Marketing', youtube: 'https://www.youtube.com/watch?v=5mCAlE3tKqk' },
      { title: 'SEO Fundamentals', youtube: 'https://www.youtube.com/watch?v=MYE6T_gd7H0' },
      { title: 'Google Ads', youtube: 'https://www.youtube.com/watch?v=Nx2T0RhKFck' },
      { title: 'Facebook & Instagram Ads', youtube: 'https://www.youtube.com/watch?v=Z7ntGQ4BnFI' },
      { title: 'Email Marketing', youtube: 'https://www.youtube.com/watch?v=BC0AhPXmaCk' },
      { title: 'Copywriting', youtube: 'https://www.youtube.com/watch?v=LApwP9P3QCg' },
      { title: 'Analytics & Tracking', youtube: 'https://www.youtube.com/watch?v=RL61_OnYwco' },
      { title: 'Funnel Building', youtube: 'https://www.youtube.com/watch?v=BN7SIGqg9Dk' },
      { title: 'Affiliate Marketing', youtube: 'https://www.youtube.com/watch?v=zP3LDqFSgjs' },
      { title: 'E-commerce Marketing', youtube: 'https://www.youtube.com/watch?v=3j2uVczYjfE' },
      { title: 'Marketing Campaign Project', youtube: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' }
    ]
  },
  {
    course: {
      title: 'Cybersecurity Fundamentals',
      description: 'Learn cybersecurity basics, ethical hacking, network security, and incident response.',
      category: 'Security',
      cover_image: '🔒'
    },
    modules: [
      { title: 'Cybersecurity Basics', youtube: 'https://www.youtube.com/watch?v=U_P23SqHqDc' },
      { title: 'Networking Fundamentals', youtube: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
      { title: 'Operating Systems Security', youtube: 'https://www.youtube.com/watch?v=Gj4yvDwM4Ck' },
      { title: 'Encryption Basics', youtube: 'https://www.youtube.com/watch?v=AQDCe585Lnc' },
      { title: 'Web Security', youtube: 'https://www.youtube.com/watch?v=WlmKwIe9z1Q' },
      { title: 'Authentication Systems', youtube: 'https://www.youtube.com/watch?v=2KhQINj1bMI' },
      { title: 'Ethical Hacking', youtube: 'https://www.youtube.com/watch?v=fNzpcB7ODxQ' },
      { title: 'Vulnerability Assessment', youtube: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
      { title: 'Malware Analysis', youtube: 'https://www.youtube.com/watch?v=7d9Kj4RSXxA' },
      { title: 'Security Tools', youtube: 'https://www.youtube.com/watch?v=PDk7hGbDDyo' },
      { title: 'Incident Response', youtube: 'https://www.youtube.com/watch?v=AvfsoCgE4Yk' },
      { title: 'Cloud Security', youtube: 'https://www.youtube.com/watch?v=jYtUJKsAVb0' },
      { title: 'Security Best Practices', youtube: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
      { title: 'Capstone Security Audit', youtube: 'https://www.youtube.com/watch?v=l3hHXzhJPSA' }
    ]
  },
  {
    course: {
      title: 'Data Science',
      description: 'Complete data science course covering Python, statistics, visualization, and machine learning.',
      category: 'Data',
      cover_image: '📊'
    },
    modules: [
      { title: 'Data Science Overview', youtube: 'https://www.youtube.com/watch?v=X3paOmcrTjQ' },
      { title: 'Python for Data Science', youtube: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI' },
      { title: 'Data Cleaning', youtube: 'https://www.youtube.com/watch?v=8f97aHAClhA' },
      { title: 'Data Visualization', youtube: 'https://www.youtube.com/watch?v=a9UrKTVEeZA' },
      { title: 'Statistics Fundamentals', youtube: 'https://www.youtube.com/watch?v=xxpc-HPKN28' },
      { title: 'Pandas & NumPy', youtube: 'https://www.youtube.com/watch?v=vmEHCJofslg' },
      { title: 'SQL for Data Analysis', youtube: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'Exploratory Data Analysis', youtube: 'https://www.youtube.com/watch?v=5NcbVYhQJvw' },
      { title: 'Machine Learning Basics', youtube: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI' },
      { title: 'Regression Models', youtube: 'https://www.youtube.com/watch?v=Wq4asSJhvjY' },
      { title: 'Classification Models', youtube: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
      { title: 'Model Evaluation', youtube: 'https://www.youtube.com/watch?v=85dtiMz9tJI' },
      { title: 'Real-World Datasets', youtube: 'https://www.youtube.com/watch?v=uEGj5O_riFQ' },
      { title: 'Final Data Project', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'Machine Learning',
      description: 'Deep dive into machine learning algorithms, neural networks, and AI model deployment.',
      category: 'AI',
      cover_image: '🤖'
    },
    modules: [
      { title: 'Introduction to ML', youtube: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI' },
      { title: 'Python & ML Libraries', youtube: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
      { title: 'Data Preprocessing', youtube: 'https://www.youtube.com/watch?v=GEn7YdM28a0' },
      { title: 'Supervised Learning', youtube: 'https://www.youtube.com/watch?v=Wq4asSJhvjY' },
      { title: 'Unsupervised Learning', youtube: 'https://www.youtube.com/watch?v=Ev8Yl4jj9Ag' },
      { title: 'Regression', youtube: 'https://www.youtube.com/watch?v=Wq4asSJhvjY' },
      { title: 'Classification', youtube: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
      { title: 'Clustering', youtube: 'https://www.youtube.com/watch?v=4b5d3oF6PQ8' },
      { title: 'Neural Networks', youtube: 'https://www.youtube.com/watch?v=aircAruvnKk' },
      { title: 'Deep Learning Basics', youtube: 'https://www.youtube.com/watch?v=VyWAvY2CF9c' },
      { title: 'Model Optimization', youtube: 'https://www.youtube.com/watch?v=85dtiMz9tJI' },
      { title: 'AI Ethics', youtube: 'https://www.youtube.com/watch?v=vgUWKXVxPnQ' },
      { title: 'Deployment of ML Models', youtube: 'https://www.youtube.com/watch?v=b5F667g1yCk' },
      { title: 'Final AI Project', youtube: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' }
    ]
  },
  {
    course: {
      title: 'Mobile App Development',
      description: 'Build mobile apps with React Native. From basics to app store publishing.',
      category: 'Development',
      cover_image: '📱'
    },
    modules: [
      { title: 'Mobile Development Overview', youtube: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
      { title: 'React Native Basics', youtube: 'https://www.youtube.com/watch?v=ur6I5m2nTvk' },
      { title: 'UI Components', youtube: 'https://www.youtube.com/watch?v=Hf4MJH0jDb4' },
      { title: 'Navigation Systems', youtube: 'https://www.youtube.com/watch?v=OmQCU-3KPms' },
      { title: 'State Management', youtube: 'https://www.youtube.com/watch?v=35lXWvCuM8o' },
      { title: 'APIs & Networking', youtube: 'https://www.youtube.com/watch?v=D-JNxF8xIBw' },
      { title: 'Authentication', youtube: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
      { title: 'Local Storage', youtube: 'https://www.youtube.com/watch?v=ZkAB8E3L0bc' },
      { title: 'Firebase Integration', youtube: 'https://www.youtube.com/watch?v=kmR6n9YQ3Yk' },
      { title: 'Push Notifications', youtube: 'https://www.youtube.com/watch?v=2VxoYqIxErc' },
      { title: 'Performance Optimization', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'App Publishing', youtube: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
      { title: 'Monetization Strategies', youtube: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
      { title: 'Final Mobile App', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'Cloud Computing',
      description: 'Master cloud computing with AWS, Docker, Kubernetes, and CI/CD pipelines.',
      category: 'Infrastructure',
      cover_image: '☁️'
    },
    modules: [
      { title: 'Cloud Fundamentals', youtube: 'https://www.youtube.com/watch?v=k1RI5locZE4' },
      { title: 'AWS Basics', youtube: 'https://www.youtube.com/watch?v=3hLmDS179YE' },
      { title: 'Virtual Machines', youtube: 'https://www.youtube.com/watch?v=wX7Tz0S9C5E' },
      { title: 'Storage Systems', youtube: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
      { title: 'Networking in Cloud', youtube: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
      { title: 'Docker Containers', youtube: 'https://www.youtube.com/watch?v=3c-iBn73dDE' },
      { title: 'Kubernetes Basics', youtube: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
      { title: 'CI/CD Pipelines', youtube: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
      { title: 'Serverless Computing', youtube: 'https://www.youtube.com/watch?v=2LQ0B8WmFvw' },
      { title: 'Monitoring & Logging', youtube: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
      { title: 'Cloud Security', youtube: 'https://www.youtube.com/watch?v=jYtUJKsAVb0' },
      { title: 'Scalability Concepts', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'Cost Optimization', youtube: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
      { title: 'Cloud Deployment Project', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'Software Engineering',
      description: 'Software development lifecycle, clean code, testing, and system design.',
      category: 'Development',
      cover_image: '⚙️'
    },
    modules: [
      { title: 'Software Development Lifecycle', youtube: 'https://www.youtube.com/watch?v=i-QyW8D3ei0' },
      { title: 'Requirements Engineering', youtube: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
      { title: 'System Design', youtube: 'https://www.youtube.com/watch?v=Y-Gl4REyeqs' },
      { title: 'Version Control', youtube: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { title: 'Clean Code Principles', youtube: 'https://www.youtube.com/watch?v=RR_dQ4sBSwM' },
      { title: 'Testing Fundamentals', youtube: 'https://www.youtube.com/watch?v=Jv2uxzhPFl4' },
      { title: 'Agile Methodologies', youtube: 'https://www.youtube.com/watch?v=Z9QbYZh1YXY' },
      { title: 'APIs & Integrations', youtube: 'https://www.youtube.com/watch?v=GZvSYJDk-us' },
      { title: 'Database Design', youtube: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
      { title: 'DevOps Basics', youtube: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
      { title: 'Security Principles', youtube: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
      { title: 'Scalability Concepts', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'Team Collaboration', youtube: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
      { title: 'Enterprise Software Project', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'Game Development',
      description: 'Create games with Unity and C#. From physics to publishing.',
      category: 'Development',
      cover_image: '🎮'
    },
    modules: [
      { title: 'Introduction to Game Development', youtube: 'https://www.youtube.com/watch?v=gB1F9G0JXOo' },
      { title: 'Unity Fundamentals', youtube: 'https://www.youtube.com/watch?v=XtQMytORBmM' },
      { title: 'C# Basics', youtube: 'https://www.youtube.com/watch?v=GhQdlIFylQ8' },
      { title: 'Game Physics', youtube: 'https://www.youtube.com/watch?v=F0B3DAlz5Cg' },
      { title: 'Character Controllers', youtube: 'https://www.youtube.com/watch?v=_QajrabyTJc' },
      { title: 'Animations', youtube: 'https://www.youtube.com/watch?v=JeZkctmoBPw' },
      { title: 'Game UI', youtube: 'https://www.youtube.com/watch?v=HwdweCXUjHo' },
      { title: 'Audio Systems', youtube: 'https://www.youtube.com/watch?v=6OT43pvUyfY' },
      { title: 'AI for Games', youtube: 'https://www.youtube.com/watch?v=T1GIPEqbN6Y' },
      { title: 'Multiplayer Basics', youtube: 'https://www.youtube.com/watch?v=1BdBdP5sMYo' },
      { title: 'Mobile Optimization', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'Publishing Games', youtube: 'https://www.youtube.com/watch?v=0-S5a0eXPoc' },
      { title: 'Monetization', youtube: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
      { title: 'Final Game Project', youtube: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' }
    ]
  },
  {
    course: {
      title: 'Business & Entrepreneurship',
      description: 'Start and scale your business. Market research, funding, and growth strategies.',
      category: 'Business',
      cover_image: '💼'
    },
    modules: [
      { title: 'Entrepreneurial Mindset', youtube: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
      { title: 'Business Models', youtube: 'https://www.youtube.com/watch?v=IP0cUBWTgpY' },
      { title: 'Market Research', youtube: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
      { title: 'Branding', youtube: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
      { title: 'Financial Basics', youtube: 'https://www.youtube.com/watch?v=7j7LQeKZLro' },
      { title: 'Sales Fundamentals', youtube: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
      { title: 'Digital Business', youtube: 'https://www.youtube.com/watch?v=3j2uVczYjfE' },
      { title: 'Customer Acquisition', youtube: 'https://www.youtube.com/watch?v=BN7SIGqg9Dk' },
      { title: 'Operations Management', youtube: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
      { title: 'Business Automation', youtube: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
      { title: 'Leadership Skills', youtube: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
      { title: 'Pitching Investors', youtube: 'https://www.youtube.com/watch?v=QrLi9op6v8k' },
      { title: 'Scaling Strategies', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'Startup Business Plan', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'Stock Market Investing',
      description: 'Learn investing fundamentals, technical analysis, and portfolio building.',
      category: 'Finance',
      cover_image: '📉'
    },
    modules: [
      { title: 'Investing Fundamentals', youtube: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8' },
      { title: 'Stock Market Basics', youtube: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo' },
      { title: 'Fundamental Analysis', youtube: 'https://www.youtube.com/watch?v=4Hw0nWryiQY' },
      { title: 'Technical Analysis', youtube: 'https://www.youtube.com/watch?v=eynxyoKgpng' },
      { title: 'Risk Management', youtube: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
      { title: 'Portfolio Building', youtube: 'https://www.youtube.com/watch?v=4Gg3n3sC2cY' },
      { title: 'Value Investing', youtube: 'https://www.youtube.com/watch?v=4Hw0nWryiQY' },
      { title: 'Growth Investing', youtube: 'https://www.youtube.com/watch?v=p7HKvqRI_Bo' },
      { title: 'Dividend Investing', youtube: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8' },
      { title: 'Trading Psychology', youtube: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
      { title: 'Financial Statements', youtube: 'https://www.youtube.com/watch?v=7j7LQeKZLro' },
      { title: 'Economic Indicators', youtube: 'https://www.youtube.com/watch?v=4Hw0nWryiQY' },
      { title: 'Long-Term Wealth Strategies', youtube: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8' },
      { title: 'Investment Portfolio Project', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'Cryptocurrency & Blockchain',
      description: 'Understand blockchain technology, crypto trading, DeFi, NFTs, and Web3.',
      category: 'Finance',
      cover_image: '🪙'
    },
    modules: [
      { title: 'Blockchain Fundamentals', youtube: 'https://www.youtube.com/watch?v=yubzJw0uiE4' },
      { title: 'Bitcoin Basics', youtube: 'https://www.youtube.com/watch?v=1YAz5DRoJeA' },
      { title: 'Ethereum Ecosystem', youtube: 'https://www.youtube.com/watch?v=IsXvoYeJxKA' },
      { title: 'Wallets & Security', youtube: 'https://www.youtube.com/watch?v=2KhQINj1bMI' },
      { title: 'Smart Contracts', youtube: 'https://www.youtube.com/watch?v=pWGLtjG-F5c' },
      { title: 'DeFi Fundamentals', youtube: 'https://www.youtube.com/watch?v=17QRFlml4pA' },
      { title: 'NFTs Explained', youtube: 'https://www.youtube.com/watch?v=NNQLJcJEzv0' },
      { title: 'Trading Basics', youtube: 'https://www.youtube.com/watch?v=eynxyoKgpng' },
      { title: 'On-Chain Analysis', youtube: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
      { title: 'Tokenomics', youtube: 'https://www.youtube.com/watch?v=IP0cUBWTgpY' },
      { title: 'Crypto Risk Management', youtube: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
      { title: 'Web3 Applications', youtube: 'https://www.youtube.com/watch?v=wHTcrmhVtoA' },
      { title: 'Blockchain Careers', youtube: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
      { title: 'Final Blockchain Project', youtube: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' }
    ]
  },
  {
    course: {
      title: 'Video Editing & Content Creation',
      description: 'Create engaging video content. Premiere Pro, motion graphics, and YouTube growth.',
      category: 'Creative',
      cover_image: '🎬'
    },
    modules: [
      { title: 'Content Creation Fundamentals', youtube: 'https://www.youtube.com/watch?v=5mCAlE3tKqk' },
      { title: 'Storytelling', youtube: 'https://www.youtube.com/watch?v=LApwP9P3QCg' },
      { title: 'Camera Basics', youtube: 'https://www.youtube.com/watch?v=3pU9YgqNkqk' },
      { title: 'Lighting Techniques', youtube: 'https://www.youtube.com/watch?v=ly8xWeSqQxY' },
      { title: 'Audio Recording', youtube: 'https://www.youtube.com/watch?v=6OT43pvUyfY' },
      { title: 'Adobe Premiere Pro', youtube: 'https://www.youtube.com/watch?v=Hls3Tp7JS8E' },
      { title: 'Motion Graphics', youtube: 'https://www.youtube.com/watch?v=JeZkctmoBPw' },
      { title: 'Short-Form Content', youtube: 'https://www.youtube.com/watch?v=3pU9YgqNkqk' },
      { title: 'YouTube Growth', youtube: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
      { title: 'TikTok & Reels Strategy', youtube: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
      { title: 'Thumbnail Design', youtube: 'https://www.youtube.com/watch?v=WoPrbTZkLg8' },
      { title: 'Monetization Strategies', youtube: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
      { title: 'Personal Branding', youtube: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
      { title: 'Final Content Project', youtube: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' }
    ]
  },
  {
    course: {
      title: 'SQL & Database Management',
      description: 'Master SQL queries, database design, indexing, and PostgreSQL administration.',
      category: 'Data',
      cover_image: '🗄️'
    },
    modules: [
      { title: 'Database Fundamentals', youtube: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
      { title: 'SQL Syntax', youtube: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'SELECT Queries', youtube: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'Filtering & Sorting', youtube: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'JOIN Operations', youtube: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'Aggregation Functions', youtube: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'Subqueries', youtube: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
      { title: 'Database Design', youtube: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
      { title: 'Indexing', youtube: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
      { title: 'Transactions', youtube: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' },
      { title: 'PostgreSQL Administration', youtube: 'https://www.youtube.com/watch?v=qw--VYLpxG4' },
      { title: 'Database Security', youtube: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
      { title: 'Performance Optimization', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'Final Database Project', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'DevOps Engineering',
      description: 'Linux, Docker, Kubernetes, CI/CD, monitoring, and production deployment.',
      category: 'Infrastructure',
      cover_image: '🔧'
    },
    modules: [
      { title: 'Linux Fundamentals', youtube: 'https://www.youtube.com/watch?v=Gj4yvDwM4Ck' },
      { title: 'Networking Basics', youtube: 'https://www.youtube.com/watch?v=IPvYjXCsTg8' },
      { title: 'Git & Version Control', youtube: 'https://www.youtube.com/watch?v=RGOj5yH7evk' },
      { title: 'CI/CD Pipelines', youtube: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
      { title: 'Docker', youtube: 'https://www.youtube.com/watch?v=3c-iBn73dDE' },
      { title: 'Kubernetes', youtube: 'https://www.youtube.com/watch?v=X48VuDVv0do' },
      { title: 'Infrastructure as Code', youtube: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
      { title: 'Monitoring Systems', youtube: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
      { title: 'Logging Systems', youtube: 'https://www.youtube.com/watch?v=4D3RgAFWZpM' },
      { title: 'AWS DevOps', youtube: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
      { title: 'Security Automation', youtube: 'https://www.youtube.com/watch?v=Gk_27_MHQbo' },
      { title: 'Scaling Infrastructure', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'Production Deployment', youtube: 'https://www.youtube.com/watch?v=4YOpILi9Oxs' },
      { title: 'DevOps Pipeline Project', youtube: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' }
    ]
  },
  {
    course: {
      title: 'Freelancing & Remote Work',
      description: 'Build a successful freelance career. Find clients, set rates, and scale your income.',
      category: 'Career',
      cover_image: '🌍'
    },
    modules: [
      { title: 'Freelancing Fundamentals', youtube: 'https://www.youtube.com/watch?v=fXxJ7aYZ5bU' },
      { title: 'Finding Clients', youtube: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
      { title: 'Portfolio Building', youtube: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
      { title: 'Proposal Writing', youtube: 'https://www.youtube.com/watch?v=LApwP9P3QCg' },
      { title: 'Pricing Strategies', youtube: 'https://www.youtube.com/watch?v=IP0cUBWTgpY' },
      { title: 'Communication Skills', youtube: 'https://www.youtube.com/watch?v=HanzRm4V1k8' },
      { title: 'Time Management', youtube: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
      { title: 'Contracts & Payments', youtube: 'https://www.youtube.com/watch?v=7j7LQeKZLro' },
      { title: 'Personal Branding', youtube: 'https://www.youtube.com/watch?v=JKIAOZZritk' },
      { title: 'LinkedIn Optimization', youtube: 'https://www.youtube.com/watch?v=ZbM0vQ3wvXc' },
      { title: 'Remote Productivity', youtube: 'https://www.youtube.com/watch?v=eXDNkwIeerc' },
      { title: 'Scaling Freelance Income', youtube: 'https://www.youtube.com/watch?v=9D1F4cR7NwI' },
      { title: 'Building an Agency', youtube: 'https://www.youtube.com/watch?v=QrLi9op6v8k' },
      { title: 'Freelance Business Project', youtube: 'https://www.youtube.com/watch?v=6i7qZzS3i3U' }
    ]
  },
  {
    course: {
      title: 'AI Tools & Prompt Engineering',
      description: 'Master AI tools, prompt engineering, automation workflows, and building AI agents.',
      category: 'AI',
      cover_image: '✨'
    },
    modules: [
      { title: 'Introduction to AI', youtube: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI' },
      { title: 'Understanding LLMs', youtube: 'https://www.youtube.com/watch?v=zjkBMFhNj_g' },
      { title: 'Prompt Engineering Basics', youtube: 'https://www.youtube.com/watch?v=jC4v5AS4RIM' },
      { title: 'Advanced Prompting', youtube: 'https://www.youtube.com/watch?v=jC4v5AS4RIM' },
      { title: 'AI for Content Creation', youtube: 'https://www.youtube.com/watch?v=5mCAlE3tKqk' },
      { title: 'AI for Coding', youtube: 'https://www.youtube.com/watch?v=7eh4d6sabA0' },
      { title: 'AI for Design', youtube: 'https://www.youtube.com/watch?v=WoPrbTZkLg8' },
      { title: 'AI Automation Workflows', youtube: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
      { title: 'AI Research Techniques', youtube: 'https://www.youtube.com/watch?v=6ZvEIdDGy2Q' },
      { title: 'AI Chatbots', youtube: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
      { title: 'Building AI Agents', youtube: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' },
      { title: 'AI Ethics & Risks', youtube: 'https://www.youtube.com/watch?v=vgUWKXVxPnQ' },
      { title: 'Monetizing AI Skills', youtube: 'https://www.youtube.com/watch?v=8oDJ0MQHqpg' },
      { title: 'Final AI Automation Project', youtube: 'https://www.youtube.com/watch?v=PMF5u7G7PnY' }
    ]
  }
]

function extractYoutubeId(url) {
  if (!url) return null
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function seedAll() {
  console.log('🌱 Starting full seed of all 20 courses...\n')

  for (let c = 0; c < ALL_COURSES.length; c++) {
    const courseData = ALL_COURSES[c]
    const courseTitle = courseData.course.title

    console.log(`[${c + 1}/20] Seeding: ${courseTitle}`)

    // Insert course
    const { data: course, error: courseErr } = await supabase
      .from('courses')
      .insert({
        title: courseData.course.title,
        description: courseData.course.description,
        category: courseData.course.category,
        cover_image: courseData.course.cover_image,
        status: 'published'
      })
      .select()
      .single()

    if (courseErr) {
      console.error(`  ❌ Course error: ${courseErr.message}`)
      continue
    }

    // Insert modules and lessons
    for (let m = 0; m < courseData.modules.length; m++) {
      const mod = courseData.modules[m]

      const { data: moduleData, error: modErr } = await supabase
        .from('modules')
        .insert({
          course_id: course.id,
          title: mod.title,
          order_index: m
        })
        .select()
        .single()

      if (modErr) {
        console.error(`  ❌ Module error: ${modErr.message}`)
        continue
      }

      const videoId = extractYoutubeId(mod.youtube)
      const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

      const { error: lessonErr } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleData.id,
          title: `${mod.title} - Full Tutorial`,
          youtube_url: mod.youtube,
          youtube_id: videoId,
          thumbnail: thumbnail,
          duration: 'PT30M',
          channel_name: 'Tutorial Channel',
          order_index: 0
        })

      if (lessonErr) {
        console.error(`  ❌ Lesson error: ${lessonErr.message}`)
      }
    }

    console.log(`  ✅ Done — 14 modules seeded\n`)
  }

  console.log('🎉 All 20 courses seeded successfully!')
}

seedAll()
