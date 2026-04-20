-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 20, 2026 at 06:50 AM
-- Server version: 10.11.15-MariaDB
-- PHP Version: 8.1.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `srivagroupsin_business_db1`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `module` varchar(100) NOT NULL,
  `record_id` bigint(20) NOT NULL,
  `action` enum('create','update','delete') NOT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

CREATE TABLE `businesses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `add_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_enabled` tinyint(1) DEFAULT 1,
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`id`, `user_id`, `name`, `email`, `phone`, `details`, `add_json`, `is_active`, `is_enabled`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Circuit Point', 'supermarket@mail.com', '9876543210', 'Retail grocery store', '{\"city\": \"Chennai\", \"category\": \"Retail\"}', 1, 1, 'active', '2026-03-10 10:47:57', '2026-03-12 09:51:28'),
(2, 1, 'Cpoint', 'electronics@mail.com', '9876500000', 'Electronics shop', '{\"city\": \"Chennai\", \"category\": \"Electronics\"}', 1, 1, 'active', '2026-03-10 10:47:57', '2026-03-12 09:50:56'),
(3, 2, 'Ravi Textiles', 'textiles@mail.com', '9876511111', 'Clothing retail store', '{\"city\": \"Madurai\", \"category\": \"Textiles\"}', 1, 1, 'active', '2026-03-10 10:47:57', '2026-03-10 10:47:57');

-- --------------------------------------------------------

--
-- Table structure for table `business_mode_master`
--

CREATE TABLE `business_mode_master` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business_modules`
--

CREATE TABLE `business_modules` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_modules`
--

INSERT INTO `business_modules` (`id`, `business_id`, `name`, `created_at`) VALUES
(1, 1, 'Sales', '2026-03-11 06:01:46'),
(6, 40, 'd12', '2026-04-06 09:05:05'),
(7, 40, 'dr', '2026-04-06 09:06:33'),
(8, 40, 'w12', '2026-04-06 09:08:02'),
(9, 40, 'Sale', '2026-04-07 04:25:58'),
(10, 40, 'q12', '2026-04-07 04:26:35');

-- --------------------------------------------------------

--
-- Table structure for table `business_module_items`
--

CREATE TABLE `business_module_items` (
  `id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_module_items`
--

INSERT INTO `business_module_items` (`id`, `module_id`, `business_id`, `name`, `created_at`) VALUES
(1, 1, 1, 'Retail', '2026-03-11 06:02:12'),
(2, 6, 40, 'WWWW', '2026-04-06 09:20:58'),
(4, 6, 40, 'rt23', '2026-04-06 09:33:30'),
(5, 10, 40, 'A', '2026-04-07 04:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `business_product_allocations`
--

CREATE TABLE `business_product_allocations` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `category_group_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `min_sale_qty` int(11) DEFAULT 1,
  `max_sale_qty` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_product_allocations`
--

INSERT INTO `business_product_allocations` (`id`, `business_id`, `setup_id`, `category_group_id`, `category_id`, `brand_id`, `product_id`, `min_sale_qty`, `max_sale_qty`, `is_active`, `created_at`) VALUES
(1, 2, 2, 3, 520, 58, 2653, 12, 22, 1, '2026-03-11 08:33:40'),
(2, 2, 2, 3, 524, 281, 2611, 13, 23, 1, '2026-03-11 08:34:09'),
(3, 2, 2, 3, 523, 58, 2652, 12, 22, 1, '2026-03-11 09:15:01'),
(4, 1, 1, 1, 11, 228, 2651, 12, 22, 0, '2026-03-12 06:08:53'),
(6, 1, 1, 1, 11, 232, 2147, 20, 200, 0, '2026-03-12 06:53:42'),
(8, 1, 1, 16, 484, 232, 2584, 12, 22, 0, '2026-03-13 08:40:54'),
(9, 1, 1, 16, 10, 232, 806, 1002, 2005, 0, '2026-03-14 08:25:35'),
(12, 1, 1, 15, 97, 297, 2934, 12, 22, 1, '2026-03-24 09:01:44'),
(13, 1, 1, 15, 399, 8, 2607, 1, 1, 1, '2026-03-24 09:13:45'),
(14, 1, 1, 16, 82, 232, 553, 1002, 2005, 0, '2026-03-24 09:15:48'),
(15, 1, 1, 16, 82, 232, 555, 12, 22, 1, '2026-03-24 09:17:54'),
(18, 1, 1, 16, 82, 232, 556, 12, 22, 1, '2026-03-24 09:24:45'),
(19, 1, 1, 16, 82, 232, 557, 1, 1, 1, '2026-03-24 09:25:04'),
(20, 1, 1, 15, 97, 147, 2260, 20, 90, 1, '2026-03-26 08:34:37'),
(21, 1, 1, 15, 399, 31, 2605, 12, 200, 1, '2026-03-26 08:56:44'),
(22, 1, 1, 16, 567, 232, 2139, 50, 80, 1, '2026-04-01 02:16:08'),
(23, 40, 40, 16, 82, 232, 555, 1, 1, 1, '2026-04-07 03:51:25'),
(24, 40, 40, 16, 601, 232, 2899, 10, 100, 1, '2026-04-08 06:13:27'),
(25, 40, 40, 16, 73, 232, 3712, 5, 10, 1, '2026-04-10 10:18:25'),
(26, 40, 40, 15, 97, 297, 2934, 123, 12, 0, '2026-04-15 05:13:14'),
(27, 40, 40, 16, 232, 232, 601, 211, 12, 0, '2026-04-15 05:21:24'),
(28, 40, 40, 16, 271, 272, 431, 12, 1, 1, '2026-04-16 03:52:03');

-- --------------------------------------------------------

--
-- Table structure for table `business_setup`
--

CREATE TABLE `business_setup` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup`
--

INSERT INTO `business_setup` (`id`, `business_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-03-10 11:44:13', '2026-03-10 11:44:13'),
(2, 2, '2026-03-11 08:36:32', '2026-03-11 08:36:32'),
(3, 40, '2026-04-06 08:32:56', '2026-04-06 08:32:56');

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_brands`
--

CREATE TABLE `business_setup_brands` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_brands`
--

INSERT INTO `business_setup_brands` (`id`, `business_id`, `setup_id`, `brand_id`) VALUES
(129, 2, 2, 124),
(130, 2, 2, 228),
(131, 2, 2, 230),
(132, 2, 2, 232),
(133, 1, 1, 6),
(134, 1, 1, 8),
(135, 1, 1, 10),
(136, 1, 1, 31),
(137, 1, 1, 32),
(138, 1, 1, 33),
(139, 1, 1, 34),
(140, 1, 1, 36),
(141, 1, 1, 37),
(142, 1, 1, 135),
(143, 1, 1, 136),
(144, 1, 1, 63),
(145, 1, 1, 23),
(146, 1, 1, 26),
(147, 1, 1, 27),
(148, 1, 1, 28),
(149, 1, 1, 30),
(150, 1, 1, 130),
(151, 1, 1, 234),
(152, 1, 1, 235),
(153, 1, 1, 236),
(154, 1, 1, 237),
(155, 1, 1, 149),
(156, 1, 1, 150),
(157, 1, 1, 147),
(158, 1, 1, 239),
(159, 1, 1, 297),
(160, 1, 1, 232),
(161, 1, 1, 228),
(162, 1, 1, 230),
(163, 1, 1, 124),
(164, 1, 1, 11),
(165, 1, 1, 160),
(166, 1, 1, 271),
(167, 1, 1, 272),
(168, 1, 1, 273),
(169, 1, 1, 279);

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_categories`
--

CREATE TABLE `business_setup_categories` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_categories`
--

INSERT INTO `business_setup_categories` (`id`, `business_id`, `setup_id`, `category_id`) VALUES
(195, 2, 2, 299),
(196, 2, 2, 10),
(197, 1, 1, 3),
(198, 1, 1, 212),
(199, 1, 1, 213),
(200, 1, 1, 211),
(201, 1, 1, 10),
(202, 1, 1, 54),
(203, 1, 1, 82),
(204, 1, 1, 106),
(205, 1, 1, 110),
(206, 1, 1, 123),
(207, 1, 1, 275),
(208, 1, 1, 408),
(209, 1, 1, 413),
(210, 1, 1, 414),
(211, 1, 1, 415),
(212, 1, 1, 416),
(213, 1, 1, 427),
(214, 1, 1, 429),
(215, 1, 1, 430),
(216, 1, 1, 431),
(217, 1, 1, 433),
(218, 1, 1, 434),
(219, 1, 1, 435),
(220, 1, 1, 485),
(221, 1, 1, 534),
(222, 1, 1, 546),
(223, 1, 1, 568),
(224, 1, 1, 587),
(225, 1, 1, 614),
(226, 1, 1, 203),
(227, 1, 1, 399),
(228, 1, 1, 400),
(229, 1, 1, 401),
(230, 1, 1, 464),
(231, 1, 1, 91),
(232, 1, 1, 96),
(233, 1, 1, 97),
(234, 1, 1, 98),
(235, 1, 1, 99),
(236, 1, 1, 100),
(237, 1, 1, 117),
(238, 1, 1, 132),
(239, 1, 1, 589),
(240, 1, 1, 358),
(241, 1, 1, 299),
(242, 1, 1, 447),
(243, 1, 1, 567),
(244, 1, 1, 593),
(245, 1, 1, 594),
(246, 1, 1, 597),
(247, 1, 1, 598),
(248, 1, 1, 513),
(249, 1, 1, 514),
(250, 1, 1, 515),
(251, 1, 1, 487),
(252, 1, 1, 488),
(253, 1, 1, 489),
(254, 1, 1, 490),
(255, 1, 1, 491),
(256, 1, 1, 492),
(257, 1, 1, 493),
(258, 1, 1, 495),
(259, 1, 1, 73),
(260, 1, 1, 84),
(261, 1, 1, 90),
(262, 1, 1, 276),
(263, 1, 1, 62),
(264, 1, 1, 64),
(265, 1, 1, 535),
(266, 1, 1, 537),
(267, 1, 1, 555),
(268, 1, 1, 551),
(269, 1, 1, 552),
(270, 1, 1, 553),
(271, 1, 1, 599),
(272, 1, 1, 600),
(273, 1, 1, 601),
(274, 1, 1, 622),
(275, 1, 1, 518),
(276, 1, 1, 536),
(277, 1, 1, 540),
(278, 1, 1, 541),
(279, 1, 1, 542),
(280, 1, 1, 543),
(281, 1, 1, 544),
(282, 1, 1, 545),
(283, 1, 1, 420),
(284, 1, 1, 615),
(285, 1, 1, 616),
(286, 1, 1, 617),
(287, 1, 1, 618),
(288, 1, 1, 619),
(289, 1, 1, 482),
(290, 1, 1, 483),
(291, 1, 1, 484);

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_category_groups`
--

CREATE TABLE `business_setup_category_groups` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `category_group_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_category_groups`
--

INSERT INTO `business_setup_category_groups` (`id`, `business_id`, `setup_id`, `category_group_id`) VALUES
(51, 2, 2, 16),
(52, 2, 2, 12),
(53, 1, 1, 15),
(54, 1, 1, 16);

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_modes`
--

CREATE TABLE `business_setup_modes` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `mode_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_modes`
--

INSERT INTO `business_setup_modes` (`id`, `business_id`, `setup_id`, `mode_id`) VALUES
(1, 1, 1, 1),
(2, 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_module_items`
--

CREATE TABLE `business_setup_module_items` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `module_item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_module_items`
--

INSERT INTO `business_setup_module_items` (`id`, `business_id`, `setup_id`, `module_item_id`) VALUES
(36, 2, 2, 1),
(37, 2, 2, 4),
(38, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_sales_types`
--

CREATE TABLE `business_setup_sales_types` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `sales_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_sales_types`
--

INSERT INTO `business_setup_sales_types` (`id`, `business_id`, `setup_id`, `sales_type_id`) VALUES
(1, 1, 1, 1),
(2, 1, 1, 2),
(3, 1, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_service_types`
--

CREATE TABLE `business_setup_service_types` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `service_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_service_types`
--

INSERT INTO `business_setup_service_types` (`id`, `business_id`, `setup_id`, `service_type_id`) VALUES
(1, 1, 1, 1),
(2, 1, 1, 2),
(3, 1, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `business_setup_shop_types`
--

CREATE TABLE `business_setup_shop_types` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `shop_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_setup_shop_types`
--

INSERT INTO `business_setup_shop_types` (`id`, `business_id`, `setup_id`, `shop_type_id`) VALUES
(57, 2, 2, 4),
(58, 2, 2, 5),
(59, 1, 1, 1),
(60, 1, 1, 2),
(61, 1, 1, 3),
(62, 1, 1, 4),
(63, 1, 1, 5);

-- --------------------------------------------------------

--
-- Table structure for table `business_variants`
--

CREATE TABLE `business_variants` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `business_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `business_id`, `name`, `phone`, `email`, `address`, `created_at`) VALUES
(1, NULL, 'Walk-in Customer', NULL, NULL, NULL, '2026-03-11 10:58:04'),
(14, 1, 'hari', '9025084185', NULL, NULL, '2026-03-13 07:51:06'),
(15, 1, 'kavin', '8072148623', NULL, NULL, '2026-03-13 09:23:44'),
(26, 1, 'Walk-in', 'N/A', NULL, NULL, '2026-03-20 01:57:34'),
(27, 40, 'Walk-in', 'N/A', NULL, NULL, '2026-04-09 04:37:00');

-- --------------------------------------------------------

--
-- Table structure for table `product_stock`
--

CREATE TABLE `product_stock` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `is_self_produced` tinyint(1) DEFAULT 0,
  `storage_location_id` int(11) DEFAULT NULL,
  `total_qty` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_stock`
--

INSERT INTO `product_stock` (`id`, `business_id`, `product_id`, `supplier_id`, `is_self_produced`, `storage_location_id`, `total_qty`, `created_at`) VALUES
(34, 40, 2899, 2, 0, 75, 0, '2026-04-10 04:51:58'),
(35, 40, 3712, 2, 0, 75, 0, '2026-04-10 10:24:03');

-- --------------------------------------------------------

--
-- Table structure for table `product_stock_types`
--

CREATE TABLE `product_stock_types` (
  `id` int(11) NOT NULL,
  `stock_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `stock_type_id` int(11) NOT NULL,
  `qty` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_stock_types`
--

INSERT INTO `product_stock_types` (`id`, `stock_id`, `variant_id`, `stock_type_id`, `qty`) VALUES
(1, 7, NULL, 1, 9),
(2, 8, NULL, 1, 15),
(3, 10, NULL, 1, 20),
(4, 11, NULL, 1, 2),
(5, 11, NULL, 2, -18),
(6, 11, NULL, 3, 17),
(7, 12, NULL, 1, 15),
(8, 12, NULL, 2, -85),
(9, 12, NULL, 3, 85),
(10, 14, NULL, 3, 1000),
(12, 15, NULL, 1, 0),
(13, 4, NULL, 1, 89),
(14, 16, NULL, 1, 1),
(15, 16, NULL, 2, 29),
(16, 17, NULL, 1, 0),
(17, 17, NULL, 2, 0),
(18, 17, NULL, 3, 20),
(19, 18, NULL, 1, 1),
(20, 17, NULL, 1, 1),
(21, 19, NULL, 1, 0),
(23, 20, NULL, 1, 0),
(24, 21, NULL, 1, 0),
(25, 21, NULL, 2, 8),
(26, 21, NULL, 3, 10),
(27, 22, NULL, 1, 0),
(28, 22, NULL, 2, 23),
(29, 22, NULL, 3, 22),
(30, 23, NULL, 1, 11),
(31, 23, NULL, 2, 26),
(32, 23, NULL, 3, 50),
(33, 28, 38, 1, 5),
(34, 28, 38, 2, 2),
(35, 28, 38, 3, 3),
(36, 28, 39, 1, 1),
(37, 28, 40, 1, 1),
(38, 28, 40, 2, 2),
(39, 28, 40, 3, 7),
(40, 28, 41, 1, 13),
(41, 29, 42, 1, 12),
(42, 30, 43, 1, 1),
(43, 30, 44, 1, 1),
(44, 29, 45, 1, 12),
(45, 31, 46, 1, 1),
(46, 32, 47, 1, 1),
(47, 31, 48, 1, 1),
(48, 33, 49, 1, 1),
(49, 31, 50, 1, 1),
(50, 31, 51, 1, 1),
(55, 34, 54, 1, 23),
(56, 35, 55, 2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_stock_variants`
--

CREATE TABLE `product_stock_variants` (
  `id` int(11) NOT NULL,
  `stock_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `buying_price` decimal(10,2) DEFAULT NULL,
  `profit_margin` decimal(10,2) DEFAULT NULL,
  `selling_price` decimal(10,2) DEFAULT NULL,
  `qty` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_stock_variants`
--

INSERT INTO `product_stock_variants` (`id`, `stock_id`, `variant_id`, `buying_price`, `profit_margin`, `selling_price`, `qty`) VALUES
(1, 3, 1, '0.00', '0.00', '0.00', 0),
(2, 5, 1, '100.00', '20.00', '120.00', 2),
(3, 6, 1, '0.00', '0.00', '0.00', 22),
(4, 7, 1, '100.00', '20.00', '120.00', 9),
(5, 8, 1, '18.00', '2.00', '20.00', 15),
(6, 10, 1, '150.00', '50.00', '200.00', 0),
(7, 10, 2, '30.00', '20.00', '50.00', 0),
(8, 11, 1, '150.00', '70.00', '220.00', 0),
(9, 11, 2, '60.00', '30.00', '90.00', 0),
(10, 11, 3, '80.00', '20.00', '100.00', 0),
(11, 12, 1, '60.00', '40.00', '100.00', 0),
(12, 12, 2, '80.00', '23.00', '103.00', 0),
(13, 12, 3, '90.00', '50.00', '140.00', 5),
(14, 13, 1, '12.00', '3.00', '15.00', 12),
(15, 14, 1, '100.00', '20.00', '120.00', 1000),
(17, 15, 1, '160.00', '40.00', '200.00', 0),
(18, 15, 2, '50.00', '20.00', '70.00', 0),
(19, 4, 1, '1000.00', '500.00', '1500.00', 89),
(20, 16, 1, '100.00', '200.00', '300.00', 0),
(21, 16, 1, '100.00', '20.00', '120.00', 28),
(22, 17, 1, '500.00', '50.00', '550.00', 8),
(23, 17, 2, '100.00', '100.00', '200.00', 8),
(24, 17, 3, '30.00', '10.00', '40.00', 4),
(25, 18, 1, '12.00', '3.00', '15.00', 0),
(26, 17, 2, '12.00', '2.00', '14.00', 1),
(27, 19, 1, '200.00', '90.00', '290.00', 0),
(29, 20, 1, '1.00', '1.00', '2.00', 11),
(30, 21, 1, '1000.00', '500.00', '1500.00', 0),
(31, 21, 2, '800.00', '90.00', '890.00', 8),
(32, 21, 3, '900.00', '700.00', '1600.00', 10),
(33, 22, 1, '900.00', '90.00', '990.00', 35),
(34, 22, 2, '800.00', '60.00', '860.00', 10),
(35, 23, 1, '10000.00', '2000.00', '12000.00', 9),
(36, 23, 2, '8000.00', '2000.00', '10000.00', 9),
(37, 23, 3, '12000.00', '2000.00', '14000.00', 69),
(38, 28, 1, '100.00', '12.00', '112.00', 0),
(39, 28, 1, '11.00', '11.00', '22.00', 1),
(40, 28, 2, '20.00', '30.00', '50.00', 10),
(41, 28, 1, '3.00', '3.00', '6.00', 13),
(42, 29, 1, '23.00', '3.00', '26.00', 12),
(43, 30, 1, '10.00', '2.00', '12.00', 1),
(44, 30, 1, '10.00', '2.00', '12.00', 1),
(45, 29, 1, '0.00', '0.00', '0.00', 12),
(46, 31, 1, '1.00', '1.00', '2.00', 1),
(47, 32, 1, '1.00', '1.00', '2.00', 1),
(48, 31, 1, '1.00', '1.00', '2.00', 1),
(49, 33, 1, '1.00', '1.00', '2.00', 1),
(50, 31, 1, '1.00', '1.00', '2.00', 1),
(51, 31, 1, '1.00', '1.00', '2.00', 1),
(54, 34, 1, '33.00', '3.00', '36.00', 23),
(55, 35, 2, '8.00', '12.00', '20.00', 10);

-- --------------------------------------------------------

--
-- Table structure for table `product_variant_master`
--

CREATE TABLE `product_variant_master` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_variant_master`
--

INSERT INTO `product_variant_master` (`id`, `name`) VALUES
(1, 'Original'),
(2, 'Imported'),
(3, 'Complimentary'),
(4, 'Refurbished'),
(5, 'Used');

-- --------------------------------------------------------

--
-- Table structure for table `sales_bills`
--

CREATE TABLE `sales_bills` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `external_customer_id` int(11) DEFAULT NULL,
  `customer_type` enum('USER','BUSINESS') NOT NULL,
  `customer_source` varchar(50) DEFAULT 'CENTRAL_API',
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `customer_meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`customer_meta`)),
  `bill_number` varchar(50) NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT 0.00,
  `discount` decimal(10,2) DEFAULT 0.00,
  `tax` decimal(10,2) DEFAULT 0.00,
  `final_amount` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_bills`
--

INSERT INTO `sales_bills` (`id`, `business_id`, `external_customer_id`, `customer_type`, `customer_source`, `customer_name`, `customer_phone`, `customer_meta`, `bill_number`, `payment_method`, `total_amount`, `discount`, `tax`, `final_amount`, `created_at`, `updated_at`) VALUES
(13, 1, 14, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00001', 'CASH', '2000.00', '100.00', '50.00', '1950.00', '2026-03-13 07:51:06', '2026-04-10 05:40:14'),
(14, 1, 14, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00002', 'CASH', '2000.00', '100.00', '50.00', '1950.00', '2026-03-13 09:15:45', '2026-04-10 05:40:14'),
(15, 1, 1, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00003', 'CASH', '2000.00', '100.00', '50.00', '1950.00', '2026-03-13 09:16:47', '2026-04-10 05:40:14'),
(16, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00004', 'CASH', '3200.00', '0.00', '0.00', '3200.00', '2026-03-13 09:23:44', '2026-04-10 05:40:14'),
(17, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00005', 'CASH', '1250.00', '0.00', '0.00', '1250.00', '2026-03-13 09:43:28', '2026-04-10 05:40:14'),
(18, 1, 1, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00006', 'CASH', '0.00', '0.00', '0.00', '0.00', '2026-03-14 04:56:57', '2026-04-10 05:40:14'),
(19, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00007', 'CASH', '2120.00', '0.00', '0.00', '2120.00', '2026-03-14 08:16:41', '2026-04-10 05:40:14'),
(20, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00008', 'CASH', '10460.00', '0.00', '0.00', '10460.00', '2026-03-14 08:29:49', '2026-04-10 05:40:14'),
(21, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00009', 'CASH', '100.00', '0.00', '0.00', '100.00', '2026-03-17 05:25:19', '2026-04-10 05:40:14'),
(22, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00010', 'CASH', '0.00', '0.00', '0.00', '0.00', '2026-03-17 05:26:20', '2026-04-10 05:40:14'),
(23, 1, 1, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00011', 'CASH', '515.00', '0.00', '0.00', '515.00', '2026-03-17 07:21:14', '2026-04-10 05:40:14'),
(35, 1, 18, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00012', 'CASH', '120.00', '0.00', '0.00', '120.00', '2026-03-19 06:22:25', '2026-04-10 05:40:14'),
(36, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00013', 'CASH', '790.00', '0.00', '0.00', '790.00', '2026-03-19 06:51:47', '2026-04-10 05:40:14'),
(41, 1, 18, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00014', 'CASH', '200.00', '0.00', '0.00', '200.00', '2026-03-19 06:56:44', '2026-04-10 05:40:14'),
(44, 1, 18, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00015', 'CASH', '550.00', '0.00', '0.00', '550.00', '2026-03-19 06:59:51', '2026-04-10 05:40:14'),
(54, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00016', 'CASH', '90.00', '0.00', '0.00', '90.00', '2026-03-20 01:57:34', '2026-04-10 05:40:14'),
(56, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00017', 'CASH', '350.00', '0.00', '0.00', '350.00', '2026-03-20 01:58:29', '2026-04-10 05:40:14'),
(57, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00018', 'CASH', '1620.00', '0.00', '0.00', '1620.00', '2026-03-20 01:59:01', '2026-04-10 05:40:14'),
(58, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00019', 'CASH', '15.00', '0.00', '0.00', '15.00', '2026-03-23 07:13:03', '2026-04-10 05:40:14'),
(59, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00020', 'CASH', '3480.00', '0.00', '0.00', '3480.00', '2026-03-24 09:14:52', '2026-04-10 05:40:14'),
(61, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00021', 'CASH', '180.00', '0.00', '0.00', '180.00', '2026-03-26 08:33:00', '2026-04-10 05:40:14'),
(62, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00022', 'CASH', '2.00', '0.00', '0.00', '2.00', '2026-03-26 08:33:40', '2026-04-10 05:40:14'),
(63, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00023', 'CASH', '12000.00', '0.00', '0.00', '12000.00', '2026-03-26 08:37:00', '2026-04-10 05:40:14'),
(64, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00024', 'CASH', '3000.00', '0.00', '0.00', '3000.00', '2026-03-26 08:37:45', '2026-04-10 05:40:14'),
(65, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00025', 'CASH', '1780.00', '0.00', '0.00', '1780.00', '2026-03-26 08:38:26', '2026-04-10 05:40:14'),
(66, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00026', 'CASH', '36000.00', '0.00', '0.00', '36000.00', '2026-03-26 09:02:14', '2026-04-10 05:40:14'),
(67, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00027', 'CASH', '24750.00', '0.00', '0.00', '24750.00', '2026-03-27 08:26:40', '2026-04-10 05:40:14'),
(68, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00028', 'CASH', '1250.00', '32.00', '430.00', '1648.00', '2026-03-30 07:51:34', '2026-04-10 05:40:14'),
(69, 1, 26, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00029', 'CASH', '5900.00', '0.00', '0.00', '5900.00', '2026-04-01 03:36:21', '2026-04-10 05:40:14'),
(70, 1, 15, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00030', 'CASH', '2000.00', '160.00', '1200.00', '3040.00', '2026-04-02 04:18:21', '2026-04-10 05:40:14'),
(71, 40, 27, 'USER', 'CENTRAL_API', NULL, NULL, NULL, 'BILL-00001', 'CASH', '1120.00', '0.00', '0.00', '1120.00', '2026-04-09 04:37:00', '2026-04-10 05:40:14'),
(72, 40, 44, 'USER', 'CENTRAL_API', 'lohit', '9986745645', NULL, 'BILL-00002', 'CASH', '108.00', '0.00', '0.00', '108.00', '2026-04-10 07:13:59', '2026-04-10 07:13:59'),
(73, 40, 42, 'BUSINESS', 'CENTRAL_API', 'circuit point', '9367714442', NULL, 'BILL-00003', 'CASH', '108.00', '0.00', '0.00', '108.00', '2026-04-10 07:15:54', '2026-04-10 07:15:54'),
(74, 40, 46, 'BUSINESS', 'CENTRAL_API', 'ravi', '9785645643', NULL, 'BILL-00004', 'CASH', '72.00', '0.00', '0.00', '72.00', '2026-04-10 07:24:14', '2026-04-10 07:24:14'),
(75, 40, 45, 'BUSINESS', 'CENTRAL_API', 'ravitrade', '7465764365', '{\"email\": \"ravitrade@gmail.com\", \"address\": {\"area\": \"Serayampalayam\", \"state\": \"tamilnadu\", \"street\": \"Neelambur\", \"country\": \"India\", \"pincode\": \"641669\", \"district\": \"Coimbatore\", \"door_number\": \"12\"}, \"gst_number\": \"22AAAAA0000A1Z1\"}', 'BILL-00005', 'CASH', '72.00', '0.00', '0.00', '72.00', '2026-04-10 07:28:26', '2026-04-10 07:28:26');

-- --------------------------------------------------------

--
-- Table structure for table `sales_bill_items`
--

CREATE TABLE `sales_bill_items` (
  `id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `stock_type_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_bill_items`
--

INSERT INTO `sales_bill_items` (`id`, `bill_id`, `product_id`, `variant_id`, `stock_type_id`, `price`, `qty`, `total`) VALUES
(13, 13, 2651, 1, 1, '120.00', 1, '120.00'),
(14, 14, 2651, 1, 1, '120.00', 1, '120.00'),
(15, 15, 2651, 1, 1, '120.00', 1, '120.00'),
(16, 16, 2147, 1, 2, '120.00', 10, '1200.00'),
(17, 16, 2584, 1, 2, '200.00', 10, '2000.00'),
(18, 17, 2584, 2, 2, '50.00', 5, '250.00'),
(19, 17, 2584, 1, 2, '200.00', 5, '1000.00'),
(20, 18, 2651, 1, 2, '0.00', 12, '0.00'),
(21, 19, 2147, 3, 2, '100.00', 6, '600.00'),
(22, 19, 2147, 2, 2, '90.00', 12, '1080.00'),
(23, 19, 2147, 1, 2, '220.00', 2, '440.00'),
(24, 20, 806, 3, 2, '140.00', 10, '1400.00'),
(25, 20, 806, 2, 2, '103.00', 20, '2060.00'),
(26, 20, 806, 1, 2, '100.00', 70, '7000.00'),
(27, 21, 2147, 3, 2, '100.00', 1, '100.00'),
(28, 22, 2147, 1, 2, '0.00', 1, '0.00'),
(29, 23, 806, 2, 2, '103.00', 5, '515.00'),
(41, 35, 2147, 1, 2, '120.00', 1, '120.00'),
(42, 36, 2584, 1, 2, '550.00', 1, '550.00'),
(43, 36, 2584, 2, 2, '200.00', 1, '200.00'),
(44, 36, 2584, 3, 2, '40.00', 1, '40.00'),
(49, 41, 2584, 2, 2, '200.00', 1, '200.00'),
(52, 44, 2584, 1, 2, '550.00', 1, '550.00'),
(64, 54, 2147, 2, 1, '90.00', 1, '90.00'),
(67, 56, 2584, 2, 1, '70.00', 5, '350.00'),
(68, 57, 2147, 1, 1, '120.00', 1, '120.00'),
(69, 57, 2651, 1, 1, '1500.00', 1, '1500.00'),
(70, 58, 2584, 1, 1, '15.00', 1, '15.00'),
(71, 59, 2934, 1, 1, '290.00', 12, '3480.00'),
(73, 61, 2147, 2, 1, '90.00', 2, '180.00'),
(74, 62, 2934, 1, 1, '2.00', 1, '2.00'),
(75, 63, 2260, 1, 1, '1500.00', 8, '12000.00'),
(76, 64, 2260, 1, 2, '1500.00', 2, '3000.00'),
(77, 65, 2260, 2, 1, '890.00', 2, '1780.00'),
(78, 66, 2605, 1, 1, '12000.00', 1, '12000.00'),
(79, 66, 2605, 2, 1, '10000.00', 1, '10000.00'),
(80, 66, 2605, 3, 1, '14000.00', 1, '14000.00'),
(81, 67, 2260, 1, 1, '990.00', 25, '24750.00'),
(82, 68, 2584, 2, 1, '200.00', 5, '1358.00'),
(83, 69, 2584, 1, 3, '550.00', 10, '5500.00'),
(84, 69, 2584, 3, 3, '40.00', 10, '400.00'),
(85, 70, 2584, 1, 1, '200.00', 10, '3040.00'),
(86, 71, 2899, 1, 1, '112.00', 10, '1120.00'),
(87, 72, 2899, 1, 1, '36.00', 3, '108.00'),
(88, 73, 2899, 1, 1, '36.00', 3, '108.00'),
(89, 74, 2899, 1, 1, '36.00', 2, '72.00'),
(90, 75, 2899, 1, 1, '36.00', 2, '72.00');

-- --------------------------------------------------------

--
-- Table structure for table `sales_returns`
--

CREATE TABLE `sales_returns` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `stock_type_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_type_master`
--

CREATE TABLE `sales_type_master` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_type_master`
--

CREATE TABLE `service_type_master` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shop_type_master`
--

CREATE TABLE `shop_type_master` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shop_type_master`
--

INSERT INTO `shop_type_master` (`id`, `name`) VALUES
(1, 'Export'),
(2, 'Import'),
(3, 'Local Shop'),
(4, 'Online Shop'),
(5, 'Wholesale Shop');

-- --------------------------------------------------------

--
-- Table structure for table `stock_movements`
--

CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `stock_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `stock_type_id` int(11) DEFAULT NULL,
  `movement_type` enum('PURCHASE','SALE','RETURN','ADJUSTMENT','TRANSFER') NOT NULL,
  `qty` int(11) NOT NULL,
  `storage_location_id` int(11) DEFAULT NULL,
  `reference_type` varchar(50) DEFAULT NULL,
  `reference_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_movements`
--

INSERT INTO `stock_movements` (`id`, `business_id`, `product_id`, `stock_id`, `variant_id`, `stock_type_id`, `movement_type`, `qty`, `storage_location_id`, `reference_type`, `reference_id`, `created_at`) VALUES
(1, 1, 2651, 7, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 13, '2026-03-13 07:51:06'),
(2, 1, 2651, 7, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 14, '2026-03-13 09:15:45'),
(3, 1, 2651, 7, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 15, '2026-03-13 09:16:47'),
(4, 1, 2147, 5, 1, 2, 'SALE', -10, NULL, 'SALE_BILL', 16, '2026-03-13 09:23:44'),
(5, 1, 2584, 10, 1, 2, 'SALE', -10, NULL, 'SALE_BILL', 16, '2026-03-13 09:23:44'),
(6, 1, 2584, 10, 2, 2, 'SALE', -5, NULL, 'SALE_BILL', 17, '2026-03-13 09:43:28'),
(7, 1, 2584, 10, 1, 2, 'SALE', -5, NULL, 'SALE_BILL', 17, '2026-03-13 09:43:28'),
(8, 1, 2651, 3, 1, 2, 'SALE', -12, NULL, 'SALE_BILL', 18, '2026-03-14 04:56:57'),
(9, 1, 2147, 11, 3, 2, 'SALE', -6, NULL, 'SALE_BILL', 19, '2026-03-14 08:16:41'),
(10, 1, 2147, 11, 2, 2, 'SALE', -12, NULL, 'SALE_BILL', 19, '2026-03-14 08:16:41'),
(11, 1, 2147, 11, 1, 2, 'SALE', -2, NULL, 'SALE_BILL', 19, '2026-03-14 08:16:41'),
(12, 1, 806, 12, 3, 2, 'SALE', -10, NULL, 'SALE_BILL', 20, '2026-03-14 08:29:49'),
(13, 1, 806, 12, 2, 2, 'SALE', -20, NULL, 'SALE_BILL', 20, '2026-03-14 08:29:49'),
(14, 1, 806, 12, 1, 2, 'SALE', -70, NULL, 'SALE_BILL', 20, '2026-03-14 08:29:49'),
(15, 1, 2147, 11, 3, 2, 'SALE', -1, NULL, 'SALE_BILL', 21, '2026-03-17 05:25:19'),
(16, 1, 2147, 6, 1, 2, 'SALE', -1, NULL, 'SALE_BILL', 22, '2026-03-17 05:26:20'),
(17, 1, 806, 12, 2, 2, 'SALE', -5, NULL, 'SALE_BILL', 23, '2026-03-17 07:21:14'),
(18, 1, 2147, 16, 1, 2, 'SALE', -1, NULL, 'SALE_BILL', 35, '2026-03-19 06:22:25'),
(19, 1, 2584, 17, 1, 2, 'SALE', -1, NULL, 'SALE_BILL', 36, '2026-03-19 06:51:47'),
(20, 1, 2584, 17, 2, 2, 'SALE', -1, NULL, 'SALE_BILL', 36, '2026-03-19 06:51:47'),
(21, 1, 2584, 17, 3, 2, 'SALE', -1, NULL, 'SALE_BILL', 36, '2026-03-19 06:51:47'),
(22, 1, 2584, 17, 2, 2, 'SALE', -1, NULL, 'SALE_BILL', 41, '2026-03-19 06:56:44'),
(23, 1, 2584, 17, 1, 2, 'SALE', -1, NULL, 'SALE_BILL', 44, '2026-03-19 06:59:51'),
(24, 1, 2147, 11, 2, 1, 'SALE', -1, NULL, 'SALE_BILL', 54, '2026-03-20 01:57:34'),
(26, 1, 2584, 15, 2, 1, 'SALE', -5, NULL, 'SALE_BILL', 56, '2026-03-20 01:58:29'),
(27, 1, 2147, 16, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 57, '2026-03-20 01:59:01'),
(28, 1, 2651, 4, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 57, '2026-03-20 01:59:01'),
(29, 1, 2584, 18, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 58, '2026-03-23 07:13:03'),
(30, 1, 2934, 19, 1, 1, 'SALE', -12, NULL, 'SALE_BILL', 59, '2026-03-24 09:14:52'),
(31, 1, 2147, 11, 2, 1, 'SALE', -2, NULL, 'SALE_BILL', 61, '2026-03-26 08:33:00'),
(32, 1, 2934, 20, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 62, '2026-03-26 08:33:40'),
(33, 1, 2260, 21, 1, 1, 'SALE', -8, NULL, 'SALE_BILL', 63, '2026-03-26 08:37:00'),
(34, 1, 2260, 21, 1, 2, 'SALE', -2, NULL, 'SALE_BILL', 64, '2026-03-26 08:37:45'),
(35, 1, 2260, 21, 2, 1, 'SALE', -2, NULL, 'SALE_BILL', 65, '2026-03-26 08:38:26'),
(36, 1, 2605, 23, 1, 1, 'SALE', -1, NULL, 'SALE_BILL', 66, '2026-03-26 09:02:14'),
(37, 1, 2605, 23, 2, 1, 'SALE', -1, NULL, 'SALE_BILL', 66, '2026-03-26 09:02:14'),
(38, 1, 2605, 23, 3, 1, 'SALE', -1, NULL, 'SALE_BILL', 66, '2026-03-26 09:02:14'),
(39, 1, 2260, 22, 1, 1, 'SALE', -25, NULL, 'SALE_BILL', 67, '2026-03-27 08:26:40'),
(40, 1, 2584, 17, 2, 1, 'SALE', -5, NULL, 'SALE_BILL', 68, '2026-03-30 07:51:34'),
(41, 1, 2584, 17, 1, 3, 'SALE', -10, NULL, 'SALE_BILL', 69, '2026-04-01 03:36:21'),
(42, 1, 2584, 17, 3, 3, 'SALE', -10, NULL, 'SALE_BILL', 69, '2026-04-01 03:36:21'),
(43, 1, 2584, 15, 1, 1, 'SALE', -10, NULL, 'SALE_BILL', 70, '2026-04-02 04:18:21'),
(44, 40, 2899, 28, 1, 1, 'SALE', -10, NULL, 'SALE_BILL', 71, '2026-04-09 04:37:00'),
(45, 40, 2899, 34, 1, 1, 'SALE', -3, NULL, 'SALE_BILL', 72, '2026-04-10 07:13:59'),
(46, 40, 2899, 34, 1, 1, 'SALE', -3, NULL, 'SALE_BILL', 73, '2026-04-10 07:15:54'),
(47, 40, 2899, 34, 1, 1, 'SALE', -2, NULL, 'SALE_BILL', 74, '2026-04-10 07:24:14'),
(48, 40, 2899, 34, 1, 1, 'SALE', -2, NULL, 'SALE_BILL', 75, '2026-04-10 07:28:26');

-- --------------------------------------------------------

--
-- Table structure for table `stock_type_master`
--

CREATE TABLE `stock_type_master` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_type_master`
--

INSERT INTO `stock_type_master` (`id`, `business_id`, `name`) VALUES
(1, 1, 'Display'),
(2, 1, 'Shop in Sales'),
(3, 1, 'Outside Stocks');

-- --------------------------------------------------------

--
-- Table structure for table `storage_address_fields`
--

CREATE TABLE `storage_address_fields` (
  `id` int(11) NOT NULL,
  `storage_type_id` int(11) NOT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `field_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storage_address_fields`
--

INSERT INTO `storage_address_fields` (`id`, `storage_type_id`, `field_name`, `created_at`, `field_order`) VALUES
(1, 1, 'Address', '2026-04-01 11:16:43', 1),
(2, 1, 'Pincode', '2026-04-01 11:16:51', 2),
(3, 2, 'Place', '2026-04-02 05:04:28', 1),
(4, 2, 'Address', '2026-04-02 05:04:28', 2),
(5, 2, 'Landmark', '2026-04-02 05:04:28', 3),
(6, 2, 'Pincode', '2026-04-02 05:04:28', 4),
(7, 3, 'Place', '2026-04-02 08:45:38', 1),
(8, 3, 'Address', '2026-04-02 08:45:38', 2),
(9, 3, 'Landmark', '2026-04-02 08:45:39', 3),
(10, 3, 'Pincode', '2026-04-02 08:45:39', 4),
(11, 3, 'sss', '2026-04-02 09:19:46', 11),
(14, 3, 'dd', '2026-04-03 04:40:13', 6),
(17, 3, 'CC', '2026-04-03 05:24:47', 10),
(18, 5, 'ss', '2026-04-06 09:39:12', 1),
(19, 5, 'rrr', '2026-04-09 01:55:26', 2),
(20, 4, 'CITY', '2026-04-09 04:15:54', 1),
(21, 7, 'address', '2026-04-10 10:06:44', 1),
(22, 7, 'pincode', '2026-04-10 10:06:54', 2),
(23, 7, 'place', '2026-04-10 10:08:48', 3),
(24, 5, 'ww', '2026-04-11 06:33:07', 3),
(25, 4, 'swq', '2026-04-15 08:57:28', 2),
(26, 5, 'ewwe', '2026-04-15 09:20:00', 4),
(27, 4, 'ew', '2026-04-15 09:20:17', 3),
(28, 4, 'wewe', '2026-04-15 09:21:45', 5),
(29, 4, 'ew', '2026-04-15 09:26:39', 4),
(30, 4, '45', '2026-04-15 09:32:09', 6),
(31, 4, 'sfd', '2026-04-15 09:34:07', 7),
(32, 4, 'r', '2026-04-15 09:43:34', 8),
(33, 4, 'fd', '2026-04-15 09:48:54', 9),
(34, 4, 'ju', '2026-04-15 10:00:25', 10),
(35, 4, 'yj', '2026-04-15 10:04:41', 11),
(36, 4, 're', '2026-04-15 10:06:20', 12),
(37, 4, 'g', '2026-04-15 10:09:43', 13),
(38, 4, 'e', '2026-04-15 10:11:43', 14),
(39, 4, 'dewwe', '2026-04-15 10:13:31', 15),
(40, 4, 'err', '2026-04-15 10:14:44', 16),
(41, 4, 'f', '2026-04-16 03:52:15', 17);

-- --------------------------------------------------------

--
-- Table structure for table `storage_address_values`
--

CREATE TABLE `storage_address_values` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `storage_type_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `field_value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `address_group_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storage_address_values`
--

INSERT INTO `storage_address_values` (`id`, `business_id`, `storage_type_id`, `field_id`, `field_value`, `created_at`, `address_group_id`) VALUES
(1, 1, 1, 1, 'Nellambur', '2026-04-01 11:17:15', 1775042235933),
(2, 1, 1, 2, '123456', '2026-04-01 11:17:15', 1775042235933),
(3, 1, 1, 1, 'CBE', '2026-04-01 11:17:24', 1775042244364),
(4, 1, 1, 2, '778945', '2026-04-01 11:17:24', 1775042244364),
(5, 1, 2, 3, 'AA', '2026-04-02 05:04:45', 1775106285977),
(9, 40, 5, 18, 'q34', '2026-04-09 01:58:40', 1775699920228),
(10, 40, 5, 19, 'w12', '2026-04-09 01:58:40', 1775699920228),
(11, 40, 4, 20, 'CBE', '2026-04-09 04:16:05', 1775708165989),
(12, 40, 7, 21, 'neelambur', '2026-04-10 10:09:35', 1775815775776),
(13, 40, 7, 22, '23456', '2026-04-10 10:09:35', 1775815775776),
(14, 40, 7, 23, 'neelambur', '2026-04-10 10:09:35', 1775815775776),
(15, 40, 4, 20, 'gfe', '2026-04-15 08:59:19', 1776243559847),
(16, 40, 4, 20, 'e', '2026-04-15 09:00:56', 1776243656516),
(17, 40, 4, 25, 'ew', '2026-04-15 09:00:56', 1776243656516),
(18, 40, 4, 0, NULL, '2026-04-15 09:21:50', 1776244910573),
(19, 40, 4, 0, NULL, '2026-04-15 09:21:50', 1776244910573),
(20, 40, 4, 0, NULL, '2026-04-15 09:21:50', 1776244910573),
(21, 40, 4, 20, 'we', '2026-04-15 09:23:50', 1776245030599),
(22, 40, 4, 25, 'we', '2026-04-15 09:23:50', 1776245030599),
(23, 40, 4, 27, 'we', '2026-04-15 09:23:50', 1776245030599),
(24, 40, 4, 28, 'we', '2026-04-15 09:23:50', 1776245030599),
(25, 40, 4, 0, NULL, '2026-04-15 09:32:19', 1776245539576),
(26, 40, 4, 0, NULL, '2026-04-15 09:32:19', 1776245539576),
(27, 40, 4, 0, NULL, '2026-04-15 09:32:19', 1776245539576),
(28, 40, 4, 0, NULL, '2026-04-15 09:32:19', 1776245539576),
(29, 40, 4, 0, NULL, '2026-04-15 09:34:14', 1776245654097),
(30, 40, 4, 0, NULL, '2026-04-15 09:34:14', 1776245654097),
(31, 40, 4, 0, NULL, '2026-04-15 09:34:14', 1776245654097),
(32, 40, 4, 0, NULL, '2026-04-15 09:34:14', 1776245654097),
(33, 40, 4, 0, NULL, '2026-04-15 09:34:14', 1776245654097),
(34, 40, 4, 0, NULL, '2026-04-15 09:43:37', 1776246217120),
(35, 40, 4, 0, NULL, '2026-04-15 09:43:37', 1776246217120),
(36, 40, 4, 0, NULL, '2026-04-15 09:43:37', 1776246217120),
(37, 40, 4, 0, NULL, '2026-04-15 09:43:37', 1776246217120),
(38, 40, 4, 0, NULL, '2026-04-15 09:43:37', 1776246217120),
(39, 40, 4, 0, NULL, '2026-04-15 09:43:37', 1776246217120),
(40, 40, 4, 0, NULL, '2026-04-15 09:49:04', 1776246544386),
(41, 40, 4, 0, NULL, '2026-04-15 09:49:04', 1776246544386),
(42, 40, 4, 0, NULL, '2026-04-15 09:49:04', 1776246544386),
(43, 40, 4, 0, NULL, '2026-04-15 09:49:04', 1776246544386),
(44, 40, 4, 0, NULL, '2026-04-15 09:49:04', 1776246544386),
(45, 40, 4, 0, NULL, '2026-04-15 09:49:04', 1776246544386),
(46, 40, 4, 0, NULL, '2026-04-15 09:49:04', 1776246544386),
(47, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(48, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(49, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(50, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(51, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(52, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(53, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(54, 40, 4, 0, NULL, '2026-04-15 10:00:32', 1776247232333),
(55, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(56, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(57, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(58, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(59, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(60, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(61, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(62, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(63, 40, 4, 0, NULL, '2026-04-15 10:04:49', 1776247489928),
(64, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(65, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(66, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(67, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(68, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(69, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(70, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(71, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(72, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(73, 40, 4, 0, NULL, '2026-04-15 10:06:23', 1776247583912),
(74, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(75, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(76, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(77, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(78, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(79, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(80, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(81, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(82, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(83, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(84, 40, 4, 0, NULL, '2026-04-15 10:09:46', 1776247786535),
(85, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(86, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(87, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(88, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(89, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(90, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(91, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(92, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(93, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(94, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(95, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(96, 40, 4, 0, NULL, '2026-04-15 10:11:45', 1776247905758),
(97, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(98, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(99, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(100, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(101, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(102, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(103, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(104, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(105, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(106, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(107, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(108, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(109, 40, 4, 0, NULL, '2026-04-15 10:13:33', 1776248013349),
(110, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(111, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(112, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(113, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(114, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(115, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(116, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(117, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(118, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(119, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(120, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(121, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(122, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(123, 40, 4, 0, NULL, '2026-04-15 10:14:47', 1776248087689),
(124, 40, 4, 20, '', '2026-04-15 10:16:12', 1776248172477),
(125, 40, 4, 25, '', '2026-04-15 10:16:12', 1776248172477),
(126, 40, 4, 27, '', '2026-04-15 10:16:12', 1776248172477),
(127, 40, 4, 28, '', '2026-04-15 10:16:12', 1776248172477),
(128, 40, 4, 29, '', '2026-04-15 10:16:12', 1776248172477),
(129, 40, 4, 30, '', '2026-04-15 10:16:12', 1776248172477),
(130, 40, 4, 31, '', '2026-04-15 10:16:12', 1776248172477),
(131, 40, 4, 32, '', '2026-04-15 10:16:12', 1776248172477),
(132, 40, 4, 33, '', '2026-04-15 10:16:12', 1776248172477),
(133, 40, 4, 34, '', '2026-04-15 10:16:12', 1776248172477),
(134, 40, 4, 35, '', '2026-04-15 10:16:12', 1776248172477),
(135, 40, 4, 36, '', '2026-04-15 10:16:12', 1776248172477),
(136, 40, 4, 37, '', '2026-04-15 10:16:12', 1776248172477),
(137, 40, 4, 38, '', '2026-04-15 10:16:12', 1776248172477),
(138, 40, 4, 39, '', '2026-04-15 10:16:12', 1776248172477),
(139, 40, 4, 40, '', '2026-04-15 10:16:12', 1776248172477),
(140, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(141, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(142, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(143, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(144, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(145, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(146, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(147, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(148, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(149, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(150, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(151, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(152, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(153, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(154, 40, 4, 0, NULL, '2026-04-15 10:58:35', 1776250715433),
(155, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(156, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(157, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(158, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(159, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(160, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(161, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(162, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(163, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(164, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(165, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(166, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(167, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(168, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451),
(169, 40, 4, 0, NULL, '2026-04-16 03:52:18', 1776311538451);

-- --------------------------------------------------------

--
-- Table structure for table `storage_locations`
--

CREATE TABLE `storage_locations` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `storage_type_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `level_id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `partition_rows` int(11) DEFAULT NULL,
  `partition_columns` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storage_locations`
--

INSERT INTO `storage_locations` (`id`, `business_id`, `storage_type_id`, `parent_id`, `level_id`, `code`, `name`, `created_at`, `partition_rows`, `partition_columns`) VALUES
(1, 1, 1, NULL, 1, 'B1', 'Building 1', '2026-04-01 11:18:50', NULL, NULL),
(2, 1, 1, 1, 3, 'F1', 'Floor 1', '2026-04-01 11:21:42', NULL, NULL),
(3, 1, 1, 2, 4, 'R1', 'Rack 1', '2026-04-01 11:43:32', NULL, NULL),
(4, 1, 1, 3, 5, 'S1', 'Shelf', '2026-04-01 11:46:38', NULL, NULL),
(5, 1, 1, 4, 6, 'B1', 'Box 1', '2026-04-01 11:58:28', NULL, NULL),
(6, 1, 1, 5, 7, 'C1', 'Container 1', '2026-04-01 11:58:39', NULL, NULL),
(7, 1, 1, 6, 8, 'R1', 'Row/Col', '2026-04-01 11:59:12', 2, 2),
(8, 1, 1, 7, 8, 'R1-A1', 'A1', '2026-04-01 11:59:12', NULL, NULL),
(9, 1, 1, 7, 8, 'R1-A2', 'A2', '2026-04-01 11:59:12', NULL, NULL),
(10, 1, 1, 7, 8, 'R1-B1', 'B1', '2026-04-01 11:59:12', NULL, NULL),
(11, 1, 1, 7, 8, 'R1-B2', 'B2', '2026-04-01 11:59:12', NULL, NULL),
(12, 1, 2, NULL, 9, 'A', 'A', '2026-04-02 05:04:49', NULL, NULL),
(13, 1, 2, 12, 10, 'A-B', 'B', '2026-04-02 05:05:00', NULL, NULL),
(14, 1, 2, 13, 11, 'B-C', 'C', '2026-04-02 05:06:44', NULL, NULL),
(15, 1, 2, NULL, 14, 'R12', 'R12', '2026-04-02 05:07:31', NULL, NULL),
(16, 1, 2, 15, 14, 'R12-S1', 'S1', '2026-04-02 05:07:56', NULL, NULL),
(17, 1, 2, 15, 14, 'R12-S2', 'S2', '2026-04-02 05:07:56', NULL, NULL),
(21, 35, 3, NULL, 17, 'B1', 'A', '2026-04-03 05:26:09', NULL, NULL),
(22, 35, 3, 21, 18, 'B1', 'AA', '2026-04-03 05:26:15', NULL, NULL),
(23, 35, 3, 22, 19, 'F1', 'DD', '2026-04-03 05:26:21', NULL, NULL),
(24, 35, 3, 23, 20, 'P1', 'ff', '2026-04-03 06:05:44', NULL, NULL),
(25, 35, 3, 24, 21, 'R1', 'fe', '2026-04-03 06:05:53', NULL, NULL),
(29, 40, 5, 30, 29, 'S1', 'AAA', '2026-04-06 09:39:58', NULL, NULL),
(30, 40, 5, 29, 29, 'S2', 'AAAA', '2026-04-06 09:40:01', NULL, NULL),
(63, 40, 5, NULL, 30, 'B1', 'A', '2026-04-09 03:51:01', NULL, NULL),
(64, 40, 5, 63, 29, 'F3', '1', '2026-04-09 03:51:06', NULL, NULL),
(65, 40, 5, 64, 31, 'R1', '101', '2026-04-09 03:51:15', NULL, NULL),
(66, 40, 5, 65, 33, 'S1', 'S1', '2026-04-09 03:51:26', NULL, NULL),
(67, 40, 5, 66, 32, 'R1', '1', '2026-04-09 03:51:36', NULL, NULL),
(68, 40, 5, 67, 35, 'C1', 'C1', '2026-04-09 03:51:46', NULL, NULL),
(69, 40, 5, 68, 34, 'B1', 'B1', '2026-04-09 03:51:55', NULL, NULL),
(70, 40, 5, 69, 36, 'R1', 'RC1', '2026-04-09 03:52:12', 1, 1),
(71, 40, 5, 70, 36, 'R1-A1', 'A1', '2026-04-09 03:52:12', NULL, NULL),
(72, 40, 4, NULL, 37, '1', 'A', '2026-04-09 04:17:04', NULL, NULL),
(73, 40, 4, 72, 38, 'F1', '2', '2026-04-09 04:17:14', NULL, NULL),
(74, 40, 4, 73, 39, 'R1', '3', '2026-04-09 04:17:18', NULL, NULL),
(75, 40, 4, 74, 40, 'B1', '4', '2026-04-09 04:17:26', NULL, NULL),
(76, 40, 5, NULL, 30, 'B2', 'circuitpoint', '2026-04-10 10:15:37', NULL, NULL),
(77, 40, 5, 76, 31, 'R2', 'rooms 1', '2026-04-10 10:16:29', NULL, NULL),
(79, 40, 7, NULL, 41, 'B1', 'circuitpoinnt', '2026-04-10 11:05:41', NULL, NULL),
(80, 40, 7, 79, 42, 'F1', 'floor 1', '2026-04-10 11:05:55', NULL, NULL),
(81, 40, 7, 80, 43, 'R1', 'rack 1', '2026-04-10 11:06:13', NULL, NULL),
(82, 40, 7, 81, 44, 'S1', 'shelf 1', '2026-04-10 11:06:40', NULL, NULL),
(83, 40, 7, 82, 45, 'B1', 'fingerprint box', '2026-04-10 11:06:56', NULL, NULL),
(84, 40, 7, 83, 47, 'C1', 'partition 1', '2026-04-10 11:08:36', 2, 3),
(85, 40, 7, 84, 47, 'C1-A1', 'A1', '2026-04-10 11:08:36', NULL, NULL),
(86, 40, 7, 84, 47, 'C1-A2', 'A2', '2026-04-10 11:08:36', NULL, NULL),
(87, 40, 7, 84, 47, 'C1-A3', 'A3', '2026-04-10 11:08:36', NULL, NULL),
(88, 40, 7, 84, 47, 'C1-B1', 'B1', '2026-04-10 11:08:36', NULL, NULL),
(89, 40, 7, 84, 47, 'C1-B2', 'B2', '2026-04-10 11:08:36', NULL, NULL),
(90, 40, 7, 84, 47, 'C1-B3', 'B3', '2026-04-10 11:08:36', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `storage_structure_levels`
--

CREATE TABLE `storage_structure_levels` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `storage_type_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `level_order` int(11) DEFAULT NULL,
  `is_partitionable` tinyint(1) DEFAULT 0,
  `partition_rows` int(11) DEFAULT NULL,
  `partition_columns` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storage_structure_levels`
--

INSERT INTO `storage_structure_levels` (`id`, `business_id`, `storage_type_id`, `parent_id`, `name`, `level_order`, `is_partitionable`, `partition_rows`, `partition_columns`, `created_at`) VALUES
(1, 1, 1, NULL, 'Building', 1, 0, NULL, NULL, '2026-04-01 11:17:34'),
(3, 1, 1, NULL, 'Floor', 2, 0, NULL, NULL, '2026-04-01 11:17:49'),
(4, 1, 1, NULL, 'Rack', 3, 0, NULL, NULL, '2026-04-01 11:17:57'),
(5, 1, 1, NULL, 'Shelf', 4, 0, NULL, NULL, '2026-04-01 11:18:01'),
(6, 1, 1, NULL, 'Box', 5, 0, NULL, NULL, '2026-04-01 11:18:04'),
(7, 1, 1, NULL, 'Container', 6, 0, NULL, NULL, '2026-04-01 11:18:09'),
(8, 1, 1, NULL, 'Row-Col', 7, 1, NULL, NULL, '2026-04-01 11:18:23'),
(9, 1, 2, NULL, 'Block', 1, 0, NULL, NULL, '2026-04-02 05:04:28'),
(10, 1, 2, 9, 'Building', 2, 0, NULL, NULL, '2026-04-02 05:04:28'),
(11, 1, 2, 10, 'Floor', 3, 0, NULL, NULL, '2026-04-02 05:04:28'),
(12, 1, 2, 11, 'Partition', 4, 0, NULL, NULL, '2026-04-02 05:04:28'),
(13, 1, 2, 12, 'Room', 5, 0, NULL, NULL, '2026-04-02 05:04:28'),
(14, 1, 2, 13, 'Rack & Shelf', 6, 0, NULL, NULL, '2026-04-02 05:04:28'),
(15, 1, 2, 14, 'Box & Container', 7, 0, NULL, NULL, '2026-04-02 05:04:28'),
(16, 1, 2, 15, 'Row & Column', 8, 0, NULL, NULL, '2026-04-02 05:04:28'),
(17, 35, 3, NULL, 'Block', 1, 0, NULL, NULL, '2026-04-02 08:45:39'),
(18, 35, 3, 17, 'Building', 2, 0, NULL, NULL, '2026-04-02 08:45:39'),
(19, 35, 3, 18, 'Floor', 3, 0, NULL, NULL, '2026-04-02 08:45:39'),
(20, 35, 3, 19, 'Partition', 4, 0, NULL, NULL, '2026-04-02 08:45:39'),
(21, 35, 3, 20, 'Room', 5, 0, NULL, NULL, '2026-04-02 08:45:39'),
(22, 35, 3, 21, 'Rack & Shelf', 6, 0, NULL, NULL, '2026-04-02 08:45:39'),
(23, 35, 3, 22, 'Box & Container', 7, 0, NULL, NULL, '2026-04-02 08:45:39'),
(24, 35, 3, 23, 'Row & Column', 8, 0, NULL, NULL, '2026-04-02 08:45:39'),
(29, 40, 5, NULL, 'Floor122w', 3, 0, NULL, NULL, '2026-04-06 09:39:18'),
(30, 40, 5, NULL, 'Building2', 1, 0, NULL, NULL, '2026-04-06 09:40:16'),
(31, 40, 5, NULL, 'Room12', 2, 0, NULL, NULL, '2026-04-06 12:17:46'),
(32, 40, 5, NULL, 'Rack', 5, 0, NULL, NULL, '2026-04-06 12:17:52'),
(33, 40, 5, NULL, 'Shelf', 4, 0, NULL, NULL, '2026-04-06 12:17:59'),
(34, 40, 5, NULL, 'Box12', 7, 0, NULL, NULL, '2026-04-06 12:18:05'),
(35, 40, 5, NULL, 'Container', 6, 0, NULL, NULL, '2026-04-06 12:18:09'),
(36, 40, 5, NULL, 'Row-Col', 8, 1, NULL, NULL, '2026-04-06 12:18:30'),
(37, 40, 4, NULL, 'BUILDING', 1, 0, NULL, NULL, '2026-04-09 04:16:20'),
(38, 40, 4, NULL, 'FLOOR', 2, 0, NULL, NULL, '2026-04-09 04:16:26'),
(39, 40, 4, NULL, 'RACK', 3, 0, NULL, NULL, '2026-04-09 04:16:33'),
(40, 40, 4, NULL, 'BOX', 4, 0, NULL, NULL, '2026-04-09 04:16:38'),
(41, 40, 7, NULL, 'building', 1, 0, NULL, NULL, '2026-04-10 10:10:02'),
(42, 40, 7, NULL, 'floor', 2, 0, NULL, NULL, '2026-04-10 10:10:10'),
(43, 40, 7, NULL, 'rack', 3, 0, NULL, NULL, '2026-04-10 10:10:43'),
(44, 40, 7, NULL, 'shelf', 4, 0, NULL, NULL, '2026-04-10 10:10:52'),
(45, 40, 7, NULL, 'box', 5, 0, NULL, NULL, '2026-04-10 10:11:06'),
(47, 40, 7, NULL, 'container', 6, 1, NULL, NULL, '2026-04-10 10:12:23'),
(50, 40, 4, NULL, '43434343', 5, 0, NULL, NULL, '2026-04-15 10:16:18'),
(51, 40, 4, NULL, '555445', 6, 1, NULL, NULL, '2026-04-15 10:58:45');

-- --------------------------------------------------------

--
-- Table structure for table `storage_types`
--

CREATE TABLE `storage_types` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storage_types`
--

INSERT INTO `storage_types` (`id`, `business_id`, `name`, `created_at`) VALUES
(1, 1, 'WareHouse', '2026-04-01 11:16:29'),
(2, 1, 'NN', '2026-04-02 05:04:28'),
(3, 35, 'ss', '2026-04-02 08:45:38'),
(4, 40, 'D11', '2026-04-06 08:33:23'),
(5, 40, 's2', '2026-04-06 09:39:04'),
(6, 41, 'SS', '2026-04-09 01:53:43'),
(7, 40, 'CP', '2026-04-10 10:06:23');

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `min_purchase_qty` int(11) DEFAULT 1,
  `max_purchase_qty` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `company_name` varchar(255) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `gst_number` varchar(30) DEFAULT NULL,
  `with_gst` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `business_id`, `name`, `phone`, `email`, `min_purchase_qty`, `max_purchase_qty`, `created_at`, `company_name`, `pan_number`, `gst_number`, `with_gst`) VALUES
(1, 1, 'ABC Traders', '9876543210', 'abc@gmail.com', 10, 100, '2026-03-11 08:27:01', NULL, NULL, NULL, 0),
(2, 35, '55ERGDSF', 'SDGFFSRG', NULL, 1, NULL, '2026-04-03 06:15:42', 'SDFDS', 'HRTHW4', '12345', 1),
(4, 35, 'CD', 'WW', NULL, 1, NULL, '2026-04-03 06:27:03', 'WW', 'WW', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `supplier_addresses`
--

CREATE TABLE `supplier_addresses` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `address_type` enum('permanent','current') DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_addresses`
--

INSERT INTO `supplier_addresses` (`id`, `supplier_id`, `address_type`, `address_line_1`, `address_line_2`, `city`, `state`, `pincode`) VALUES
(1, 2, 'permanent', 'SGSE', 'DSFGSD', 'GSDFGS', 'Tamil Nadu', 'DFGSDGWE'),
(2, 2, 'current', 'SGSE', 'DSFGSD', 'GSDFGS', 'Tamil Nadu', 'DFGSDGWE'),
(5, 4, 'permanent', 'WW', 'WW', 'WW', 'Tamil Nadu', 'WW'),
(6, 4, 'current', 'WW', 'WW', 'WW', 'Tamil Nadu', 'WW');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_branches`
--

CREATE TABLE `supplier_branches` (
  `id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `branch_name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_branches`
--

INSERT INTO `supplier_branches` (`id`, `supplier_id`, `branch_name`, `phone`) VALUES
(1, 2, 'SRFWAE', 'SDGFFSRG'),
(3, 4, 'WWW', 'WW');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT '000000',
  `details` text DEFAULT NULL,
  `add_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_enabled` tinyint(1) DEFAULT 1,
  `status` varchar(50) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `central_token` text DEFAULT NULL,
  `central_token_expiry` datetime DEFAULT NULL,
  `user_id` varchar(50) DEFAULT NULL
) ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `details`, `add_json`, `is_active`, `is_enabled`, `status`, `created_at`, `updated_at`, `central_token`, `central_token_expiry`, `user_id`) VALUES
(1, 'Hari', 'srihari8489@gmail.com', '000000', 'Main account user', '{\"plan\": \"premium\", \"role\": \"owner\"}', 1, 1, 'active', '2026-03-10 10:47:57', '2026-03-10 10:53:04', NULL, NULL, NULL),
(2, 'Ravi', 'Kavin@mail.com', '000000', 'Secondary account user', '{\"plan\": \"basic\", \"role\": \"owner\"}', 1, 1, 'active', '2026-03-10 10:47:57', '2026-03-10 10:47:57', NULL, NULL, NULL),
(3, 'narendra', 'yudeshprasath@gmail.com', 'external_auth', NULL, NULL, 1, 1, 'active', '2026-04-02 06:35:26', '2026-04-20 02:09:46', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ5dWRlc2hwcmFzYXRoQGdtYWlsLmNvbSIsInVzZXJfbWFpbl9pZCI6IjI3NjE4NDY0MzUiLCJ1c2VyX25hbWUiOiJuYXJlbmRyYSIsInVzZXJfdHlwZSI6Imd1ZXN0IiwiaWF0IjoxNzc2NjUwOTg2LCJleHAiOjE3NzY3MzczODZ9.XqEzzPyv9wFIHPYXNMuJUcurAny48C0HyD6Jrlc87rM', '2026-04-21 02:09:46', '2761846435'),
(4, 'krishna', 'kavinbk035@gmail.com', 'external_auth', NULL, NULL, 1, 1, 'active', '2026-04-06 02:11:14', '2026-04-09 01:53:30', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoia2F2aW5iazAzNUBnbWFpbC5jb20iLCJ1c2VyX21haW5faWQiOiIxMzc3NzAyNDkwIiwidXNlcl9uYW1lIjoia3Jpc2huYSIsInVzZXJfdHlwZSI6Imd1ZXN0IiwiaWF0IjoxNzc1Njk5NjEwLCJleHAiOjE3NzU3ODYwMTB9.cm4yrGvGYiDBLneXJJz6pgtWcevahXR_iXoN1AVQWKc', '2026-04-10 01:53:30', '1377702490'),
(5, 'Selvaraj', 'thecircuitpoint@gmail.com', 'external_auth', NULL, NULL, 1, 1, 'active', '2026-04-06 11:12:43', '2026-04-06 11:12:43', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoidGhlY2lyY3VpdHBvaW50QGdtYWlsLmNvbSIsInVzZXJfbWFpbl9pZCI6IjMzODY5NTAxMDciLCJ1c2VyX25hbWUiOiJTZWx2YXJhaiIsInVzZXJfdHlwZSI6Imd1ZXN0IiwiaWF0IjoxNzc1NDczOTYzLCJleHAiOjE3NzU1NjAzNjN9.M_CXhwWDWLkoQc3sl1JJ4ehQyFlYFHbV-y3k2gAMh3g', '2026-04-07 11:12:43', '3386950107');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_module` (`module`),
  ADD KEY `idx_record` (`record_id`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indexes for table `businesses`
--
ALTER TABLE `businesses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_business_user` (`user_id`);

--
-- Indexes for table `business_mode_master`
--
ALTER TABLE `business_mode_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_modules`
--
ALTER TABLE `business_modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_business_module` (`business_id`,`name`);

--
-- Indexes for table `business_module_items`
--
ALTER TABLE `business_module_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_module_item` (`business_id`,`module_id`,`name`),
  ADD KEY `module_id` (`module_id`);

--
-- Indexes for table `business_product_allocations`
--
ALTER TABLE `business_product_allocations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `business_id` (`business_id`,`product_id`);

--
-- Indexes for table `business_setup`
--
ALTER TABLE `business_setup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_setup_brands`
--
ALTER TABLE `business_setup_brands`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setup_id` (`setup_id`,`brand_id`);

--
-- Indexes for table `business_setup_categories`
--
ALTER TABLE `business_setup_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setup_id` (`setup_id`,`category_id`);

--
-- Indexes for table `business_setup_category_groups`
--
ALTER TABLE `business_setup_category_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setup_id` (`setup_id`,`category_group_id`);

--
-- Indexes for table `business_setup_modes`
--
ALTER TABLE `business_setup_modes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setup_id` (`setup_id`,`mode_id`);

--
-- Indexes for table `business_setup_module_items`
--
ALTER TABLE `business_setup_module_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_setup_sales_types`
--
ALTER TABLE `business_setup_sales_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setup_id` (`setup_id`,`sales_type_id`);

--
-- Indexes for table `business_setup_service_types`
--
ALTER TABLE `business_setup_service_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setup_id` (`setup_id`,`service_type_id`);

--
-- Indexes for table `business_setup_shop_types`
--
ALTER TABLE `business_setup_shop_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setup_id` (`setup_id`,`shop_type_id`);

--
-- Indexes for table `business_variants`
--
ALTER TABLE `business_variants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_stock`
--
ALTER TABLE `product_stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_stock` (`business_id`,`product_id`,`storage_location_id`,`supplier_id`);

--
-- Indexes for table `product_stock_types`
--
ALTER TABLE `product_stock_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_variant_stocktype` (`variant_id`,`stock_type_id`);

--
-- Indexes for table `product_stock_variants`
--
ALTER TABLE `product_stock_variants`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_variant_master`
--
ALTER TABLE `product_variant_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_bills`
--
ALTER TABLE `sales_bills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_lookup` (`external_customer_id`,`customer_type`);

--
-- Indexes for table `sales_bill_items`
--
ALTER TABLE `sales_bill_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_returns`
--
ALTER TABLE `sales_returns`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_type_master`
--
ALTER TABLE `sales_type_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `service_type_master`
--
ALTER TABLE `service_type_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `shop_type_master`
--
ALTER TABLE `shop_type_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_movements`
--
ALTER TABLE `stock_movements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_type_master`
--
ALTER TABLE `stock_type_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `storage_address_fields`
--
ALTER TABLE `storage_address_fields`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `storage_type_id_2` (`storage_type_id`,`field_order`),
  ADD KEY `storage_type_id` (`storage_type_id`);

--
-- Indexes for table `storage_address_values`
--
ALTER TABLE `storage_address_values`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `storage_locations`
--
ALTER TABLE `storage_locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_location_code` (`business_id`,`storage_type_id`,`parent_id`,`code`),
  ADD KEY `storage_type_id` (`storage_type_id`),
  ADD KEY `level_id` (`level_id`),
  ADD KEY `idx_storage_locations_parent` (`parent_id`),
  ADD KEY `idx_storage_locations_id` (`id`);

--
-- Indexes for table `storage_structure_levels`
--
ALTER TABLE `storage_structure_levels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `storage_type_id_2` (`storage_type_id`,`level_order`),
  ADD UNIQUE KEY `unique_structure_level` (`business_id`,`storage_type_id`,`level_order`),
  ADD KEY `storage_type_id` (`storage_type_id`);

--
-- Indexes for table `storage_types`
--
ALTER TABLE `storage_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_addresses`
--
ALTER TABLE `supplier_addresses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `supplier_branches`
--
ALTER TABLE `supplier_branches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `businesses`
--
ALTER TABLE `businesses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business_mode_master`
--
ALTER TABLE `business_mode_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business_modules`
--
ALTER TABLE `business_modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `business_module_items`
--
ALTER TABLE `business_module_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `business_product_allocations`
--
ALTER TABLE `business_product_allocations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `business_setup`
--
ALTER TABLE `business_setup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `business_setup_brands`
--
ALTER TABLE `business_setup_brands`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=408;

--
-- AUTO_INCREMENT for table `business_setup_categories`
--
ALTER TABLE `business_setup_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=940;

--
-- AUTO_INCREMENT for table `business_setup_category_groups`
--
ALTER TABLE `business_setup_category_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `business_setup_modes`
--
ALTER TABLE `business_setup_modes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `business_setup_module_items`
--
ALTER TABLE `business_setup_module_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `business_setup_sales_types`
--
ALTER TABLE `business_setup_sales_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `business_setup_service_types`
--
ALTER TABLE `business_setup_service_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `business_setup_shop_types`
--
ALTER TABLE `business_setup_shop_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `business_variants`
--
ALTER TABLE `business_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `product_stock`
--
ALTER TABLE `product_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `product_stock_types`
--
ALTER TABLE `product_stock_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `product_stock_variants`
--
ALTER TABLE `product_stock_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `product_variant_master`
--
ALTER TABLE `product_variant_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sales_bills`
--
ALTER TABLE `sales_bills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=76;

--
-- AUTO_INCREMENT for table `sales_bill_items`
--
ALTER TABLE `sales_bill_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `sales_returns`
--
ALTER TABLE `sales_returns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_type_master`
--
ALTER TABLE `sales_type_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_type_master`
--
ALTER TABLE `service_type_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shop_type_master`
--
ALTER TABLE `shop_type_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stock_movements`
--
ALTER TABLE `stock_movements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `stock_type_master`
--
ALTER TABLE `stock_type_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `storage_address_fields`
--
ALTER TABLE `storage_address_fields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `storage_address_values`
--
ALTER TABLE `storage_address_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=170;

--
-- AUTO_INCREMENT for table `storage_locations`
--
ALTER TABLE `storage_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `storage_structure_levels`
--
ALTER TABLE `storage_structure_levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `storage_types`
--
ALTER TABLE `storage_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `supplier_addresses`
--
ALTER TABLE `supplier_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `supplier_branches`
--
ALTER TABLE `supplier_branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `businesses`
--
ALTER TABLE `businesses`
  ADD CONSTRAINT `fk_business_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_module_items`
--
ALTER TABLE `business_module_items`
  ADD CONSTRAINT `business_module_items_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `business_modules` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_setup_brands`
--
ALTER TABLE `business_setup_brands`
  ADD CONSTRAINT `business_setup_brands_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_setup_categories`
--
ALTER TABLE `business_setup_categories`
  ADD CONSTRAINT `business_setup_categories_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_setup_category_groups`
--
ALTER TABLE `business_setup_category_groups`
  ADD CONSTRAINT `business_setup_category_groups_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_setup_modes`
--
ALTER TABLE `business_setup_modes`
  ADD CONSTRAINT `business_setup_modes_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_setup_sales_types`
--
ALTER TABLE `business_setup_sales_types`
  ADD CONSTRAINT `business_setup_sales_types_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_setup_service_types`
--
ALTER TABLE `business_setup_service_types`
  ADD CONSTRAINT `business_setup_service_types_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `business_setup_shop_types`
--
ALTER TABLE `business_setup_shop_types`
  ADD CONSTRAINT `business_setup_shop_types_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_stock_types`
--
ALTER TABLE `product_stock_types`
  ADD CONSTRAINT `fk_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_stock_variants` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `storage_address_fields`
--
ALTER TABLE `storage_address_fields`
  ADD CONSTRAINT `storage_address_fields_ibfk_1` FOREIGN KEY (`storage_type_id`) REFERENCES `storage_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `storage_locations`
--
ALTER TABLE `storage_locations`
  ADD CONSTRAINT `storage_locations_ibfk_1` FOREIGN KEY (`storage_type_id`) REFERENCES `storage_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `storage_locations_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `storage_structure_levels` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `storage_structure_levels`
--
ALTER TABLE `storage_structure_levels`
  ADD CONSTRAINT `storage_structure_levels_ibfk_1` FOREIGN KEY (`storage_type_id`) REFERENCES `storage_types` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_addresses`
--
ALTER TABLE `supplier_addresses`
  ADD CONSTRAINT `supplier_addresses_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_branches`
--
ALTER TABLE `supplier_branches`
  ADD CONSTRAINT `supplier_branches_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
