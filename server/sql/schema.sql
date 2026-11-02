-- ============================================
-- SkillSync AI - PostgreSQL Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  title VARCHAR(100),
  bio TEXT,
  location VARCHAR(100),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  portfolio_url VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 2. SKILLS (Master list)
-- ============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  icon VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);

-- ============================================
-- 3. USER_SKILLS
-- ============================================
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency VARCHAR(20) NOT NULL CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
  years_experience NUMERIC(3,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_skills_user ON user_skills(user_id);

-- ============================================
-- 4. JOB_ANALYSES
-- ============================================
CREATE TABLE IF NOT EXISTS job_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(200) NOT NULL,
  company_name VARCHAR(200),
  job_description TEXT NOT NULL,
  source_type VARCHAR(20) DEFAULT 'text' CHECK (source_type IN ('text', 'pdf')),
  ai_analysis JSONB,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_analyses_user ON job_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_job_analyses_created ON job_analyses(created_at DESC);

-- ============================================
-- 5. JOB_REQUIRED_SKILLS
-- ============================================
CREATE TABLE IF NOT EXISTS job_required_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_analysis_id UUID NOT NULL REFERENCES job_analyses(id) ON DELETE CASCADE,
  skill_name VARCHAR(100) NOT NULL,
  skill_type VARCHAR(20) DEFAULT 'required' CHECK (skill_type IN ('required', 'preferred')),
  importance VARCHAR(20) DEFAULT 'medium' CHECK (importance IN ('high', 'medium', 'low')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_required_skills_job ON job_required_skills(job_analysis_id);

-- ============================================
-- 6. SKILL_GAP_RESULTS
-- ============================================
CREATE TABLE IF NOT EXISTS skill_gap_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_analysis_id UUID NOT NULL REFERENCES job_analyses(id) ON DELETE CASCADE,
  matched_skills JSONB DEFAULT '[]',
  missing_skills JSONB DEFAULT '[]',
  weak_skills JSONB DEFAULT '[]',
  match_percentage NUMERIC(5,2) DEFAULT 0,
  readiness_score NUMERIC(5,2) DEFAULT 0,
  analysis_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, job_analysis_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_gap_user ON skill_gap_results(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_gap_job ON skill_gap_results(job_analysis_id);

-- ============================================
-- 7. ROADMAPS
-- ============================================
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_analysis_id UUID REFERENCES job_analyses(id) ON DELETE SET NULL,
  skill_gap_id UUID REFERENCES skill_gap_results(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  total_weeks INTEGER DEFAULT 4,
  total_hours NUMERIC(6,1) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  progress NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmaps_user ON roadmaps(user_id);

-- ============================================
-- 8. ROADMAP_TASKS
-- ============================================
CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  day_number INTEGER,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  skill_name VARCHAR(100),
  task_type VARCHAR(30) DEFAULT 'learn' CHECK (task_type IN ('learn', 'practice', 'project', 'review', 'assessment')),
  estimated_hours NUMERIC(4,1) DEFAULT 1,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_roadmap ON roadmap_tasks(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_tasks_week ON roadmap_tasks(week_number);

-- ============================================
-- 9. LEARNING_RESOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS learning_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_task_id UUID NOT NULL REFERENCES roadmap_tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url TEXT,
  resource_type VARCHAR(30) DEFAULT 'article' CHECK (resource_type IN ('article', 'video', 'course', 'documentation', 'tutorial', 'book', 'project')),
  provider VARCHAR(100),
  is_free BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_resources_task ON learning_resources(roadmap_task_id);

-- ============================================
-- 10. CHAT_HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created ON chat_history(created_at DESC);

-- ============================================
-- SEED: Master Skills List
-- ============================================
INSERT INTO skills (name, category) VALUES
  -- Programming Languages
  ('JavaScript', 'Programming Languages'),
  ('Python', 'Programming Languages'),
  ('Java', 'Programming Languages'),
  ('C++', 'Programming Languages'),
  ('C#', 'Programming Languages'),
  ('TypeScript', 'Programming Languages'),
  ('Go', 'Programming Languages'),
  ('Rust', 'Programming Languages'),
  ('PHP', 'Programming Languages'),
  ('Ruby', 'Programming Languages'),
  ('Swift', 'Programming Languages'),
  ('Kotlin', 'Programming Languages'),
  ('R', 'Programming Languages'),
  ('Dart', 'Programming Languages'),
  -- Frontend
  ('React', 'Frontend'),
  ('Angular', 'Frontend'),
  ('Vue.js', 'Frontend'),
  ('Next.js', 'Frontend'),
  ('HTML', 'Frontend'),
  ('CSS', 'Frontend'),
  ('Tailwind CSS', 'Frontend'),
  ('Bootstrap', 'Frontend'),
  ('Redux', 'Frontend'),
  ('jQuery', 'Frontend'),
  ('Svelte', 'Frontend'),
  ('SASS/SCSS', 'Frontend'),
  -- Backend
  ('Node.js', 'Backend'),
  ('Express.js', 'Backend'),
  ('Django', 'Backend'),
  ('Flask', 'Backend'),
  ('Spring Boot', 'Backend'),
  ('Ruby on Rails', 'Backend'),
  ('ASP.NET', 'Backend'),
  ('FastAPI', 'Backend'),
  ('NestJS', 'Backend'),
  ('GraphQL', 'Backend'),
  -- Database
  ('PostgreSQL', 'Database'),
  ('MySQL', 'Database'),
  ('MongoDB', 'Database'),
  ('Redis', 'Database'),
  ('SQLite', 'Database'),
  ('Firebase', 'Database'),
  ('Elasticsearch', 'Database'),
  ('Oracle', 'Database'),
  -- DevOps & Cloud
  ('Docker', 'DevOps & Cloud'),
  ('Kubernetes', 'DevOps & Cloud'),
  ('AWS', 'DevOps & Cloud'),
  ('Azure', 'DevOps & Cloud'),
  ('Google Cloud', 'DevOps & Cloud'),
  ('CI/CD', 'DevOps & Cloud'),
  ('Linux', 'DevOps & Cloud'),
  ('Nginx', 'DevOps & Cloud'),
  ('Terraform', 'DevOps & Cloud'),
  ('Jenkins', 'DevOps & Cloud'),
  -- Data Science & AI
  ('Machine Learning', 'Data Science & AI'),
  ('Deep Learning', 'Data Science & AI'),
  ('TensorFlow', 'Data Science & AI'),
  ('PyTorch', 'Data Science & AI'),
  ('Pandas', 'Data Science & AI'),
  ('NumPy', 'Data Science & AI'),
  ('Data Analysis', 'Data Science & AI'),
  ('NLP', 'Data Science & AI'),
  ('Computer Vision', 'Data Science & AI'),
  -- Tools
  ('Git', 'Tools'),
  ('GitHub', 'Tools'),
  ('VS Code', 'Tools'),
  ('Postman', 'Tools'),
  ('Figma', 'Tools'),
  ('Jira', 'Tools'),
  ('Webpack', 'Tools'),
  ('Vite', 'Tools'),
  -- Mobile
  ('React Native', 'Mobile'),
  ('Flutter', 'Mobile'),
  ('Android', 'Mobile'),
  ('iOS', 'Mobile'),
  -- Testing
  ('Jest', 'Testing'),
  ('Cypress', 'Testing'),
  ('Selenium', 'Testing'),
  ('Mocha', 'Testing'),
  ('Unit Testing', 'Testing'),
  -- Soft Skills & Concepts
  ('REST APIs', 'Concepts'),
  ('Microservices', 'Concepts'),
  ('System Design', 'Concepts'),
  ('Data Structures', 'Concepts'),
  ('Algorithms', 'Concepts'),
  ('Design Patterns', 'Concepts'),
  ('Agile/Scrum', 'Concepts'),
  ('OOP', 'Concepts')
ON CONFLICT (name) DO NOTHING;
