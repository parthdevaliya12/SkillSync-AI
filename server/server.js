const app = require('./app');
const { pool } = require('./config/database');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    // Don't exit - tables might already exist
  }
};

const startServer = async () => {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', result.rows[0].now);

    // Initialize schema
    await initDatabase();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 SkillSync AI Server running on port ${PORT}`);
      console.log(`📡 Local API: http://localhost:${PORT}/api`);
      console.log(`🌐 Live Render API: https://skillsync-ai-yp0s.onrender.com/api`);
      console.log(`💻 Live Vercel Frontend: https://skills-sync-ai.vercel.app`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
