import { generateExcelExport, generatePdfExport, generateWordExport } from '../services/exportService.js';

export async function exportExcelReport(req, res) {
  try {
    const buffer = await generateExcelExport(req.body || {});
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="laporan-keuangan.xlsx"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function exportPdfReport(req, res) {
  try {
    const buffer = await generatePdfExport(req.body || {});
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="laporan-keuangan.pdf"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function exportWordReport(req, res) {
  try {
    const buffer = await generateWordExport(req.body || {});
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="laporan-keuangan.docx"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
