-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 06 Jul 2020 pada 12.57
-- Versi server: 10.4.11-MariaDB
-- Versi PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edneed`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `nik` bigint(16) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `notelp` bigint(13) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`nik`, `name`, `email`, `notelp`, `password`) VALUES
(3127459599555, 'aldytamas', 'laraqesas@gmail.com', 877899248, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
(3175060408826154, 'budisetiawan', 'budi@gmail.com', 81267215623, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
(2131414141414141, 'manekin', 'portalsak@gmail.com', 87789924821, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
(3175060408826177, 'ratih', 'ratih@gmail.com', 81226127865, '$2b$10$YicaNm7tBqCQ0O3frly8BOCWZB6XMQA6W1fYYfo6M2Unr5Dm51gRC'),
(3175060408826143, 'ridhosinaga', 'anitysa@gmail.com', 82226127865, '$2b$10$YicaNm7tBqCQ0O3frly8BOCWZB6XMQA6W1fYYfo6M2Unr5Dm51gRC');

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `parent_id` int(30) NOT NULL,
  `name` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 0, 'Parent Category 1', '2020-07-05 15:19:17', '0000-00-00'),
(2, 0, 'Parent Category 2', '2020-07-05 15:19:17', '0000-00-00'),
(3, 0, 'Parent Category 3', '2020-07-05 15:19:17', '0000-00-00'),
(4, 1, 'Sub Category 1 Part 1', '2020-07-06 10:24:09', '0000-00-00'),
(5, 2, 'Sub Category 2', '2020-07-05 15:19:17', '0000-00-00'),
(6, 3, 'Sub Category 3', '2020-07-05 15:19:17', '0000-00-00'),
(7, 4, 'Sub Sub Category 1', '2020-07-05 15:19:17', '0000-00-00'),
(8, 5, 'Sub Sub Category 2', '2020-07-05 15:19:17', '0000-00-00'),
(9, 6, 'Sub Sub Category 3', '2020-07-05 15:19:17', '0000-00-00'),
(10, 0, 'Parent Category 4', '2020-07-06 05:14:34', NULL),
(12, 0, 'Parent Category 5', '2020-07-06 05:15:37', NULL),
(14, 1, 'Sub Category 1 Part 2', '2020-07-06 10:31:28', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `name` varchar(20) NOT NULL,
  `mobile` bigint(13) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`name`, `mobile`, `password`) VALUES
('adul', 982718271, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
('aldy', 787878, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
('aldytamara', 12345, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
('indahprimata', 8771277212, '$2b$10$YicaNm7tBqCQ0O3frly8BOcHgQZFdvhky9r0fP9tyTFJdyuBH0/gi'),
('kocag', 87399829, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
('lazuardykhatulistiwa', 87765665422, '$2b$10$YicaNm7tBqCQ0O3frly8BOCWZB6XMQA6W1fYYfo6M2Unr5Dm51gRC'),
('rahmat', 89819, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi'),
('sule', 877899248134, '$2b$10$YicaNm7tBqCQ0O3frly8BOvSiqlKE6h1wRxOHzSfAhdPmbdjR/Vqi');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `nik` (`nik`);

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`name`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
