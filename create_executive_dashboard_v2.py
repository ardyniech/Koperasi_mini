#!/usr/bin/env python3
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, LineChart, PieChart, Reference
from openpyxl.utils import get_column_letter
from datetime import datetime, timedelta
import random

excel_path = "/home/ardy/koperasi_mini/koperasi_executive_dashboard_v2.xlsx"

# Generate realistic data
def generate_data():
    random.seed(42)
    members = []
    for i in range(1, 151):
        stat = 'Aktif' if random.random() > 0.12 else 'Nonaktif'
        simpanan = random.randint(1000000, 50000000) if stat == 'Aktif' else 0
        pinjaman = random.randint(5000000, 100000000) if stat == 'Aktif' and random.random() > 0.4 else 0
        members.append([
            f'KMS{str(i).zfill(4)}', f'Anggota {i}',
            f'320{random.randint(100000000000, 999999999999)}',
            f'08{random.randint(1000000000, 9999999999)}',
            f'anggota{i}@koperasi.co.id', f'Jakarta Selatan',
            (datetime.now() - timedelta(days=random.randint(30, 1000))).strftime('%Y-%m-%d'),
            stat, simpanan, pinjaman
        ])
    
    savings = []
    for i in range(800):
        member = random.choice([m for m in members if m[7] == 'Aktif'])
        amount = random.choice([100000, 250000, 500000, 1000000, 2500000, 5000000])
        savings.append([
            f'SMP{datetime.now().strftime("%Y%m")}{str(i).zfill(6)}',
            member[0], member[1],
            (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d'),
            random.choices(['Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela'], weights=[20, 30, 50])[0],
            amount, 'Verified', ''
        ])
    
    loans = []
    for i in range(120):
        member = random.choice([m for m in members if m[7] == 'Aktif' and m[8] > 5000000])
        amount = random.choice([10000000, 25000000, 50000000, 100000000, 250000000])
        status = random.choices(['Aktif', 'Lunas', 'Menunggu', 'Macet'], weights=[50, 40, 8, 2])[0]
        loans.append([
            f'PNJ{datetime.now().strftime("%Y%m")}{str(i).zfill(5)}',
            member[0], member[1],
            (datetime.now() - timedelta(days=random.randint(0, 180))).strftime('%Y-%m-%d'),
            amount, random.choice([6, 12, 24, 36]), amount * 0.05,
            random.choice([5, 7.5, 10, 12.5]), amount/12,
            amount if status == 'Aktif' else (amount*0.3 if status == 'Macet' else 0),
            status, ''
        ])
    
    payments = []
    for loan in loans:
        if loan[9] == 'Aktif':
            for bulan in range(1, random.randint(3, 13)):
                payments.append([
                    f'ANG{datetime.now().strftime("%Y%m")}{str(len(payments)).zfill(6)}',
                    loan[0], loan[1], loan[2], bulan,
                    (datetime.now() - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d'),
                    loan[8], random.choices(['Lunas', 'Terlambat'], weights=[75, 25])[0],
                    random.randint(0, 100000) if random.random() > 0.7 else 0
                ])
    return members, savings, loans, payments

members, savings, loans, payments = generate_data()

# Professional Color Scheme
DARK_NAVY = '1E293B'
NAVY = '334155'
STEEL = '475569'
WHITE = 'FFFFFF'
EMERALD = '10B981'
RED = 'EF4444'
AMBER = 'F59E0B'
BLUE = '3B82F6'
LIGHT_GRAY = 'F8FAFC'
BORDER = 'E2E8F0'

wb = Workbook()
wb.remove(wb.active)

def fill(color):
    return PatternFill(start_color=color, end_color=color, fill_type='solid')

def border():
    return Border(
        left=Side(style='thin', color=BORDER),
        right=Side(style='thin', color=BORDER),
        top=Side(style='thin', color=BORDER),
        bottom=Side(style='thin', color=BORDER)
    )

# ============ EXECUTIVE DASHBOARD ============
ws = wb.create_sheet('Dashboard Eksekutif')

# Header
ws.merge_cells('A1:O1')
hdr = ws['A1']
hdr.value = 'KOPERASI MINI SYARIAH'
hdr.font = Font(bold=True, size=26, color=WHITE, name='Arial')
hdr.fill = fill(DARK_NAVY)
hdr.alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[1].height = 55

ws.merge_cells('A2:O2')
sub = ws['A2']
sub.value = 'DASHBOARD EKSEKUTIF MANAJEMEN'
sub.font = Font(bold=True, size=18, color=WHITE, name='Arial')
sub.fill = fill(NAVY)
sub.alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[2].height = 40

ws.merge_cells('A3:O3')
ts = ws['A3']
ts.value = f'Periode: {datetime.now().strftime("%B %Y")} | Generated: {datetime.now().strftime("%d %B %Y %H:%M")}'
ts.font = Font(size=10, color=STEEL, italic=True, name='Arial')
ts.fill = fill(LIGHT_GRAY)
ts.alignment = Alignment(horizontal='center')
ws.row_dimensions[3].height = 22

# KPI Section
ws.row_dimensions[4].height = 15

total_aset = sum(m[8] for m in members)
outstanding = sum(l[4] for l in loans if l[9] in ['Aktif', 'Macet'])
npl = (sum(l[4] for l in loans if l[9]=='Macet') / max(outstanding, 1)) * 100
collection_rate = (len([p for p in payments if p[7]=='Lunas']) / max(len(payments), 1)) * 100

kpi_layout = [
    ('👥', 'Total Anggota', f'{len([m for m in members if m[7]=="Aktif"]):,}', 'Aktif', NAVY, '↑ 8.3%'),
    ('💰', 'Total Aset', f'Rp {total_aset:,.0f}', 'Simpanan', EMERALD, '↑ 12.5%'),
    ('🏦', 'Outstanding', f'Rp {outstanding:,.0f}', 'Pinjaman', BLUE, '↓ 3.2%'),
    ('✅', 'Collection Rate', f'{collection_rate:.1f}%', 'Angsuran', EMERALD, 'Target: 90%'),
    ('⚠️', 'NPL Ratio', f'{npl:.2f}%', 'Risiko', RED if npl > 5 else AMBER, 'Batas: 5%'),
    ('📈', 'ROA', f'{random.uniform(2.8, 4.5):.2f}%', 'Profit', AMBER, 'Bervariasi'),
]

for idx, (icon, title, value, subtitle, color, trend) in enumerate(kpi_layout):
    col = 2 + (idx % 3) * 5
    row = 5 if idx < 3 else 9
    
    # Card container
    for r in range(row, row + 4):
        for c in range(col, col + 4):
            cell = ws.cell(row=r, column=c)
            cell.fill = fill(WHITE)
            cell.border = border()
    
    ws.cell(row=row, column=col).fill = fill(DARK_NAVY)
    ws.merge_cells(f'{get_column_letter(col)}{row}:{get_column_letter(col+3)}{row}')
    title_cell = ws.cell(row=row, column=col)
    title_cell.value = f'{icon} {title}'
    title_cell.font = Font(bold=True, size=12, color=WHITE, name='Arial')
    title_cell.alignment = Alignment(horizontal='center')
    
    ws.merge_cells(f'{get_column_letter(col)}{row+1}:{get_column_letter(col+3)}{row+1}')
    value_cell = ws.cell(row=row+1, column=col)
    value_cell.value = value
    value_cell.font = Font(bold=True, size=18, color=DARK_NAVY, name='Arial')
    value_cell.alignment = Alignment(horizontal='center')
    ws.row_dimensions[row+1].height = 35
    
    ws.merge_cells(f'{get_column_letter(col)}{row+2}:{get_column_letter(col+3)}{row+2}')
    sub_cell = ws.cell(row=row+2, column=col)
    sub_cell.value = subtitle
    sub_cell.font = Font(size=10, color=STEEL, name='Arial')
    sub_cell.alignment = Alignment(horizontal='center')
    
    ws.merge_cells(f'{get_column_letter(col)}{row+3}:{get_column_letter(col+3)}{row+3}')
    trend_cell = ws.cell(row=row+3, column=col)
    trend_cell.value = trend
    trend_cell.font = Font(size=9, color=color, bold=True, name='Arial')
    trend_cell.alignment = Alignment(horizontal='center')

# Portfolio Analytics
ws.row_dimensions[13].height = 20
ws.merge_cells('B14:O14')
analytics = ws['B14']
analytics.value = '📊 ANALISIS PORTOFOLIO'
analytics.font = Font(bold=True, size=16, color=DARK_NAVY, name='Arial')
analytics.fill = fill(LIGHT_GRAY)
analytics.alignment = Alignment(horizontal='center')
ws.row_dimensions[14].height = 30

# Risk Table
risk_headers = ['Kategori Risiko', 'Nominal (Rp)', 'Persentase', 'Level', 'Status']
for col, h in enumerate(risk_headers, 2):
    cell = ws.cell(row=15, column=col)
    cell.value = h
    cell.font = Font(bold=True, color=WHITE, name='Arial')
    cell.fill = fill(NAVY)
    cell.alignment = Alignment(horizontal='center')
    cell.border = border()

risk_data = [
    ('Kredit Macet', sum(l[4] for l in loans if l[9]=='Macet'), npl, 'CRITICAL', RED),
    ('Kredit Kurang Lancar', sum(l[4] for l in loans if l[9]=='Menunggu'), 3.2, 'WARNING', AMBER),
    ('Kredit Lancar', sum(l[4] for l in loans if l[9]=='Aktif'), 91.8, 'GOOD', EMERALD),
    ('Angsuran Terlambat', sum(p[6] for p in payments if p[7]=='Terlambat'), 5.5, 'MEDIUM', AMBER),
]

for row_idx, (kategori, nominal, persen, level, color) in enumerate(risk_data, 16):
    ws.cell(row=row_idx, column=2).value = kategori
    ws.cell(row=row_idx, column=2).font = Font(bold=True, name='Arial')
    ws.cell(row=row_idx, column=3).value = nominal
    ws.cell(row=row_idx, column=3).number_format = '#,##0'
    ws.cell(row=row_idx, column=4).value = f'{persen:.1f}%'
    ws.cell(row=row_idx, column=5).value = level
    ws.cell(row=row_idx, column=5).fill = fill(color)
    ws.cell(row=row_idx, column=5).font = Font(bold=True, color=WHITE if color != AMBER else DARK_NAVY, name='Arial')
    ws.cell(row=row_idx, column=5).alignment = Alignment(horizontal='center')
    ws.cell(row=row_idx, column=6).value = '●' if level == 'GOOD' else ('▲' if level == 'WARNING' else '■')
    ws.cell(row=row_idx, column=6).font = Font(color=color, size=14)
    
    for col in range(2, 7):
        ws.cell(row=row_idx, column=col).border = border()
        if row_idx % 2 == 0:
            ws.cell(row=row_idx, column=col).fill = fill(LIGHT_GRAY)

# Executive Summary
ws.row_dimensions[20].height = 20
ws.merge_cells('B21:O21')
summary = ws['B21']
summary.value = '📝 EKSEKUTIF SUMMARY'
summary.font = Font(bold=True, size=16, color=DARK_NAVY, name='Arial')
summary.fill = fill(LIGHT_GRAY)
summary.alignment = Alignment(horizontal='center')
ws.row_dimensions[21].height = 30

insights = [
    f'✓ Portofolio aset tumbuh 12.5% YoY mencapai Rp {total_aset:,.0f} dengan kualitas terjaga',
    f'⚠ NPL ratio {npl:.2f}% masih dalam batas aman (<5%) namun perlu monitoring ketat',
    f'↑ Collection rate {collection_rate:.1f}% melampaui target 90%, menunjukkan efektivitas penagihan',
    f'→ Cadangan kerugian kredit telah dialokasikan sebesar 5% dari outstanding',
    f'★ ROA {random.uniform(2.8, 4.5):.2f}% menunjukkan efisiensi operasional yang baik di industri',
]

for idx, insight in enumerate(insights, 22):
    ws.merge_cells(f'B{idx}:O{idx}')
    cell = ws[f'B{idx}']
    cell.value = insight
    cell.font = Font(size=11, name='Arial')
    cell.fill = fill(WHITE)
    cell.alignment = Alignment(wrap_text=True, vertical='center')
    cell.border = border()
    ws.row_dimensions[idx].height = 35

# ============ CHARTS SHEET ============
ws_chart = wb.create_sheet('Analitik & Charts')

# Pie Chart - Simpanan Composition
ws_chart['A1'] = 'Komposisi Simpanan'
ws_chart['A1'].font = Font(bold=True, size=14, color=DARK_NAVY, name='Arial')

simpok = sum(s[5] for s in savings if s[4] == 'Simpanan Pokok')
simwaj = sum(s[5] for s in savings if s[4] == 'Simpanan Wajib')
simsuk = sum(s[5] for s in savings if s[4] == 'Simpanan Sukarela')

ws_chart['A3'] = 'Jenis'
ws_chart['B3'] = 'Nominal'
for i, (jenis, nilai) in enumerate([('Pokok', simpok), ('Wajib', simwaj), ('Sukarela', simsuk)], 4):
    ws_chart.cell(row=i, column=1).value = jenis
    ws_chart.cell(row=i, column=2).value = nilai

pie = PieChart()
pie.title = 'Komposisi Portofolio Simpanan'
pie.style = 26
data = Reference(ws_chart, min_col=2, min_row=3, max_row=6)
cats = Reference(ws_chart, min_col=1, min_row=4, max_row=6)
pie.add_data(data, titles_from_data=True)
pie.set_categories(cats)
ws_chart.add_chart(pie, 'D3')

# Trend Chart
ws_chart['A10'] = 'Trend Keuangan 6 Bulan'
ws_chart['A10'].font = Font(bold=True, size=14, color=DARK_NAVY, name='Arial')

ws_chart['A12'] = 'Bulan'
ws_chart['B12'] = 'Simpanan'
ws_chart['C12'] = 'Pinjaman'
ws_chart['D12'] = 'Angsuran'
ws_chart['E12'] = 'Profit'

for i in range(6):
    bulan = (datetime.now() - timedelta(days=30*i)).strftime('%b %Y')
    row = 13 + i
    ws_chart.cell(row=row, column=1).value = bulan
    ws_chart.cell(row=row, column=2).value = random.randint(50000000, 200000000)
    ws_chart.cell(row=row, column=3).value = random.randint(80000000, 300000000)
    ws_chart.cell(row=row, column=4).value = random.randint(40000000, 150000000)
    ws_chart.cell(row=row, column=5).value = random.randint(5000000, 20000000)

line = LineChart()
line.title = 'Trend Keuangan'
line.style = 12
line.y_axis.title = 'Nominal (Rp)'
data = Reference(ws_chart, min_col=2, min_row=12, max_row=18, max_col=5)
cats = Reference(ws_chart, min_col=1, min_row=13, max_row=18)
line.add_data(data, titles_from_data=True)
line.set_categories(cats)
ws_chart.add_chart(line, 'G10')

# ============ DATA SHEETS ============
def add_data_sheet(name, headers, data):
    ws = wb.create_sheet(name)
    ws['A1'] = name
    ws['A1'].font = Font(bold=True, size=14, color=DARK_NAVY, name='Arial')
    ws.merge_cells(f'A1:{get_column_letter(len(headers))}1')
    
    for col, h in enumerate(headers, 1):
        cell = ws.cell(row=3, column=col)
        cell.value = h
        cell.font = Font(bold=True, color=WHITE, name='Arial')
        cell.fill = fill(NAVY)
        cell.alignment = Alignment(horizontal='center')
        cell.border = border()
    
    for row_data in data:
        ws.append(row_data)
    
    for row in ws.iter_rows(min_row=4, max_row=ws.max_row):
        for cell in row:
            cell.border = border()
            cell.font = Font(name='Arial')
            if isinstance(cell.value, (int, float)):
                cell.number_format = '#,##0'
                cell.alignment = Alignment(horizontal='right')
            if cell.row % 2 == 0:
                cell.fill = fill(LIGHT_GRAY)
    
    for col in range(1, len(headers) + 1):
        max_len = max((len(str(ws.cell(row=r, column=col).value or '')) for r in range(1, ws.max_row + 1)), default=10)
        ws.column_dimensions[get_column_letter(col)].width = min(max_len + 2, 30)

add_data_sheet('👥 Anggota', 
    ['ID', 'Nama', 'NIK', 'No HP', 'Email', 'Alamat', 'Tgl Daftar', 'Status', 'Simpanan', 'Pinjaman'],
    members)

add_data_sheet('💰 Simpanan',
    ['ID', 'ID Anggota', 'Nama', 'Tanggal', 'Jenis', 'Nominal', 'Status', 'Ket'],
    savings)

add_data_sheet('🏦 Pinjaman',
    ['ID', 'ID Anggota', 'Nama', 'Tgl Pengajuan', 'Jumlah', 'Tenor', 'Bunga', 'Margin%', 'Angsuran', 'Sisa', 'Status', 'Ket'],
    loans)

add_data_sheet('✅ Angsuran',
    ['ID', 'ID Pinjaman', 'ID Anggota', 'Nama', 'Bulan Ke', 'Tanggal', 'Nominal', 'Status', 'Denda'],
    payments)

# Save
wb.save(excel_path)
print(f'✅ Executive Dashboard v2 Created: {excel_path}')
print(f'🏛️ Features:')
print(f'   ✓ Layout Eksekutif (typography: Arial, spacing profesional)')
print(f'   ✓ 6 KPI Cards dengan trend indicators (↑↓)')
print(f'   ✓ Risk Assessment Matrix (NPL, Collection Rate)')
print(f'   ✓ Executive Summary dengan insights naratif')
print(f'   ✓ 2 Advanced Charts (Pie + Line)')
print(f'   ✓ Professional color scheme (Dark Navy + Emerald + Steel)')
print(f'   ✓ Total Records: {len(members) + len(savings) + len(loans) + len(payments)}')
