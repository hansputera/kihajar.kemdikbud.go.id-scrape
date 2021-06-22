# KIHAJAR (Kita Harus Belajar)

Apa itu KIHAJAR? KIHAJAR adalah singkatan dari "Kita Harus Belajar".
Program KIHAJAR ada 3 yaitu:
- Kihajar STEM
- Kihajar Explorer
- Kihajar TIK Talks

# Routes

Disini ada 4 route yang saya buat, berikut adalah route dan fungsi serta query yang dibutuhkan.

- `/` (Route awal, yaitu halaman awal dari app)
- `/provinces` (Route yang berfungsi untuk mendapatkan daftar provinsi beserta jumlah siswa dan timnya) | Query yang ada disini bisa diisi adalah `identifier` untuk mencari spesifik provinsi dan nama. Contoh: `?identifier=Sulawesi` dan `?identifier=01000`
- `/daftar-kabupaten` (Route yang berfungsi untuk melihat daftar kabupaten berdasarkan id provinsi) | Query yang dibutuhkan adalah `provinceId` yang diisikan dengan ID Provinsi.
- `/daftar-sekolah` (Route yang berfungsi untuk mendapatkan daftar sekolah dari sebuah kabupaten berdasarkan ID Kabupaten dan Provinsi) | Query yang dibutuhkan adalah `provinceId`, dan `kabId`.
- `/daftar-tim` (Route yang berfungsi untuk mendapatkan detail anggota, kode tim, waktu daftar, dan nama pembimbing berdasarkan id provinsi, kabupaten, id sekolah, dan type id sekolah) | Query yang dibutuhkan adalah `provinceId`, `kabId`, `schoolId`, dan `schoolTypeId`.

