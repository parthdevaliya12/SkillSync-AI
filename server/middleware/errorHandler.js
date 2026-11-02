const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details || err.message
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Duplicate entry. This record already exists.'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Referenced record not found.'
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Request too large.'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Internal server error';

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
