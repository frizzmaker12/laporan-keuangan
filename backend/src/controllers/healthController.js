export function getHealth(req, res) {
  res.json({
    success: true,
    message: 'API running normally',
    timestamp: new Date().toISOString(),
  });
}
