# 🤖 Agent Rules - PanenKu Refactoring Project

> **⚠️ WAJIB BACA FILE INI SEBELUM MELAKUKAN PERUBAHAN APAPUN**

---

## 📋 Pre-Flight Checklist

Sebelum memulai task apapun, agent HARUS:

### 1. ✅ Cek Konteks & State Saat Ini
```bash
# Baca file-file ini WAJIB:
- .github/AGENT_RULES.md        # File ini
- REFACTORING_GUIDE.md          # Arsitektur target
- CHANGELOG.md                  # Log perubahan terakhir
- package.json                  # Dependencies saat ini
```

### 2. ✅ Cek Progress Refactoring
```bash
# Baca CHANGELOG.md untuk tahu:
- Apa yang sudah dikerjakan?
- Apa yang sedang in-progress?
- Apa blocker/issue yang ada?
```

### 3. ✅ Konfirmasi Scope Task
Sebelum coding, TANYAKAN ke user:
- "Task ini tentang [X], apakah benar?"
- "Ini akan mempengaruhi file [A, B, C], lanjut?"

---

## 🔄 Workflow Wajib

### Setiap Perubahan HARUS Mengikuti Flow Ini:

```
┌─────────────────┐
│ 1. UNDERSTAND   │ ← Baca konteks, pahami task
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. PLAN         │ ← List file yang akan diubah
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. IMPLEMENT    │ ← Buat perubahan SATU per SATU
└────────┬────────┘
         ▼
┌─────────────────┐
│ 4. TEST         │ ← Jalankan test, cek error
└────────┬────────┘
         ▼
┌─────────────────┐
│ 5. LOG          │ ← Update CHANGELOG.md
└────────┬────────┘
         ▼
┌─────────────────┐
│ 6. VERIFY       │ ← Konfirmasi ke user
└─────────────────┘
```

---

## 📝 Format Log Perubahan

Setiap selesai task, UPDATE file `CHANGELOG.md` dengan format:

```markdown
## [YYYY-MM-DD] - Task Name

### Changed
- `path/to/file.tsx` - Deskripsi perubahan

### Added
- `path/to/new-file.ts` - Deskripsi file baru

### Removed
- `path/to/old-file.tsx` - Alasan dihapus

### Dependencies
- Added: `package-name@version`
- Removed: `old-package`

### Testing
- [ ] Unit tests passed
- [ ] Build successful
- [ ] Manual testing done

### Notes
- Catatan penting untuk task selanjutnya
```

---

## 🧪 Testing Requirements

### WAJIB Jalankan Sebelum Commit:

```bash
# 1. Type check
npm run type-check   # atau: npx tsc --noEmit

# 2. Lint
npm run lint

# 3. Unit tests
npm run test

# 4. Build check
npm run build
```

### Jika Test Gagal:
1. **JANGAN** lanjut ke task berikutnya
2. **FIX** error terlebih dahulu
3. **LOG** error di CHANGELOG.md bagian "Issues"

---

## 🚫 Yang TIDAK BOLEH Dilakukan

| ❌ Jangan | ✅ Seharusnya |
|-----------|---------------|
| Ubah banyak file sekaligus tanpa test | Ubah 1-3 file, test, lanjut |
| Skip testing | SELALU test setiap perubahan |
| Hapus file tanpa konfirmasi | Tanya user dulu |
| Tambah dependency tanpa alasan | Jelaskan kenapa perlu |
| Ubah arsitektur drastis | Ikuti REFACTORING_GUIDE.md |
| Abaikan TypeScript error | Fix semua error |
| Hardcode values | Gunakan constants |

---

## 📁 File Penting yang Harus Dijaga

```
JANGAN UBAH tanpa konfirmasi eksplisit:
├── app/api/**              # API routes
├── src/lib/auth.ts         # Authentication config
├── src/lib/firebase.ts     # Firebase config
├── src/lib/mongodb.ts      # MongoDB config
├── src/models/**           # Database models
└── next.config.mjs         # Next.js config
```

---

## 🎯 Prioritas Refactoring

Ikuti urutan ini (sesuai REFACTORING_GUIDE.md):

```
Phase 1: Foundation ──────────────────────────
  □ Setup stores/ folder
  □ Setup services/api/ folder
  □ Setup constants/ folder
  
Phase 2: State Management ────────────────────
  □ Create cartStore.ts
  □ Create services/api/cartApi.ts
  □ Migrate CartContext → Zustand
  
Phase 3: Components ──────────────────────────
  □ Refactor ProductCard
  □ Refactor Navbar
  □ Refactor ProductDetail
  □ Refactor Cart components
  
Phase 4: Hooks ───────────────────────────────
  □ Create useAuth.ts
  □ Create useCartActions.ts
  □ Improve existing hooks
  
Phase 5: Cleanup ─────────────────────────────
  □ Remove deprecated code
  □ Update tests
  □ Documentation
```

---

## 💬 Komunikasi dengan User

### Saat Memulai Task:
```
"Saya akan mengerjakan [TASK]. 
File yang akan diubah: [LIST FILES].
Apakah ada concern sebelum saya mulai?"
```

### Saat Selesai Task:
```
"✅ Task [TASK] selesai.
- Perubahan: [SUMMARY]
- Test: [PASS/FAIL]
- Next step yang disarankan: [SUGGESTION]"
```

### Saat Ada Masalah:
```
"⚠️ Ada issue saat mengerjakan [TASK]:
- Error: [ERROR MESSAGE]
- File: [FILE PATH]
- Opsi solusi: [OPTIONS]
Mau pilih opsi mana?"
```

---

## 🔍 Quick Reference Commands

```bash
# Check TypeScript errors
npx tsc --noEmit

# Run tests
npm run test

# Run specific test
npm run test -- ProductCard

# Check lint
npm run lint

# Build project
npm run build

# Check dependencies
npm ls

# Find unused exports
npx ts-prune
```

---

## 📊 Status Tracking

Gunakan emoji untuk status di CHANGELOG:

| Emoji | Status |
|-------|--------|
| ✅ | Completed |
| 🔄 | In Progress |
| ⏸️ | Paused |
| ❌ | Blocked |
| 🐛 | Has Bug |
| 📝 | Needs Review |

---

## ⚡ Emergency Rollback

Jika terjadi kesalahan besar:

```bash
# 1. Check git status
git status

# 2. Discard all changes (HATI-HATI!)
git checkout -- .

# 3. Atau rollback specific file
git checkout -- path/to/file.tsx

# 4. Log incident di CHANGELOG.md
```

---

**Last Updated**: 2026-01-10
**Version**: 1.0.0
