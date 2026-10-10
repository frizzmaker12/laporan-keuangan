import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function generateExcelExport(data = {}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Laporan Keuangan');

  sheet.columns = [
    { header: 'Tanggal', key: 'date', width: 15 },
    { header: 'Kategori', key: 'category', width: 20 },
    { header: 'Jenis', key: 'type', width: 15 },
    { header: 'Nominal', key: 'amountIdr', width: 18 },
    { header: 'Keterangan', key: 'note', width: 30 },
  ];

  const records = data.records || [
    { date: '2026-10-10', category: 'Jajan', type: 'expense', amountIdr: 50000, note: 'Makan siang' },
    { date: '2026-10-09', category: 'Investasi', type: 'expense', amountIdr: 200000, note: 'Investasi reksadana' },
  ];

  records.forEach((row) => sheet.addRow(row));

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

export async function generatePdfExport(data = {}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    doc.fontSize(18).text('Laporan Keuangan', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Periode: ${data.period || 'Bulanan'}`);
    doc.moveDown();

    const rows = data.records || [
      ['Tanggal', 'Kategori', 'Nominal'],
      ['2026-10-10', 'Jajan', 'Rp 50.000'],
      ['2026-10-09', 'Investasi', 'Rp 200.000'],
    ];

    rows.forEach((row) => {
      doc.text(row.join(' | '));
    });

    doc.end();
  });
}

export async function generateWordExport(data = {}) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ children: [new TextRun({ text: 'Laporan Keuangan', bold: true, size: 28 })] }),
        new Paragraph({ children: [new TextRun({ text: `Periode: ${data.period || 'Bulanan'}` })] }),
        new Paragraph({ children: [new TextRun({ text: '---' })] }),
        ...((data.records || [
          { date: '2026-10-10', category: 'Jajan', amountIdr: 50000 },
          { date: '2026-10-09', category: 'Investasi', amountIdr: 200000 },
        ]).map((row) => new Paragraph({
          children: [
            new TextRun({ text: `${row.date} | ${row.category} | Rp ${Number(row.amountIdr || 0).toLocaleString('id-ID')}` }),
          ],
        }))),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}
