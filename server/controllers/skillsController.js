const { query } = require('../config/database');

// GET /api/skills - Get master skills list
const getAllSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT id, name, category, icon FROM skills';
    const params = [];
    const conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY category, name';

    const result = await query(sql, params);
    res.json({ skills: result.rows });
  } catch (error) {
    next(error);
  }
};

// GET /api/user-skills - Get user's skills
const getUserSkills = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT us.id, us.proficiency, us.years_experience, us.created_at, us.updated_at,
              s.id as skill_id, s.name, s.category, s.icon
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = $1
       ORDER BY s.category, s.name`,
      [req.user.id]
    );

    res.json({ skills: result.rows });
  } catch (error) {
    next(error);
  }
};

// POST /api/user-skills - Add skill to user
const addUserSkill = async (req, res, next) => {
  try {
    const { skillId, skillName, category, proficiency, yearsExperience } = req.body;

    if (!proficiency || !['beginner', 'intermediate', 'advanced'].includes(proficiency)) {
      return res.status(400).json({ error: 'Valid proficiency level is required (beginner, intermediate, advanced).' });
    }

    let finalSkillId = skillId;

    // If skillName is provided but no skillId, create or find the skill
    if (!finalSkillId && skillName) {
      const existing = await query('SELECT id FROM skills WHERE LOWER(name) = LOWER($1)', [skillName]);
      if (existing.rows.length > 0) {
        finalSkillId = existing.rows[0].id;
      } else {
        const created = await query(
          'INSERT INTO skills (name, category) VALUES ($1, $2) RETURNING id',
          [skillName.trim(), category || 'Other']
        );
        finalSkillId = created.rows[0].id;
      }
    }

    if (!finalSkillId) {
      return res.status(400).json({ error: 'Skill ID or skill name is required.' });
    }

    const result = await query(
      `INSERT INTO user_skills (user_id, skill_id, proficiency, years_experience)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [req.user.id, finalSkillId, proficiency, yearsExperience || 0]
    );

    // Fetch the full skill data
    const skill = await query(
      `SELECT us.id, us.proficiency, us.years_experience, us.created_at,
              s.id as skill_id, s.name, s.category, s.icon
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({
      message: 'Skill added successfully',
      skill: skill.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'You have already added this skill.' });
    }
    next(error);
  }
};

// PUT /api/user-skills/:id - Update user skill
const updateUserSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { proficiency, yearsExperience } = req.body;

    if (proficiency && !['beginner', 'intermediate', 'advanced'].includes(proficiency)) {
      return res.status(400).json({ error: 'Invalid proficiency level.' });
    }

    const result = await query(
      `UPDATE user_skills SET 
        proficiency = COALESCE($1, proficiency),
        years_experience = COALESCE($2, years_experience),
        updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING id`,
      [proficiency, yearsExperience, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    const skill = await query(
      `SELECT us.id, us.proficiency, us.years_experience, us.created_at, us.updated_at,
              s.id as skill_id, s.name, s.category, s.icon
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.id = $1`,
      [id]
    );

    res.json({
      message: 'Skill updated successfully',
      skill: skill.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/user-skills/:id - Remove user skill
const deleteUserSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query(
      'DELETE FROM user_skills WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Skill not found.' });
    }

    res.json({ message: 'Skill removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSkills, getUserSkills, addUserSkill, updateUserSkill, deleteUserSkill };
