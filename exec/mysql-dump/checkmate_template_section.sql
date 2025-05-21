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
-- Table structure for table `template_section`
--

DROP TABLE IF EXISTS `template_section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template_section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `is_required_in_template` bit(1) NOT NULL,
  `template_section_no` int NOT NULL,
  `section_id` int NOT NULL,
  `template_id` int NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfmyqwxwejlqddlku7h37ku7qn` (`section_id`),
  KEY `FK52dqdvh67c2nacmniu1mdpp9k` (`template_id`),
  CONSTRAINT `FK52dqdvh67c2nacmniu1mdpp9k` FOREIGN KEY (`template_id`) REFERENCES `template` (`id`),
  CONSTRAINT `FKfmyqwxwejlqddlku7h37ku7qn` FOREIGN KEY (`section_id`) REFERENCES `section` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template_section`
--

LOCK TABLES `template_section` WRITE;
/*!40000 ALTER TABLE `template_section` DISABLE KEYS */;
INSERT INTO `template_section` VALUES (16,_binary '',1,1,122,NULL),(17,_binary '',2,2,122,NULL),(18,_binary '',3,3,122,NULL),(19,_binary '\0',4,4,122,NULL),(20,_binary '\0',5,5,122,NULL),(21,_binary '',6,6,122,NULL),(22,_binary '',7,7,122,NULL),(23,_binary '',8,8,122,NULL),(39,_binary '',1,1,123,'임대인 및 임차인'),(40,_binary '',2,9,123,NULL),(41,_binary '',3,7,123,'임대인 상세정보'),(42,_binary '',4,8,123,'임차인 상세정보'),(43,_binary '',1,10,129,'계약 당사자 정보'),(44,_binary '',2,11,129,'시급 및 근무요일 정보'),(45,_binary '',3,12,129,'계약기간 정보'),(46,_binary '',4,13,129,'근로조건 및 복리후생'),(47,_binary '',5,14,129,'고용주 상세 정보'),(48,_binary '',6,15,129,'근로자 상세 정보'),(49,_binary '',1,1,121,'매도인 및 매수인'),(50,_binary '',2,16,121,NULL),(51,_binary '\0',3,17,121,NULL),(52,_binary '\0',4,18,121,NULL),(53,_binary '',5,19,121,NULL),(54,_binary '',6,7,121,'매도인 상세정보'),(55,_binary '',7,8,121,'매수인 상세정보'),(56,_binary '',1,10,135,NULL),(57,_binary '',2,20,135,NULL),(58,_binary '',3,21,135,NULL),(59,_binary '',4,22,135,NULL),(60,_binary '',5,23,135,NULL),(61,_binary '\0',6,24,135,NULL),(62,_binary '',7,25,135,NULL),(63,_binary '',8,26,135,NULL),(64,_binary '',1,27,151,NULL),(65,_binary '',2,28,151,NULL),(66,_binary '',3,29,151,NULL),(67,_binary '',4,30,151,NULL),(68,_binary '',5,31,151,NULL),(69,_binary '',6,32,151,NULL),(70,_binary '',7,33,151,NULL),(71,_binary '\0',8,34,151,NULL),(72,_binary '\0',9,35,151,NULL),(73,_binary '',10,36,151,NULL),(74,_binary '',11,37,151,NULL),(75,_binary '',1,10,136,NULL),(76,_binary '',2,38,136,NULL),(77,_binary '',3,39,136,NULL),(78,_binary '',4,40,136,NULL),(79,_binary '',5,41,136,NULL),(80,_binary '',6,42,136,NULL),(81,_binary '\0',7,43,136,NULL),(82,_binary '',8,25,136,NULL),(83,_binary '',9,26,136,NULL),(84,_binary '',1,44,149,NULL),(85,_binary '',2,45,149,NULL),(86,_binary '',3,46,149,NULL),(87,_binary '',4,47,149,NULL),(88,_binary '',5,48,149,NULL),(89,_binary '',6,49,149,NULL),(90,_binary '',7,50,149,NULL),(91,_binary '',8,51,149,NULL),(92,_binary '',1,10,137,NULL),(93,_binary '',2,38,137,NULL),(94,_binary '',3,39,137,NULL),(95,_binary '',4,40,137,NULL),(96,_binary '',5,41,137,NULL),(97,_binary '\0',6,43,137,NULL),(98,_binary '',7,25,137,NULL),(99,_binary '',8,26,137,NULL),(100,_binary '',1,10,138,NULL),(101,_binary '',2,38,138,NULL),(102,_binary '',3,52,138,NULL),(103,_binary '',4,40,138,NULL),(104,_binary '',5,41,138,NULL),(105,_binary '\0',6,53,138,NULL),(106,_binary '',7,25,138,NULL),(107,_binary '',8,26,138,NULL),(108,_binary '',1,10,139,NULL),(109,_binary '',2,38,139,NULL),(110,_binary '',3,39,139,NULL),(111,_binary '',4,40,139,NULL),(112,_binary '',5,41,139,NULL),(113,_binary '\0',6,43,139,NULL),(114,_binary '',7,25,139,NULL),(115,_binary '',8,26,139,NULL),(116,_binary '',1,58,76,''),(117,_binary '',2,54,76,NULL),(118,_binary '',3,55,76,NULL),(119,_binary '',4,56,76,NULL),(120,_binary '\0',5,57,76,NULL),(121,_binary '',6,8,76,NULL),(122,_binary '',7,7,76,NULL),(123,_binary '',1,59,153,NULL),(124,_binary '',2,60,153,NULL),(125,_binary '',3,61,153,NULL),(126,_binary '',1,10,131,'계약 당사자 정보'),(127,_binary '',2,11,131,'시급 및 근무요일 정보'),(128,_binary '',3,12,131,'계약기간 정보'),(129,_binary '',4,13,131,'근로조건 및 복리후생'),(130,_binary '',5,14,131,'고용주 상세 정보'),(131,_binary '',6,15,131,'근로자 상세 정보');
/*!40000 ALTER TABLE `template_section` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-21 14:26:26
