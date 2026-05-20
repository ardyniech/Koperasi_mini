# TODO - Koperasi Mini Syariah

## Completed Tasks
- [x] 1. Buat struktur project (backend/frontend)
- [x] 2. Setup backend FastAPI + SQLite
- [x] 3. Setup frontend React + Vite + TypeScript
- [x] 4. Implementasi auth (register, login, JWT)
- [x] 5. Implementasi Anggota model + CRUD
- [x] 6. Implementasi Simpanan model + CRUD
- [x] 7. Implementasi Pinjaman (syariah margin) + CRUD
- [x] 8. Implementasi Angsuran + denda
- [x] 9. Implementasi Funding Gotong Royong + CRUD
- [x] 10. Setup backend Baju Besi (pytest + ptw)
- [x] 11. Pecah frontend jadi lego modular components
- [x] 12. Setup frontend static guarding (TypeScript, ESLint, pre-commit)
- [x] 13. Update SOUL.md dengan SOP baru
- [x] 14. Setup frontend Baju Besi (static guarding: TypeScript, ESLint, pre-commit, smoke_check) ← ganti vitest (incompatible Termux ARM64)

## Pending Tasks
- [ ] 15. Pecah sisa frontend pages (SaldoView, KewajibanView) jadi lego modules
- [ ] 16. Verifikasi semua penjaga (tsc, eslint, pre-commit) berfungsi
- [ ] 17. Test frontend build di Termux
- [ ] 18. Full integration testing (frontend ↔ backend)
- [ ] 19. Push git repo ke remote (optional)

## Notes
- Vitest/jest tidak kompatibel dengan Termux ARM64 (exit code 132: Illegal instruction)
- Frontend testing diganti static guarding (TypeScript strict + ESLint + pre-commit hook)
- Setiap file >100 baris wajib dipecah (Lego style) sesuai aturan user
