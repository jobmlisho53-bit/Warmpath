require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function seedPythonCourse() {
  const modules = [
    'Python Setup & Syntax',
    'Variables & Data Types',
    'Conditional Logic',
    'Loops & Functions',
    'Lists, Tuples & Dictionaries',
    'File Handling',
    'Object-Oriented Programming',
    'Error Handling',
    'Modules & Packages',
    'APIs & Requests',
    'Databases with Python',
    'Automation Scripts',
    'Data Analysis Basics',
    'Final Project'
  ]

  // Sample YouTube videos for each module (well-known Python tutorials)
  const lessons = [
    { title: 'Python Setup & Syntax - Full Tutorial', youtube_url: 'https://www.youtube.com/watch?v=rfscVS0vtbw' },
    { title: 'Variables & Data Types in Python', youtube_url: 'https://www.youtube.com/watch?v=khKv-8q7YmY' },
    { title: 'Conditional Logic - If Statements', youtube_url: 'https://www.youtube.com/watch?v=DZwmZ8Usvnk' },
    { title: 'Loops & Functions Explained', youtube_url: 'https://www.youtube.com/watch?v=OnDr4J2UXSA' },
    { title: 'Lists, Tuples & Dictionaries', youtube_url: 'https://www.youtube.com/watch?v=W8KRzm-HUcc' },
    { title: 'File Handling in Python', youtube_url: 'https://www.youtube.com/watch?v=Uh2ebFW8OYM' },
    { title: 'Object-Oriented Programming', youtube_url: 'https://www.youtube.com/watch?v=ZDa-Z5JzLYM' },
    { title: 'Error Handling Try/Except', youtube_url: 'https://www.youtube.com/watch?v=NIWwJbo-9_8' },
    { title: 'Modules & Packages', youtube_url: 'https://www.youtube.com/watch?v=CqvZ3vGoGs0' },
    { title: 'APIs & Requests Library', youtube_url: 'https://www.youtube.com/watch?v=tb8gHvYlCFs' },
    { title: 'Databases with Python', youtube_url: 'https://www.youtube.com/watch?v=C0y6FhGZq9s' },
    { title: 'Automation Scripts', youtube_url: 'https://www.youtube.com/watch?v=PXMJ6FS7llk' },
    { title: 'Data Analysis Basics', youtube_url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8' },
    { title: 'Final Project - Build Something', youtube_url: 'https://www.youtube.com/watch?v=DLn3jOsNRVE' }
  ]

  // Create course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .insert({
      title: 'Python Programming',
      description: 'Learn Python from scratch. From basic syntax to data analysis and automation.',
      category: 'Development',
      cover_image: '🐍',
      status: 'published'
    })
    .select()
    .single()

  if (courseErr) {
    console.error('Course error:', courseErr.message)
    return
  }

  console.log('Course created:', course.id)

  for (let i = 0; i < modules.length; i++) {
    // Create module
    const { data: mod, error: modErr } = await supabase
      .from('modules')
      .insert({
        course_id: course.id,
        title: modules[i],
        order_index: i
      })
      .select()
      .single()

    if (modErr) {
      console.error('Module error:', modErr.message)
      continue
    }

    // Create lesson with YouTube URL
    const { data: lesson, error: lessonErr } = await supabase
      .from('lessons')
      .insert({
        module_id: mod.id,
        title: lessons[i].title,
        youtube_url: lessons[i].youtube_url,
        youtube_id: lessons[i].youtube_url.split('v=')[1] || lessons[i].youtube_url.split('/').pop(),
        thumbnail: `https://img.youtube.com/vi/${lessons[i].youtube_url.split('v=')[1]}/maxresdefault.jpg`,
        duration: 'PT1H',
        channel_name: 'Python Tutorial',
        order_index: 0
      })
      .select()
      .single()

    if (lessonErr) {
      console.error('Lesson error:', lessonErr.message)
    } else {
      console.log(`  Module ${i + 1}: ${modules[i]} — Lesson created`)
    }
  }

  console.log('Seeding complete!')
}

seedPythonCourse()
