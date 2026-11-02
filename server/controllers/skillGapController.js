const { query } = require('../config/database');

// POST /api/skill-gap/:jobId - Calculate skill gap
const calculateSkillGap = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Get job analysis
    const jobResult = await query(
      'SELECT * FROM job_analyses WHERE id = $1 AND user_id = $2',
      [jobId, req.user.id]
    );

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job analysis not found.' });
    }

    // Get required skills for this job
    const jobSkills = await query(
      'SELECT skill_name, skill_type, importance FROM job_required_skills WHERE job_analysis_id = $1',
      [jobId]
    );

    // Get user's skills
    const userSkills = await query(
      `SELECT s.name, us.proficiency
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1`,
      [req.user.id]
    );

    const userSkillMap = {};
    userSkills.rows.forEach(s => {
      userSkillMap[s.name.toLowerCase()] = s.proficiency;
    });

    const matched = [];
    const missing = [];
    const weak = [];

    const requiredSkills = jobSkills.rows.filter(s => s.skill_type === 'required');
    const preferredSkills = jobSkills.rows.filter(s => s.skill_type === 'preferred');

    // Analyze required skills
    for (const skill of requiredSkills) {
      const userProficiency = userSkillMap[skill.skill_name.toLowerCase()];
      if (userProficiency) {
        if (
          (skill.importance === 'high' && userProficiency === 'beginner') ||
          (skill.importance === 'high' && userProficiency === 'intermediate' && Math.random() < 0.3)
        ) {
          weak.push({
            name: skill.skill_name,
            type: 'required',
            importance: skill.importance,
            userLevel: userProficiency,
            recommendation: `Improve ${skill.skill_name} from ${userProficiency} to advanced`
          });
        } else {
          matched.push({
            name: skill.skill_name,
            type: 'required',
            importance: skill.importance,
            userLevel: userProficiency
          });
        }
      } else {
        missing.push({
          name: skill.skill_name,
          type: 'required',
          importance: skill.importance,
          recommendation: `Learn ${skill.skill_name} - this is a required skill`
        });
      }
    }

    // Analyze preferred skills
    for (const skill of preferredSkills) {
      const userProficiency = userSkillMap[skill.skill_name.toLowerCase()];
      if (userProficiency) {
        matched.push({
          name: skill.skill_name,
          type: 'preferred',
          importance: skill.importance,
          userLevel: userProficiency
        });
      } else {
        missing.push({
          name: skill.skill_name,
          type: 'preferred',
          importance: skill.importance,
          recommendation: `Consider learning ${skill.skill_name} - it's preferred for this role`
        });
      }
    }

    // Calculate match percentage using backend business logic
    const totalSkills = jobSkills.rows.length;
    const matchedCount = matched.length;
    const weakCount = weak.length;

    let matchPercentage = 0;
    let readinessScore = 0;

    if (totalSkills > 0) {
      // Weighted calculation: required skills count more
      const requiredTotal = requiredSkills.length;
      const preferredTotal = preferredSkills.length;
      const requiredMatched = matched.filter(s => s.type === 'required').length;
      const preferredMatched = matched.filter(s => s.type === 'preferred').length;
      const weakRequired = weak.filter(s => s.type === 'required').length;

      const requiredWeight = 0.7;
      const preferredWeight = 0.3;

      const requiredScore = requiredTotal > 0
        ? ((requiredMatched + weakRequired * 0.5) / requiredTotal) * 100
        : 100;
      const preferredScore = preferredTotal > 0
        ? (preferredMatched / preferredTotal) * 100
        : 100;

      matchPercentage = Math.round(
        requiredScore * requiredWeight + preferredScore * preferredWeight
      );

      // Readiness score factors in weak skills penalty
      const weakPenalty = weakCount * 5;
      readinessScore = Math.max(0, Math.min(100, matchPercentage - weakPenalty));
    }

    // Upsert skill gap result
    const existingGap = await query(
      'SELECT id FROM skill_gap_results WHERE user_id = $1 AND job_analysis_id = $2',
      [req.user.id, jobId]
    );

    let gapResult;
    if (existingGap.rows.length > 0) {
      gapResult = await query(
        `UPDATE skill_gap_results SET
          matched_skills = $1, missing_skills = $2, weak_skills = $3,
          match_percentage = $4, readiness_score = $5, updated_at = NOW()
         WHERE user_id = $6 AND job_analysis_id = $7
         RETURNING *`,
        [
          JSON.stringify(matched), JSON.stringify(missing), JSON.stringify(weak),
          matchPercentage, readinessScore, req.user.id, jobId
        ]
      );
    } else {
      gapResult = await query(
        `INSERT INTO skill_gap_results (user_id, job_analysis_id, matched_skills, missing_skills, weak_skills, match_percentage, readiness_score)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          req.user.id, jobId,
          JSON.stringify(matched), JSON.stringify(missing), JSON.stringify(weak),
          matchPercentage, readinessScore
        ]
      );
    }

    res.json({
      message: 'Skill gap analysis completed',
      skillGap: {
        ...gapResult.rows[0],
        jobTitle: jobResult.rows[0].job_title,
        companyName: jobResult.rows[0].company_name
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/skill-gap/:jobId - Get skill gap for a job
const getSkillGap = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const result = await query(
      `SELECT sgr.*, ja.job_title, ja.company_name
       FROM skill_gap_results sgr
       JOIN job_analyses ja ON sgr.job_analysis_id = ja.id
       WHERE sgr.job_analysis_id = $1 AND sgr.user_id = $2`,
      [jobId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No skill gap analysis found for this job. Run analysis first.' });
    }

    res.json({ skillGap: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

module.exports = { calculateSkillGap, getSkillGap };
