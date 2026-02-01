// Role definitions for EduVera
// Sekolah: 10 roles, Pesantren: 5 roles

export type SekolahRole =
    | 'admin_sekolah'    // Super admin sekolah
    | 'kepala_sekolah'   // Kepala Sekolah
    | 'wakil_kepsek'     // Wakil Kepala Sekolah
    | 'wali_kelas'       // Wali Kelas
    | 'guru'             // Guru Mapel
    | 'tata_usaha'       // TU / Administrasi
    | 'bendahara'        // Bendahara / Keuangan
    | 'bk'               // Bimbingan Konseling
    | 'perpustakaan'     // Pustakawan
    | 'wali_siswa';      // Orang Tua / Wali Siswa

export type PesantrenRole =
    | 'admin_pesantren'  // Super admin pesantren
    | 'pengasuh'         // Pengasuh / Kyai
    | 'sekretaris'       // Sekretaris
    | 'bendahara'        // Bendahara
    | 'pendidikan'       // Bagian Pendidikan
    | 'wali_santri';     // Orang Tua / Wali Santri

export type UserRole = SekolahRole | PesantrenRole;

// Role metadata
export interface RoleMetadata {
    id: string;
    name: string;
    description: string;
    color: string;
    icon: string;
}

// Sekolah roles metadata
export const sekolahRoles: Record<SekolahRole, RoleMetadata> = {
    admin_sekolah: {
        id: 'admin_sekolah',
        name: 'Admin Sekolah',
        description: 'Akses penuh ke semua fitur sekolah',
        color: 'red',
        icon: '👑'
    },
    kepala_sekolah: {
        id: 'kepala_sekolah',
        name: 'Kepala Sekolah',
        description: 'Akses dashboard, laporan, dan approval',
        color: 'purple',
        icon: '🎓'
    },
    wakil_kepsek: {
        id: 'wakil_kepsek',
        name: 'Wakil Kepala Sekolah',
        description: 'Akses kurikulum, akademik, dan SDM',
        color: 'indigo',
        icon: '📋'
    },
    wali_kelas: {
        id: 'wali_kelas',
        name: 'Wali Kelas',
        description: 'Akses kelas, siswa, nilai, dan absensi',
        color: 'blue',
        icon: '👨‍🏫'
    },
    guru: {
        id: 'guru',
        name: 'Guru',
        description: 'Akses jadwal, nilai, dan mapel',
        color: 'cyan',
        icon: '📚'
    },
    tata_usaha: {
        id: 'tata_usaha',
        name: 'Tata Usaha',
        description: 'Akses data siswa, surat, dan arsip',
        color: 'teal',
        icon: '📁'
    },
    bendahara: {
        id: 'bendahara',
        name: 'Bendahara',
        description: 'Akses keuangan, SPP, dan laporan keuangan',
        color: 'emerald',
        icon: '💰'
    },
    bk: {
        id: 'bk',
        name: 'Bimbingan Konseling',
        description: 'Akses data siswa dan konseling',
        color: 'green',
        icon: '🧠'
    },
    perpustakaan: {
        id: 'perpustakaan',
        name: 'Pustakawan',
        description: 'Akses perpustakaan dan peminjaman',
        color: 'lime',
        icon: '📖'
    },
    wali_siswa: {
        id: 'wali_siswa',
        name: 'Wali Siswa',
        description: 'Akses nilai anak, SPP, dan pengumuman',
        color: 'amber',
        icon: '👨‍👩‍👧'
    }
};

// Pesantren roles metadata
export const pesantrenRoles: Record<PesantrenRole, RoleMetadata> = {
    admin_pesantren: {
        id: 'admin_pesantren',
        name: 'Admin Pesantren',
        description: 'Akses penuh ke semua fitur pesantren',
        color: 'red',
        icon: '👑'
    },
    pengasuh: {
        id: 'pengasuh',
        name: 'Pengasuh / Kyai',
        description: 'Akses dashboard, laporan, dan approval',
        color: 'purple',
        icon: '🕌'
    },
    sekretaris: {
        id: 'sekretaris',
        name: 'Sekretaris',
        description: 'Akses data santri, surat, dan arsip',
        color: 'blue',
        icon: '📁'
    },
    bendahara: {
        id: 'bendahara',
        name: 'Bendahara',
        description: 'Akses keuangan, syahriah, dan laporan',
        color: 'emerald',
        icon: '💰'
    },
    pendidikan: {
        id: 'pendidikan',
        name: 'Bagian Pendidikan',
        description: 'Akses tahfidz, diniyah, dan nilai santri',
        color: 'teal',
        icon: '📖'
    },
    wali_santri: {
        id: 'wali_santri',
        name: 'Wali Santri',
        description: 'Akses nilai anak, syahriah, dan pengumuman',
        color: 'amber',
        icon: '👨‍👩‍👧'
    }
};

// Permission types
export type SekolahModule =
    | 'dashboard'
    | 'siswa'
    | 'guru'
    | 'staf'
    | 'kelas'
    | 'rombel'
    | 'jadwal'
    | 'absensi'
    | 'kurikulum'
    | 'mapel'
    | 'jenjang'
    | 'nilai'
    | 'erapor'
    | 'sdm'
    | 'keuangan'
    | 'spp'
    | 'kalender'
    | 'laporan'
    | 'pengaturan';

export type PesantrenModule =
    | 'dashboard'
    | 'santri'
    | 'ustadz'
    | 'asrama'
    | 'tahfidz'
    | 'diniyah'
    | 'kepesantrenan'
    | 'keuangan'
    | 'syahriah'
    | 'laporan'
    | 'wali'
    | 'pengaturan';

export type PermissionLevel = 'none' | 'read' | 'write' | 'admin';

// Permission matrix for Sekolah roles
export const sekolahPermissions: Record<SekolahRole, Partial<Record<SekolahModule, PermissionLevel>>> = {
    admin_sekolah: {
        dashboard: 'admin', siswa: 'admin', guru: 'admin', staf: 'admin', kelas: 'admin',
        rombel: 'admin', jadwal: 'admin', absensi: 'admin', kurikulum: 'admin', mapel: 'admin',
        jenjang: 'admin', nilai: 'admin', erapor: 'admin', sdm: 'admin', keuangan: 'admin',
        spp: 'admin', kalender: 'admin', laporan: 'admin', pengaturan: 'admin'
    },
    kepala_sekolah: {
        dashboard: 'admin', siswa: 'read', guru: 'read', staf: 'read', kelas: 'read',
        rombel: 'read', jadwal: 'read', absensi: 'read', kurikulum: 'read', mapel: 'read',
        jenjang: 'read', nilai: 'read', erapor: 'admin', sdm: 'read', keuangan: 'admin',
        spp: 'read', kalender: 'write', laporan: 'admin', pengaturan: 'read'
    },
    wakil_kepsek: {
        dashboard: 'read', siswa: 'write', guru: 'write', staf: 'read', kelas: 'write',
        rombel: 'write', jadwal: 'write', absensi: 'read', kurikulum: 'admin', mapel: 'write',
        jenjang: 'read', nilai: 'read', erapor: 'write', sdm: 'write', keuangan: 'none',
        spp: 'none', kalender: 'write', laporan: 'read', pengaturan: 'read'
    },
    wali_kelas: {
        dashboard: 'read', siswa: 'write', guru: 'none', staf: 'none', kelas: 'write',
        rombel: 'read', jadwal: 'read', absensi: 'write', kurikulum: 'none', mapel: 'none',
        jenjang: 'none', nilai: 'write', erapor: 'write', sdm: 'none', keuangan: 'none',
        spp: 'none', kalender: 'read', laporan: 'read', pengaturan: 'none'
    },
    guru: {
        dashboard: 'read', siswa: 'read', guru: 'none', staf: 'none', kelas: 'read',
        rombel: 'read', jadwal: 'read', absensi: 'write', kurikulum: 'none', mapel: 'read',
        jenjang: 'none', nilai: 'write', erapor: 'none', sdm: 'none', keuangan: 'none',
        spp: 'none', kalender: 'read', laporan: 'none', pengaturan: 'none'
    },
    tata_usaha: {
        dashboard: 'read', siswa: 'write', guru: 'write', staf: 'write', kelas: 'read',
        rombel: 'read', jadwal: 'none', absensi: 'read', kurikulum: 'none', mapel: 'none',
        jenjang: 'none', nilai: 'none', erapor: 'none', sdm: 'write', keuangan: 'none',
        spp: 'none', kalender: 'read', laporan: 'read', pengaturan: 'read'
    },
    bendahara: {
        dashboard: 'read', siswa: 'read', guru: 'none', staf: 'none', kelas: 'none',
        rombel: 'none', jadwal: 'none', absensi: 'none', kurikulum: 'none', mapel: 'none',
        jenjang: 'none', nilai: 'none', erapor: 'none', sdm: 'none', keuangan: 'admin',
        spp: 'admin', kalender: 'none', laporan: 'read', pengaturan: 'none'
    },
    bk: {
        dashboard: 'read', siswa: 'write', guru: 'none', staf: 'none', kelas: 'read',
        rombel: 'read', jadwal: 'none', absensi: 'read', kurikulum: 'none', mapel: 'none',
        jenjang: 'none', nilai: 'read', erapor: 'read', sdm: 'none', keuangan: 'none',
        spp: 'none', kalender: 'read', laporan: 'none', pengaturan: 'none'
    },
    perpustakaan: {
        dashboard: 'read', siswa: 'read', guru: 'read', staf: 'none', kelas: 'none',
        rombel: 'none', jadwal: 'none', absensi: 'none', kurikulum: 'none', mapel: 'none',
        jenjang: 'none', nilai: 'none', erapor: 'none', sdm: 'none', keuangan: 'none',
        spp: 'none', kalender: 'read', laporan: 'none', pengaturan: 'none'
    },
    wali_siswa: {
        dashboard: 'read', siswa: 'read', guru: 'none', staf: 'none', kelas: 'none',
        rombel: 'none', jadwal: 'read', absensi: 'read', kurikulum: 'none', mapel: 'none',
        jenjang: 'none', nilai: 'read', erapor: 'read', sdm: 'none', keuangan: 'none',
        spp: 'read', kalender: 'read', laporan: 'none', pengaturan: 'none'
    }
};

// Permission matrix for Pesantren roles
export const pesantrenPermissions: Record<PesantrenRole, Partial<Record<PesantrenModule, PermissionLevel>>> = {
    admin_pesantren: {
        dashboard: 'admin', santri: 'admin', ustadz: 'admin', asrama: 'admin', tahfidz: 'admin',
        diniyah: 'admin', kepesantrenan: 'admin', keuangan: 'admin', syahriah: 'admin',
        laporan: 'admin', wali: 'admin', pengaturan: 'admin'
    },
    pengasuh: {
        dashboard: 'admin', santri: 'read', ustadz: 'read', asrama: 'read', tahfidz: 'read',
        diniyah: 'read', kepesantrenan: 'read', keuangan: 'read', syahriah: 'read',
        laporan: 'admin', wali: 'read', pengaturan: 'read'
    },
    sekretaris: {
        dashboard: 'read', santri: 'write', ustadz: 'write', asrama: 'write', tahfidz: 'none',
        diniyah: 'none', kepesantrenan: 'write', keuangan: 'none', syahriah: 'none',
        laporan: 'read', wali: 'write', pengaturan: 'read'
    },
    bendahara: {
        dashboard: 'read', santri: 'read', ustadz: 'none', asrama: 'none', tahfidz: 'none',
        diniyah: 'none', kepesantrenan: 'none', keuangan: 'admin', syahriah: 'admin',
        laporan: 'read', wali: 'none', pengaturan: 'none'
    },
    pendidikan: {
        dashboard: 'read', santri: 'read', ustadz: 'read', asrama: 'none', tahfidz: 'admin',
        diniyah: 'admin', kepesantrenan: 'none', keuangan: 'none', syahriah: 'none',
        laporan: 'read', wali: 'none', pengaturan: 'none'
    },
    wali_santri: {
        dashboard: 'read', santri: 'read', ustadz: 'none', asrama: 'none', tahfidz: 'read',
        diniyah: 'read', kepesantrenan: 'read', keuangan: 'none', syahriah: 'read',
        laporan: 'none', wali: 'none', pengaturan: 'none'
    }
};

// Helper functions
export function hasPermission(
    role: UserRole,
    module: SekolahModule | PesantrenModule,
    requiredLevel: PermissionLevel
): boolean {
    const levelOrder: Record<PermissionLevel, number> = {
        none: 0,
        read: 1,
        write: 2,
        admin: 3
    };

    const permissions = role.includes('sekolah') || role.includes('kepsek') || role.includes('guru') || role.includes('siswa') || role.includes('tata_usaha') || role.includes('perpustakaan') || role.includes('wali_kelas') || role.includes('bk')
        ? sekolahPermissions[role as SekolahRole]
        : pesantrenPermissions[role as PesantrenRole];

    const actualLevel = (permissions as Record<string, PermissionLevel>)[module] || 'none';
    return levelOrder[actualLevel] >= levelOrder[requiredLevel];
}

export function canAccess(role: UserRole, module: SekolahModule | PesantrenModule): boolean {
    return hasPermission(role, module, 'read');
}

export function canEdit(role: UserRole, module: SekolahModule | PesantrenModule): boolean {
    return hasPermission(role, module, 'write');
}

export function canManage(role: UserRole, module: SekolahModule | PesantrenModule): boolean {
    return hasPermission(role, module, 'admin');
}
