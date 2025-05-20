-- Create database
CREATE DATABASE IF NOT EXISTS integra_test;
USE integra_test;

-- Create provinces table
CREATE TABLE IF NOT EXISTS provinces (
  code VARCHAR(10) PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create regencies table
CREATE TABLE IF NOT EXISTS regencies (
  code VARCHAR(10) PRIMARY KEY,
  province_code VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (province_code) REFERENCES provinces(code)
);

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
  code VARCHAR(10) PRIMARY KEY,
  regency_code VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (regency_code) REFERENCES regencies(code)
);

-- Create people table
CREATE TABLE IF NOT EXISTS people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nik VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  province_code VARCHAR(10) NOT NULL,
  regency_code VARCHAR(10) NOT NULL,
  district_code VARCHAR(10) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(14) NOT NULL,
  email VARCHAR(255) NOT NULL,
  birth_date DATE NOT NULL,
  income INT NOT NULL,
  education VARCHAR(50) NOT NULL,
  occupation VARCHAR(255) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (province_code) REFERENCES provinces(code),
  FOREIGN KEY (regency_code) REFERENCES regencies(code),
  FOREIGN KEY (district_code) REFERENCES districts(code)
);

-- Insert sample provinces data
INSERT INTO provinces (code, name) VALUES
('11', 'ACEH'),
('12', 'SUMATERA UTARA'),
('13', 'SUMATERA BARAT'),
('14', 'RIAU'),
('31', 'DKI JAKARTA'),
('32', 'JAWA BARAT'),
('33', 'JAWA TENGAH'),
('34', 'DI YOGYAKARTA'),
('35', 'JAWA TIMUR');

-- Insert sample regencies data
INSERT INTO regencies (code, province_code, name) VALUES
('3171', '31', 'KOTA JAKARTA PUSAT'),
('3172', '31', 'KOTA JAKARTA UTARA'),
('3173', '31', 'KOTA JAKARTA BARAT'),
('3174', '31', 'KOTA JAKARTA SELATAN'),
('3175', '31', 'KOTA JAKARTA TIMUR'),
('3201', '32', 'KABUPATEN BOGOR'),
('3273', '32', 'KOTA BANDUNG'),
('3301', '33', 'KABUPATEN CILACAP'),
('3302', '33', 'KABUPATEN BANYUMAS'),
('3471', '34', 'KOTA YOGYAKARTA'),
('3501', '35', 'KABUPATEN PACITAN');

-- Insert sample districts data
INSERT INTO districts (code, regency_code, name) VALUES
('317101', '3171', 'TANAH ABANG'),
('317102', '3171', 'MENTENG'),
('317103', '3171', 'SENEN'),
('317201', '3172', 'PENJARINGAN'),
('317202', '3172', 'PADEMANGAN'),
('317301', '3173', 'CENGKARENG'),
('317302', '3173', 'GROGOL PETAMBURAN'),
('317401', '3174', 'KEBAYORAN BARU'),
('317402', '3174', 'KEBAYORAN LAMA'),
('317501', '3175', 'MATRAMAN'),
('317502', '3175', 'JATINEGARA'),
('320101', '3201', 'BOGOR SELATAN'),
('320102', '3201', 'BOGOR TIMUR'),
('327301', '3273', 'SUKASARI'),
('327302', '3273', 'COBLONG'),
('330101', '3301', 'KEDUNGREJA'),
('330102', '3301', 'PATIMUAN'),
('330201', '3302', 'LUMBIR'),
('330202', '3302', 'WANGON'),
('347101', '3471', 'MANTRIJERON'),
('347102', '3471', 'KRATON'),
('350101', '3501', 'DONOROJO'),
('350102', '3501', 'PUNUNG');

-- Insert sample people data
INSERT INTO people (nik, name, province_code, regency_code, district_code, address, phone, email, birth_date, income, education, occupation, notes) VALUES
('1234567890123456', 'Budi Santoso', '31', '3171', '317101', 'Jl. Kebon Kacang No. 10 RT 05/RW 07', '081234567890', 'budi@example.com', '1990-05-15', 5000000, 'S1', 'Karyawan Swasta', 'Aktif sebagai ketua RT'),
('2345678901234567', 'Siti Nurhaliza', '31', '3174', '317401', 'Jl. Melawai 5 No. 20 RT 03/RW 04', '082345678901', 'siti@example.com', '1995-08-20', 7500000, 'S1', 'Guru', 'Guru Matematika SMA'),
('3456789012345678', 'Ahmad Dhani', '32', '3273', '327301', 'Jl. Sukajadi No. 15 RT 02/RW 03', '083456789012', 'ahmad@example.com', '1985-03-10', 10000000, 'S2', 'Dosen', 'Dosen Fakultas Ekonomi'),
('4567890123456789', 'Dewi Lestari', '33', '3301', '330101', 'Jl. Mawar No. 7 RT 01/RW 02', '084567890123', 'dewi@example.com', '2000-12-25', 3000000, 'SMA/SMK', 'Mahasiswa', 'Mahasiswa Semester 5'),
('5678901234567890', 'Joko Widodo', '34', '3471', '347101', 'Jl. Malioboro No. 45 RT 04/RW 05', '085678901234', 'joko@example.com', '1975-06-30', 15000000, 'S3', 'Pengusaha', 'Pemilik Toko Mebel'),
('6789012345678901', 'Rina Marlina', '35', '3501', '350101', 'Jl. Pahlawan No. 12 RT 06/RW 08', '086789012345', 'rina@example.com', '2018-02-14', 0, 'SD', 'Pelajar', 'Siswa SD Kelas 1'),
('7890123456789012', 'Bambang Pamungkas', '31', '3172', '317201', 'Jl. Sunter Jaya No. 30 RT 08/RW 09', '087890123456', 'bambang@example.com', '1980-07-05', 8000000, 'D3', 'Wiraswasta', 'Pemilik Toko Elektronik'),
('8901234567890123', 'Tuti Wulandari', '32', '3201', '320101', 'Jl. Pajajaran No. 55 RT 09/RW 10', '088901234567', 'tuti@example.com', '2010-09-18', 0, 'SD', 'Pelajar', 'Siswa SD Kelas 5'),
('9012345678901234', 'Hendra Setiawan', '33', '3302', '330201', 'Jl. Sudirman No. 75 RT 10/RW 11', '089012345678', 'hendra@example.com', '1988-11-22', 6500000, 'S1', 'Pegawai Negeri', 'PNS Kementerian Pendidikan'),
('0123456789012345', 'Maya Anggraini', '31', '3173', '317301', 'Jl. Tanjung Duren No. 25 RT 11/RW 12', '080123456789', 'maya@example.com', '2015-04-10', 0, 'SD', 'Pelajar', 'Siswa SD Kelas 2');
