const { query } = require('../config/database');
const { generateJSON } = require('../config/gemini');
const pdfParse = require('pdf-parse');

// POST /api/jobs/analyze - Analyze job description
const analyzeJob = async (req, res, next) => {
  try {
    const { jobTitle, companyName, jobDescription } = req.body;
    let description = jobDescription;

    // Handle PDF upload
    if (req.file) {
      try {
        const pdfData = await pdfParse(req.file.buffer);
        description = pdfData.text;
      } catch (err) {
        return res.status(400).json({ error: 'Failed to parse PDF file.' });
      }
    }

    if (!description || description.trim().length < 20) {
      return res.status(400).json({ error: 'Job description is too short. Please provide more details.' });
    }

    const prompt = `Analyze the following job description and extract structured information.

Job Title: ${jobTitle || 'Not specified'}
Company: ${companyName || 'Not specified'}

Job Description:
${description}

Return a JSON object with this exact structure:
{
  "extractedTitle": "the job title",
  "requiredSkills": [
    { "name": "Skill Name", "importance": "high|medium|low" }
  ],
  "preferredSkills": [
    { "name": "Skill Name", "importance": "high|medium|low" }
  ],
  "experienceRequired": "e.g., 2-4 years",
  "toolsAndTechnologies": ["Tool1", "Tool2"],
  "importantKeywords": ["keyword1", "keyword2"],
  "jobLevel": "entry|mid|senior|lead",
  "summary": "Brief 2-3 sentence summary of the role"
}

Rules:
- Extract ONLY technical skills mentioned in the job description.
- Categorize skills as required or preferred based on the description.
- Set importance based on emphasis in the description.
- Be accurate and specific.
- Return valid JSON only.`;

    const aiAnalysis = await generateJSON(prompt);

    // Validate AI response structure
    if (!aiAnalysis.requiredSkills || !Array.isArray(aiAnalysis.requiredSkills)) {
      throw new Error('Invalid AI response structure');
    }

    // Save job analysis
    const jobResult = await query(
      `INSERT INTO job_analyses (user_id, job_title, company_name, job_description, source_type, ai_analysis, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'completed')
       RETURNING id, job_title, company_name, source_type, ai_analysis, status, created_at`,
      [
        req.user.id,
        aiAnalysis.extractedTitle || jobTitle || 'Untitled Position',
        companyName || null,
        description,
        req.file ? 'pdf' : 'text',
        JSON.stringify(aiAnalysis)
      ]
    );

    const jobId = jobResult.rows[0].id;

    // Save required skills
    for (const skill of aiAnalysis.requiredSkills) {
      await query(
        `INSERT INTO job_required_skills (job_analysis_id, skill_name, skill_type, importance)
         VALUES ($1, $2, 'required', $3)`,
        [jobId, skill.name, skill.importance || 'medium']
      );
    }

    // Save preferred skills
    if (aiAnalysis.preferredSkills) {
      for (const skill of aiAnalysis.preferredSkills) {
        await query(
          `INSERT INTO job_required_skills (job_analysis_id, skill_name, skill_type, importance)
           VALUES ($1, $2, 'preferred', $3)`,
          [jobId, skill.name, skill.importance || 'low']
        );
      }
    }

    res.status(201).json({
      message: 'Job analyzed successfully',
      job: jobResult.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs - Get all user's job analyses
const getJobs = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, job_title, company_name, source_type, ai_analysis, status, created_at
       FROM job_analyses
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ jobs: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/jobs/:id - Get single job analysis
const getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const jobResult = await query(
      `SELECT id, job_title, company_name, job_description, source_type, ai_analysis, status, created_at
       FROM job_analyses
       WHERE id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job analysis not found.' });
    }

    const skillsResult = await query(
      `SELECT id, skill_name, skill_type, importance
       FROM job_required_skills
       WHERE job_analysis_id = $1
       ORDER BY skill_type, importance DESC`,
      [id]
    );

    const gapResult = await query(
      `SELECT * FROM skill_gap_results WHERE job_analysis_id = $1 AND user_id = $2`,
      [id, req.user.id]
    );

    res.json({
      job: {
        ...jobResult.rows[0],
        skills: skillsResult.rows,
        skillGap: gapResult.rows[0] || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/jobs/:id - Delete job analysis
const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM job_analyses WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job analysis not found.' });
    }

    res.json({ message: 'Job analysis deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { analyzeJob, getJobs, getJobById, deleteJob };
