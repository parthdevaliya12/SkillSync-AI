const { query } = require('../config/database');

// GET /api/dashboard/stats
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total skills
    const skillsResult = await query(
      'SELECT COUNT(*) as count FROM user_skills WHERE user_id = $1',
      [userId]
    );

    // Analyzed jobs
    const jobsResult = await query(
      'SELECT COUNT(*) as count FROM job_analyses WHERE user_id = $1',
      [userId]
    );

    // Average match
    const matchResult = await query(
      'SELECT COALESCE(AVG(match_percentage), 0) as avg_match FROM skill_gap_results WHERE user_id = $1',
      [userId]
    );

    // Active roadmaps
    const roadmapsResult = await query(
      "SELECT COUNT(*) as count FROM roadmaps WHERE user_id = $1 AND status = 'active'",
      [userId]
    );

    // Completed tasks
    const tasksResult = await query(
      `SELECT COUNT(*) as count FROM roadmap_tasks rt
       JOIN roadmaps r ON rt.roadmap_id = r.id
       WHERE r.user_id = $1 AND rt.is_completed = true`,
      [userId]
    );

    // Skill distribution
    const distributionResult = await query(
      `SELECT s.category, COUNT(*) as count
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1
       GROUP BY s.category
       ORDER BY count DESC`,
      [userId]
    );

    // Recent job analyses
    const recentJobsResult = await query(
      `SELECT ja.id, ja.job_title, ja.company_name, ja.created_at,
        sgr.match_percentage, sgr.readiness_score
       FROM job_analyses ja
       LEFT JOIN skill_gap_results sgr ON ja.id = sgr.job_analysis_id AND sgr.user_id = $1
       WHERE ja.user_id = $1
       ORDER BY ja.created_at DESC
       LIMIT 5`,
      [userId]
    );

    // Recent activities (last 10)
    const activitiesResult = await query(
      `(SELECT 'skill_added' as type, s.name as title, us.created_at
        FROM user_skills us JOIN skills s ON us.skill_id = s.id
        WHERE us.user_id = $1 ORDER BY us.created_at DESC LIMIT 3)
       UNION ALL
       (SELECT 'job_analyzed' as type, job_title as title, created_at
        FROM job_analyses WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3)
       UNION ALL
       (SELECT 'task_completed' as type, rt.title, rt.completed_at as created_at
        FROM roadmap_tasks rt JOIN roadmaps r ON rt.roadmap_id = r.id
        WHERE r.user_id = $1 AND rt.is_completed = true
        ORDER BY rt.completed_at DESC LIMIT 4)
       ORDER BY created_at DESC
       LIMIT 10`,
      [userId]
    );

    res.json({
      stats: {
        totalSkills: parseInt(skillsResult.rows[0].count),
        analyzedJobs: parseInt(jobsResult.rows[0].count),
        averageMatch: Math.round(parseFloat(matchResult.rows[0].avg_match)),
        activeRoadmaps: parseInt(roadmapsResult.rows[0].count),
        completedTasks: parseInt(tasksResult.rows[0].count)
      },
      skillDistribution: distributionResult.rows,
      recentJobs: recentJobsResult.rows,
      recentActivities: activitiesResult.rows
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/dashboard/progress
const getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Weekly learning progress (last 8 weeks)
    const weeklyProgress = await query(
      `SELECT 
        DATE_TRUNC('week', rt.completed_at) as week,
        COUNT(*) as tasks_completed,
        SUM(rt.estimated_hours) as hours_learned
       FROM roadmap_tasks rt
       JOIN roadmaps r ON rt.roadmap_id = r.id
       WHERE r.user_id = $1 AND rt.is_completed = true AND rt.completed_at IS NOT NULL
       GROUP BY DATE_TRUNC('week', rt.completed_at)
       ORDER BY week DESC
       LIMIT 8`,
      [userId]
    );

    // Job readiness comparison
    const readinessResult = await query(
      `SELECT ja.job_title, sgr.match_percentage, sgr.readiness_score, sgr.created_at
       FROM skill_gap_results sgr
       JOIN job_analyses ja ON sgr.job_analysis_id = ja.id
       WHERE sgr.user_id = $1
       ORDER BY sgr.created_at DESC
       LIMIT 6`,
      [userId]
    );

    // Proficiency breakdown
    const proficiencyResult = await query(
      `SELECT proficiency, COUNT(*) as count
       FROM user_skills
       WHERE user_id = $1
       GROUP BY proficiency`,
      [userId]
    );

    res.json({
      weeklyProgress: weeklyProgress.rows.reverse(),
      jobReadiness: readinessResult.rows,
      proficiencyBreakdown: proficiencyResult.rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getProgress };
