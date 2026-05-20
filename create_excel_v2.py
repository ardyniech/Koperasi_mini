#!/usr/bin/env python3
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side, GradientFill
from openpyxl.chart import BarChart, LineChart, PieChart, Reference
from openpyxl.styles.numbers import FORMAT_PERCENTAGE
from openpyxl.utils import get_column_letter
from datetime import datetime, timedelta
import random

excel_path = "/home/ardy/koperasi_mini/koperasi_mini_management_v2.xlsx"

def generate_data():
    members = []
    for i in range(1, 51):
        m = [f'KMS{str(i).zfill(3)}', f'Anggota {i}',
             f'320{str(random.randint(100000000000, 999999999999))}',
             f'08{random.randint(1000000000, 9999999999)}',
             f'anggota{i}@example.com', f'Jalan Contoh No. {i}',
             (datetime.now() - timedelta(days=random.randint(30, 365))).strftime('%Y-%m-%d'),
             random.choice(['Aktif', 'Aktif', 'Aktif', 'Nonaktif']), 0, 0]
        members.append(m)
    
    savings = []
    for i in range(200):
        member = random.choice(members)
        amount = random.choice([50000, 100000, 250000, 500000, 1000000])
        date = (datetime.now() - timedelta(days=random.randint(0, 180))).strftime('%Y-%m-%d')
        savings.append([
            f'SMP{datetime.now().strftime("%Y%m")}{str(i).zfill(4)}', member[0], member[1], date,
            random.choice(['Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela']), amount, 'Verified', ''
        ])
        idx = next(i for i, m in enumerate(members) if m[0] == member[0])
        members[idx][8] += amount
    
    loans = []
    for i in range(30):
        member = random.choice(members)
        amount = random.choice([1000000, 2500000, 5000000, 10000000])
        date = (datetime.now() - timedelta(days=random.randint(0, 90))).strftime('%Y-%m-%d')
        tenor = random.choice([6, 12, 24])
        status = random.choice(['Aktif', 'Lunas', 'Menunggu Persetujuan'])
        loans.append([
            f'PNJ{datetime.now().strftime("%Y%m")}{str(i).zfill(3)}',
            member[0], member[1], date, amount, tenor, 0, random.choice([5, 7, 10]), 
            amount/tenor, amount if status == 'Aktif' else 0, status, ''
        ])
        if status == 'Aktif':
            idx = next(i for i, m in enumerate(members) if m[0] == member[0])
            members[idx][9] += amount
    
    payments = []
    for loan in loans:
        if loan[10] == 'Aktif':
            for bulan in range(1, random.randint(1, int(loan[5]) + 1)):
                payments.append([
                    f'ANG{datetime.now().strftime("%Y%m")}{str(len(payments)).zfill(4)}',
                    loan[0], loan[1], loan[2], bulan,
                    (datetime.now() - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d'),
                    loan[8], random.choice(['Lunas', 'Lunas', 'Terlambat']), 0
                ])
    return members, savings, loans, payments

members, savings, loans, payments = generate_data()

wb = Workbook()
wb.remove(wb.active)

# Color Palette
DARK_BLUE = '1E40AF'
LIGHT_BLUE = '3B82F6'
GREEN = '10B981'
RED = 'EF4444'
YELLOW = 'F59E0B'
GRAY = '6B7280'
WHITE = 'FFFFFF'
LIGHT_GRAY = 'F3F4F6'

def get_fill(color):
    return PatternFill(start_color=color, end_color=color, fill_type='solid')

def get_border():
    return Border(left=Side(style='thin', color=LIGHT_GRAY), 
                  right=Side(style='thin', color=LIGHT_GRAY),
                  top=Side(style='thin', color=LIGHT_GRAY), 
                  bottom=Side(style='thin', color=LIGHT_GRAY))

def auto_width(ws, min_col=1, max_col=None):
    if max_col is None:
        max_col = ws.max_column
    for col in range(min_col, max_col + 1):
        max_len = 0
        for row in range(1, ws.max_row + 1):
            cell = ws.cell(row=row, column=col)
            if cell.value:
                max_len = max(max_len, len(str(cell.value)))
        ws.column_dimensions[get_column_letter(col)].width = min(max_len + 2, 30)

# ============ DASHBOARD SHEET ============
ws = wb.create_sheet('📊 Dashboard')

# Title
ws.merge_cells('A1:H1')
title_cell = ws['A1']
title_cell.value = 'KOPERASI MINI SYARIAH - MANAGEMENT DASHBOARD'
title_cell.font = Font(bold=True, size=18, color=WHITE)
title_cell.fill = get_fill(DARK_BLUE)
title_cell.alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[1].height = 40

# Date
ws.merge_cells('A2:H2')
date_cell = ws['A2']
date_cell.value = f'Generated: {datetime.now().strftime("%d %B %Y %H:%M")}'
date_cell.font = Font(italic=True, color=GRAY, size=10)
date_cell.alignment = Alignment(horizontal='center')
ws.row_dimensions[2].height = 20

# KPI Cards (Row 4-8)
kpi_data = [
    ('Total Anggota Aktif', len([m for m in members if m[7] == 'Aktif']), DARK_BLUE, '👥'),
    ('Total Simpanan', f"Rp {sum(m[8] for m in members):,}", GREEN, '💰'),
    ('Pinjaman Aktif', f"Rp {sum(l[4] for l in loans if l[10] == 'Aktif'):,}", LIGHT_BLUE, '🏦'),
    ('Menunggu Persetujuan', len([l for l in loans if l[10] == 'Menunggu Persetujuan']), YELLOW, '⏳'),
    ('Angsuran Bulan Ini', f"Rp {sum(p[6] for p in payments if p[5].startswith(datetime.now().strftime('%Y-%m'))):,}", GREEN, '✅'),
]

for idx, (label, value, color, icon) in enumerate(kpi_data):
    row = 4 + idx * 2
    col_start = 2 if idx < 3 else 5
    col_end = 4 if idx < 3 else 7
    
    ws.merge_cells(f'{get_column_letter(col_start)}{row}:{get_column_letter(col_end)}{row}')
    cell = ws.cell(row=row, column=col_start)
    cell.value = f"{icon} {label}"
    cell.font = Font(bold=True, color=WHITE, size=11)
    cell.fill = get_fill(color)
    cell.alignment = Alignment(horizontal='center')
    ws.row_dimensions[row].height = 25
    
    ws.merge_cells(f'{get_column_letter(col_start)}{row+1}:{get_column_letter(col_end)}{row+1}')
    cell = ws.cell(row=row+1, column=col_start)
    cell.value = value
    cell.font = Font(bold=True, size=14, color=color)
    cell.alignment = Alignment(horizontal='center')
    ws.row_dimensions[row+1].height = 30

# Quick Stats (Row 16+)
ws.merge_cells('B16:E16')
stat_title = ws['B16']
stat_title.value = '📈 STATISTIK CEPAT'
stat_title.font = Font(bold=True, size=14, color=DARK_BLUE)
stat_title.alignment = Alignment(horizontal='center')

stats = [
    ('Simpanan Pokok', sum(s[5] for s in savings if s[4] == 'Simpanan Pokok'), GREEN),
    ('Simpanan Wajib', sum(s[5] for s in savings if s[4] == 'Simpanan Wajib'), GREEN),
    ('Simpanan Sukarela', sum(s[5] for s in savings if s[4] == 'Simpanan Sukarela'), GREEN),
    ('Pinjaman Lunas', sum(l[4] for l in loans if l[10] == 'Lunas'), LIGHT_BLUE),
    ('Estimasi Macet (5%)', sum(l[4] for l in loans if l[10] == 'Aktif') * 0.05, RED),
    ('Angsuran Terlambat', sum(p[6] for p in payments if p[7] == 'Terlambat'), RED),
]

for idx, (label, value, color) in enumerate(stats):
    row = 17 + idx
    ws.cell(row=row, column=2).value = label
    ws.cell(row=row, column=2).font = Font(bold=True)
    ws.cell(row=row, column=3).value = value
    ws.cell(row=row, column=3).number_format = '#,##0'
    ws.cell(row=row, column=3).font = Font(color=color, bold=True)
    ws.cell(row=row, column=3).alignment = Alignment(horizontal='right')
    ws.cell(row=row, column=4).value = 'Rp'

# Pie Chart - Simpanan by Type
ws_pie = wb.create_sheet('📊 Charts')
ws_pie['A1'] = 'Simpanan by Jenis'
ws_pie['A1'].font = Font(bold=True, size=14, color=DARK_BLUE)

simpok = sum(s[5] for s in savings if s[4] == 'Simpanan Pokok')
simwaj = sum(s[5] for s in savings if s[4] == 'Simpanan Wajib')
simsuk = sum(s[5] for s in savings if s[4] == 'Simpanan Sukarela')

ws_pie['A3'] = 'Jenis'
ws_pie['B3'] = 'Nominal'
ws_pie['A4'] = 'Simpanan Pokok'
ws_pie['B4'] = simpok
ws_pie['A5'] = 'Simpanan Wajib'
ws_pie['B5'] = simwaj
ws_pie['A6'] = 'Simpanan Sukarela'
ws_pie['B6'] = simsuk

pie = PieChart()
pie.title = 'Komposisi Simpanan'
pie.style = 10
data = Reference(ws_pie, min_col=2, min_row=3, max_row=6)
cats = Reference(ws_pie, min_col=1, min_row=4, max_row=6)
pie.add_data(data, titles_from_data=True)
pie.set_categories(cats)
ws_pie.add_chart(pie, 'D3')

# Bar Chart - Pinjaman by Status
ws_pie['A8'] = 'Status Pinjaman'
ws_pie['A8'].font = Font(bold=True, size=14, color=DARK_BLUE)
ws_pie['A10'] = 'Aktif'
ws_pie['B10'] = sum(l[4] for l in loans if l[10] == 'Aktif')
ws_pie['A11'] = 'Lunas'
ws_pie['B11'] = sum(l[4] for l in loans if l[10] == 'Lunas')
ws_pie['A12'] = 'Menunggu'
ws_pie['B12'] = sum(l[4] for l in loans if l[10] == 'Menunggu Persetujuan')

bar = BarChart()
bar.title = 'Pinjaman by Status'
bar.style = 11
bar.y_axis.title = 'Nominal (Rp)'
data = Reference(ws_pie, min_col=2, min_row=9, max_row=12)
cats = Reference(ws_pie, min_col=1, min_row=10, max_row=12)
bar.add_data(data, titles_from_data=True)
bar.set_categories(cats)
ws_pie.add_chart(bar, 'D10')

# Line Chart - Trend 6 Bulan
ws_pie['A14'] = 'Laporan Keuangan 6 Bulan'
ws_pie['A14'].font = Font(bold=True, size=14, color=DARK_BLUE)
ws_pie['A16'] = 'Bulan'
ws_pie['B16'] = 'Simpanan'
ws_pie['C16'] = 'Pinjaman'
ws_pie['D16'] = 'Angsuran'
ws_pie['E16'] = 'Profit'

for i in range(6):
    month_date = datetime.now() - timedelta(days=30*i)
    bulan = month_date.strftime('%b %Y')
    simpan = random.randint(5000000, 20000000)
    pinjam = random.randint(10000000, 30000000)
    angsur = random.randint(5000000, 15000000)
    profit = int(angsur * 0.07)
    row = 17 + i
    ws_pie.cell(row=row, column=1).value = bulan
    ws_pie.cell(row=row, column=2).value = simpan
    ws_pie.cell(row=row, column=3).value = pinjam
    ws_pie.cell(row=row, column=4).value = angsur
    ws_pie.cell(row=row, column=5).value = profit

line = LineChart()
line.title = 'Trend Keuangan'
line.style = 12
line.y_axis.title = 'Nominal (Rp)'
line.x_axis.title = 'Bulan'
data = Reference(ws_pie, min_col=2, min_row=16, max_row=22, max_col=5)
cats = Reference(ws_pie, min_col=1, min_row=17, max_row=22)
line.add_data(data, titles_from_data=True)
line.set_categories(cats)
ws_pie.add_chart(line, 'G3')

auto_width(ws_pie)

# ============ DATA SHEETS ============
def add_data_sheet(name, headers, data, title):
    ws = wb.create_sheet(name)
    ws['A1'] = title
    ws['A1'].font = Font(bold=True, size=14, color=DARK_BLUE)
    ws.merge_cells(f'A1:{get_column_letter(len(headers))}1')
    
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=3, column=col)
        cell.value = header
        cell.font = Font(bold=True, color=WHITE)
        cell.fill = get_fill(DARK_BLUE)
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
    
    auto_width(ws)

add_data_sheet('👥 Anggota', 
    ['ID', 'Nama', 'NIK', 'No HP', 'Email', 'Alamat', 'Tanggal Daftar', 'Status', 'Total Simpanan', 'Total Pinjaman'],
    members, 'DATA ANGGOTA')

add_data_sheet('💰 Simpanan',
    ['ID Transaksi', 'ID Anggota', 'Nama', 'Tanggal', 'Jenis', 'Nominal', 'Status', 'Ket'],
    savings, 'DATA SIMPANAN')

add_data_sheet('🏦 Pinjaman',
    ['ID Pinjaman', 'ID Anggota', 'Nama', 'Tanggal', 'Jumlah', 'Tenor', 'Bunga%', 'Bagi Hasil%', 'Angsuran/Bulan', 'Sisa', 'Status', 'Ket'],
    loans, 'DATA PINJAMAN')

add_data_sheet('✅ Angsuran',
    ['ID Angsuran', 'ID Pinjaman', 'ID Anggota', 'Nama', 'Bulan Ke', 'Tanggal', 'Nominal', 'Status', 'Denda'],
    payments, 'DATA ANGSURAN')

# Save
wb.save(excel_path)
print(f"✅ Excel Dashboard v2 Created: {excel_path}")
print(f"📊 Features:")
print(f"   ✓ Visual KPI Cards dengan icons & colors")
print(f"   ✓ Pie Chart (Komposisi Simpanan)")
print(f"   ✓ Bar Chart (Pinjaman by Status)")
print(f"   ✓ Line Chart (Trend 6 Bulan)")
print(f"   ✓ Color-coded stats (Green=Good, Red=Warning)")
print(f"   ✓ Sheet names dengan emojis")
print(f"   ✓ Total Records: {len(members) + len(savings) + len(loans) + len(payments)}")
