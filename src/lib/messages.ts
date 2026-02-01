// Error messages dalam Bahasa Indonesia yang user-friendly
// Gunakan file ini untuk semua error messages di aplikasi

export const errorMessages = {
    // =============================================
    // NETWORK & SERVER ERRORS
    // =============================================
    network: {
        offline: "Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.",
        timeout: "Permintaan memakan waktu terlalu lama. Silakan coba lagi.",
        serverError: "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi.",
        serviceUnavailable: "Layanan sedang tidak tersedia. Silakan coba beberapa saat lagi.",
        connectionFailed: "Gagal menghubungi server. Periksa koneksi internet Anda."
    },

    // =============================================
    // AUTHENTICATION ERRORS
    // =============================================
    auth: {
        invalidCredentials: "Email atau password salah. Silakan coba lagi.",
        emailNotFound: "Email tidak terdaftar. Silakan daftar terlebih dahulu.",
        emailExists: "Email ini sudah terdaftar. Silakan gunakan email lain atau login.",
        passwordTooShort: "Password minimal 8 karakter untuk keamanan akun Anda.",
        passwordMismatch: "Password dan konfirmasi password tidak cocok.",
        sessionExpired: "Sesi Anda telah berakhir. Silakan login kembali.",
        unauthorized: "Anda tidak memiliki akses. Silakan login terlebih dahulu.",
        accountInactive: "Akun belum diaktifkan. Silakan hubungi admin.",
        accountSuspended: "Akun ditangguhkan. Silakan hubungi admin untuk informasi lebih lanjut."
    },

    // =============================================
    // REGISTRATION ERRORS
    // =============================================
    register: {
        nameRequired: "Mohon masukkan nama lengkap Anda.",
        emailRequired: "Mohon masukkan alamat email yang valid.",
        emailInvalid: "Format email tidak valid. Contoh: nama@email.com",
        whatsappRequired: "Mohon masukkan nomor WhatsApp yang aktif.",
        whatsappInvalid: "Format nomor WhatsApp tidak valid. Gunakan format 08xxxxxxxxxx.",
        passwordRequired: "Mohon buat password untuk akun Anda.",
        institutionRequired: "Mohon masukkan nama lembaga/institusi.",
        addressRequired: "Mohon masukkan alamat lengkap lembaga.",
        planRequired: "Silakan pilih paket langganan yang diinginkan.",
        jenjangRequired: "Silakan pilih minimal satu jenjang sekolah.",
        subdomainRequired: "Mohon tentukan subdomain untuk lembaga Anda.",
        subdomainTaken: "Subdomain sudah digunakan. Silakan pilih nama lain.",
        subdomainInvalid: "Subdomain hanya boleh huruf kecil, angka, dan strip (-). Minimal 3 karakter.",
        bankRequired: "Mohon lengkapi informasi rekening bank.",
        registrationFailed: "Pendaftaran gagal. Silakan coba lagi atau hubungi support."
    },

    // =============================================
    // PAYMENT ERRORS
    // =============================================
    payment: {
        paymentFailed: "Pembayaran gagal. Silakan coba lagi dengan metode pembayaran lain.",
        paymentExpired: "Waktu pembayaran telah habis. Silakan lakukan pembayaran ulang.",
        paymentPending: "Pembayaran sedang diproses. Harap tunggu konfirmasi.",
        insufficientFunds: "Saldo tidak mencukupi. Silakan gunakan metode pembayaran lain.",
        transactionDeclined: "Transaksi ditolak. Silakan hubungi bank Anda.",
        invalidAmount: "Jumlah pembayaran tidak valid.",
        gatewayError: "Terjadi kesalahan pada sistem pembayaran. Silakan coba beberapa saat lagi."
    },

    // =============================================
    // DATA VALIDATION ERRORS
    // =============================================
    validation: {
        required: "Kolom ini wajib diisi.",
        minLength: (min: number) => `Minimal ${min} karakter.`,
        maxLength: (max: number) => `Maksimal ${max} karakter.`,
        invalidFormat: "Format tidak valid.",
        invalidNumber: "Mohon masukkan angka yang valid.",
        invalidDate: "Tanggal tidak valid.",
        invalidPhone: "Nomor telepon tidak valid. Gunakan format 08xxxxxxxxxx.",
        invalidEmail: "Format email tidak valid.",
        fileTooLarge: "Ukuran file terlalu besar. Maksimal 5MB.",
        fileTypeInvalid: "Tipe file tidak didukung. Gunakan JPG, PNG, atau PDF."
    },

    // =============================================
    // CRUD OPERATION ERRORS
    // =============================================
    crud: {
        createFailed: "Gagal menyimpan data. Silakan coba lagi.",
        updateFailed: "Gagal memperbarui data. Silakan coba lagi.",
        deleteFailed: "Gagal menghapus data. Silakan coba lagi.",
        loadFailed: "Gagal memuat data. Silakan refresh halaman.",
        notFound: "Data tidak ditemukan.",
        duplicateEntry: "Data sudah ada. Silakan gunakan data yang berbeda."
    },

    // =============================================
    // SUCCESS MESSAGES
    // =============================================
    success: {
        saved: "Data berhasil disimpan!",
        updated: "Data berhasil diperbarui!",
        deleted: "Data berhasil dihapus!",
        registered: "Pendaftaran berhasil! Silakan cek email Anda.",
        loggedIn: "Login berhasil! Selamat datang.",
        loggedOut: "Anda telah keluar dari sistem.",
        paymentSuccess: "Pembayaran berhasil! Terima kasih.",
        emailSent: "Email berhasil dikirim!",
        passwordChanged: "Password berhasil diubah!"
    },

    // =============================================
    // CONFIRMATION MESSAGES
    // =============================================
    confirm: {
        delete: "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
        logout: "Apakah Anda yakin ingin keluar?",
        cancel: "Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang.",
        unsavedChanges: "Anda memiliki perubahan yang belum disimpan. Yakin ingin meninggalkan halaman?"
    },

    // =============================================
    // LOADING & STATUS MESSAGES
    // =============================================
    status: {
        loading: "Memuat data...",
        processing: "Sedang diproses...",
        saving: "Menyimpan...",
        uploading: "Mengunggah...",
        searching: "Mencari...",
        noData: "Belum ada data.",
        noResults: "Tidak ada hasil yang ditemukan."
    }
};

// Helper function to get error message
export function getErrorMessage(error: any): string {
    if (typeof error === 'string') {
        return error;
    }

    if (error?.response?.data?.error) {
        return error.response.data.error;
    }

    if (error?.message) {
        // Map common English errors to Indonesian
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('fetch')) {
            return errorMessages.network.connectionFailed;
        }
        if (message.includes('timeout')) {
            return errorMessages.network.timeout;
        }
        if (message.includes('unauthorized') || message.includes('401')) {
            return errorMessages.auth.sessionExpired;
        }
        if (message.includes('forbidden') || message.includes('403')) {
            return errorMessages.auth.unauthorized;
        }

        return error.message;
    }

    return errorMessages.network.serverError;
}

// API error handler
export function handleApiError(error: any): string {
    const status = error?.response?.status;

    switch (status) {
        case 400:
            return error?.response?.data?.error || "Permintaan tidak valid. Silakan periksa data Anda.";
        case 401:
            return errorMessages.auth.sessionExpired;
        case 403:
            return errorMessages.auth.unauthorized;
        case 404:
            return errorMessages.crud.notFound;
        case 409:
            return error?.response?.data?.error || errorMessages.crud.duplicateEntry;
        case 422:
            return error?.response?.data?.error || "Data yang dikirim tidak valid.";
        case 500:
            return errorMessages.network.serverError;
        case 502:
        case 503:
            return errorMessages.network.serviceUnavailable;
        default:
            return getErrorMessage(error);
    }
}
