import {
  getSummary,
  getDailyReportData,
  getMonthlyReportData,
  getYearlyReportData,
} from '../services/reportService.js';

export function getSummaryReport(req, res) {
  const summary = getSummary();
  res.json({ success: true, data: summary });
}

export function getDailyReport(req, res) {
  const { date } = req.query;
  const result = getDailyReportData(date || new Date().toISOString().slice(0, 10));
  res.json({ success: true, data: result });
}

export function getMonthlyReport(req, res) {
  const { month } = req.query;
  const result = getMonthlyReportData(month || new Date().toISOString().slice(0, 7));
  res.json({ success: true, data: result });
}

export function getYearlyReport(req, res) {
  const { year } = req.query;
  const result = getYearlyReportData(year || new Date().getFullYear());
  res.json({ success: true, data: result });
}
