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
-- Table structure for table `contract_category`
--

DROP TABLE IF EXISTS `contract_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `level` enum('MAJOR','MEDIUM','SUB') DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK563cs0t0y0sew2296xf0c03sm` (`parent_id`),
  CONSTRAINT `FK563cs0t0y0sew2296xf0c03sm` FOREIGN KEY (`parent_id`) REFERENCES `contract_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_category`
--

LOCK TABLES `contract_category` WRITE;
/*!40000 ALTER TABLE `contract_category` DISABLE KEYS */;
INSERT INTO `contract_category` VALUES (1,'MAJOR','계약서',NULL),(2,'MAJOR','내용증명',NULL),(3,'MAJOR','지급명령',NULL),(4,'MAJOR','기타',NULL),(5,'MEDIUM','손해배상, 계약이행',2),(6,'MEDIUM','통지',2),(7,'MEDIUM','임대차',2),(8,'MEDIUM','용역, 매매',2),(9,'MEDIUM','손해배상, 약정금',3),(10,'MEDIUM','임대차',3),(11,'MEDIUM','근로, 용역, 매매',3),(12,'MEDIUM','매매계약',1),(13,'MEDIUM','임대차계약',1),(14,'MEDIUM','임직원계약',1),(15,'MEDIUM','용역계약',1),(16,'MEDIUM','합의서, 협의서',4),(17,'MEDIUM','기타',4),(18,'MEDIUM','통지서, 확인서, 신청서',4),(19,'MEDIUM','규칙, 방침',4),(20,'MEDIUM','동의서, 승낙서, 보고서',4),(21,'MEDIUM','약관',4),(43,'SUB','내용증명(임금청구)',5),(44,'SUB','내용증명(부당이득 반환)',5),(45,'SUB','내용증명(물건, 권리침해 손해배상 등)',5),(46,'SUB','내용증명(권리청구)',5),(47,'SUB','내용증명(계약해지 통지)',5),(48,'SUB','내용증명(계약해지 통지 답변서)',5),(49,'SUB','내용증명(계약이행 청구)',5),(50,'SUB','내용증명(차용, 임대차 등 계약 관련 금전 채무 부존재 통보)',6),(51,'SUB','내용증명(질권)',6),(52,'SUB','내용증명(양수인의 채권양도통지)',6),(53,'SUB','내용증명(법원 판결, 결정 등 불이행에 대한 조치 통보)',6),(54,'SUB','내용증명(하자보수청구-임차인용)',7),(55,'SUB','내용증명(하자보수청구-임차인용)',10),(56,'SUB','내용증명(층간소음)',7),(57,'SUB','내용증명(층간소음)',10),(58,'SUB','내용증명(임차권등기명령신청)',7),(59,'SUB','내용증명(임차권등기명령신청)',10),(60,'SUB','내용증명(임대차 계약연장 불허통지)',7),(61,'SUB','내용증명(임대차 계약연장 불허통지)',10),(62,'SUB','내용증명(임대차 계약갱신 청구)',7),(63,'SUB','내용증명(임대차 계약갱신 청구)',10),(64,'SUB','내용증명(임대료 증액청구)',7),(65,'SUB','내용증명(임대료 증액청구)',10),(66,'SUB','내용증명(임대료 연체로 인한 계약 해지 및 명도 청구)',7),(67,'SUB','내용증명(임대료 연체로 인한 계약 해지 및 명도 청구)',10),(68,'SUB','내용증명(월세 청구)',7),(69,'SUB','내용증명(월세 청구)',10),(70,'SUB','내용증명(상가임대차 계약연장 불허통지)',7),(71,'SUB','내용증명(상가임대차 계약연장 불허통지)',10),(72,'SUB','내용증명(부동산 계약해지-임대인용)',7),(73,'SUB','내용증명(부동산 계약해지-임대인용)',10),(74,'SUB','내용증명(부동산 계약해지-세입자용)',7),(75,'SUB','내용증명(부동산 계약해지-세입자용)',10),(76,'SUB','내용증명(보증금 반환 청구)',7),(77,'SUB','내용증명(보증금 반환 청구)',10),(78,'SUB','내용증명(권리금 손해배상)',7),(79,'SUB','내용증명(권리금 손해배상)',10),(80,'SUB','내용증명(매매대금 청구용)',8),(81,'SUB','내용증명(매매대금 청구 답변서)',8),(82,'SUB','내용증명(매매대금 반환 청구)',8),(106,'SUB','지급명령 신청서(부당이득 반환)',9),(107,'SUB','지금명령 신청서(임대차 3법 위반)',9),(108,'SUB','지금명령 신청서(임대료, 손해배상 청구)',9),(109,'SUB','지금명령 신청서(연체임대료 청구용)',9),(110,'SUB','지금명령 신청서(부동산 권리침해, 손해배상)',9),(111,'SUB','지금명령 신청서(보증금 반환 청구)',9),(112,'SUB','지금명령 신청서(매매대금 청구)',11),(113,'SUB','지금명령 신청서(임금청구)',11),(114,'SUB','지금명령 신청서(용역대금 청구)',11),(115,'SUB','지금명령 신청서(용역대금 반환 청구)',11),(116,'SUB','지금명령 신청서(매매대금 청구)',11),(117,'SUB','지금명령 신청서(매매대금 반환 청구)',11),(121,'SUB','부동산 매매계약서(건물, 토지 직거래용)',12),(122,'SUB','부동산 임대차 계약서 (직거래용)',13),(123,'SUB','부동산 가계약서',13),(124,'SUB','퇴사자서약서(일반용)',14),(125,'SUB','퇴사자서약서(권고사직용)',14),(126,'SUB','입사자서약서',14),(127,'SUB','임원서약서',14),(128,'SUB','임원 보수 규정',14),(129,'SUB','알바계약서(편의점용, 5인 이상)',14),(130,'SUB','알바계약서(편의점용, 5인 미만)',14),(131,'SUB','알바계약서(카페용, 5인 이상)',14),(132,'SUB','알바계약서(카페용, 5인 미만)',14),(133,'SUB','알바계약서(일반용, 5인 이상)',14),(134,'SUB','알바계약서(일반용, 5인 미만)',14),(135,'SUB','근로계약서(주40시간 근무)',14),(136,'SUB','근로계약서(주15시간이상, 5인이상)',14),(137,'SUB','근로계약서(주15시간이상, 5인미만)',14),(138,'SUB','근로계약서(주15시간미만, 5인이상)',14),(139,'SUB','근로계약서(주15시간미만, 5인미만)',14),(140,'SUB','근로계약서(일용근로자)',14),(141,'SUB','근로계약서(유연근무, 5인이상)',14),(142,'SUB','근로계약서(유연근무, 5인미만)',14),(143,'SUB','근로계약서(연봉갱신용, 5인이상)',14),(144,'SUB','근로계약서(연봉갱신용, 5인미만)',14),(145,'SUB','근로계약서(병원용, 5인이상)',14),(146,'SUB','근로계약서(병원용, 5인미만)',14),(147,'SUB','근로계약서(근로조건 변경용, 5인이상)',14),(148,'SUB','근로계약서(근로조건 변경용, 5인미만)',14),(149,'SUB','용역계약서(일반)',15),(150,'SUB','용역계약서(건설 및 기타 공사)',15),(151,'SUB','가사도우미계약서',15),(152,'SUB','업무인수인계서',17),(153,'SUB','사직서',17),(154,'SUB','권고사직서',17),(155,'SUB','개인정보취급자 보안서약서',17),(156,'SUB','연차 이월 합의서',16),(157,'SUB','계약 해제(해지) 합의서',16),(158,'SUB','해고예고통지서',18),(159,'SUB','근로계약서 교부 확인서',18),(160,'SUB','경력증명서',18),(161,'SUB','개인정보처리방침',19),(162,'SUB','민감정보처리 동의서',20),(163,'SUB','고유식별정보처리 동의서',20),(164,'SUB','개인정보처리동의서',20),(165,'SUB','개인정보수집동의서(온라인플랫폼)',20),(166,'SUB','위치기반 서비스 이용약관',21);
/*!40000 ALTER TABLE `contract_category` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-21 14:26:25
