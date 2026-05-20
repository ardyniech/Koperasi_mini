#!/usr/bin/env python3
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import LineChart, Reference
from datetime import datetime, timedelta
import random
import openpyxl.utils

excel_path = "/home/ardy/koperasi_mini/koperasi_mini_management.xlsx"

def generate_members(n=50):
    members = []
    for i in range(1, n+1):
        m = [
            f'KMS{str(i).zfill(3)}', f'Anggota {i}',
            f'320{str(random.randint(100000000000, 999999999999))}',
            f'08{random.randint(1000000000, 9999999999)}',
            f'anggota{i}@example.com', f'Jalan Contoh No. {i}',
            (datetime.now() - timedelta(days=random.randint(30, 365))).strftime('%Y-%m-%d'),
            random.choice(['Aktif', 'Aktif', 'Aktif', 'Nonaktif']), 0, 0
        ]
        members.append(m)
    return members

def generate_savings(members, n=200):
    savings = []
    for i in range(n):
        member = random.choice(members)
        amount = random.choice([50000, 100000, 250000, 500000, 1000000])
        date = (datetime.now() - timedelta(days=random.randint(0, 180))).strftime('%Y-%m-%d')
        savings.append([
            f'SMP{datetime.now().strftime("%Y%m")}{str(i).zfill(4)}',
            member[0], member[1], date,
            random.choice(['Simpanan Pokok', 'Simpanan Wajib', 'Simpanan Sukarela']),
            amount, 'Verified', ''
        ])
        idx = members.index(member)
        members[idx][8] += amount
    return savings

def generate_loans(members, n=30):
    loans = []
    for i in range(n):
        member = random.choice(members)
        amount = random.choice([1000000, 2500000, 5000000, 10000000])
        date = (datetime.now() - timedelta(days=random.randint(0, 90))).strftime('%Y-%m-%d')
        tenor = random.choice([6, 12, 24])
        status = random.choice(['Aktif', 'Lunas', 'Menunggu Persetujuan'])
        loans.append([
            f'PNJ{datetime.now().strftime("%Y%m")}{str(i).zfill(3)}',
            member[0], member[1], date, amount, tenor, 0,
            random.choice([5, 7, 10]), amount/tenor,
            amount if status == 'Aktif' else 0, status, ''
        ])
        if status == 'Aktif':
            idx = members.index(member)
            members[idx][9] += amount
    return loans

def generate_payments(loans):
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
    return payments

def adjust_column_width(ws):
    for col in ws.columns:
        max_length = 0
        column_letter = openpyxl.utils.get_column_letter(col[0].column)
        for cell in col:
            try:
                if cell.value and len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 30)
        ws.column_dimensions[column_letter].width = adjusted_width

# Generate data
members = generate_members(50)
savings = generate_savings(members, 200)
loans = generate_loans(members, 30)
payments = generate_payments(loans)

# Create workbook
wb = Workbook()
wb.remove(wb.active)

# Styles
header_fill = PatternFill(start_color='1E40AF', end_color='1E40AF', fill_type='solid')
header_font = Font(bold=True, color='FFFFFF', size=11)
title_font = Font(bold=True, size=14, color='1E40AF')
subtitle_font = Font(bold=True, size=12, color='1E40AF')
thin_border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))

def add_sheet_with_data(ws, title, headers, data):
    ws['A1'] = title
    ws['A1'].font = title_font
    ws.merge_cells(f'A1:{openpyxl.utils.get_column_letter(len(headers))}1')
    
    for col, header in enumerate(headers, 1):
        cell = ws.cell(row=3, column=col)
        cell.value = header
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal='center')
        cell.border = thin_border
    
    for row in data:
        ws.append(row)
    
    for row in ws.iter_rows(min_row=4, max_row=ws.max_row):
        for cell in row:
            cell.border = thin_border
            if isinstance(cell.value, (int, float)):
                cell.number_format = '#,##0'
                cell.alignment = Alignment(horizontal='right')
    
    adjust_column_width(ws)

# Sheet 1: Dashboard
ws_dash = wb.create_sheet('Dashboard')
ws_dash['A1'] = 'KOPERASI MINI SYARIAH - DASHBOARD MANAGEMENT'
ws_dash['A1'].font = Font(bold=True, size=16, color='1E40AF')
ws_dash.merge_cells('A1:H1')

ws_dash['A3'] = 'KEY METRICS'
ws_dash['A3'].font = subtitle_font

metrics = [
    ['Total Anggota Aktif', len([m for m in members if m[7] == 'Aktif'])],
    ['Total Simpanan (Rp)', sum(m[8] for m in members)],
    ['Total Pinjaman Aktif (Rp)', sum(l[4] for l in loans if l[10] == 'Aktif')],
    ['Pinjaman Menunggu Persetujuan', len([l for l in loans if l[10] == 'Menunggu Persetujuan'])],
    ['Total Angsuran Bulan Ini (Rp)', sum(p[6] for p in payments if p[5].startswith(datetime.now().strftime('%Y-%m')))],
    ['Rasio Pinjaman/Simpanan (%)', f"{sum(l[4] for l in loans if l[10] == 'Aktif') / max(sum(m[8] for m in members), 1) * 100:.1f}%"]
]

for i, (label, value) in enumerate(metrics, 4):
    ws_dash[f'A{i}'] = label
    ws_dash[f'B{i}'] = value
    ws_dash[f'A{i}'].font = Font(bold=True)
    if isinstance(value, (int, float)):
        ws_dash[f'B{i}'].number_format = '#,##0'

ws_dash['A12'] = 'STATISTIK CEPAT'
ws_dash['A12'].font = subtitle_font

stats = [
    ['Simpanan Pokok (Rp)', sum(s[5] for s in savings if s[4] == 'Simpanan Pokok')],
    ['Simpanan Wajib (Rp)', sum(s[5] for s in savings if s[4] == 'Simpanan Wajib')],
    ['Simpanan Sukarela (Rp)', sum(s[5] for s in savings if s[4] == 'Simpanan Sukarela')],
    ['Pinjaman Lunas (Rp)', sum(l[4] for l in loans if l[10] == 'Lunas')],
    ['Estimasi Macet 5% (Rp)', sum(l[4] for l in loans if l[10] == 'Aktif') * 0.05],
    ['Angsuran Terlambat (Rp)', sum(p[6] for p in payments if p[7] == 'Terlambat')]
]

for i, (label, value) in enumerate(stats, 13):
    ws_dash[f'A{i}'] = label
    ws_dash[f'B{i}'] = value
    ws_dash[f'B{i}'].number_format = '#,##0'

# Sheet 2: Anggota
ws_anggota = wb.create_sheet('Anggota')
add_sheet_with_data(ws_anggota, 'DATA ANGGOTA KOPERASI',
    ['ID Anggota', 'Nama', 'NIK', 'No HP', 'Email', 'Alamat', 'Tanggal Daftar', 'Status', 'Total Simpanan', 'Total Pinjaman'],
    members)

# Sheet 3: Simpanan
ws_simpanan = wb.create_sheet('Simpanan')
add_sheet_with_data(ws_simpanan, 'DATA SIMPANAN (SIMPAN)',
    ['ID Transaksi', 'ID Anggota', 'Nama', 'Tanggal', 'Jenis', 'Nominal', 'Status', 'Keterangan'],
    savings)

# Sheet 4: Pinjaman
ws_pinjaman = wb.create_sheet('Pinjaman')
add_sheet_with_data(ws_pinjaman, 'DATA PINJAMAN',
    ['ID Pinjaman', 'ID Anggota', 'Nama', 'Tanggal', 'Jumlah', 'Tenor', 'Bunga%', 'Bagi Hasil%', 'Angsuran/Bulan', 'Sisa', 'Status', 'Ket'],
    loans)

# Sheet 5: Angsuran
ws_angsuran = wb.create_sheet('Angsuran')
add_sheet_with_data(ws_angsuran, 'DATA ANGSURAN',
    ['ID Angsuran', 'ID Pinjaman', 'ID Anggota', 'Nama', 'Bulan Ke', 'Tanggal', 'Nominal', 'Status', 'Denda'],
    payments)

# Sheet 6: Laporan Keuangan
ws_lap = wb.create_sheet('Laporan Keuangan')
ws_lap['A1'] = 'LAPORAN KEUANGAN BULANAN'
ws_lap['A1'].font = title_font
ws_lap.merge_cells('A1:F1')

headers_lap = ['Bulan', 'Total Simpanan (Rp)', 'Total Penarikan (Rp)', 'Total Pinjaman (Rp)', 'Total Angsuran (Rp)', 'Profit Bagi Hasil (Rp)']
for col, h in enumerate(headers_lap, 1):
    cell = ws_lap.cell(row=3, column=col)
    cell.value = h
    cell.font = header_font
    cell.fill = header_fill
    cell.alignment = Alignment(horizontal='center')
    cell.border = thin_border

laporan_data = []
for i in range(6):
    bulan = (datetime.now() - timedelta(days=30*i)).strftime('%B %Y')
    simpan = random.randint(5000000, 20000000)
    tarik = random.randint(2000000, 8000000)
    pinjam = random.randint(10000000, 30000000)
    angsur = random.randint(5000000, 15000000)
    profit = int(angsur * 0.07)
    laporan_data.append([bulan, simpan, tarik, pinjam, angsur, profit])

for row in laporan_data:
    ws_lap.append(row)

for row in ws_lap.iter_rows(min_row=4, max_row=ws_lap.max_row):
    for cell in row:
        cell.border = thin_border
        if isinstance(cell.value, (int, float)):
            cell.number_format = '#,##0'
            cell.alignment = Alignment(horizontal='right')

adjust_column_width(ws_lap)

# Add chart
chart = LineChart()
chart.title = 'Trend Keuangan 6 Bulan'
chart.style = 10
chart.y_axis.title = 'Nominal (Rp)'
chart.x_axis.title = 'Bulan'
data = Reference(ws_lap, min_col=2, min_row=3, max_row=9, max_col=6)
cats = Reference(ws_lap, min_col=1, min_row=4, max_row=9)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
ws_lap.add_chart(chart, 'H3')

# Save
wb.save(excel_path)
print(f"✅ Excel created: {excel_path}")
print(f"📊 Sheets: Dashboard, Anggota, Simpanan, Pinjaman, Angsuran, Laporan Keuangan")
print(f"📈 Total Records: {len(members) + len(savings) + len(loans) + len(payments)}")
