#!/bin/bash

# Script to replace all alert() with showToast() in EduVera-FE

# Files to update
files=(
    "src/app/(dashboard)/sekolah/absensi/page.tsx"
    "src/app/(dashboard)/sekolah/jadwal/page.tsx"
    "src/app/(dashboard)/sekolah/pengaturan/page.tsx"
    "src/app/(dashboard)/pesantren/absensi/page.tsx"
    "src/app/(dashboard)/pesantren/pengaturan/page.tsx"
    "src/app/(dashboard)/owner/disbursements/page.tsx"
    "src/app/(dashboard)/owner/settings/page.tsx"
)

cd "/home/mahinutsmannawawi/Mahin Project/EduVera/EduVera-FE"

for file in "${files[@]}"; do
    echo "Processing $file..."
    
    # Add import if not exists
    if ! grep -q "showToast" "$file"; then
        # Find the line with Modal import and add Toast import after
        sed -i '/import Modal from/a import { showToast } from "@/components/ui/Toast";' "$file"
    fi
    
    # Replace success alerts
    sed -i 's/alert("Pengaturan berhasil disimpan!")/showToast("Pengaturan berhasil disimpan!", "success")/g' "$file"
    sed -i 's/alert("Absensi berhasil disimpan!")/showToast("Absensi berhasil disimpan!", "success")/g' "$file"
    sed -i 's/alert("Jadwal berhasil disimpan!")/showToast("Jadwal berhasil disimpan!", "success")/g' "$file"
    sed -i 's/alert("Settings saved successfully!")/showToast("Settings saved successfully!", "success")/g' "$file"
    
    # Replace error alerts
    sed -i 's/alert("Gagal menyimpan pengaturan")/showToast("Gagal menyimpan pengaturan", "error")/g' "$file"
    sed -i 's/alert("Gagal menyimpan absensi")/showToast("Gagal menyimpan absensi", "error")/g' "$file"
    sed -i 's/alert("Gagal menyimpan jadwal")/showToast("Gagal menyimpan jadwal", "error")/g' "$file"
    sed -i 's/alert("Failed to save settings")/showToast("Failed to save settings", "error")/g' "$file"
    sed -i 's/alert(`Failed to \${actionType} disbursement`)/showToast(`Failed to \${actionType} disbursement`, "error")/g' "$file"
    
    echo "✓ $file updated"
done

echo "All files updated!"
