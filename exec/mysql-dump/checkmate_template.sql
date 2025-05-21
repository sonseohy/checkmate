-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: checkmate.ai.kr    Database: checkmate
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `name` varchar(30) NOT NULL,
  `version` int NOT NULL,
  `category_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKdu7kov6hvypn1j8eplrcdhohd` (`category_id`),
  CONSTRAINT `FKdu7kov6hvypn1j8eplrcdhohd` FOREIGN KEY (`category_id`) REFERENCES `contract_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
INSERT INTO `template` VALUES (76,'2025-05-21 04:54:11.368902','내용증명(보증금 반환 청구)',1,76),(121,'2025-05-15 12:13:34.356335','부동산 매매계약서(건물, 토지 직거래용)',1,121),(122,'2025-05-09 15:59:43.000000','부동산 임대차계약서(직거래)',1,122),(123,'2025-05-13 10:08:36.333817','부동산 가계약서',1,123),(129,'2025-05-14 09:23:56.000000','알바계약서(편의점용, 5인 이상)',1,129),(131,'2025-05-21 14:02:11.000000','알바계약서(카페용, 5인 이상)',1,131),(135,'2025-05-15 20:50:30.002048','근로계약서(주40시간 근무)',1,135),(136,'2025-05-19 00:59:19.334946','근로계약서(주15시간이상, 5인이상)',1,136),(137,'2025-05-20 09:09:09.940664','근로계약서(주15시간이상, 5인미만)',1,137),(138,'2025-05-20 13:24:36.354167','근로계약서(주15시간미만, 5인이상)',1,138),(139,'2025-05-21 04:02:28.228663','근로계약서(주15시간미만, 5인미만)',1,139),(149,'2025-05-19 17:17:48.888199','용역계약서(일반)',1,149),(151,'2025-05-16 16:33:36.014668','가사도우미계약서',1,151),(153,'2025-05-21 12:13:03.598302','사직서',1,153);
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-21 14:26:23
