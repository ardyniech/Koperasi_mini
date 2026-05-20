#!/bin/bash
# smoke_check.sh - Frontend Static Guarding
# Usage: bash smoke_check.sh

set -e  # Exit on error

echo "🔍 Starting Frontend Smoke Check..."

# 1. Check if all required files exist
echo "📁 Checking required files..."
REQUIRED_FILES=(
  "index.html"
  "vite.config.js"
  "tsconfig.json"
  "eslint.config.js"
  "src/main.tsx"
  "src/App.tsx"
  "src/api.ts"
  "src/pages/Login.tsx"
  "src/pages/Dashboard.tsx"
  "src/pages/SimpananInput.tsx"
  "src/pages/PinjamanInput.tsx"
  "src/pages/AngsuranInput.tsx"
  "src/pages/FundingInput.tsx"
  "src/pages/SaldoView.tsx"
  "src/pages/KewajibanView.tsx"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing file: $file"
    exit 1
  fi
done
echo "✅ All required files exist"

# 2. Build check (make sure frontend can build)
echo "🏗️  Running build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Build successful"
else
  echo "❌ Build failed"
  exit 1
fi

# 3. Optional: TypeScript check (manual, doesn't fail script)
echo "🔧 TypeScript check (optional, for manual review)..."
npx tsc --noEmit 2>&1 | head -20 || true
echo "✅ TypeScript check completed (errors shown above if any)"

# 4. Optional: ESLint check (manual, doesn't fail script)
echo "🧹 ESLint check (optional, for manual review)..."
npx eslint src/ 2>&1 | head -20 || true
echo "✅ ESLint check completed (errors shown above if any)"

echo ""
echo "🎉 Smoke check passed! Frontend build is healthy."
echo "💡 Tip: Run 'npx tsc --noEmit' manually to see TypeScript errors while typing."
