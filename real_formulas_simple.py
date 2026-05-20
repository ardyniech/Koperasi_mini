#!/usr/bin/env python3
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = Workbook()
wb.remove(wb.active)

DARK = '1E293B'
MID = '334155'
GREEN = '10B981'
BLUE = '3B82F6'
WHITE = 'FFFFFF'

def fill(c):
    return PatternFill(start_color=c, end_color=c, fill_type='solid')

def border():
    return Border(left=Side(style='thin'), right=Side(style='thin'),
                top=Side(style='thin'), bottom=Side(style='thin'))

# === 1. DASHBOARD ===
ws = wb.create_sheet('Dashboard')
ws['A1'] = 'KOPERASI MINI - REAL FORMULAS'
ws['A1'].font = Font(bold=True, size=16, color=WHITE, name='Consolas')
ws['A1'].fill = fill(DARK)
ws.merge_cells('A1:J1')

# KPI Cards with REAL formulas
ws['A3'] = 'Total Members:'
ws['B3'] = '=COUNTA(Members!A:A)-3'
ws['B3'].font = Font(bold=True, size=14, color=BLUE, name='Consolas')

ws['A4'] = 'Total Savings (Rp):'
ws['B4'] = '=SUM(Members!F:F)'
ws['B4'].number_format = '#,##0'
ws['B4'].font = Font(bold=True, size=14, color=GREEN, name='Consolas')

ws['A5'] = 'Total Loans (Rp):'
ws['B5'] = '=SUM(Members!G:G)'
ws['B5'].number_format = '#,##0'
ws['B5'].font = Font(bold=True, size=14, color=BLUE, name='Consolas')

ws['A6'] = 'Avg Credit Score:'
ws['B6'] = '=AVERAGE(Members!D:D)'
ws['B6'].font = Font(bold=True, size=14, name='Consolas')

for row in range(3, 7):
    for col in range(1, 3):
        ws.cell(row=row, column=col).border = border()

# === 2. DCF (NPV & IRR) ===
ws_dcf = wb.create_sheet('DCF')
ws_dcf['A1'] = 'DCF VALUATION'
ws_dcf['A1'].font = Font(bold=True, size=14, color=WHITE, name='Consolas')
ws_dcf['A1'].fill = fill(DARK)
ws_dcf.merge_cells('A1:E1')

# Cash flows
ws_dcf['A3'] = 'Year'
ws_dcf['B3'] = 'Cash Flow'
ws_dcf['C3'] = 'Disc Factor'
ws_dcf['D3'] = 'PV'
for col in range(1, 5):
    ws_dcf.cell(row=3, column=col).font = Font(bold=True, color=WHITE, name='Consolas')
    ws_dcf.cell(row=3, column=col).fill = fill(MID)

flows = [(-15000000000, '=1/(1.1^A4)', '=B4*C4'),
          (5000000000, '=1/(1.1^A5)', '=B5*C5'),
          (6000000000, '=1/(1.1^A6)', '=B6*C6'),
          (7000000000, '=1/(1.1^A7)', '=B7*C7'),
          (13000000000, '=1/(1.1^A8)', '=B8*C8')]

for idx, (cf, df, pv) in enumerate(flows, 4):
    ws_dcf.cell(row=idx, column=1).value = idx - 4
    ws_dcf.cell(row=idx, column=2).value = cf
    ws_dcf.cell(row=idx, column=2).number_format = '#,##0'
    ws_dcf.cell(row=idx, column=3).value = df
    ws_dcf.cell(row=idx, column=3).number_format = '0.0000'
    ws_dcf.cell(row=idx, column=4).value = pv
    ws_dcf.cell(row=idx, column=4).number_format = '#,##0'
    for col in range(1, 5):
        ws_dcf.cell(row=idx, column=col).border = border()

# NPV Formula
ws_dcf['A10'] = 'NPV (10%):'
ws_dcf['B10'] = '=NPV(0.1, B4:B8)'
ws_dcf['B10'].number_format = '#,##0'
ws_dcf['B10'].font = Font(bold=True, size=14, color=GREEN, name='Consolas')
ws_dcf['B10'].border = border()

# IRR Formula
ws_dcf['A11'] = 'IRR:'
ws_dcf['B11'] = '=IRR(B4:B8)'
ws_dcf['B11'].number_format = '0.00%'
ws_dcf['B11'].font = Font(bold=True, size=14, color=BLUE, name='Consolas')
ws_dcf['B11'].border = border()

# === 3. AMORTIZATION (PMT) ===
ws_amo = wb.create_sheet('Amortization')
ws_amo['A1'] = 'AMORTIZATION (PMT Formula)'
ws_amo['A1'].font = Font(bold=True, size=14, color=WHITE, name='Consolas')
ws_amo['A1'].fill = fill(DARK)
ws_amo.merge_cells('A1:I1')

# Loan params
ws_amo['A3'] = 'Principal:'
ws_amo['B3'] = 100000000
ws_amo['B3'].number_format = '#,##0'
ws_amo['A4'] = 'Rate (%):'
ws_amo['B4'] = 10
ws_amo['A5'] = 'Tenor (months):'
ws_amo['B5'] = 12

# PMT Formula
ws_amo['A7'] = 'Monthly Payment:'
ws_amo['B7'] = '=PMT(B4/100/12, B5, -B3)'
ws_amo['B7'].number_format = '#,##0'
ws_amo['B7'].font = Font(bold=True, size=16, color=GREEN, name='Consolas')
ws_amo['B7'].border = border()

# Schedule headers
headers = ['Period', 'Beg Bal', 'Principal', 'Margin', 'Payment', 'End Bal']
for col, h in enumerate(headers, 1):
    cell = ws_amo.cell(row=9, column=col)
    cell.value = h
    cell.font = Font(bold=True, color=WHITE, name='Consolas')
    cell.fill = fill(MID)
    cell.border = border()

# Schedule with formulas
for period in range(1, 13):
    row = 9 + period
    ws_amo.cell(row=row, column=1).value = period
    if period == 1:
        ws_amo.cell(row=row, column=2).value = '=$B$3'
    else:
        ws_amo.cell(row=row, column=2).value = f'=F{row-1}'
    ws_amo.cell(row=row, column=2).number_format = '#,##0'
    
    ws_amo.cell(row=row, column=3).value = '=$B$7*($B$3/($B$3+$B$3*0.1))'
    ws_amo.cell(row=row, column=3).number_format = '#,##0'
    
    ws_amo.cell(row=row, column=4).value = '=$B$7-C{row}'.format(row=row)
    ws_amo.cell(row=row, column=4).number_format = '#,##0'
    
    ws_amo.cell(row=row, column=5).value = '=$B$7'
    ws_amo.cell(row=row, column=5).number_format = '#,##0'
    
    ws_amo.cell(row=row, column=6).value = f'=B{row}-C{row}'
    ws_amo.cell(row=row, column=6).number_format = '#,##0'
    
    for col in range(1, 7):
        ws_amo.cell(row=row, column=col).border = border()

# === 4. MEMBERS DATA ===
ws_mem = wb.create_sheet('Members')
ws_mem['A1'] = 'MEMBERS DATA (100 Records)'
ws_mem['A1'].font = Font(bold=True, size=14, color=WHITE, name='Consolas')
ws_mem['A1'].fill = fill(DARK)
ws_mem.merge_cells('A1:J1')

headers = ['ID', 'Name', 'Salary', 'Credit Score', 'Status', 'Savings', 'Loans', 'Total', 'Risk', 'PD']
for col, h in enumerate(headers, 1):
    cell = ws_mem.cell(row=3, column=col)
    cell.value = h
    cell.font = Font(bold=True, color=WHITE, name='Consolas')
    cell.fill = fill(MID)
    cell.border = border()

import random
random.seed(2026)
for i in range(100):
    row = i + 4
    score = random.randint(550, 800)
    ws_mem.cell(row=row, column=1).value = f'KMS{i:04d}'
    ws_mem.cell(row=row, column=2).value = f'Anggota {i+1}'
    ws_mem.cell(row=row, column=3).value = random.randint(5000000, 30000000)
    ws_mem.cell(row=row, column=3).number_format = '#,##0'
    ws_mem.cell(row=row, column=4).value = score
    ws_mem.cell(row=row, column=5).value = 'Aktif' if score > 600 else 'Nonaktif'
    ws_mem.cell(row=row, column=6).value = random.randint(1000000, 50000000)
    ws_mem.cell(row=row, column=6).number_format = '#,##0'
    ws_mem.cell(row=row, column=7).value = f'=F{row}*0.8'
    ws_mem.cell(row=row, column=7).number_format = '#,##0'
    ws_mem.cell(row=row, column=8).value = f'=F{row}+G{row}'
    ws_mem.cell(row=row, column=8).number_format = '#,##0'
    ws_mem.cell(row=row, column=9).value = f'=IF(D{row}>700,"Prime",IF(D{row}>650,"Good","Fair"))'
    ws_mem.cell(row=row, column=10).value = f'=1/(1+EXP(0.1*(D{row}-650)))'
    ws_mem.cell(row=row, column=10).number_format = '0.00%'
    for col in range(1, 11):
        ws_mem.cell(row=row, column=col).border = border()
        ws_mem.cell(row=row, column=col).font = Font(name='Consolas', size=10)

# Save
excel_path = '/home/ardy/koperasi_mini/koperasi_FINAL_with_FORMULAS.xlsx'
wb.save(excel_path)
print(f'SUCCESS: {excel_path}')
print('Formulas included:')
print('  ✓ Dashboard: =COUNTA(), =SUM(), =AVERAGE()')
print('  ✓ DCF: =NPV(), =IRR()')
print('  ✓ Amortization: =PMT()')
print('  ✓ Members: =IF(), logistic PD formula')
print('ALL FORMULAS WILL CALCULATE IN EXCEL!')
