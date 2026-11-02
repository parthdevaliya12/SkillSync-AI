const { query } = require('../config/database');
const { generateJSON } = require('../config/gemini');

// POST /api/roadmaps/generate - Generate AI learning roadmap
const generateRoadmap = async (req, res, next) => {
  try {
    const { jobAnalysisId, skillGapId, totalWeeks, hoursPerWeek } = req.body;

    if (!skillGapId && !jobAnalysisId) {
      return res.status(400).json({ error: 'Job analysis or skill gap ID is required.' });
    }

    // Get skill gap data
    let gapData;
    if (skillGapId) {
      const gapResult = await query(
        'SELECT * FROM skill_gap_results WHERE id = $1 AND user_id = $2',
        [skillGapId, req.user.id]
      );
      if (gapResult.rows.length === 0) {
        return res.status(404).json({ error: 'Skill gap analysis not found.' });
      }
      gapData = gapResult.rows[0];
    } else {
      const gapResult = await query(
        'SELECT * FROM skill_gap_results WHERE job_analysis_id = $1 AND user_id = $2',
        [jobAnalysisId, req.user.id]
      );
      if (gapResult.rows.length === 0) {
        return res.status(404).json({ error: 'No skill gap found. Run skill gap analysis first.' });
      }
      gapData = gapResult.rows[0];
    }

    // Get job info
    const jobResult = await query(
      'SELECT job_title, company_name FROM job_analyses WHERE id = $1',
      [gapData.job_analysis_id]
    );

    const missingSkills = typeof gapData.missing_skills === 'string'
      ? JSON.parse(gapData.missing_skills)
      : gapData.missing_skills;
    const weakSkills = typeof gapData.weak_skills === 'string'
      ? JSON.parse(gapData.weak_skills)
      : gapData.weak_skills;

    const weeks = totalWeeks || 4;
    const hrsPerWeek = hoursPerWeek || 10;

    const prompt = `Create a detailed ${weeks}-week learning roadmap for someone who wants to become a ${jobResult.rows[0]?.job_title || 'developer'}.

Skills they need to LEARN (missing):
${missingSkills.map(s => `- ${s.name} (${s.importance} priority, ${s.type})`).join('\n')}

Skills they need to IMPROVE (weak):
${weakSkills.map(s => `- ${s.name} (currently ${s.userLevel}, needs improvement)`).join('\n')}

The learner has ${hrsPerWeek} hours per week available.

Return a JSON object with this structure:
{
  "title": "Learning Roadmap: [Role Name]",
  "description": "Brief description of the roadmap",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "Week theme",
      "tasks": [
        {
          "title": "Task title",
          "description": "What to learn/do",
          "skillName": "Related skill",
          "taskType": "learn|practice|project|review|assessment",
          "estimatedHours": 2,
          "priority": "high|medium|low",
          "dayNumber": 1,
          "resources": [
            {
              "title": "Resource name",
              "url": "https://example.com",
              "type": "article|video|course|documentation|tutorial|book|project",
              "provider": "Provider name",
              "isFree": true
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Create exactly ${weeks} weeks.
- Each week should have 4-6 tasks.
- Start with fundamentals, progress to advanced topics.
- Include a mix of learning, practice, and project tasks.
- Provide real, useful resource URLs when possible.
- Total hours per week should be around ${hrsPerWeek}.
- Prioritize required skills over preferred ones.
- Return valid JSON only.`;

    const roadmapData = await generateJSON(prompt);

    // Validate response
    if (!roadmapData.weeks || !Array.isArray(roadmapData.weeks)) {
      throw new Error('Invalid roadmap response structure');
    }

    // Save roadmap
    const totalHours = roadmapData.weeks.reduce((sum, week) =>
      sum + week.tasks.reduce((tSum, task) => tSum + (task.estimatedHours || 1), 0), 0
    );

    const roadmapResult = await query(
      `INSERT INTO roadmaps (user_id, job_analysis_id, skill_gap_id, title, description, total_weeks, total_hours, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING *`,
      [
        req.user.id,
        gapData.job_analysis_id,
        gapData.id,
        roadmapData.title || `Roadmap for ${jobResult.rows[0]?.job_title || 'Career'}`,
        roadmapData.description || '',
        weeks,
        totalHours
      ]
    );

    const roadmapId = roadmapResult.rows[0].id;

    // Save tasks and resources
    let orderIndex = 0;
    for (const week of roadmapData.weeks) {
      for (const task of week.tasks) {
        const taskResult = await query(
          `INSERT INTO roadmap_tasks (roadmap_id, week_number, day_number, title, description, skill_name, task_type, estimated_hours, priority, order_index)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           RETURNING id`,
          [
            roadmapId,
            week.weekNumber,
            task.dayNumber || null,
            task.title,
            task.description || '',
            task.skillName || null,
            task.taskType || 'learn',
            task.estimatedHours || 1,
            task.priority || 'medium',
            orderIndex++
          ]
        );

        // Save resources
        if (task.resources && Array.isArray(task.resources)) {
          for (const resource of task.resources) {
            await query(
              `INSERT INTO learning_resources (roadmap_task_id, title, url, resource_type, provider, is_free)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                taskResult.rows[0].id,
                resource.title,
                resource.url || null,
                resource.type || 'article',
                resource.provider || null,
                resource.isFree !== false
              ]
            );
          }
        }
      }
    }

    // Fetch complete roadmap
    const fullRoadmap = await getFullRoadmap(roadmapId);

    res.status(201).json({
      message: 'Roadmap generated successfully',
      roadmap: fullRoadmap
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get full roadmap with tasks and resources
const getFullRoadmap = async (roadmapId) => {
  const roadmap = await query('SELECT * FROM roadmaps WHERE id = $1', [roadmapId]);
  if (roadmap.rows.length === 0) return null;

  const tasks = await query(
    `SELECT rt.*, 
       COALESCE(json_agg(
         json_build_object(
           'id', lr.id, 'title', lr.title, 'url', lr.url, 
           'resourceType', lr.resource_type, 'provider', lr.provider, 'isFree', lr.is_free
         )
       ) FILTER (WHERE lr.id IS NOT NULL), '[]') as resources
     FROM roadmap_tasks rt
     LEFT JOIN learning_resources lr ON rt.id = lr.roadmap_task_id
     WHERE rt.roadmap_id = $1
     GROUP BY rt.id
     ORDER BY rt.week_number, rt.order_index`,
    [roadmapId]
  );

  return {
    ...roadmap.rows[0],
    tasks: tasks.rows
  };
};

// GET /api/roadmaps - Get all user roadmaps
const getRoadmaps = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT r.*, ja.job_title, ja.company_name,
        (SELECT COUNT(*) FROM roadmap_tasks rt WHERE rt.roadmap_id = r.id) as total_tasks,
        (SELECT COUNT(*) FROM roadmap_tasks rt WHERE rt.roadmap_id = r.id AND rt.is_completed = true) as completed_tasks
       FROM roadmaps r
       LEFT JOIN job_analyses ja ON r.job_analysis_id = ja.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json({ roadmaps: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/roadmaps/:id - Get single roadmap with tasks
const getRoadmapById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const roadmap = await query(
      `SELECT r.*, ja.job_title, ja.company_name
       FROM roadmaps r
       LEFT JOIN job_analyses ja ON r.job_analysis_id = ja.id
       WHERE r.id = $1 AND r.user_id = $2`,
      [id, req.user.id]
    );

    if (roadmap.rows.length === 0) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    const fullRoadmap = await getFullRoadmap(id);

    res.json({ roadmap: fullRoadmap });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id - Update task completion
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;

    // Verify ownership
    const taskCheck = await query(
      `SELECT rt.roadmap_id FROM roadmap_tasks rt
       JOIN roadmaps r ON rt.roadmap_id = r.id
       WHERE rt.id = $1 AND r.user_id = $2`,
      [id, req.user.id]
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const roadmapId = taskCheck.rows[0].roadmap_id;

    await query(
      `UPDATE roadmap_tasks SET 
        is_completed = $1, 
        completed_at = $2
       WHERE id = $3`,
      [isCompleted, isCompleted ? new Date() : null, id]
    );

    // Update roadmap progress
    const progressResult = await query(
      `SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_completed = true) as completed
       FROM roadmap_tasks WHERE roadmap_id = $1`,
      [roadmapId]
    );

    const { total, completed } = progressResult.rows[0];
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    const status = progress === 100 ? 'completed' : 'active';

    await query(
      'UPDATE roadmaps SET progress = $1, status = $2, updated_at = NOW() WHERE id = $3',
      [progress, status, roadmapId]
    );

    res.json({
      message: 'Task updated successfully',
      progress,
      status
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/roadmaps/:id - Delete roadmap
const deleteRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM roadmaps WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateRoadmap, getRoadmaps, getRoadmapById, updateTask, deleteRoadmap };
