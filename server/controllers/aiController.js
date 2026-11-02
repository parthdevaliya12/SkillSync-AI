const { query } = require('../config/database');
const { generateContent } = require('../config/gemini');

// POST /api/ai/chat - Chat with AI assistant
const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Get user context
    const userSkills = await query(
      `SELECT s.name, us.proficiency 
       FROM user_skills us JOIN skills s ON us.skill_id = s.id 
       WHERE us.user_id = $1`,
      [req.user.id]
    );

    const recentJobs = await query(
      `SELECT job_title, company_name, ai_analysis 
       FROM job_analyses 
       WHERE user_id = $1 
       ORDER BY created_at DESC LIMIT 3`,
      [req.user.id]
    );

    const roadmaps = await query(
      `SELECT r.title, r.progress, r.status,
        (SELECT COUNT(*) FROM roadmap_tasks rt WHERE rt.roadmap_id = r.id AND rt.is_completed = false) as pending_tasks
       FROM roadmaps r 
       WHERE r.user_id = $1 
       ORDER BY r.created_at DESC LIMIT 3`,
      [req.user.id]
    );

    const gapResults = await query(
      `SELECT sgr.match_percentage, sgr.readiness_score, ja.job_title
       FROM skill_gap_results sgr
       JOIN job_analyses ja ON sgr.job_analysis_id = ja.id
       WHERE sgr.user_id = $1
       ORDER BY sgr.created_at DESC LIMIT 3`,
      [req.user.id]
    );

    // Get recent chat history for context
    const recentChats = await query(
      `SELECT role, content FROM chat_history 
       WHERE user_id = $1 
       ORDER BY created_at DESC LIMIT 10`,
      [req.user.id]
    );

    const chatContext = recentChats.rows.reverse().map(c => `${c.role}: ${c.content}`).join('\n');

    const prompt = `You are SkillSync AI, an intelligent career development assistant. You help users with career guidance, skill development, and learning recommendations.

USER PROFILE:
- Name: ${req.user.full_name}
- Skills: ${userSkills.rows.map(s => `${s.name} (${s.proficiency})`).join(', ') || 'No skills added yet'}

RECENT JOB ANALYSES:
${recentJobs.rows.map(j => `- ${j.job_title} at ${j.company_name || 'N/A'}`).join('\n') || 'No job analyses yet'}

SKILL GAP RESULTS:
${gapResults.rows.map(g => `- ${g.job_title}: ${g.match_percentage}% match, ${g.readiness_score}% readiness`).join('\n') || 'No skill gap analyses yet'}

ACTIVE ROADMAPS:
${roadmaps.rows.map(r => `- ${r.title}: ${r.progress}% complete, ${r.pending_tasks} tasks remaining`).join('\n') || 'No roadmaps yet'}

RECENT CONVERSATION:
${chatContext || 'No previous conversation'}

USER MESSAGE: ${message}

Provide helpful, personalized career advice based on the user's profile and data. Be encouraging, specific, and actionable. Keep responses concise (2-4 paragraphs max) unless the user asks for detailed information. Use markdown formatting for better readability.`;

    const response = await generateContent(prompt);

    // Save chat history
    await query(
      'INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)',
      [req.user.id, 'user', message]
    );
    await query(
      'INSERT INTO chat_history (user_id, role, content) VALUES ($1, $2, $3)',
      [req.user.id, 'assistant', response]
    );

    res.json({
      message: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/ai/history - Get chat history
const getHistory = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const result = await query(
      `SELECT id, role, content, created_at 
       FROM chat_history 
       WHERE user_id = $1 
       ORDER BY created_at ASC 
       LIMIT $2`,
      [req.user.id, parseInt(limit)]
    );

    res.json({ history: result.rows });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/ai/history - Clear chat history
const clearHistory = async (req, res, next) => {
  try {
    await query('DELETE FROM chat_history WHERE user_id = $1', [req.user.id]);
    res.json({ message: 'Chat history cleared.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { chat, getHistory, clearHistory };
