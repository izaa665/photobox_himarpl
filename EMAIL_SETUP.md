# Setup Email untuk Photobox

## Cara Install PHPMailer (Manual)

Karena Composer tidak tersedia, download PHPMailer secara manual:

### Opsi 1: Download dari GitHub
1. Buka: https://github.com/PHPMailer/PHPMailer/releases
2. Download versi terbaru (zip)
3. Extract file zip
4. Copy folder `PHPMailer-6.8.0` ke `c:\xampp\htdocs\photobox\`
5. Rename folder menjadi `PHPMailer`

### Opsi 2: Download langsung
1. Buka browser dan kunjungi: https://github.com/PHPMailer/PHPMailer/archive/refs/tags/v6.8.0.zip
2. Save file ke `c:\xampp\htdocs\photobox\PHPMailer.zip`
3. Extract file tersebut
4. Rename folder hasil extract menjadi `PHPMailer`

## Konfigurasi SMTP

### Untuk Gmail:
1. Buka Google Account: https://myaccount.google.com/security
2. Aktifkan **2-Step Verification**
3. Buka: https://myaccount.google.com/apppasswords
4. Buat App Password baru:
   - Pilih "Mail" untuk app
   - Pilih "Other (Custom name)" dan ketik "Photobox"
   - Klik "Generate"
   - Copy password yang muncul (format: xxxx xxxx xxxx xxxx)

5. Edit file `send_email.php` (baris 48-53):
```php
$smtpHost = 'smtp.gmail.com';
$smtpPort = 587;
$smtpUsername = 'email-kamu@gmail.com'; // Ganti dengan email kamu
$smtpPassword = 'xxxx xxxx xxxx xxxx'; // Ganti dengan App Password dari langkah 4
$fromEmail = 'email-kamu@gmail.com'; // Ganti dengan email kamu
$fromName = 'Photobox Fun';
```

### Untuk Email Lain:
- **Outlook/Hotmail**: smtp.office365.com, port 587
- **Yahoo**: smtp.mail.yahoo.com, port 587
- Lihat dokumentasi SMTP provider kamu

## Tanpa PHPMailer (Fallback)

Jika tidak ingin install PHPMailer, sistem akan otomatis menggunakan fungsi `mail()` bawaan PHP.

### Konfigurasi php.ini untuk XAMPP:
1. Buka `C:\xampp\php\php.ini`
2. Cari dan uncomment baris berikut:
```ini
sendmail_path = "\"C:\xampp\sendmail\sendmail.exe\" -t"
```

3. Buka `C:\xampp\sendmail\sendmail.ini`
4. Konfigurasi SMTP:
```ini
smtp_server=smtp.gmail.com
smtp_port=587
auth_username=email-kamu@gmail.com
auth_password=app-password-kamu
force_sender=email-kamu@gmail.com
```

5. Restart Apache di XAMPP Control Panel

## Testing

Setelah konfigurasi:
1. Buka aplikasi Photobox
2. Ambil foto dan pilih layout
3. Masukkan email di step terakhir
4. Cek inbox email untuk hasil

## Troubleshooting

### Email tidak terkirim:
- Cek konfigurasi SMTP di send_email.php
- Pastikan App Password Gmail sudah benar
- Cek folder `temp_photos_*` di photobox (harus kosong setelah kirim)
- Cek error di browser console (F12)

### PHPMailer tidak ditemukan:
- Pastikan folder PHPMailer ada di `c:\xampp\htdocs\photobox\`
- Pastikan struktur folder: `PHPMailer/src/PHPMailer.php`
- Jika tidak ada, sistem akan otomatis fallback ke mail()

### Permission error:
- Pastikan folder photobox bisa write (create folder temp)
- Cek permission folder di XAMPP
