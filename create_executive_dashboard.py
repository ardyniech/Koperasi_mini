#!/usr/bin/env python3
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, GradientFill
from openpyxl.chart import BarChart, LineChart, PieChart, Reference, ScatterChart, Series
from openpyxl.chart.label import DataLabelList
from openpyxl.formatting.rule import DataBarRule, ColorScaleRule, CellIsRule, FormulaRule
from openpyxl.styles.differential import DifferentialStyle
from datetime import datetime, timedelta
import random
from openpyxl.utils import get_column_letter

excel_path = "/home/ardy/koperasi_mini/koperasi_executive_dashboard.xlsx"

# Generate data
def generate_data():
    members = []
    for i in range(1, 101):
        stat = 'Aktif' if random.random() > 0.15 else 'Nonaktif'
        m = [f'KMS{str(i).zfill(4)}', f'Anggota {i}', 
             f'320{str(random.randint(100000000000, 999999999999))}',
             f'08{random.randint(1000000000, 9999999999)}',
             f'anggota{i}@example.com', f'Jl. Contoh No. {i}',
             (datetime.now() - timedelta(days=random.randint(30, 730))).strftime('%Y-%m-%d'),
             stat, 0, 0]
        members.append(m)
    
    savings = []
    for i in range(500):
        member = random.choice([m for m in members if m[7] == 'Aktif'])
        amount = random.choice([100000, 250000, 500000, 1000000, 2500000, 5000000])
        date = (datetime.now() - timedelta(days=random.randint(0, 365))).strftime('%Y-%m-%d')
        jenis = random.choices(['Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela'], 
                              weights=[20, 30, 50])[0]
        savings.append([f'SMP{datetime.now().strftime("%Y%m")}{str(i).zfill(5)}',
                       member[0], member[1], date, jenis, amount, 'Verified', ''])
        idx = next(i for i, m in enumerate(members) if m[0] == member[0])
        members[idx][8] += amount
    
    loans = []
    for i in range(80):
        member = random.choice([m for m in members if m[7] == 'Aktif' and m[8] > 5000000])
        amount = random.choice([5000000, 10000000, 25000000, 50000000, 100000000])
        date = (datetime.now() - timedelta(days=random.randint(0, 180))).strftime('%Y-%m-%d')
        tenor = random.choice([6, 12, 24, 36, 60])
        status = random.choices(['Aktif', 'Lunas', 'Menunggu Persetujuan', 'Macet'], 
                                weights=[50, 40, 8, 2])[0]
        margin = random.choice([5, 7.5, 10, 12.5])
        angsuran = amount / tenor
        sisa = amount if status == 'Aktif' else (amount * 0.3 if status == 'Macet' else 0)
        loans.append([f'PNJ{datetime.now().strftime("%Y%m")}{str(i).zfill(4)}',
                     member[0], member[1], date, amount, tenor, 0, margin, 
                     angsuran, sisa, status, ''])
        if status in ['Aktif', 'Macet']:
            idx = next(i for i, m in enumerate(members) if m[0] == member[0])
            members[idx][9] += amount
    
    payments = []
    for loan in loans:
        if loan[10] == 'Aktif':
            for bulan in range(1, random.randint(3, int(loan[5]) + 1)):
                status_bayar = random.choices(['Lunas', 'Terlambat', 'Belum Bayar'], 
                                             weights=[70, 25, 5])[0]
                payments.append([
                    f'ANG{datetime.now().strftime("%Y%m")}{str(len(payments)).zfill(5)}',
                    loan[0], loan[1], loan[2], bulan,
                    (datetime.now() - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d'),
                    loan[8], status_bayar, 
                    50000 if status_bayar == 'Terlambat' else 0
                ])
    
    return members, savings, loans, payments

members, savings, loans, payments = generate_data()

# Color Palette (Professional)
DARK_NAVY = '1E293B'
NAVY = '334155'
LIGHT_NAVY = '475569'
WHITE = 'FFFFFF'
GREEN = '059669'
LIGHT_GREEN = 'D1FAE5'
RED = 'DC2626'
LIGHT_RED = 'FEE2E2'
YELLOW = 'D97706'
LIGHT_YELLOW = 'FEF3C7'
BLUE = '2563EB'
LIGHT_BLUE = 'DBEAFE'
GRAY = '6B7280'
LIGHT_GRAY = 'F9FAFB'
BORDER_GRAY = 'E5E7EB'

def get_fill(color):
    return PatternFill(start_color=color, end_color=color, fill_type='solid')

def get_gradient_fill(color1, color2):
    return GradientFill(stop=(color1, color2))

def get_border():
    return Border(
        left=Side(style='thin', color=BORDER_GRAY),
        right=Side(style='thin', color=BORDER_GRAY),
        top=Side(style='thin', color=BORDER_GRAY),
        bottom=Side(style='thin', color=BORDER_GRAY)
    )

def auto_width(ws):
    for col in range(1, ws.max_column + 1):
        max_len = 0
        col_letter = get_column_letter(col)
        for row in range(1, ws.max_row + 1):
            cell = ws.cell(row=row, column=col)
            if cell.value:
                max_len = max(max_len, len(str(cell.value)))
        ws.column_dimensions[col_letter].width = min(max_len + 2, 35)

# ============ EXECUTIVE DASHBOARD ============
wb = Workbook()
wb.remove(wb.active)

ws = wb.create_sheet('🏛️ Executive Dashboard')

# ========== HEADER SECTION ==========
ws.merge_cells('A1:O1')
header = ws['A1']
header.value = 'KOPERASI MINI SYARIAH'
header.font = Font(bold=True, size=24, color=WHITE)
header.fill = get_fill(DARK_NAVY)
header.alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[1].height = 50

ws.merge_cells('A2:O2')
subheader = ws['A2']
subheader.value = 'EXECUTIVE MANAGEMENT DASHBOARD'
subheader.font = Font(bold=True, size=16, color=LIGHT_NAVY)
subheader.fill = get_fill(NAVY)
subheader.alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[2].height = 35

ws.merge_cells('A3:O3')
timestamp = ws['A3']
timestamp.value = f'Report Generated: {datetime.now().strftime("%A, %d %B %Y %H:%M:%S")} | Data Refresh: Real-time'
timestamp.font = Font(italic=True, color=GRAY, size=10)
timestamp.fill = get_fill(LIGHT_GRAY)
timestamp.alignment = Alignment(horizontal='center')
ws.row_dimensions[3].height = 20

# ========== KPI SECTION (Row 5-12) ==========
ws.row_dimensions[4].height = 10  # Spacer

kpi_cards = [
    ('👥', 'Total Anggota', len([m for m in members if m[7] == 'Aktif']), 'Aktif', NAVY, '↑ 12% vs bln lalu'),
    ('💰', 'Total Aset (Rp)', f"{sum(m[8] for m in members):,.0f}", 'Simpanan', GREEN, '↑ 8.5% growth'),
    ('🏦', 'Outstanding (Rp)', f"{sum(l[4] for l in loans if l[10] in ['Aktif', 'Macet']):,.0f}", 'Pinjaman', BLUE, '↓ 3.2% risk'),
    ('✅', 'Angsuran Bulan Ini', f"{sum(p[6] for p in payments if p[5].startswith(datetime.now().strftime('%Y-%m'))):,.0f}", 'Collected', GREEN, '94% collection rate'),
    ('⚠️', 'NPL Ratio', f"{(sum(l[4] for l in loans if l[10]=='Macet') / max(sum(l[4] for l in loans if l[10] in ['Aktif','Macet']), 1)) * 100:.1f}%", 'NPL', RED, 'Below 5% threshold'),
    ('📈', 'ROA', f"{random.uniform(2.5, 4.8):.2f}%", 'Return', YELLOW, 'Healthy range'),
]

for idx, (icon, title, value, subtitle, color, trend) in enumerate(kpi_cards):
    col_start = 2 + (idx % 3) * 5
    col_end = col_start + 3
    row = 5 if idx < 3 else 9
    
    # Card background
    for r in range(row, row + 3):
        for c in range(col_start, col_end):
            cell = ws.cell(row=r, column=c)
            cell.fill = get_fill(LIGHT_GRAY if r % 2 == 0 else WHITE)
            cell.border = get_border()
    
    # Icon & Title
    ws.merge_cells(f'{get_column_letter(col_start)}{row}:{get_column_letter(col_end)}{row}')
    title_cell = ws.cell(row=row, column=col_start)
    title_cell.value = f"{icon} {title}"
    title_cell.font = Font(bold=True, size=12, color=color)
    title_cell.alignment = Alignment(horizontal='center')
    
    # Value
    ws.merge_cells(f'{get_column_letter(col_start)}{row+1}:{get_column_letter(col_end)}{row+1}')
    value_cell = ws.cell(row=row+1, column=col_start)
    value_cell.value = value
    value_cell.font = Font(bold=True, size=20, color=DARK_NAVY)
    value_cell.alignment = Alignment(horizontal='center')
    ws.row_dimensions[row+1].height = 30
    
    # Subtitle & Trend
    ws.merge_cells(f'{get_column_letter(col_start)}{row+2}:{get_column_letter(col_end)}{row+2}')
    sub_cell = ws.cell(row=row+2, column=col_start)
    sub_cell.value = f"{subtitle} | {trend}"
    sub_cell.font = Font(size=9, color=GRAY, italic=True)
    sub_cell.alignment = Alignment(horizontal='center')

# ========== RISK ASSESSMENT (Row 14-22) ==========
ws.row_dimensions[13].height = 15

ws.merge_cells('B14:O14')
risk_title = ws['B14']
risk_title.value = '⚠️ RISK ASSESSMENT MATRIX'
risk_title.font = Font(bold=True, size=14, color=DARK_NAVY)
risk_title.fill = get_fill(LIGHT_YELLOW)
risk_title.alignment = Alignment(horizontal='center')
ws.row_dimensions[14].height = 25

# Risk categories
risk_data = [
    ('Kredit Macet', sum(l[4] for l in loans if l[10]=='Macet'), RED, 'Critical'),
    ('Angsuran Terlambat', sum(p[6] for p in payments if p[7]=='Terlambat'), YELLOW, 'Medium'),
    ('Pinjaman Ditolak', len([l for l in loans if l[10]=='Menunggu Persetujuan']), GRAY, 'Low'),
    ('Likuiditas', random.randint(70, 95), GREEN, 'Good'),
]

for idx, (risk, value, color, level) in enumerate(risk_data):
    row = 15 + idx
    ws.cell(row=row, column=2).value = risk
    ws.cell(row=row, column=2).font = Font(bold=True)
    ws.cell(row=row, column=3).value = value
    ws.cell(row=row, column=3).number_format = '#,##0'
    ws.cell(row=row, column=3).font = Font(color=color, bold=True)
    ws.cell(row=row, column=4).value = level
    ws.cell(row=row, column=4).fill = get_fill(color)
    ws.cell(row=row, column=4).font = Font(bold=True, color=WHITE if color != YELLOW else DARK_NAVY)
    ws.cell(row=row, column=4).alignment = Alignment(horizontal='center')
    
    # Heat bar visualization (simulated dengan cell fill)
    bar_length = int(value / max(sum(l[4] for l in loans if l[10]=='Macet') if 'Macet' in risk else 1e6 * 20)
    for c in range(5, min(5 + bar_length, 15)):
        ws.cell(row=row, column=c).fill = get_fill(LIGHT_RED if color == RED else LIGHT_YELLOW if color == YELLOW else LIGHT_GREEN)

# ========== EXECUTIVE SUMMARY (Row 24-32) ==========
ws.row_dimensions[22].height = 15

ws.merge_cells('B24:O24')
summary_title = ws['B24']
summary_title.value = '📝 EXECUTIVE SUMMARY'
summary_title.font = Font(bold=True, size=14, color=DARK_NAVY)
summary_title.fill = get_fill(LIGHT_BLUE)
summary_title.alignment = Alignment(horizontal='center')
ws.row_dimensions[24].height = 25

summary_insights = [
    f"✓ Total aset meningkat 8.5% mencapai Rp {sum(m[8] for m in members):,.0f} dibanding periode sama tahun lalu",
    f"⚠ NPL ratio saat ini {(sum(l[4] for l in loans if l[10]=='Macet') / max(sum(l[4] for l in loans if l[10] in ['Aktif','Macet']), 1)) * 100:.1f}%, masih dalam batas aman (<5%)",
    f"↑ Collection rate bulan ini 94%, melebihi target 90% yang ditetapkan",
    f"→ Disarankan menambah cadangan kerugian kredit sebesar 5% dari outstanding",
    f"★ ROA {random.uniform(2.5, 4.8):.2f}% menunjukkan efisiensi operasional yang baik",
]

for idx, insight in enumerate(summary_insights):
    row = 25 + idx
    ws.merge_cells(f'B{row}:O{row}')
    cell = ws[f'B{row}']
    cell.value = insight
    cell.font = Font(size=11)
    cell.fill = get_fill(WHITE if idx % 2 == 0 else LIGHT_GRAY)
    cell.alignment = Alignment(wrap_text=True, vertical='center')
    cell.border = get_border()
    ws.row_dimensions[row].height = 30

# ========== CHARTS SECTION ==========
ws_charts = wb.create_sheet('📊 Analytics')

# 1. Portfolio Composition (Pie)
ws_charts['A1'] = 'Komposisi Portofolio Simpanan'
ws_charts['A1'].font = Font(bold=True, size=14, color=DARK_NAVY)
simpok = sum(s[5] for s in savings if s[4] == 'Simpanan Pokok')
simwaj = sum(s[5] for s in savings if s[4] == 'Simpanan Wajib')
simsuk = sum(s[5] for s in savings if s[4] == 'Simpanan Sukarela')
ws_charts['A3'] = 'Jenis'
ws_charts['B3'] = 'Nominal'
ws_charts['A4'] = 'Simpanan Pokok'
ws_charts['B4'] = simpok
ws_charts['A5'] = 'Simpanan Wajib'
ws_charts['B5'] = simwaj
ws_charts['A6'] = 'Simpanan Sukarela'
ws_charts['B6'] = simsuk

pie = PieChart()
pie.title = 'Portfolio Composition'
pie.style = 26
data = Reference(ws_charts, min_col=2, min_row=3, max_row=6)
cats = Reference(ws_charts, min_col=1, min_row=4, max_row=6)
pie.add_data(data, titles_from_data=True)
pie.set_categories(cats)
pie.dataLabels = DataLabelList()
pie.dataLabels.showCatName = True
pie.dataLabels.showPercent = True
ws_charts.add_chart(pie, 'D3')

# 2. Loan Performance (Bar + Line Combo)
ws_charts['A10'] = 'Performa Pinjaman per Bulan'
ws_charts['A10'].font = Font(bold=True, size=14, color=DARK_NAVY)
ws_charts['A12'] = 'Bulan'
ws_charts['B12'] = 'Disetujui'
ws_charts['C12'] = 'Ditolak'
ws_charts['D12'] = 'Macet'

months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
for i, m in enumerate(months):
    row = 13 + i
    ws_charts.cell(row=row, column=1).value = m
    ws_charts.cell(row=row, column=2).value = random.randint(5, 15)
    ws_charts.cell(row=row, column=3).value = random.randint(1, 5)
    ws_charts.cell(row=row, column=4).value = random.randint(0, 2)

bar = BarChart()
bar.title = 'Loan Performance Trend'
bar.style = 11
bar.y_axis.title = 'Jumlah Pinjaman'
data = Reference(ws_charts, min_col=2, min_row=12, max_row=18, max_col=4)
cats = Reference(ws_charts, min_col=1, min_row=13, max_row=18)
bar.add_data(data, titles_from_data=True)
bar.set_categories(cats)
ws_charts.add_chart(bar, 'D10')

# 3. Financial Trend (Line Chart)
ws_charts['A22'] = 'Trend Keuangan 6 Bulan Terakhir'
ws_charts['A22'].font = Font(bold=True, size=14, color=DARK_NAVY)
ws_charts['A24'] = 'Bulan'
ws_charts['B24'] = 'Simpanan'
ws_charts['C24'] = 'Pinjaman'
ws_charts['D24'] = 'Angsuran'
ws_charts['E24'] = 'Profit'

for i in range(6):
    month_date = datetime.now() - timedelta(days=30*i)
    bulan = month_date.strftime('%b %Y')
    row = 25 + i
    ws_charts.cell(row=row, column=1).value = bulan
    ws_charts.cell(row=row, column=2).value = random.randint(20000000, 80000000)
    ws_charts.cell(row=row, column=3).value = random.randint(30000000, 100000000)
    ws_charts.cell(row=row, column=4).value = random.randint(15000000, 50000000)
    ws_charts.cell(row=row, column=5).value = random.randint(1000000, 5000000)

line = LineChart()
line.title = 'Financial Trend Analysis'
line.style = 12
line.y_axis.title = 'Nominal (Rp)'
line.x_axis.title = 'Bulan'
data = Reference(ws_charts, min_col=2, min_row=24, max_row=30, max_col=5)
cats = Reference(ws_charts, min_col=1, min_row=25, max_row=30)
line.add_data(data, titles_from_data=True)
line.set_categories(cats)
ws_charts.add_chart(line, 'G10')

auto_width(ws_charts)

# ========== DATA SHEETS (with conditional formatting) ==========
def add_advanced_sheet(name, headers, data, title):
    ws = wb.create_sheet(name)
    ws['A1'] = title
    ws['A1'].font = Font(bold=True, size=14, color=DARK_NAVY)
    ws.merge_cells(f'A1:{get_column_letter(len(headers))}1')
    
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=3, column=col)
        cell.value = header
        cell.font = Font(bold=True, color=WHITE)
        cell.fill = get_fill(NAVY)
        cell.alignment = Alignment(horizontal='center')
        cell.border = get_border()
    
    for row_data in data:
        ws.append(row_data)
    
    for row in ws.iter_rows(min_row=4, max_row=ws.max_row):
        for cell in row:
            cell.border = get_border()
            if isinstance(cell.value, (int, float)):
                cell.number_format = '#,##0'
                cell.alignment = Alignment(horizontal='right')
    
    # Conditional formatting untuk kolom numerik
    if len(data) > 0:
        # Data bars untuk kolom terakhir
        ws.conditional_formatting.add(
            f'{get_column_letter(len(headers))}4:{get_column_letter(len(headers))}{ws.max_row}',
            DataBarRule(start_type='min', end_type='max', color=BLUE)
        )
    
    auto_width(ws)

add_advanced_sheet('👥 Anggota', 
    ['ID', 'Nama', 'NIK', 'No HP', 'Email', 'Alamat', 'Tgl Daftar', 'Status', 'Total Simpanan', 'Total Pinjaman'],
    members, 'DATA ANGGOTA (100 Records)')

add_advanced_sheet('💰 Simpanan',
    ['ID Transaksi', 'ID Anggota', 'Nama', 'Tanggal', 'Jenis', 'Nominal', 'Status', 'Ket'],
    savings, 'DATA TRANSAKSI SIMPANAN (500 Records)')

add_advanced_sheet('🏦 Pinjaman',
    ['ID Pinjaman', 'ID Anggota', 'Nama', 'Tgl Pengajuan', 'Jumlah', 'Tenor', 'Bunga%', 'Margin%', 'Angsuran/Bulan', 'Sisa', 'Status', 'Ket'],
    loans, 'DATA PINJAMAN (80 Records)')

add_advanced_sheet('✅ Angsuran',
    ['ID Angsuran', 'ID Pinjaman', 'ID Anggota', 'Nama', 'Bulan Ke', 'Tanggal', 'Nominal', 'Status', 'Denda'],
    payments, 'DATA ANGSURAN')

# Save
wb.save(excel_path)
print(f"✅ Executive Dashboard Created: {excel_path}")
print(f"🏛️ Features:")
print(f"   ✓ Executive-level layout dengan professional color scheme")
print(f"   ✓ 6 KPI cards dengan trend indicators & icons")
print(f"   ✓ Risk Assessment Matrix (Heat map style)")
print(f"   ✓ Executive Summary dengan insights naratif")
print(f"   ✓ 3 Advanced Charts (Pie, Bar, Line)")
print(f"   ✓ Data Bars conditional formatting")
print(f"   ✓ Total Records: {len(members) + len(savings) + len(loans) + len(payments)}")
print(f"   ✓ Professional typography & spacing")
