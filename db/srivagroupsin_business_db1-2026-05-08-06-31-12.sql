/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.16-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: srivagroupsin_business_db1
-- ------------------------------------------------------
-- Server version	10.11.16-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `module` varchar(100) NOT NULL,
  `record_id` bigint(20) NOT NULL,
  `action` enum('create','update','delete') NOT NULL,
  `old_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `new_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_module` (`module`),
  KEY `idx_record` (`record_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `audit_logs_chk_1` CHECK (json_valid(`old_data`)),
  CONSTRAINT `audit_logs_chk_2` CHECK (json_valid(`new_data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_mode_master`
--

DROP TABLE IF EXISTS `business_mode_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_mode_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_mode_master`
--

LOCK TABLES `business_mode_master` WRITE;
/*!40000 ALTER TABLE `business_mode_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_mode_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_module_items`
--

DROP TABLE IF EXISTS `business_module_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_module_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` int(11) NOT NULL,
  `business_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_module_item` (`business_id`,`module_id`,`name`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `business_module_items_ibfk_1` FOREIGN KEY (`module_id`) REFERENCES `business_modules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_module_items`
--

LOCK TABLES `business_module_items` WRITE;
/*!40000 ALTER TABLE `business_module_items` DISABLE KEYS */;
INSERT INTO `business_module_items` VALUES
(1,1,1,'Retail','2026-03-11 06:02:12'),
(2,6,40,'WWWW','2026-04-06 09:20:58'),
(4,6,40,'rt23','2026-04-06 09:33:30'),
(5,10,40,'A','2026-04-07 04:28:44');
/*!40000 ALTER TABLE `business_module_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_modules`
--

DROP TABLE IF EXISTS `business_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_business_module` (`business_id`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_modules`
--

LOCK TABLES `business_modules` WRITE;
/*!40000 ALTER TABLE `business_modules` DISABLE KEYS */;
INSERT INTO `business_modules` VALUES
(1,1,'Sales','2026-03-11 06:01:46'),
(6,40,'d12','2026-04-06 09:05:05'),
(7,40,'dr','2026-04-06 09:06:33'),
(8,40,'w12','2026-04-06 09:08:02'),
(9,40,'Sale','2026-04-07 04:25:58'),
(10,40,'q12','2026-04-07 04:26:35'),
(11,52,'Local Shop','2026-05-06 10:01:23');
/*!40000 ALTER TABLE `business_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_product_allocations`
--

DROP TABLE IF EXISTS `business_product_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_product_allocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `category_group_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `product_id` bigint(20) NOT NULL,
  `min_sale_qty` int(11) DEFAULT 1,
  `max_sale_qty` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_id` (`business_id`,`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_product_allocations`
--

LOCK TABLES `business_product_allocations` WRITE;
/*!40000 ALTER TABLE `business_product_allocations` DISABLE KEYS */;
INSERT INTO `business_product_allocations` VALUES
(1,2,2,3,520,58,2653,12,22,1,'2026-03-11 08:33:40'),
(2,2,2,3,524,281,2611,13,23,1,'2026-03-11 08:34:09'),
(3,2,2,3,523,58,2652,12,22,1,'2026-03-11 09:15:01'),
(4,1,1,1,11,228,2651,12,22,0,'2026-03-12 06:08:53'),
(6,1,1,1,11,232,2147,20,200,0,'2026-03-12 06:53:42'),
(8,1,1,16,484,232,2584,12,22,0,'2026-03-13 08:40:54'),
(9,1,1,16,10,232,806,1002,2005,0,'2026-03-14 08:25:35'),
(12,1,1,15,97,297,2934,12,22,1,'2026-03-24 09:01:44'),
(13,1,1,15,399,8,2607,1,1,1,'2026-03-24 09:13:45'),
(14,1,1,16,82,232,553,1002,2005,0,'2026-03-24 09:15:48'),
(15,1,1,16,82,232,555,12,22,1,'2026-03-24 09:17:54'),
(18,1,1,16,82,232,556,12,22,1,'2026-03-24 09:24:45'),
(19,1,1,16,82,232,557,1,1,1,'2026-03-24 09:25:04'),
(20,1,1,15,97,147,2260,20,90,1,'2026-03-26 08:34:37'),
(21,1,1,15,399,31,2605,12,200,1,'2026-03-26 08:56:44'),
(22,1,1,16,567,232,2139,50,80,1,'2026-04-01 02:16:08'),
(23,40,40,16,82,232,555,1,100,1,'2026-04-07 03:51:25'),
(24,40,40,16,601,232,2899,10,100,1,'2026-04-08 06:13:27'),
(25,40,40,16,73,232,3712,5,10,1,'2026-04-10 10:18:25'),
(26,40,40,15,97,297,2934,123,12,0,'2026-04-15 05:13:14'),
(27,40,40,16,232,232,601,211,12,0,'2026-04-15 05:21:24'),
(28,40,40,16,271,272,431,12,1,1,'2026-04-16 03:52:03'),
(29,40,40,15,14,14,96,1,10,1,'2026-04-28 09:06:15'),
(30,40,40,15,14,14,400,1,156,1,'2026-04-29 09:29:52'),
(31,40,40,16,643,232,3417,5,10,1,'2026-04-30 10:58:25'),
(32,40,40,16,643,232,2977,5,10,1,'2026-05-02 10:04:10');
/*!40000 ALTER TABLE `business_product_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup`
--

DROP TABLE IF EXISTS `business_setup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup`
--

LOCK TABLES `business_setup` WRITE;
/*!40000 ALTER TABLE `business_setup` DISABLE KEYS */;
INSERT INTO `business_setup` VALUES
(1,1,'2026-03-10 11:44:13','2026-03-10 11:44:13'),
(2,2,'2026-03-11 08:36:32','2026-03-11 08:36:32'),
(3,40,'2026-04-06 08:32:56','2026-04-06 08:32:56'),
(4,52,'2026-05-06 10:01:29','2026-05-06 10:01:29');
/*!40000 ALTER TABLE `business_setup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_brands`
--

DROP TABLE IF EXISTS `business_setup_brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_brands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setup_id` (`setup_id`,`brand_id`),
  CONSTRAINT `business_setup_brands_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=883 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_brands`
--

LOCK TABLES `business_setup_brands` WRITE;
/*!40000 ALTER TABLE `business_setup_brands` DISABLE KEYS */;
INSERT INTO `business_setup_brands` VALUES
(129,2,2,124),
(130,2,2,228),
(131,2,2,230),
(132,2,2,232),
(133,1,1,6),
(134,1,1,8),
(135,1,1,10),
(136,1,1,31),
(137,1,1,32),
(138,1,1,33),
(139,1,1,34),
(140,1,1,36),
(141,1,1,37),
(142,1,1,135),
(143,1,1,136),
(144,1,1,63),
(145,1,1,23),
(146,1,1,26),
(147,1,1,27),
(148,1,1,28),
(149,1,1,30),
(150,1,1,130),
(151,1,1,234),
(152,1,1,235),
(153,1,1,236),
(154,1,1,237),
(155,1,1,149),
(156,1,1,150),
(157,1,1,147),
(158,1,1,239),
(159,1,1,297),
(160,1,1,232),
(161,1,1,228),
(162,1,1,230),
(163,1,1,124),
(164,1,1,11),
(165,1,1,160),
(166,1,1,271),
(167,1,1,272),
(168,1,1,273),
(169,1,1,279),
(684,52,4,228),
(685,52,4,230),
(686,52,4,232),
(687,52,4,46),
(688,52,4,48),
(689,52,4,124),
(690,52,4,300),
(691,52,4,301),
(692,52,4,10),
(693,52,4,14),
(694,52,4,125),
(695,52,4,126),
(696,52,4,128),
(697,52,4,21),
(698,52,4,38),
(699,52,4,43),
(700,52,4,47),
(701,52,4,330),
(702,52,4,11),
(703,52,4,160),
(704,52,4,271),
(705,52,4,272),
(706,52,4,273),
(707,52,4,315),
(708,52,4,279),
(709,52,4,121),
(710,52,4,242),
(711,52,4,340),
(712,52,4,8),
(713,52,4,234),
(714,52,4,235),
(715,52,4,236),
(716,52,4,237),
(717,52,4,149),
(718,52,4,150),
(719,52,4,30),
(720,52,4,147),
(721,52,4,239),
(722,52,4,297),
(723,52,4,6),
(724,52,4,31),
(725,52,4,33),
(726,52,4,34),
(727,52,4,36),
(728,52,4,310),
(729,52,4,316),
(730,52,4,317),
(731,52,4,136),
(732,52,4,23),
(733,52,4,27),
(734,52,4,131),
(735,52,4,311),
(736,52,4,312),
(737,52,4,313),
(738,52,4,314),
(739,52,4,318),
(740,52,4,319),
(741,52,4,129),
(742,52,4,251),
(743,52,4,305),
(744,52,4,306),
(745,52,4,307),
(746,52,4,308),
(747,52,4,114),
(748,52,4,331),
(749,52,4,139),
(750,52,4,243),
(751,52,4,44),
(752,52,4,45),
(753,52,4,244),
(754,52,4,245),
(755,52,4,246),
(756,52,4,247),
(757,52,4,2),
(758,52,4,4),
(759,52,4,16),
(760,52,4,24),
(761,52,4,146),
(762,52,4,225),
(763,52,4,51),
(764,52,4,20),
(765,52,4,205),
(766,52,4,25),
(767,52,4,248),
(768,52,4,302),
(769,52,4,15),
(770,52,4,256),
(771,52,4,88),
(772,52,4,258),
(773,52,4,5),
(774,52,4,49),
(775,52,4,50),
(776,52,4,320),
(777,52,4,333),
(778,52,4,335),
(779,52,4,241),
(780,52,4,12),
(781,52,4,337),
(782,52,4,338),
(783,40,3,10),
(784,40,3,14),
(785,40,3,124),
(786,40,3,125),
(787,40,3,126),
(788,40,3,128),
(789,40,3,8),
(790,40,3,234),
(791,40,3,235),
(792,40,3,236),
(793,40,3,237),
(794,40,3,149),
(795,40,3,150),
(796,40,3,30),
(797,40,3,147),
(798,40,3,239),
(799,40,3,297),
(800,40,3,6),
(801,40,3,31),
(802,40,3,33),
(803,40,3,34),
(804,40,3,36),
(805,40,3,232),
(806,40,3,310),
(807,40,3,316),
(808,40,3,317),
(809,40,3,136),
(810,40,3,228),
(811,40,3,230),
(812,40,3,23),
(813,40,3,27),
(814,40,3,131),
(815,40,3,311),
(816,40,3,312),
(817,40,3,313),
(818,40,3,314),
(819,40,3,318),
(820,40,3,319),
(821,40,3,129),
(822,40,3,121),
(823,40,3,242),
(824,40,3,340),
(825,40,3,251),
(826,40,3,300),
(827,40,3,301),
(828,40,3,46),
(829,40,3,48),
(830,40,3,21),
(831,40,3,38),
(832,40,3,43),
(833,40,3,47),
(834,40,3,330),
(835,40,3,354),
(836,40,3,279),
(837,40,3,11),
(838,40,3,160),
(839,40,3,271),
(840,40,3,272),
(841,40,3,273),
(842,40,3,315),
(843,40,3,305),
(844,40,3,306),
(845,40,3,307),
(846,40,3,308),
(847,40,3,114),
(848,40,3,331),
(849,40,3,139),
(850,40,3,243),
(851,40,3,44),
(852,40,3,45),
(853,40,3,244),
(854,40,3,245),
(855,40,3,246),
(856,40,3,247),
(857,40,3,2),
(858,40,3,4),
(859,40,3,16),
(860,40,3,24),
(861,40,3,146),
(862,40,3,225),
(863,40,3,51),
(864,40,3,20),
(865,40,3,205),
(866,40,3,25),
(867,40,3,248),
(868,40,3,302),
(869,40,3,15),
(870,40,3,256),
(871,40,3,88),
(872,40,3,258),
(873,40,3,5),
(874,40,3,49),
(875,40,3,50),
(876,40,3,320),
(877,40,3,333),
(878,40,3,335),
(879,40,3,241),
(880,40,3,12),
(881,40,3,337),
(882,40,3,338);
/*!40000 ALTER TABLE `business_setup_brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_categories`
--

DROP TABLE IF EXISTS `business_setup_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setup_id` (`setup_id`,`category_id`),
  CONSTRAINT `business_setup_categories_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2666 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_categories`
--

LOCK TABLES `business_setup_categories` WRITE;
/*!40000 ALTER TABLE `business_setup_categories` DISABLE KEYS */;
INSERT INTO `business_setup_categories` VALUES
(195,2,2,299),
(196,2,2,10),
(197,1,1,3),
(198,1,1,212),
(199,1,1,213),
(200,1,1,211),
(201,1,1,10),
(202,1,1,54),
(203,1,1,82),
(204,1,1,106),
(205,1,1,110),
(206,1,1,123),
(207,1,1,275),
(208,1,1,408),
(209,1,1,413),
(210,1,1,414),
(211,1,1,415),
(212,1,1,416),
(213,1,1,427),
(214,1,1,429),
(215,1,1,430),
(216,1,1,431),
(217,1,1,433),
(218,1,1,434),
(219,1,1,435),
(220,1,1,485),
(221,1,1,534),
(222,1,1,546),
(223,1,1,568),
(224,1,1,587),
(225,1,1,614),
(226,1,1,203),
(227,1,1,399),
(228,1,1,400),
(229,1,1,401),
(230,1,1,464),
(231,1,1,91),
(232,1,1,96),
(233,1,1,97),
(234,1,1,98),
(235,1,1,99),
(236,1,1,100),
(237,1,1,117),
(238,1,1,132),
(239,1,1,589),
(240,1,1,358),
(241,1,1,299),
(242,1,1,447),
(243,1,1,567),
(244,1,1,593),
(245,1,1,594),
(246,1,1,597),
(247,1,1,598),
(248,1,1,513),
(249,1,1,514),
(250,1,1,515),
(251,1,1,487),
(252,1,1,488),
(253,1,1,489),
(254,1,1,490),
(255,1,1,491),
(256,1,1,492),
(257,1,1,493),
(258,1,1,495),
(259,1,1,73),
(260,1,1,84),
(261,1,1,90),
(262,1,1,276),
(263,1,1,62),
(264,1,1,64),
(265,1,1,535),
(266,1,1,537),
(267,1,1,555),
(268,1,1,551),
(269,1,1,552),
(270,1,1,553),
(271,1,1,599),
(272,1,1,600),
(273,1,1,601),
(274,1,1,622),
(275,1,1,518),
(276,1,1,536),
(277,1,1,540),
(278,1,1,541),
(279,1,1,542),
(280,1,1,543),
(281,1,1,544),
(282,1,1,545),
(283,1,1,420),
(284,1,1,615),
(285,1,1,616),
(286,1,1,617),
(287,1,1,618),
(288,1,1,619),
(289,1,1,482),
(290,1,1,483),
(291,1,1,484),
(2063,52,4,215),
(2064,52,4,116),
(2065,52,4,10),
(2066,52,4,54),
(2067,52,4,82),
(2068,52,4,106),
(2069,52,4,110),
(2070,52,4,123),
(2071,52,4,275),
(2072,52,4,299),
(2073,52,4,408),
(2074,52,4,413),
(2075,52,4,414),
(2076,52,4,415),
(2077,52,4,416),
(2078,52,4,427),
(2079,52,4,429),
(2080,52,4,430),
(2081,52,4,431),
(2082,52,4,433),
(2083,52,4,434),
(2084,52,4,435),
(2085,52,4,447),
(2086,52,4,485),
(2087,52,4,488),
(2088,52,4,489),
(2089,52,4,490),
(2090,52,4,491),
(2091,52,4,493),
(2092,52,4,494),
(2093,52,4,495),
(2094,52,4,534),
(2095,52,4,536),
(2096,52,4,540),
(2097,52,4,541),
(2098,52,4,542),
(2099,52,4,546),
(2100,52,4,568),
(2101,52,4,587),
(2102,52,4,593),
(2103,52,4,594),
(2104,52,4,614),
(2105,52,4,630),
(2106,52,4,631),
(2107,52,4,632),
(2108,52,4,633),
(2109,52,4,639),
(2110,52,4,640),
(2111,52,4,667),
(2112,52,4,203),
(2113,52,4,287),
(2114,52,4,272),
(2115,52,4,3),
(2116,52,4,212),
(2117,52,4,213),
(2118,52,4,298),
(2119,52,4,304),
(2120,52,4,211),
(2121,52,4,9),
(2122,52,4,680),
(2123,52,4,544),
(2124,52,4,545),
(2125,52,4,316),
(2126,52,4,196),
(2127,52,4,86),
(2128,52,4,165),
(2129,52,4,453),
(2130,52,4,78),
(2131,52,4,436),
(2132,52,4,440),
(2133,52,4,42),
(2134,52,4,143),
(2135,52,4,15),
(2136,52,4,445),
(2137,52,4,465),
(2138,52,4,323),
(2139,52,4,30),
(2140,52,4,548),
(2141,52,4,36),
(2142,52,4,320),
(2143,52,4,628),
(2144,52,4,214),
(2145,52,4,219),
(2146,52,4,221),
(2147,52,4,279),
(2148,52,4,280),
(2149,52,4,281),
(2150,52,4,621),
(2151,52,4,567),
(2152,52,4,597),
(2153,52,4,598),
(2154,52,4,513),
(2155,52,4,514),
(2156,52,4,515),
(2157,52,4,73),
(2158,52,4,84),
(2159,52,4,90),
(2160,52,4,276),
(2161,52,4,654),
(2162,52,4,62),
(2163,52,4,64),
(2164,52,4,535),
(2165,52,4,537),
(2166,52,4,555),
(2167,52,4,657),
(2168,52,4,665),
(2169,52,4,551),
(2170,52,4,552),
(2171,52,4,553),
(2172,52,4,599),
(2173,52,4,600),
(2174,52,4,601),
(2175,52,4,622),
(2176,52,4,518),
(2177,52,4,543),
(2178,52,4,420),
(2179,52,4,615),
(2180,52,4,616),
(2181,52,4,617),
(2182,52,4,618),
(2183,52,4,619),
(2184,52,4,642),
(2185,52,4,668),
(2186,52,4,482),
(2187,52,4,487),
(2188,52,4,492),
(2189,52,4,641),
(2190,52,4,643),
(2191,52,4,399),
(2192,52,4,400),
(2193,52,4,401),
(2194,52,4,464),
(2195,52,4,91),
(2196,52,4,96),
(2197,52,4,97),
(2198,52,4,98),
(2199,52,4,99),
(2200,52,4,100),
(2201,52,4,117),
(2202,52,4,132),
(2203,52,4,589),
(2204,52,4,607),
(2205,52,4,608),
(2206,52,4,609),
(2207,52,4,610),
(2208,52,4,611),
(2209,52,4,612),
(2210,52,4,613),
(2211,52,4,627),
(2212,52,4,308),
(2213,52,4,358),
(2214,52,4,671),
(2215,52,4,683),
(2216,52,4,655),
(2217,52,4,644),
(2218,52,4,442),
(2219,52,4,572),
(2220,52,4,441),
(2221,52,4,317),
(2222,52,4,484),
(2223,52,4,483),
(2224,52,4,461),
(2225,52,4,26),
(2226,52,4,13),
(2227,52,4,22),
(2228,52,4,23),
(2229,52,4,28),
(2230,52,4,55),
(2231,52,4,585),
(2232,52,4,459),
(2233,52,4,576),
(2234,52,4,583),
(2235,52,4,421),
(2236,52,4,37),
(2237,52,4,584),
(2238,52,4,422),
(2239,52,4,142),
(2240,52,4,460),
(2241,52,4,462),
(2242,52,4,59),
(2243,52,4,71),
(2244,52,4,18),
(2245,52,4,80),
(2246,52,4,20),
(2247,52,4,571),
(2248,52,4,32),
(2249,52,4,574),
(2250,52,4,65),
(2251,52,4,578),
(2252,52,4,11),
(2253,52,4,579),
(2254,52,4,139),
(2255,52,4,24),
(2256,52,4,19),
(2257,52,4,575),
(2258,52,4,457),
(2259,52,4,458),
(2260,52,4,58),
(2261,52,4,87),
(2262,52,4,21),
(2263,52,4,27),
(2264,52,4,76),
(2265,52,4,550),
(2266,52,4,67),
(2267,52,4,63),
(2268,52,4,77),
(2269,52,4,145),
(2270,52,4,35),
(2271,52,4,638),
(2272,52,4,549),
(2273,52,4,432),
(2274,52,4,68),
(2275,52,4,40),
(2276,52,4,557),
(2277,52,4,52),
(2278,52,4,438),
(2279,52,4,439),
(2280,52,4,177),
(2281,52,4,570),
(2282,52,4,443),
(2283,52,4,31),
(2284,52,4,446),
(2285,52,4,444),
(2286,52,4,25),
(2287,52,4,565),
(2288,52,4,564),
(2289,52,4,566),
(2290,52,4,623),
(2291,52,4,635),
(2292,52,4,592),
(2293,52,4,581),
(2294,52,4,16),
(2295,52,4,467),
(2296,52,4,49),
(2297,52,4,468),
(2298,52,4,469),
(2299,52,4,88),
(2300,52,4,563),
(2301,52,4,451),
(2302,52,4,562),
(2303,52,4,586),
(2304,52,4,560),
(2305,52,4,559),
(2306,52,4,423),
(2307,52,4,425),
(2308,52,4,426),
(2309,52,4,496),
(2310,52,4,497),
(2311,52,4,498),
(2312,52,4,499),
(2313,52,4,500),
(2314,52,4,501),
(2315,52,4,502),
(2316,52,4,352),
(2317,52,4,353),
(2318,52,4,354),
(2319,52,4,355),
(2320,52,4,356),
(2321,52,4,357),
(2322,52,4,383),
(2323,52,4,384),
(2324,52,4,385),
(2325,52,4,12),
(2326,52,4,107),
(2327,52,4,131),
(2328,52,4,133),
(2329,52,4,134),
(2330,52,4,360),
(2331,52,4,361),
(2332,52,4,362),
(2333,52,4,363),
(2334,52,4,364),
(2335,52,4,366),
(2336,52,4,367),
(2337,52,4,368),
(2338,52,4,454),
(2339,52,4,455),
(2340,52,4,620),
(2341,52,4,653),
(2342,52,4,371),
(2343,52,4,373),
(2344,52,4,374),
(2345,52,4,387),
(2346,52,4,388),
(2347,52,4,389),
(2348,52,4,390),
(2349,52,4,111),
(2350,52,4,61),
(2351,52,4,118),
(2352,52,4,130),
(2353,52,4,346),
(2354,52,4,347),
(2355,52,4,348),
(2356,52,4,349),
(2357,52,4,350),
(2358,52,4,351),
(2359,52,4,102),
(2360,52,4,103),
(2361,52,4,437),
(2362,40,3,212),
(2363,40,3,97),
(2364,40,3,399),
(2365,40,3,400),
(2366,40,3,401),
(2367,40,3,464),
(2368,40,3,91),
(2369,40,3,96),
(2370,40,3,98),
(2371,40,3,99),
(2372,40,3,100),
(2373,40,3,117),
(2374,40,3,132),
(2375,40,3,589),
(2376,40,3,607),
(2377,40,3,608),
(2378,40,3,609),
(2379,40,3,610),
(2380,40,3,611),
(2381,40,3,612),
(2382,40,3,613),
(2383,40,3,627),
(2384,40,3,308),
(2385,40,3,358),
(2386,40,3,668),
(2387,40,3,671),
(2388,40,3,683),
(2389,40,3,3),
(2390,40,3,213),
(2391,40,3,287),
(2392,40,3,298),
(2393,40,3,304),
(2394,40,3,211),
(2395,40,3,667),
(2396,40,3,9),
(2397,40,3,680),
(2398,40,3,430),
(2399,40,3,110),
(2400,40,3,447),
(2401,40,3,414),
(2402,40,3,431),
(2403,40,3,299),
(2404,40,3,413),
(2405,40,3,485),
(2406,40,3,10),
(2407,40,3,587),
(2408,40,3,546),
(2409,40,3,544),
(2410,40,3,545),
(2411,40,3,427),
(2412,40,3,614),
(2413,40,3,275),
(2414,40,3,433),
(2415,40,3,568),
(2416,40,3,106),
(2417,40,3,123),
(2418,40,3,429),
(2419,40,3,593),
(2420,40,3,435),
(2421,40,3,495),
(2422,40,3,416),
(2423,40,3,415),
(2424,40,3,54),
(2425,40,3,434),
(2426,40,3,82),
(2427,40,3,534),
(2428,40,3,408),
(2429,40,3,488),
(2430,40,3,489),
(2431,40,3,540),
(2432,40,3,541),
(2433,40,3,490),
(2434,40,3,493),
(2435,40,3,491),
(2436,40,3,536),
(2437,40,3,542),
(2438,40,3,594),
(2439,40,3,316),
(2440,40,3,494),
(2441,40,3,639),
(2442,40,3,640),
(2443,40,3,632),
(2444,40,3,630),
(2445,40,3,633),
(2446,40,3,631),
(2447,40,3,203),
(2448,40,3,196),
(2449,40,3,86),
(2450,40,3,165),
(2451,40,3,272),
(2452,40,3,453),
(2453,40,3,78),
(2454,40,3,436),
(2455,40,3,440),
(2456,40,3,42),
(2457,40,3,143),
(2458,40,3,15),
(2459,40,3,445),
(2460,40,3,465),
(2461,40,3,323),
(2462,40,3,30),
(2463,40,3,548),
(2464,40,3,36),
(2465,40,3,320),
(2466,40,3,628),
(2467,40,3,676),
(2468,40,3,678),
(2469,40,3,681),
(2470,40,3,214),
(2471,40,3,215),
(2472,40,3,219),
(2473,40,3,221),
(2474,40,3,279),
(2475,40,3,280),
(2476,40,3,281),
(2477,40,3,621),
(2478,40,3,684),
(2479,40,3,685),
(2480,40,3,657),
(2481,40,3,665),
(2482,40,3,599),
(2483,40,3,622),
(2484,40,3,601),
(2485,40,3,600),
(2486,40,3,567),
(2487,40,3,598),
(2488,40,3,597),
(2489,40,3,552),
(2490,40,3,553),
(2491,40,3,551),
(2492,40,3,616),
(2493,40,3,615),
(2494,40,3,619),
(2495,40,3,617),
(2496,40,3,618),
(2497,40,3,420),
(2498,40,3,84),
(2499,40,3,73),
(2500,40,3,276),
(2501,40,3,90),
(2502,40,3,654),
(2503,40,3,655),
(2504,40,3,515),
(2505,40,3,514),
(2506,40,3,513),
(2507,40,3,543),
(2508,40,3,518),
(2509,40,3,62),
(2510,40,3,64),
(2511,40,3,537),
(2512,40,3,535),
(2513,40,3,555),
(2514,40,3,644),
(2515,40,3,442),
(2516,40,3,572),
(2517,40,3,441),
(2518,40,3,317),
(2519,40,3,642),
(2520,40,3,484),
(2521,40,3,483),
(2522,40,3,482),
(2523,40,3,487),
(2524,40,3,492),
(2525,40,3,461),
(2526,40,3,26),
(2527,40,3,13),
(2528,40,3,22),
(2529,40,3,23),
(2530,40,3,28),
(2531,40,3,643),
(2532,40,3,641),
(2533,40,3,55),
(2534,40,3,585),
(2535,40,3,459),
(2536,40,3,576),
(2537,40,3,583),
(2538,40,3,421),
(2539,40,3,37),
(2540,40,3,584),
(2541,40,3,422),
(2542,40,3,142),
(2543,40,3,460),
(2544,40,3,462),
(2545,40,3,59),
(2546,40,3,71),
(2547,40,3,18),
(2548,40,3,80),
(2549,40,3,20),
(2550,40,3,571),
(2551,40,3,32),
(2552,40,3,574),
(2553,40,3,65),
(2554,40,3,578),
(2555,40,3,11),
(2556,40,3,579),
(2557,40,3,139),
(2558,40,3,24),
(2559,40,3,19),
(2560,40,3,575),
(2561,40,3,457),
(2562,40,3,458),
(2563,40,3,58),
(2564,40,3,87),
(2565,40,3,21),
(2566,40,3,27),
(2567,40,3,76),
(2568,40,3,550),
(2569,40,3,67),
(2570,40,3,63),
(2571,40,3,77),
(2572,40,3,145),
(2573,40,3,35),
(2574,40,3,638),
(2575,40,3,549),
(2576,40,3,432),
(2577,40,3,68),
(2578,40,3,40),
(2579,40,3,557),
(2580,40,3,52),
(2581,40,3,438),
(2582,40,3,439),
(2583,40,3,177),
(2584,40,3,570),
(2585,40,3,443),
(2586,40,3,31),
(2587,40,3,446),
(2588,40,3,444),
(2589,40,3,25),
(2590,40,3,565),
(2591,40,3,564),
(2592,40,3,566),
(2593,40,3,623),
(2594,40,3,635),
(2595,40,3,592),
(2596,40,3,581),
(2597,40,3,16),
(2598,40,3,467),
(2599,40,3,49),
(2600,40,3,468),
(2601,40,3,469),
(2602,40,3,88),
(2603,40,3,563),
(2604,40,3,451),
(2605,40,3,562),
(2606,40,3,586),
(2607,40,3,560),
(2608,40,3,559),
(2609,40,3,423),
(2610,40,3,425),
(2611,40,3,426),
(2612,40,3,496),
(2613,40,3,497),
(2614,40,3,498),
(2615,40,3,499),
(2616,40,3,500),
(2617,40,3,501),
(2618,40,3,502),
(2619,40,3,352),
(2620,40,3,353),
(2621,40,3,354),
(2622,40,3,355),
(2623,40,3,356),
(2624,40,3,357),
(2625,40,3,383),
(2626,40,3,384),
(2627,40,3,385),
(2628,40,3,12),
(2629,40,3,107),
(2630,40,3,116),
(2631,40,3,131),
(2632,40,3,133),
(2633,40,3,134),
(2634,40,3,360),
(2635,40,3,361),
(2636,40,3,362),
(2637,40,3,363),
(2638,40,3,364),
(2639,40,3,366),
(2640,40,3,367),
(2641,40,3,368),
(2642,40,3,454),
(2643,40,3,455),
(2644,40,3,620),
(2645,40,3,653),
(2646,40,3,371),
(2647,40,3,373),
(2648,40,3,374),
(2649,40,3,387),
(2650,40,3,388),
(2651,40,3,389),
(2652,40,3,390),
(2653,40,3,111),
(2654,40,3,61),
(2655,40,3,118),
(2656,40,3,130),
(2657,40,3,346),
(2658,40,3,347),
(2659,40,3,348),
(2660,40,3,349),
(2661,40,3,350),
(2662,40,3,351),
(2663,40,3,102),
(2664,40,3,103),
(2665,40,3,437);
/*!40000 ALTER TABLE `business_setup_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_category_groups`
--

DROP TABLE IF EXISTS `business_setup_category_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_category_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `category_group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setup_id` (`setup_id`,`category_group_id`),
  CONSTRAINT `business_setup_category_groups_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_category_groups`
--

LOCK TABLES `business_setup_category_groups` WRITE;
/*!40000 ALTER TABLE `business_setup_category_groups` DISABLE KEYS */;
INSERT INTO `business_setup_category_groups` VALUES
(51,2,2,16),
(52,2,2,12),
(53,1,1,15),
(54,1,1,16),
(106,52,4,39),
(107,52,4,15),
(108,52,4,16),
(109,52,4,17),
(110,52,4,22),
(111,52,4,38),
(112,40,3,16),
(113,40,3,15),
(114,40,3,20),
(115,40,3,17),
(116,40,3,22),
(117,40,3,30),
(118,40,3,36),
(119,40,3,35),
(120,40,3,38),
(121,40,3,37);
/*!40000 ALTER TABLE `business_setup_category_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_modes`
--

DROP TABLE IF EXISTS `business_setup_modes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_modes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `mode_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setup_id` (`setup_id`,`mode_id`),
  CONSTRAINT `business_setup_modes_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_modes`
--

LOCK TABLES `business_setup_modes` WRITE;
/*!40000 ALTER TABLE `business_setup_modes` DISABLE KEYS */;
INSERT INTO `business_setup_modes` VALUES
(1,1,1,1),
(2,1,1,2);
/*!40000 ALTER TABLE `business_setup_modes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_module_items`
--

DROP TABLE IF EXISTS `business_setup_module_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_module_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `module_item_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_module_items`
--

LOCK TABLES `business_setup_module_items` WRITE;
/*!40000 ALTER TABLE `business_setup_module_items` DISABLE KEYS */;
INSERT INTO `business_setup_module_items` VALUES
(36,2,2,1),
(37,2,2,4),
(38,1,1,1),
(73,52,4,1),
(74,52,4,2),
(75,52,4,3),
(76,40,3,2),
(77,40,3,4),
(78,40,3,5);
/*!40000 ALTER TABLE `business_setup_module_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_sales_types`
--

DROP TABLE IF EXISTS `business_setup_sales_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_sales_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `sales_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setup_id` (`setup_id`,`sales_type_id`),
  CONSTRAINT `business_setup_sales_types_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_sales_types`
--

LOCK TABLES `business_setup_sales_types` WRITE;
/*!40000 ALTER TABLE `business_setup_sales_types` DISABLE KEYS */;
INSERT INTO `business_setup_sales_types` VALUES
(1,1,1,1),
(2,1,1,2),
(3,1,1,3);
/*!40000 ALTER TABLE `business_setup_sales_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_service_types`
--

DROP TABLE IF EXISTS `business_setup_service_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_service_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `service_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setup_id` (`setup_id`,`service_type_id`),
  CONSTRAINT `business_setup_service_types_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_service_types`
--

LOCK TABLES `business_setup_service_types` WRITE;
/*!40000 ALTER TABLE `business_setup_service_types` DISABLE KEYS */;
INSERT INTO `business_setup_service_types` VALUES
(1,1,1,1),
(2,1,1,2),
(3,1,1,3);
/*!40000 ALTER TABLE `business_setup_service_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_setup_shop_types`
--

DROP TABLE IF EXISTS `business_setup_shop_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_setup_shop_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `setup_id` int(11) NOT NULL,
  `shop_type_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setup_id` (`setup_id`,`shop_type_id`),
  CONSTRAINT `business_setup_shop_types_ibfk_1` FOREIGN KEY (`setup_id`) REFERENCES `business_setup` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_setup_shop_types`
--

LOCK TABLES `business_setup_shop_types` WRITE;
/*!40000 ALTER TABLE `business_setup_shop_types` DISABLE KEYS */;
INSERT INTO `business_setup_shop_types` VALUES
(57,2,2,4),
(58,2,2,5),
(59,1,1,1),
(60,1,1,2),
(61,1,1,3),
(62,1,1,4),
(63,1,1,5),
(118,52,4,3),
(119,52,4,4),
(120,40,3,1),
(121,40,3,2),
(122,40,3,3),
(123,40,3,4),
(124,40,3,5);
/*!40000 ALTER TABLE `business_setup_shop_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_variants`
--

DROP TABLE IF EXISTS `business_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_variants`
--

LOCK TABLES `business_variants` WRITE;
/*!40000 ALTER TABLE `business_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `businesses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_business_user` (`user_id`),
  CONSTRAINT `fk_business_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `businesses_chk_1` CHECK (json_valid(`add_json`))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
INSERT INTO `businesses` VALUES
(1,1,'Circuit Point','supermarket@mail.com','9876543210','Retail grocery store','{\"city\": \"Chennai\", \"category\": \"Retail\"}',1,1,'active','2026-03-10 10:47:57','2026-03-12 09:51:28'),
(2,1,'Cpoint','electronics@mail.com','9876500000','Electronics shop','{\"city\": \"Chennai\", \"category\": \"Electronics\"}',1,1,'active','2026-03-10 10:47:57','2026-03-12 09:50:56'),
(3,2,'Ravi Textiles','textiles@mail.com','9876511111','Clothing retail store','{\"city\": \"Madurai\", \"category\": \"Textiles\"}',1,1,'active','2026-03-10 10:47:57','2026-03-10 10:47:57');
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES
(1,NULL,'Walk-in Customer',NULL,NULL,NULL,'2026-03-11 10:58:04'),
(14,1,'hari','9025084185',NULL,NULL,'2026-03-13 07:51:06'),
(15,1,'kavin','8072148623',NULL,NULL,'2026-03-13 09:23:44'),
(26,1,'Walk-in','N/A',NULL,NULL,'2026-03-20 01:57:34'),
(27,40,'Walk-in','N/A',NULL,NULL,'2026-04-09 04:37:00');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_stock`
--

DROP TABLE IF EXISTS `product_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `is_self_produced` tinyint(1) DEFAULT 0,
  `storage_location_id` int(11) DEFAULT NULL,
  `total_qty` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_stock` (`business_id`,`product_id`,`storage_location_id`,`supplier_id`),
  UNIQUE KEY `unique_stock_new` (`business_id`,`product_id`,`supplier_id`,`is_self_produced`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stock`
--

LOCK TABLES `product_stock` WRITE;
/*!40000 ALTER TABLE `product_stock` DISABLE KEYS */;
INSERT INTO `product_stock` VALUES
(35,40,3712,2,0,75,0,'2026-04-10 10:24:03',0),
(36,40,3712,4,0,77,0,'2026-04-21 09:36:20',0),
(47,40,3417,49,0,NULL,0,'2026-04-30 10:59:33',0),
(48,40,96,43,0,NULL,0,'2026-05-02 09:22:35',0),
(49,40,2977,43,0,NULL,0,'2026-05-02 10:08:30',0),
(50,40,555,4,0,NULL,0,'2026-05-06 10:58:10',0),
(51,40,555,8,0,NULL,0,'2026-05-07 02:41:15',0);
/*!40000 ALTER TABLE `product_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_stock_locations`
--

DROP TABLE IF EXISTS `product_stock_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stock_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_variant_id` int(11) NOT NULL,
  `stock_type_id` int(11) NOT NULL,
  `location_id` int(11) NOT NULL,
  `qty` int(11) DEFAULT 0,
  `business_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_stock_location` (`stock_variant_id`,`stock_type_id`,`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stock_locations`
--

LOCK TABLES `product_stock_locations` WRITE;
/*!40000 ALTER TABLE `product_stock_locations` DISABLE KEYS */;
INSERT INTO `product_stock_locations` VALUES
(1,59,1,81,2,40,'2026-04-25 08:58:25',0),
(2,65,1,75,5,40,'2026-04-27 07:03:01',0);
/*!40000 ALTER TABLE `product_stock_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_stock_types`
--

DROP TABLE IF EXISTS `product_stock_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stock_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `stock_type_id` int(11) NOT NULL,
  `qty` int(11) DEFAULT 0,
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_variant_stocktype` (`variant_id`,`stock_type_id`),
  CONSTRAINT `fk_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_stock_variants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stock_types`
--

LOCK TABLES `product_stock_types` WRITE;
/*!40000 ALTER TABLE `product_stock_types` DISABLE KEYS */;
INSERT INTO `product_stock_types` VALUES
(1,7,NULL,1,9,0),
(2,8,NULL,1,15,0),
(3,10,NULL,1,20,0),
(4,11,NULL,1,2,0),
(5,11,NULL,2,-18,0),
(6,11,NULL,3,17,0),
(7,12,NULL,1,15,0),
(8,12,NULL,2,-85,0),
(9,12,NULL,3,85,0),
(10,14,NULL,3,1000,0),
(12,15,NULL,1,0,0),
(13,4,NULL,1,89,0),
(14,16,NULL,1,1,0),
(15,16,NULL,2,29,0),
(16,17,NULL,1,0,0),
(17,17,NULL,2,0,0),
(18,17,NULL,3,20,0),
(19,18,NULL,1,1,0),
(20,17,NULL,1,1,0),
(21,19,NULL,1,0,0),
(23,20,NULL,1,0,0),
(24,21,NULL,1,0,0),
(25,21,NULL,2,8,0),
(26,21,NULL,3,10,0),
(27,22,NULL,1,0,0),
(28,22,NULL,2,23,0),
(29,22,NULL,3,22,0),
(30,23,NULL,1,11,0),
(31,23,NULL,2,26,0),
(32,23,NULL,3,50,0),
(37,28,40,1,1,0),
(38,28,40,2,2,0),
(39,28,40,3,7,0),
(40,28,41,1,13,0),
(43,30,44,1,1,0),
(44,29,45,1,12,0),
(46,32,47,1,1,0),
(48,33,49,1,1,0),
(50,31,51,1,1,0),
(55,34,54,1,23,0),
(60,36,59,1,2,0),
(61,36,60,1,4,0),
(62,36,61,1,4,0),
(66,35,63,1,3,0),
(67,35,64,1,2,0),
(68,35,65,1,5,0),
(69,47,2,1,5,0),
(70,48,1,1,5,0),
(71,48,1,2,3,0),
(72,48,1,3,2,0),
(73,49,2,2,5,0),
(76,50,72,1,1,0),
(77,51,73,1,1,0);
/*!40000 ALTER TABLE `product_stock_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_stock_variants`
--

DROP TABLE IF EXISTS `product_stock_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_stock_variants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stock_id` int(11) NOT NULL,
  `variant_id` int(11) NOT NULL,
  `buying_price` decimal(10,2) DEFAULT NULL,
  `profit_margin` decimal(10,2) DEFAULT NULL,
  `selling_price` decimal(10,2) DEFAULT NULL,
  `qty` int(11) DEFAULT 0,
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_variant` (`stock_id`,`variant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_stock_variants`
--

LOCK TABLES `product_stock_variants` WRITE;
/*!40000 ALTER TABLE `product_stock_variants` DISABLE KEYS */;
INSERT INTO `product_stock_variants` VALUES
(1,3,1,0.00,0.00,0.00,0,0),
(2,5,1,100.00,20.00,120.00,2,0),
(3,6,1,0.00,0.00,0.00,22,0),
(4,7,1,100.00,20.00,120.00,9,0),
(5,8,1,18.00,2.00,20.00,15,0),
(6,10,1,150.00,50.00,200.00,0,0),
(7,10,2,30.00,20.00,50.00,0,0),
(8,11,1,150.00,70.00,220.00,0,0),
(9,11,2,60.00,30.00,90.00,0,0),
(10,11,3,80.00,20.00,100.00,0,0),
(11,12,1,60.00,40.00,100.00,0,0),
(12,12,2,80.00,23.00,103.00,0,0),
(13,12,3,90.00,50.00,140.00,5,0),
(14,13,1,12.00,3.00,15.00,12,0),
(15,14,1,100.00,20.00,120.00,1000,0),
(17,15,1,160.00,40.00,200.00,0,0),
(18,15,2,50.00,20.00,70.00,0,0),
(19,4,1,1000.00,500.00,1500.00,89,0),
(21,16,1,100.00,20.00,120.00,28,0),
(22,17,1,500.00,50.00,550.00,8,0),
(24,17,3,30.00,10.00,40.00,4,0),
(25,18,1,12.00,3.00,15.00,0,0),
(26,17,2,12.00,2.00,14.00,1,0),
(27,19,1,200.00,90.00,290.00,0,0),
(29,20,1,1.00,1.00,2.00,11,0),
(30,21,1,1000.00,500.00,1500.00,0,0),
(31,21,2,800.00,90.00,890.00,8,0),
(32,21,3,900.00,700.00,1600.00,10,0),
(33,22,1,900.00,90.00,990.00,35,0),
(34,22,2,800.00,60.00,860.00,10,0),
(35,23,1,10000.00,2000.00,12000.00,9,0),
(36,23,2,8000.00,2000.00,10000.00,9,0),
(37,23,3,12000.00,2000.00,14000.00,69,0),
(40,28,2,20.00,30.00,50.00,10,0),
(41,28,1,3.00,3.00,6.00,13,0),
(44,30,1,10.00,2.00,12.00,1,0),
(45,29,1,0.00,0.00,0.00,12,0),
(47,32,1,1.00,1.00,2.00,1,0),
(49,33,1,1.00,1.00,2.00,1,0),
(51,31,1,1.00,1.00,2.00,1,0),
(54,34,1,33.00,3.00,36.00,23,0),
(59,36,1,2.00,2.00,4.00,2,0),
(60,36,2,4.00,4.00,8.00,4,0),
(61,36,3,4.00,4.00,8.00,4,0),
(63,35,2,3.00,3.00,6.00,3,0),
(64,35,3,2.00,2.00,4.00,2,0),
(65,35,1,5.00,5.00,10.00,5,0),
(66,47,1,0.00,0.00,0.00,0,0),
(67,47,2,7.00,13.00,20.00,9,0),
(68,48,1,10.00,10.00,20.00,10,0),
(69,49,2,13.00,7.00,20.00,5,0),
(71,49,1,55.00,5.00,60.00,5,0),
(72,50,1,0.00,0.00,0.00,1,0),
(73,51,1,0.00,0.00,0.00,1,0);
/*!40000 ALTER TABLE `product_stock_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variant_master`
--

DROP TABLE IF EXISTS `product_variant_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variant_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variant_master`
--

LOCK TABLES `product_variant_master` WRITE;
/*!40000 ALTER TABLE `product_variant_master` DISABLE KEYS */;
INSERT INTO `product_variant_master` VALUES
(1,'Original'),
(2,'Imported'),
(3,'Complimentary'),
(4,'Refurbished'),
(5,'Used');
/*!40000 ALTER TABLE `product_variant_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotation_items`
--

DROP TABLE IF EXISTS `quotation_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotation_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `quotation_id` bigint(20) NOT NULL,
  `supplier_product_mapping_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `target_price` decimal(12,2) NOT NULL,
  `notes` text DEFAULT NULL,
  `additional_charges` decimal(12,2) DEFAULT 0.00,
  `tax` decimal(12,2) DEFAULT 0.00,
  `packing` decimal(12,2) DEFAULT 0.00,
  `delivery` decimal(12,2) DEFAULT 0.00,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_item` (`quotation_id`,`supplier_product_mapping_id`),
  KEY `idx_quote_id` (`quotation_id`),
  KEY `idx_mapping` (`supplier_product_mapping_id`),
  KEY `idx_deleted_i` (`is_deleted`),
  CONSTRAINT `fk_quotation` FOREIGN KEY (`quotation_id`) REFERENCES `quotations` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotation_items`
--

LOCK TABLES `quotation_items` WRITE;
/*!40000 ALTER TABLE `quotation_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotation_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quotations`
--

DROP TABLE IF EXISTS `quotations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `quotations` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint(20) NOT NULL,
  `request_date` date NOT NULL,
  `validity_date` date NOT NULL,
  `status` enum('pending','accepted','rejected','expired') DEFAULT 'pending',
  `quotation_code` varchar(50) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `quotation_code` (`quotation_code`),
  KEY `idx_supplier_id` (`supplier_id`),
  KEY `idx_status` (`status`),
  KEY `idx_deleted_q` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quotations`
--

LOCK TABLES `quotations` WRITE;
/*!40000 ALTER TABLE `quotations` DISABLE KEYS */;
/*!40000 ALTER TABLE `quotations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_bill_items`
--

DROP TABLE IF EXISTS `sales_bill_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_bill_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `stock_type_id` int(11) DEFAULT NULL,
  `stock_id` bigint(20) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_bill_items`
--

LOCK TABLES `sales_bill_items` WRITE;
/*!40000 ALTER TABLE `sales_bill_items` DISABLE KEYS */;
INSERT INTO `sales_bill_items` VALUES
(13,13,2651,1,1,NULL,120.00,1,120.00),
(14,14,2651,1,1,NULL,120.00,1,120.00),
(15,15,2651,1,1,NULL,120.00,1,120.00),
(16,16,2147,1,2,NULL,120.00,10,1200.00),
(17,16,2584,1,2,NULL,200.00,10,2000.00),
(18,17,2584,2,2,NULL,50.00,5,250.00),
(19,17,2584,1,2,NULL,200.00,5,1000.00),
(20,18,2651,1,2,NULL,0.00,12,0.00),
(21,19,2147,3,2,NULL,100.00,6,600.00),
(22,19,2147,2,2,NULL,90.00,12,1080.00),
(23,19,2147,1,2,NULL,220.00,2,440.00),
(24,20,806,3,2,NULL,140.00,10,1400.00),
(25,20,806,2,2,NULL,103.00,20,2060.00),
(26,20,806,1,2,NULL,100.00,70,7000.00),
(27,21,2147,3,2,NULL,100.00,1,100.00),
(28,22,2147,1,2,NULL,0.00,1,0.00),
(29,23,806,2,2,NULL,103.00,5,515.00),
(41,35,2147,1,2,NULL,120.00,1,120.00),
(42,36,2584,1,2,NULL,550.00,1,550.00),
(43,36,2584,2,2,NULL,200.00,1,200.00),
(44,36,2584,3,2,NULL,40.00,1,40.00),
(49,41,2584,2,2,NULL,200.00,1,200.00),
(52,44,2584,1,2,NULL,550.00,1,550.00),
(64,54,2147,2,1,NULL,90.00,1,90.00),
(67,56,2584,2,1,NULL,70.00,5,350.00),
(68,57,2147,1,1,NULL,120.00,1,120.00),
(69,57,2651,1,1,NULL,1500.00,1,1500.00),
(70,58,2584,1,1,NULL,15.00,1,15.00),
(71,59,2934,1,1,NULL,290.00,12,3480.00),
(73,61,2147,2,1,NULL,90.00,2,180.00),
(74,62,2934,1,1,NULL,2.00,1,2.00),
(75,63,2260,1,1,NULL,1500.00,8,12000.00),
(76,64,2260,1,2,NULL,1500.00,2,3000.00),
(77,65,2260,2,1,NULL,890.00,2,1780.00),
(78,66,2605,1,1,NULL,12000.00,1,12000.00),
(79,66,2605,2,1,NULL,10000.00,1,10000.00),
(80,66,2605,3,1,NULL,14000.00,1,14000.00),
(81,67,2260,1,1,NULL,990.00,25,24750.00),
(82,68,2584,2,1,NULL,200.00,5,1358.00),
(83,69,2584,1,3,NULL,550.00,10,5500.00),
(84,69,2584,3,3,NULL,40.00,10,400.00),
(85,70,2584,1,1,NULL,200.00,10,3040.00),
(86,71,2899,1,1,NULL,112.00,10,1120.00),
(87,72,2899,1,1,NULL,36.00,3,108.00),
(88,73,2899,1,1,NULL,36.00,3,108.00),
(89,74,2899,1,1,NULL,36.00,2,72.00),
(90,75,2899,1,1,NULL,36.00,2,72.00);
/*!40000 ALTER TABLE `sales_bill_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_bills`
--

DROP TABLE IF EXISTS `sales_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_bills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_customer_lookup` (`external_customer_id`,`customer_type`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_bills`
--

LOCK TABLES `sales_bills` WRITE;
/*!40000 ALTER TABLE `sales_bills` DISABLE KEYS */;
INSERT INTO `sales_bills` VALUES
(13,1,14,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00001','CASH',2000.00,100.00,50.00,1950.00,'2026-03-13 07:51:06','2026-04-10 05:40:14'),
(14,1,14,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00002','CASH',2000.00,100.00,50.00,1950.00,'2026-03-13 09:15:45','2026-04-10 05:40:14'),
(15,1,1,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00003','CASH',2000.00,100.00,50.00,1950.00,'2026-03-13 09:16:47','2026-04-10 05:40:14'),
(16,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00004','CASH',3200.00,0.00,0.00,3200.00,'2026-03-13 09:23:44','2026-04-10 05:40:14'),
(17,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00005','CASH',1250.00,0.00,0.00,1250.00,'2026-03-13 09:43:28','2026-04-10 05:40:14'),
(18,1,1,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00006','CASH',0.00,0.00,0.00,0.00,'2026-03-14 04:56:57','2026-04-10 05:40:14'),
(19,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00007','CASH',2120.00,0.00,0.00,2120.00,'2026-03-14 08:16:41','2026-04-10 05:40:14'),
(20,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00008','CASH',10460.00,0.00,0.00,10460.00,'2026-03-14 08:29:49','2026-04-10 05:40:14'),
(21,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00009','CASH',100.00,0.00,0.00,100.00,'2026-03-17 05:25:19','2026-04-10 05:40:14'),
(22,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00010','CASH',0.00,0.00,0.00,0.00,'2026-03-17 05:26:20','2026-04-10 05:40:14'),
(23,1,1,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00011','CASH',515.00,0.00,0.00,515.00,'2026-03-17 07:21:14','2026-04-10 05:40:14'),
(35,1,18,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00012','CASH',120.00,0.00,0.00,120.00,'2026-03-19 06:22:25','2026-04-10 05:40:14'),
(36,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00013','CASH',790.00,0.00,0.00,790.00,'2026-03-19 06:51:47','2026-04-10 05:40:14'),
(41,1,18,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00014','CASH',200.00,0.00,0.00,200.00,'2026-03-19 06:56:44','2026-04-10 05:40:14'),
(44,1,18,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00015','CASH',550.00,0.00,0.00,550.00,'2026-03-19 06:59:51','2026-04-10 05:40:14'),
(54,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00016','CASH',90.00,0.00,0.00,90.00,'2026-03-20 01:57:34','2026-04-10 05:40:14'),
(56,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00017','CASH',350.00,0.00,0.00,350.00,'2026-03-20 01:58:29','2026-04-10 05:40:14'),
(57,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00018','CASH',1620.00,0.00,0.00,1620.00,'2026-03-20 01:59:01','2026-04-10 05:40:14'),
(58,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00019','CASH',15.00,0.00,0.00,15.00,'2026-03-23 07:13:03','2026-04-10 05:40:14'),
(59,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00020','CASH',3480.00,0.00,0.00,3480.00,'2026-03-24 09:14:52','2026-04-10 05:40:14'),
(61,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00021','CASH',180.00,0.00,0.00,180.00,'2026-03-26 08:33:00','2026-04-10 05:40:14'),
(62,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00022','CASH',2.00,0.00,0.00,2.00,'2026-03-26 08:33:40','2026-04-10 05:40:14'),
(63,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00023','CASH',12000.00,0.00,0.00,12000.00,'2026-03-26 08:37:00','2026-04-10 05:40:14'),
(64,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00024','CASH',3000.00,0.00,0.00,3000.00,'2026-03-26 08:37:45','2026-04-10 05:40:14'),
(65,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00025','CASH',1780.00,0.00,0.00,1780.00,'2026-03-26 08:38:26','2026-04-10 05:40:14'),
(66,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00026','CASH',36000.00,0.00,0.00,36000.00,'2026-03-26 09:02:14','2026-04-10 05:40:14'),
(67,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00027','CASH',24750.00,0.00,0.00,24750.00,'2026-03-27 08:26:40','2026-04-10 05:40:14'),
(68,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00028','CASH',1250.00,32.00,430.00,1648.00,'2026-03-30 07:51:34','2026-04-10 05:40:14'),
(69,1,26,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00029','CASH',5900.00,0.00,0.00,5900.00,'2026-04-01 03:36:21','2026-04-10 05:40:14'),
(70,1,15,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00030','CASH',2000.00,160.00,1200.00,3040.00,'2026-04-02 04:18:21','2026-04-10 05:40:14'),
(71,40,27,'USER','CENTRAL_API',NULL,NULL,NULL,'BILL-00001','CASH',1120.00,0.00,0.00,1120.00,'2026-04-09 04:37:00','2026-04-10 05:40:14'),
(72,40,44,'USER','CENTRAL_API','lohit','9986745645',NULL,'BILL-00002','CASH',108.00,0.00,0.00,108.00,'2026-04-10 07:13:59','2026-04-10 07:13:59'),
(73,40,42,'BUSINESS','CENTRAL_API','circuit point','9367714442',NULL,'BILL-00003','CASH',108.00,0.00,0.00,108.00,'2026-04-10 07:15:54','2026-04-10 07:15:54'),
(74,40,46,'BUSINESS','CENTRAL_API','ravi','9785645643',NULL,'BILL-00004','CASH',72.00,0.00,0.00,72.00,'2026-04-10 07:24:14','2026-04-10 07:24:14'),
(75,40,45,'BUSINESS','CENTRAL_API','ravitrade','7465764365','{\"email\": \"ravitrade@gmail.com\", \"address\": {\"area\": \"Serayampalayam\", \"state\": \"tamilnadu\", \"street\": \"Neelambur\", \"country\": \"India\", \"pincode\": \"641669\", \"district\": \"Coimbatore\", \"door_number\": \"12\"}, \"gst_number\": \"22AAAAA0000A1Z1\"}','BILL-00005','CASH',72.00,0.00,0.00,72.00,'2026-04-10 07:28:26','2026-04-10 07:28:26');
/*!40000 ALTER TABLE `sales_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_returns`
--

DROP TABLE IF EXISTS `sales_returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_returns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `variant_id` int(11) DEFAULT NULL,
  `stock_type_id` int(11) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_returns`
--

LOCK TABLES `sales_returns` WRITE;
/*!40000 ALTER TABLE `sales_returns` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_returns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_type_master`
--

DROP TABLE IF EXISTS `sales_type_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_type_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_type_master`
--

LOCK TABLES `sales_type_master` WRITE;
/*!40000 ALTER TABLE `sales_type_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_type_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_type_master`
--

DROP TABLE IF EXISTS `service_type_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_type_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_type_master`
--

LOCK TABLES `service_type_master` WRITE;
/*!40000 ALTER TABLE `service_type_master` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_type_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_type_master`
--

DROP TABLE IF EXISTS `shop_type_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_type_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_type_master`
--

LOCK TABLES `shop_type_master` WRITE;
/*!40000 ALTER TABLE `shop_type_master` DISABLE KEYS */;
INSERT INTO `shop_type_master` VALUES
(1,'Export'),
(2,'Import'),
(3,'Local Shop'),
(4,'Online Shop'),
(5,'Wholesale Shop');
/*!40000 ALTER TABLE `shop_type_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
INSERT INTO `stock_movements` VALUES
(1,1,2651,7,1,1,'SALE',-1,NULL,'SALE_BILL',13,'2026-03-13 07:51:06'),
(2,1,2651,7,1,1,'SALE',-1,NULL,'SALE_BILL',14,'2026-03-13 09:15:45'),
(3,1,2651,7,1,1,'SALE',-1,NULL,'SALE_BILL',15,'2026-03-13 09:16:47'),
(4,1,2147,5,1,2,'SALE',-10,NULL,'SALE_BILL',16,'2026-03-13 09:23:44'),
(5,1,2584,10,1,2,'SALE',-10,NULL,'SALE_BILL',16,'2026-03-13 09:23:44'),
(6,1,2584,10,2,2,'SALE',-5,NULL,'SALE_BILL',17,'2026-03-13 09:43:28'),
(7,1,2584,10,1,2,'SALE',-5,NULL,'SALE_BILL',17,'2026-03-13 09:43:28'),
(8,1,2651,3,1,2,'SALE',-12,NULL,'SALE_BILL',18,'2026-03-14 04:56:57'),
(9,1,2147,11,3,2,'SALE',-6,NULL,'SALE_BILL',19,'2026-03-14 08:16:41'),
(10,1,2147,11,2,2,'SALE',-12,NULL,'SALE_BILL',19,'2026-03-14 08:16:41'),
(11,1,2147,11,1,2,'SALE',-2,NULL,'SALE_BILL',19,'2026-03-14 08:16:41'),
(12,1,806,12,3,2,'SALE',-10,NULL,'SALE_BILL',20,'2026-03-14 08:29:49'),
(13,1,806,12,2,2,'SALE',-20,NULL,'SALE_BILL',20,'2026-03-14 08:29:49'),
(14,1,806,12,1,2,'SALE',-70,NULL,'SALE_BILL',20,'2026-03-14 08:29:49'),
(15,1,2147,11,3,2,'SALE',-1,NULL,'SALE_BILL',21,'2026-03-17 05:25:19'),
(16,1,2147,6,1,2,'SALE',-1,NULL,'SALE_BILL',22,'2026-03-17 05:26:20'),
(17,1,806,12,2,2,'SALE',-5,NULL,'SALE_BILL',23,'2026-03-17 07:21:14'),
(18,1,2147,16,1,2,'SALE',-1,NULL,'SALE_BILL',35,'2026-03-19 06:22:25'),
(19,1,2584,17,1,2,'SALE',-1,NULL,'SALE_BILL',36,'2026-03-19 06:51:47'),
(20,1,2584,17,2,2,'SALE',-1,NULL,'SALE_BILL',36,'2026-03-19 06:51:47'),
(21,1,2584,17,3,2,'SALE',-1,NULL,'SALE_BILL',36,'2026-03-19 06:51:47'),
(22,1,2584,17,2,2,'SALE',-1,NULL,'SALE_BILL',41,'2026-03-19 06:56:44'),
(23,1,2584,17,1,2,'SALE',-1,NULL,'SALE_BILL',44,'2026-03-19 06:59:51'),
(24,1,2147,11,2,1,'SALE',-1,NULL,'SALE_BILL',54,'2026-03-20 01:57:34'),
(26,1,2584,15,2,1,'SALE',-5,NULL,'SALE_BILL',56,'2026-03-20 01:58:29'),
(27,1,2147,16,1,1,'SALE',-1,NULL,'SALE_BILL',57,'2026-03-20 01:59:01'),
(28,1,2651,4,1,1,'SALE',-1,NULL,'SALE_BILL',57,'2026-03-20 01:59:01'),
(29,1,2584,18,1,1,'SALE',-1,NULL,'SALE_BILL',58,'2026-03-23 07:13:03'),
(30,1,2934,19,1,1,'SALE',-12,NULL,'SALE_BILL',59,'2026-03-24 09:14:52'),
(31,1,2147,11,2,1,'SALE',-2,NULL,'SALE_BILL',61,'2026-03-26 08:33:00'),
(32,1,2934,20,1,1,'SALE',-1,NULL,'SALE_BILL',62,'2026-03-26 08:33:40'),
(33,1,2260,21,1,1,'SALE',-8,NULL,'SALE_BILL',63,'2026-03-26 08:37:00'),
(34,1,2260,21,1,2,'SALE',-2,NULL,'SALE_BILL',64,'2026-03-26 08:37:45'),
(35,1,2260,21,2,1,'SALE',-2,NULL,'SALE_BILL',65,'2026-03-26 08:38:26'),
(36,1,2605,23,1,1,'SALE',-1,NULL,'SALE_BILL',66,'2026-03-26 09:02:14'),
(37,1,2605,23,2,1,'SALE',-1,NULL,'SALE_BILL',66,'2026-03-26 09:02:14'),
(38,1,2605,23,3,1,'SALE',-1,NULL,'SALE_BILL',66,'2026-03-26 09:02:14'),
(39,1,2260,22,1,1,'SALE',-25,NULL,'SALE_BILL',67,'2026-03-27 08:26:40'),
(40,1,2584,17,2,1,'SALE',-5,NULL,'SALE_BILL',68,'2026-03-30 07:51:34'),
(41,1,2584,17,1,3,'SALE',-10,NULL,'SALE_BILL',69,'2026-04-01 03:36:21'),
(42,1,2584,17,3,3,'SALE',-10,NULL,'SALE_BILL',69,'2026-04-01 03:36:21'),
(43,1,2584,15,1,1,'SALE',-10,NULL,'SALE_BILL',70,'2026-04-02 04:18:21'),
(44,40,2899,28,1,1,'SALE',-10,NULL,'SALE_BILL',71,'2026-04-09 04:37:00'),
(45,40,2899,34,1,1,'SALE',-3,NULL,'SALE_BILL',72,'2026-04-10 07:13:59'),
(46,40,2899,34,1,1,'SALE',-3,NULL,'SALE_BILL',73,'2026-04-10 07:15:54'),
(47,40,2899,34,1,1,'SALE',-2,NULL,'SALE_BILL',74,'2026-04-10 07:24:14'),
(48,40,2899,34,1,1,'SALE',-2,NULL,'SALE_BILL',75,'2026-04-10 07:28:26');
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_type_master`
--

DROP TABLE IF EXISTS `stock_type_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_type_master` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_type_master`
--

LOCK TABLES `stock_type_master` WRITE;
/*!40000 ALTER TABLE `stock_type_master` DISABLE KEYS */;
INSERT INTO `stock_type_master` VALUES
(1,1,'Display',0,NULL),
(2,1,'Shop in Sales',0,NULL),
(3,1,'Outside Stocks',0,NULL);
/*!40000 ALTER TABLE `stock_type_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_address_fields`
--

DROP TABLE IF EXISTS `storage_address_fields`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_address_fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `storage_type_id` int(11) NOT NULL,
  `field_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `field_order` int(11) DEFAULT 0,
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `storage_type_id_2` (`storage_type_id`,`field_order`),
  KEY `storage_type_id` (`storage_type_id`),
  CONSTRAINT `storage_address_fields_ibfk_1` FOREIGN KEY (`storage_type_id`) REFERENCES `storage_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_address_fields`
--

LOCK TABLES `storage_address_fields` WRITE;
/*!40000 ALTER TABLE `storage_address_fields` DISABLE KEYS */;
INSERT INTO `storage_address_fields` VALUES
(1,1,'Address','2026-04-01 11:16:43',1,0),
(2,1,'Pincode','2026-04-01 11:16:51',2,0),
(3,2,'Place','2026-04-02 05:04:28',1,0),
(4,2,'Address','2026-04-02 05:04:28',2,0),
(5,2,'Landmark','2026-04-02 05:04:28',3,0),
(6,2,'Pincode','2026-04-02 05:04:28',4,0),
(7,3,'Place','2026-04-02 08:45:38',1,0),
(8,3,'Address','2026-04-02 08:45:38',2,0),
(9,3,'Landmark','2026-04-02 08:45:39',3,0),
(10,3,'Pincode','2026-04-02 08:45:39',4,0),
(11,3,'sss','2026-04-02 09:19:46',11,0),
(14,3,'dd','2026-04-03 04:40:13',6,0),
(17,3,'CC','2026-04-03 05:24:47',10,0),
(18,5,'ss','2026-04-06 09:39:12',1,0),
(19,5,'rrr','2026-04-09 01:55:26',2,0),
(20,4,'CITY','2026-04-09 04:15:54',1,0),
(21,7,'address','2026-04-10 10:06:44',1,0),
(22,7,'pincode','2026-04-10 10:06:54',2,0),
(23,7,'place','2026-04-10 10:08:48',3,0),
(24,5,'ww','2026-04-11 06:33:07',3,0),
(25,4,'swq','2026-04-15 08:57:28',2,0),
(26,5,'ewwe','2026-04-15 09:20:00',4,0),
(27,4,'ew','2026-04-15 09:20:17',3,0),
(28,4,'wewe','2026-04-15 09:21:45',5,0),
(29,4,'ew','2026-04-15 09:26:39',4,0),
(30,4,'45','2026-04-15 09:32:09',6,0),
(31,4,'sfd','2026-04-15 09:34:07',7,0),
(32,4,'r','2026-04-15 09:43:34',8,0),
(33,4,'fd','2026-04-15 09:48:54',9,0),
(34,4,'ju','2026-04-15 10:00:25',10,0),
(35,4,'yj','2026-04-15 10:04:41',11,0),
(36,4,'re','2026-04-15 10:06:20',12,0),
(37,4,'g','2026-04-15 10:09:43',13,0),
(38,4,'e','2026-04-15 10:11:43',14,0),
(39,4,'dewwe','2026-04-15 10:13:31',15,0),
(40,4,'err','2026-04-15 10:14:44',16,0),
(41,4,'f','2026-04-16 03:52:15',17,0),
(42,8,'city','2026-04-27 03:46:24',1,0),
(43,9,'w1','2026-04-27 03:50:41',1,0),
(44,10,'Address','2026-05-02 09:17:04',1,0),
(45,10,'pincode','2026-05-02 09:17:13',2,0);
/*!40000 ALTER TABLE `storage_address_fields` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_address_values`
--

DROP TABLE IF EXISTS `storage_address_values`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_address_values` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `storage_type_id` int(11) NOT NULL,
  `field_id` int(11) NOT NULL,
  `field_value` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `address_group_id` bigint(20) unsigned DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_address_values`
--

LOCK TABLES `storage_address_values` WRITE;
/*!40000 ALTER TABLE `storage_address_values` DISABLE KEYS */;
INSERT INTO `storage_address_values` VALUES
(1,1,1,1,'Nellambur','2026-04-01 11:17:15',1775042235933,0),
(2,1,1,2,'123456','2026-04-01 11:17:15',1775042235933,0),
(3,1,1,1,'CBE','2026-04-01 11:17:24',1775042244364,0),
(4,1,1,2,'778945','2026-04-01 11:17:24',1775042244364,0),
(5,1,2,3,'AA','2026-04-02 05:04:45',1775106285977,0),
(9,40,5,18,'q34','2026-04-09 01:58:40',1775699920228,0),
(10,40,5,19,'w12','2026-04-09 01:58:40',1775699920228,0),
(11,40,4,20,'CBE','2026-04-09 04:16:05',1775708165989,0),
(12,40,7,21,'neelambur','2026-04-10 10:09:35',1775815775776,0),
(13,40,7,22,'23456','2026-04-10 10:09:35',1775815775776,0),
(14,40,7,23,'neelambur','2026-04-10 10:09:35',1775815775776,0),
(15,40,4,20,'gfe','2026-04-15 08:59:19',1776243559847,0),
(18,40,4,0,NULL,'2026-04-15 09:21:50',1776244910573,0),
(19,40,4,0,NULL,'2026-04-15 09:21:50',1776244910573,0),
(20,40,4,0,NULL,'2026-04-15 09:21:50',1776244910573,0),
(25,40,4,0,NULL,'2026-04-15 09:32:19',1776245539576,0),
(26,40,4,0,NULL,'2026-04-15 09:32:19',1776245539576,0),
(27,40,4,0,NULL,'2026-04-15 09:32:19',1776245539576,0),
(28,40,4,0,NULL,'2026-04-15 09:32:19',1776245539576,0),
(29,40,4,0,NULL,'2026-04-15 09:34:14',1776245654097,0),
(30,40,4,0,NULL,'2026-04-15 09:34:14',1776245654097,0),
(31,40,4,0,NULL,'2026-04-15 09:34:14',1776245654097,0),
(32,40,4,0,NULL,'2026-04-15 09:34:14',1776245654097,0),
(33,40,4,0,NULL,'2026-04-15 09:34:14',1776245654097,0),
(34,40,4,0,NULL,'2026-04-15 09:43:37',1776246217120,0),
(35,40,4,0,NULL,'2026-04-15 09:43:37',1776246217120,0),
(36,40,4,0,NULL,'2026-04-15 09:43:37',1776246217120,0),
(37,40,4,0,NULL,'2026-04-15 09:43:37',1776246217120,0),
(38,40,4,0,NULL,'2026-04-15 09:43:37',1776246217120,0),
(39,40,4,0,NULL,'2026-04-15 09:43:37',1776246217120,0),
(40,40,4,0,NULL,'2026-04-15 09:49:04',1776246544386,0),
(41,40,4,0,NULL,'2026-04-15 09:49:04',1776246544386,0),
(42,40,4,0,NULL,'2026-04-15 09:49:04',1776246544386,0),
(43,40,4,0,NULL,'2026-04-15 09:49:04',1776246544386,0),
(44,40,4,0,NULL,'2026-04-15 09:49:04',1776246544386,0),
(45,40,4,0,NULL,'2026-04-15 09:49:04',1776246544386,0),
(46,40,4,0,NULL,'2026-04-15 09:49:04',1776246544386,0),
(47,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(48,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(49,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(50,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(51,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(52,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(53,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(54,40,4,0,NULL,'2026-04-15 10:00:32',1776247232333,0),
(55,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(56,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(57,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(58,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(59,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(60,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(61,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(62,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(63,40,4,0,NULL,'2026-04-15 10:04:49',1776247489928,0),
(64,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(65,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(66,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(67,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(68,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(69,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(70,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(71,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(72,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(73,40,4,0,NULL,'2026-04-15 10:06:23',1776247583912,0),
(74,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(75,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(76,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(77,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(78,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(79,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(80,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(81,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(82,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(83,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(84,40,4,0,NULL,'2026-04-15 10:09:46',1776247786535,0),
(85,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(86,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(87,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(88,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(89,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(90,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(91,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(92,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(93,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(94,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(95,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(96,40,4,0,NULL,'2026-04-15 10:11:45',1776247905758,0),
(97,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(98,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(99,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(100,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(101,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(102,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(103,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(104,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(105,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(106,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(107,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(108,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(109,40,4,0,NULL,'2026-04-15 10:13:33',1776248013349,0),
(110,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(111,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(112,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(113,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(114,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(115,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(116,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(117,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(118,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(119,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(120,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(121,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(122,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(123,40,4,0,NULL,'2026-04-15 10:14:47',1776248087689,0),
(140,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(141,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(142,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(143,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(144,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(145,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(146,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(147,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(148,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(149,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(150,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(151,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(152,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(153,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(154,40,4,0,NULL,'2026-04-15 10:58:35',1776250715433,0),
(155,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(156,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(157,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(158,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(159,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(160,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(161,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(162,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(163,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(164,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(165,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(166,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(167,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(168,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(169,40,4,0,NULL,'2026-04-16 03:52:18',1776311538451,0),
(170,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(171,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(172,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(173,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(174,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(175,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(176,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(177,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(178,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(179,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(180,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(181,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(182,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(183,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(184,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(185,40,4,0,NULL,'2026-04-21 03:57:06',1776743826783,0),
(186,40,10,44,'Neelambur','2026-05-02 09:17:41',1777713461045,0),
(187,40,10,45,'641062','2026-05-02 09:17:41',1777713461045,0);
/*!40000 ALTER TABLE `storage_address_values` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_locations`
--

DROP TABLE IF EXISTS `storage_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `storage_type_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `level_id` int(11) NOT NULL,
  `code` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `partition_rows` int(11) DEFAULT NULL,
  `partition_columns` int(11) DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_location_code` (`business_id`,`storage_type_id`,`parent_id`,`code`),
  KEY `storage_type_id` (`storage_type_id`),
  KEY `level_id` (`level_id`),
  KEY `idx_storage_locations_parent` (`parent_id`),
  KEY `idx_storage_locations_id` (`id`),
  CONSTRAINT `storage_locations_ibfk_1` FOREIGN KEY (`storage_type_id`) REFERENCES `storage_types` (`id`) ON DELETE CASCADE,
  CONSTRAINT `storage_locations_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `storage_structure_levels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_locations`
--

LOCK TABLES `storage_locations` WRITE;
/*!40000 ALTER TABLE `storage_locations` DISABLE KEYS */;
INSERT INTO `storage_locations` VALUES
(1,1,1,NULL,1,'B1','Building 1','2026-04-01 11:18:50',NULL,NULL,0),
(2,1,1,1,3,'F1','Floor 1','2026-04-01 11:21:42',NULL,NULL,0),
(3,1,1,2,4,'R1','Rack 1','2026-04-01 11:43:32',NULL,NULL,0),
(4,1,1,3,5,'S1','Shelf','2026-04-01 11:46:38',NULL,NULL,0),
(5,1,1,4,6,'B1','Box 1','2026-04-01 11:58:28',NULL,NULL,0),
(6,1,1,5,7,'C1','Container 1','2026-04-01 11:58:39',NULL,NULL,0),
(7,1,1,6,8,'R1','Row/Col','2026-04-01 11:59:12',2,2,0),
(8,1,1,7,8,'R1-A1','A1','2026-04-01 11:59:12',NULL,NULL,0),
(9,1,1,7,8,'R1-A2','A2','2026-04-01 11:59:12',NULL,NULL,0),
(10,1,1,7,8,'R1-B1','B1','2026-04-01 11:59:12',NULL,NULL,0),
(11,1,1,7,8,'R1-B2','B2','2026-04-01 11:59:12',NULL,NULL,0),
(12,1,2,NULL,9,'A','A','2026-04-02 05:04:49',NULL,NULL,0),
(13,1,2,12,10,'A-B','B','2026-04-02 05:05:00',NULL,NULL,0),
(14,1,2,13,11,'B-C','C','2026-04-02 05:06:44',NULL,NULL,0),
(15,1,2,NULL,14,'R12','R12','2026-04-02 05:07:31',NULL,NULL,0),
(16,1,2,15,14,'R12-S1','S1','2026-04-02 05:07:56',NULL,NULL,0),
(17,1,2,15,14,'R12-S2','S2','2026-04-02 05:07:56',NULL,NULL,0),
(21,35,3,NULL,17,'B1','A','2026-04-03 05:26:09',NULL,NULL,0),
(22,35,3,21,18,'B1','AA','2026-04-03 05:26:15',NULL,NULL,0),
(23,35,3,22,19,'F1','DD','2026-04-03 05:26:21',NULL,NULL,0),
(24,35,3,23,20,'P1','ff','2026-04-03 06:05:44',NULL,NULL,0),
(25,35,3,24,21,'R1','fe','2026-04-03 06:05:53',NULL,NULL,0),
(29,40,5,30,29,'S1','AAA','2026-04-06 09:39:58',NULL,NULL,0),
(30,40,5,29,29,'S2','AAAA','2026-04-06 09:40:01',NULL,NULL,0),
(63,40,5,NULL,30,'B1','A','2026-04-09 03:51:01',NULL,NULL,0),
(64,40,5,63,29,'F3','1','2026-04-09 03:51:06',NULL,NULL,0),
(65,40,5,64,31,'R1','101','2026-04-09 03:51:15',NULL,NULL,0),
(66,40,5,65,33,'S1','S1','2026-04-09 03:51:26',NULL,NULL,0),
(67,40,5,66,32,'R1','1','2026-04-09 03:51:36',NULL,NULL,0),
(68,40,5,67,35,'C1','C12','2026-04-09 03:51:46',NULL,NULL,0),
(71,40,5,70,36,'R1-A1','A1','2026-04-09 03:52:12',NULL,NULL,0),
(72,40,4,NULL,37,'1','A','2026-04-09 04:17:04',NULL,NULL,0),
(73,40,4,72,38,'F1','2','2026-04-09 04:17:14',NULL,NULL,0),
(74,40,4,73,39,'R1','3','2026-04-09 04:17:18',NULL,NULL,0),
(75,40,4,74,40,'B1','4fdfd','2026-04-09 04:17:26',NULL,NULL,0),
(76,40,5,NULL,30,'B2','circuitpoint','2026-04-10 10:15:37',NULL,NULL,0),
(77,40,5,76,31,'R2','rooms 1','2026-04-10 10:16:29',NULL,NULL,0),
(79,40,7,NULL,41,'B1','circuitpoinnte','2026-04-10 11:05:41',NULL,NULL,0),
(80,40,7,79,42,'F1','floor 1','2026-04-10 11:05:55',NULL,NULL,0),
(81,40,7,80,43,'R1','rack 1','2026-04-10 11:06:13',NULL,NULL,0),
(84,40,7,83,47,'C1','partition 1','2026-04-10 11:08:36',2,3,0),
(86,40,7,84,47,'C1-A2','A2vv','2026-04-10 11:08:36',NULL,NULL,0),
(87,40,7,84,47,'C1-A3','A3','2026-04-10 11:08:36',NULL,NULL,0),
(88,40,7,84,47,'C1-B1','B1','2026-04-10 11:08:36',NULL,NULL,0),
(94,40,7,79,42,'F2','Building 2','2026-04-21 04:53:05',NULL,NULL,0),
(99,40,7,NULL,41,'B2','Test level_id','2026-04-21 07:40:44',NULL,NULL,0),
(100,40,7,86,43,'R2','hhh','2026-04-21 07:43:20',NULL,NULL,0),
(101,40,7,88,43,'R3','bjjjjn','2026-04-21 07:43:32',NULL,NULL,0),
(102,40,7,NULL,41,'B3','gfgre','2026-04-21 08:38:22',NULL,NULL,0),
(103,40,7,NULL,41,'B4','gggg','2026-04-21 08:38:47',NULL,NULL,0),
(104,40,7,79,42,'F3','hhh','2026-04-21 08:38:53',NULL,NULL,0),
(105,40,5,68,34,'B1','qw','2026-04-27 03:45:26',NULL,NULL,0),
(106,40,10,NULL,64,'B1','CP','2026-05-02 09:20:08',NULL,NULL,0),
(107,40,10,106,65,'F1','floor 1','2026-05-02 09:20:27',NULL,NULL,0),
(108,40,10,107,66,'R1','project rack 1','2026-05-02 09:20:53',NULL,NULL,0),
(109,40,10,108,67,'S1','shelf 5','2026-05-02 09:21:12',NULL,NULL,0),
(110,40,10,109,68,'B1','motor driver 2','2026-05-02 09:21:45',3,2,0),
(111,40,10,110,68,'B1-A1','A1','2026-05-02 09:21:45',NULL,NULL,0),
(112,40,10,110,68,'B1-A2','A2','2026-05-02 09:21:45',NULL,NULL,0),
(113,40,10,110,68,'B1-B1','B1','2026-05-02 09:21:45',NULL,NULL,0),
(114,40,10,110,68,'B1-B2','B2','2026-05-02 09:21:45',NULL,NULL,0),
(115,40,10,110,68,'B1-C1','C1','2026-05-02 09:21:45',NULL,NULL,0),
(116,40,10,110,68,'B1-C2','C2','2026-05-02 09:21:45',NULL,NULL,0),
(117,40,4,NULL,37,'B2','hall','2026-05-06 06:52:10',NULL,NULL,0),
(118,40,4,117,38,'F2','fan','2026-05-06 06:52:20',NULL,NULL,0);
/*!40000 ALTER TABLE `storage_locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_structure_levels`
--

DROP TABLE IF EXISTS `storage_structure_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_structure_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `storage_type_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `level_order` int(11) DEFAULT NULL,
  `is_partitionable` tinyint(1) DEFAULT 0,
  `partition_rows` int(11) DEFAULT NULL,
  `partition_columns` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `storage_type_id_2` (`storage_type_id`,`level_order`),
  UNIQUE KEY `unique_structure_level` (`business_id`,`storage_type_id`,`level_order`),
  KEY `storage_type_id` (`storage_type_id`),
  CONSTRAINT `storage_structure_levels_ibfk_1` FOREIGN KEY (`storage_type_id`) REFERENCES `storage_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_structure_levels`
--

LOCK TABLES `storage_structure_levels` WRITE;
/*!40000 ALTER TABLE `storage_structure_levels` DISABLE KEYS */;
INSERT INTO `storage_structure_levels` VALUES
(1,1,1,NULL,'Building',1,0,NULL,NULL,'2026-04-01 11:17:34',0),
(3,1,1,NULL,'Floor',2,0,NULL,NULL,'2026-04-01 11:17:49',0),
(4,1,1,NULL,'Rack',3,0,NULL,NULL,'2026-04-01 11:17:57',0),
(5,1,1,NULL,'Shelf',4,0,NULL,NULL,'2026-04-01 11:18:01',0),
(6,1,1,NULL,'Box',5,0,NULL,NULL,'2026-04-01 11:18:04',0),
(7,1,1,NULL,'Container',6,0,NULL,NULL,'2026-04-01 11:18:09',0),
(8,1,1,NULL,'Row-Col',7,1,NULL,NULL,'2026-04-01 11:18:23',0),
(9,1,2,NULL,'Block',1,0,NULL,NULL,'2026-04-02 05:04:28',0),
(10,1,2,9,'Building',2,0,NULL,NULL,'2026-04-02 05:04:28',0),
(11,1,2,10,'Floor',3,0,NULL,NULL,'2026-04-02 05:04:28',0),
(12,1,2,11,'Partition',4,0,NULL,NULL,'2026-04-02 05:04:28',0),
(13,1,2,12,'Room',5,0,NULL,NULL,'2026-04-02 05:04:28',0),
(14,1,2,13,'Rack & Shelf',6,0,NULL,NULL,'2026-04-02 05:04:28',0),
(15,1,2,14,'Box & Container',7,0,NULL,NULL,'2026-04-02 05:04:28',0),
(16,1,2,15,'Row & Column',8,0,NULL,NULL,'2026-04-02 05:04:28',0),
(17,35,3,NULL,'Block',1,0,NULL,NULL,'2026-04-02 08:45:39',0),
(18,35,3,17,'Building',2,0,NULL,NULL,'2026-04-02 08:45:39',0),
(19,35,3,18,'Floor',3,0,NULL,NULL,'2026-04-02 08:45:39',0),
(20,35,3,19,'Partition',4,0,NULL,NULL,'2026-04-02 08:45:39',0),
(21,35,3,20,'Room',5,0,NULL,NULL,'2026-04-02 08:45:39',0),
(22,35,3,21,'Rack & Shelf',6,0,NULL,NULL,'2026-04-02 08:45:39',0),
(23,35,3,22,'Box & Container',7,0,NULL,NULL,'2026-04-02 08:45:39',0),
(24,35,3,23,'Row & Column',8,0,NULL,NULL,'2026-04-02 08:45:39',0),
(29,40,5,NULL,'Floor122w',3,0,NULL,NULL,'2026-04-06 09:39:18',0),
(30,40,5,NULL,'Building2',1,0,NULL,NULL,'2026-04-06 09:40:16',0),
(31,40,5,NULL,'Room12',2,0,NULL,NULL,'2026-04-06 12:17:46',0),
(32,40,5,NULL,'Rack',5,0,NULL,NULL,'2026-04-06 12:17:52',0),
(33,40,5,NULL,'Shelf',4,0,NULL,NULL,'2026-04-06 12:17:59',0),
(34,40,5,NULL,'Box12',7,0,NULL,NULL,'2026-04-06 12:18:05',0),
(35,40,5,NULL,'Container',6,0,NULL,NULL,'2026-04-06 12:18:09',0),
(36,40,5,NULL,'Row-Col',8,1,NULL,NULL,'2026-04-06 12:18:30',0),
(37,40,4,NULL,'BUILDING',1,0,NULL,NULL,'2026-04-09 04:16:20',0),
(38,40,4,NULL,'FLOOR',2,0,NULL,NULL,'2026-04-09 04:16:26',0),
(39,40,4,NULL,'RACK',3,0,NULL,NULL,'2026-04-09 04:16:33',0),
(40,40,4,NULL,'BOX',4,0,NULL,NULL,'2026-04-09 04:16:38',0),
(41,40,7,NULL,'building',1,0,NULL,NULL,'2026-04-10 10:10:02',0),
(42,40,7,NULL,'floor',2,0,NULL,NULL,'2026-04-10 10:10:10',0),
(43,40,7,NULL,'rack',3,0,NULL,NULL,'2026-04-10 10:10:43',0),
(44,40,7,NULL,'shelf',4,0,NULL,NULL,'2026-04-10 10:10:52',0),
(45,40,7,NULL,'box',5,0,NULL,NULL,'2026-04-10 10:11:06',0),
(47,40,7,NULL,'container',6,1,NULL,NULL,'2026-04-10 10:12:23',0),
(55,40,4,NULL,'Row & Column',5,0,NULL,NULL,'2026-04-27 03:44:59',1),
(56,40,8,NULL,'Build',2,0,NULL,NULL,'2026-04-27 03:46:33',1),
(57,40,8,NULL,'row & column',1,0,NULL,NULL,'2026-04-27 03:46:43',1),
(59,40,9,NULL,'building',1,0,NULL,NULL,'2026-04-27 03:50:50',0),
(60,40,9,NULL,'floor',2,0,NULL,NULL,'2026-04-27 03:50:57',0),
(61,40,9,NULL,'Rack',3,0,NULL,NULL,'2026-04-27 03:51:03',0),
(62,40,9,NULL,'box',4,0,NULL,NULL,'2026-04-27 03:51:09',0),
(63,40,9,NULL,'row & column',5,0,NULL,NULL,'2026-04-27 03:51:19',1),
(64,40,10,NULL,'Building',1,0,NULL,NULL,'2026-05-02 09:18:14',0),
(65,40,10,NULL,'floor',2,0,NULL,NULL,'2026-05-02 09:18:23',0),
(66,40,10,NULL,'rack',3,0,NULL,NULL,'2026-05-02 09:18:54',0),
(67,40,10,NULL,'shelf',4,0,NULL,NULL,'2026-05-02 09:19:06',0),
(68,40,10,NULL,'box',5,1,NULL,NULL,'2026-05-02 09:19:38',0);
/*!40000 ALTER TABLE `storage_structure_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storage_types`
--

DROP TABLE IF EXISTS `storage_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `storage_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storage_types`
--

LOCK TABLES `storage_types` WRITE;
/*!40000 ALTER TABLE `storage_types` DISABLE KEYS */;
INSERT INTO `storage_types` VALUES
(1,1,'WareHouse','2026-04-01 11:16:29',0),
(2,1,'NN','2026-04-02 05:04:28',0),
(3,35,'ss','2026-04-02 08:45:38',0),
(4,40,'D11','2026-04-06 08:33:23',0),
(5,40,'s2','2026-04-06 09:39:04',0),
(6,41,'SS','2026-04-09 01:53:43',0),
(7,40,'CP','2026-04-10 10:06:23',0),
(8,40,'W1','2026-04-27 03:46:06',1),
(9,40,'Q1','2026-04-27 03:50:35',0),
(10,40,'circuitpoint','2026-05-02 09:16:30',0);
/*!40000 ALTER TABLE `storage_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_addresses`
--

DROP TABLE IF EXISTS `supplier_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) DEFAULT NULL,
  `address_type` enum('permanent','current') DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `supplier_addresses_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_addresses`
--

LOCK TABLES `supplier_addresses` WRITE;
/*!40000 ALTER TABLE `supplier_addresses` DISABLE KEYS */;
INSERT INTO `supplier_addresses` VALUES
(1,2,'permanent','SGSE','DSFGSD','GSDFGS','Tamil Nadu','DFGSDGWE'),
(2,2,'current','SGSE','DSFGSD','GSDFGS','Tamil Nadu','DFGSDGWE'),
(5,4,'permanent','WW','WW','WW','Tamil Nadu','WW'),
(6,4,'current','WW','WW','WW','Tamil Nadu','WW');
/*!40000 ALTER TABLE `supplier_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_branches`
--

DROP TABLE IF EXISTS `supplier_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) DEFAULT NULL,
  `branch_name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `supplier_branches_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_branches`
--

LOCK TABLES `supplier_branches` WRITE;
/*!40000 ALTER TABLE `supplier_branches` DISABLE KEYS */;
INSERT INTO `supplier_branches` VALUES
(1,2,'SRFWAE','SDGFFSRG'),
(3,4,'WWW','WW');
/*!40000 ALTER TABLE `supplier_branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_product_mapping`
--

DROP TABLE IF EXISTS `supplier_product_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_product_mapping` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `cost_price` decimal(12,2) NOT NULL,
  `stock_status` enum('in_stock','out_of_stock','discontinued','order_based') NOT NULL DEFAULT 'in_stock',
  `pay_advance` decimal(12,2) DEFAULT NULL,
  `lead_days` int(11) DEFAULT NULL,
  `lead_days_type` enum('day','week','month','year','others') DEFAULT 'day',
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_supplier_product` (`supplier_id`,`product_id`,`variant_id`),
  KEY `idx_supplier` (`supplier_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_status` (`stock_status`),
  KEY `idx_deleted` (`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_product_mapping`
--

LOCK TABLES `supplier_product_mapping` WRITE;
/*!40000 ALTER TABLE `supplier_product_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_product_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_request_items`
--

DROP TABLE IF EXISTS `supplier_request_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_request_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `request_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `expected_price` decimal(12,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `stock_id` bigint(20) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_sri_request` (`request_id`,`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_request_items`
--

LOCK TABLES `supplier_request_items` WRITE;
/*!40000 ALTER TABLE `supplier_request_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_request_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_requests`
--

DROP TABLE IF EXISTS `supplier_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_requests` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint(20) NOT NULL,
  `business_id` bigint(20) NOT NULL,
  `request_code` varchar(50) DEFAULT NULL,
  `order_datetime` datetime DEFAULT current_timestamp(),
  `delivery_datetime` datetime NOT NULL,
  `status` enum('pending','accepted','partial_accepted','shipped','delivered','cancelled') DEFAULT 'pending',
  `partial_reason` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_by` bigint(20) DEFAULT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `request_code` (`request_code`),
  KEY `idx_sr_business` (`business_id`,`is_deleted`),
  KEY `idx_sr_supplier` (`supplier_id`,`is_deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_requests`
--

LOCK TABLES `supplier_requests` WRITE;
/*!40000 ALTER TABLE `supplier_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `with_gst` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES
(1,1,'ABC Traders','9876543210','abc@gmail.com',10,100,'2026-03-11 08:27:01',NULL,NULL,NULL,0),
(2,35,'55ERGDSF','SDGFFSRG',NULL,1,NULL,'2026-04-03 06:15:42','SDFDS','HRTHW4','12345',1),
(4,35,'CD','WW',NULL,1,NULL,'2026-04-03 06:27:03','WW','WW','',0);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `user_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `users_chk_1` CHECK (json_valid(`add_json`))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES
(1,'Hari','srihari8489@gmail.com','000000','Main account user','{\"plan\": \"premium\", \"role\": \"owner\"}',1,1,'active','2026-03-10 10:47:57','2026-03-10 10:53:04',NULL,NULL,NULL),
(2,'Ravi','Kavin@mail.com','000000','Secondary account user','{\"plan\": \"basic\", \"role\": \"owner\"}',1,1,'active','2026-03-10 10:47:57','2026-03-10 10:47:57',NULL,NULL,NULL),
(3,'narendra','yudeshprasath@gmail.com','external_auth',NULL,NULL,1,1,'active','2026-04-02 06:35:26','2026-05-08 06:27:50','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ5dWRlc2hwcmFzYXRoQGdtYWlsLmNvbSIsInVzZXJfbWFpbl9pZCI6IjI3NjE4NDY0MzUiLCJ1c2VyX25hbWUiOiJuYXJlbmRyYSIsInVzZXJfdHlwZSI6Imd1ZXN0IiwiaWF0IjoxNzc4MjIxNjcwLCJleHAiOjE3NzgzMDgwNzB9.h23X7UqubD4Wzc54fkXp9ntiuvuRVk6KMP-NZdkoOu8','2026-05-09 06:27:50','2761846435'),
(4,'krishna','kavinbk035@gmail.com','external_auth',NULL,NULL,1,1,'active','2026-04-06 02:11:14','2026-04-09 01:53:30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImVtYWlsIjoia2F2aW5iazAzNUBnbWFpbC5jb20iLCJ1c2VyX21haW5faWQiOiIxMzc3NzAyNDkwIiwidXNlcl9uYW1lIjoia3Jpc2huYSIsInVzZXJfdHlwZSI6Imd1ZXN0IiwiaWF0IjoxNzc1Njk5NjEwLCJleHAiOjE3NzU3ODYwMTB9.cm4yrGvGYiDBLneXJJz6pgtWcevahXR_iXoN1AVQWKc','2026-04-10 01:53:30','1377702490'),
(5,'Selvaraj','thecircuitpoint@gmail.com','external_auth',NULL,NULL,1,1,'active','2026-04-06 11:12:43','2026-04-06 11:12:43','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImVtYWlsIjoidGhlY2lyY3VpdHBvaW50QGdtYWlsLmNvbSIsInVzZXJfbWFpbl9pZCI6IjMzODY5NTAxMDciLCJ1c2VyX25hbWUiOiJTZWx2YXJhaiIsInVzZXJfdHlwZSI6Imd1ZXN0IiwiaWF0IjoxNzc1NDczOTYzLCJleHAiOjE3NzU1NjAzNjN9.M_CXhwWDWLkoQc3sl1JJ4ehQyFlYFHbV-y3k2gAMh3g','2026-04-07 11:12:43','3386950107'),
(6,'lohit','lovelylohit003@gmail.com','external_auth',NULL,NULL,1,1,'active','2026-05-06 07:04:59','2026-05-06 07:17:17','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImVtYWlsIjoibG92ZWx5bG9oaXQwMDNAZ21haWwuY29tIiwidXNlcl9tYWluX2lkIjoiNTU1NzkyMTEwNSIsInVzZXJfbmFtZSI6ImxvaGl0IiwidXNlcl90eXBlIjoiZ3Vlc3QiLCJpYXQiOjE3NzgwNTE4MzcsImV4cCI6MTc3ODEzODIzN30.-wqp9JfS8MLh5IWkVmg21y9Y6rVVEyApEudT0ULCpD0','2026-05-07 07:17:17','5557921105'),
(7,'Sri Vagroups','kalaivanissd@gmail.com','external_auth',NULL,NULL,1,1,'active','2026-05-06 07:41:06','2026-05-06 07:41:36','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsImVtYWlsIjoia2FsYWl2YW5pc3NkQGdtYWlsLmNvbSIsInVzZXJfbWFpbl9pZCI6IjYyNzE2OTI3MTIiLCJ1c2VyX25hbWUiOiJTcmkgVmFncm91cHMiLCJ1c2VyX3R5cGUiOiJndWVzdCIsImlhdCI6MTc3ODA1MzI5NiwiZXhwIjoxNzc4MTM5Njk2fQ.Ag-raaH7-bdE4OGg9qgNUDSLPsIsRs2huh79ha7wXZI','2026-05-07 07:41:36','6271692712');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-08  2:31:12
