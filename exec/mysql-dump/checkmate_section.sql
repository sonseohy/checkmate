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
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `is_required` bit(1) NOT NULL,
  `name` varchar(30) NOT NULL,
  `sequence_no` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
INSERT INTO `section` VALUES (1,'계약 당사자 정보',_binary '','집주인 및 세입자',1),(2,'계약 종류와 기간',_binary '','임대차계약의 내용',2),(3,'보증금 및 계좌 정보',_binary '','보증금 지급',3),(4,'주택 수리 정보',_binary '\0','입주 전 수리',4),(5,'추가 계약 조건',_binary '\0','특약사항',5),(6,'부동산 위치 및 면적',_binary '','부동산의 표시',6),(7,'임대인 상세 정보',_binary '','집주인 상세정보',7),(8,'임차인 상세 정보',_binary '','세입자 상세정보',8),(9,'가계약 상세 정보',_binary '','가계약 내용',2),(10,'계약 당사자 정보',_binary '','사용자 및 근로자',1),(11,'시급 및 근무요일 정보',_binary '','시급 및 근무요일',2),(12,'계약기간 정보',_binary '','근로계약의 내용',3),(13,'근로조건 및 복리후생',_binary '','최종 확인사항',4),(14,'고용주 상세 정보',_binary '','사용자(갑) 상세정보',5),(15,'근로자 이름 및 전화번호',_binary '','근로자(을) 상세정보',6),(16,'매매대금과 기한 정보',_binary '','매매계약의 내용',2),(17,'부동산 채무 정보',_binary '\0','채무의 인수',3),(18,'추가 합의사항',_binary '\0','특약사항',4),(19,'부동산 위치 및 지목과 용도',_binary '','부동산의 표시',5),(20,'고용형태 및 사업장 규모',_binary '','근로계약의 형태',2),(21,'근무일 및 시간 정보',_binary '','근무일 및 근무시간',3),(22,'임금 정보와 지급 시기',_binary '','임금',4),(23,'계약 시작일 및 업무내용',_binary '','근무의 내용',5),(24,'수습제도 및 시용기간 조건',_binary '\0','수습제도 및 채용평가기간의 적용',6),(25,'사용자(회사) 상세정보',_binary '','사용자 상세 정보',7),(26,'근로자 상세정보',_binary '','근로자 상세 정보',8),(27,'계약당사자 정보',_binary '','계약당사자',1),(28,'가사도우미 서비스 기간',_binary '','서비스 기간',2),(29,'근무 장소 및 가사도우미 입주 유무',_binary '','서비스 장소 및 입주 유무',3),(30,'가사서비스 제공 내용',_binary '','가사서비스 제공 내용',4),(31,'가사도우미 근무시간 및 휴식 시간',_binary '','서비스 제공일 및 서비스 제공 시간',5),(32,'가사 도우미 임금 및 임금 방식',_binary '','서비스 요금',6),(33,'신원보증자료 제출',_binary '','신원보증자료 제출',7),(34,'추가 합의사항',_binary '\0','추가 합의사항',8),(35,'분쟁 발생시 지정법원',_binary '\0','관할법원',9),(36,'가사서비스 이용고객 (갑) 상세정보',_binary '','가사서비스 이용고객 (갑) 상세정보',10),(37,'기정관리사 (을) 상세정보',_binary '','가정관리사 (을) 상세정보',11),(38,'일하는 날 및 급여 지급 주기',_binary '','작성 전 필수 질문',2),(39,'근무일 및 시간 정보',_binary '','근무일 및 근로시간',3),(40,'지급 시기와 지급계좌 정보',_binary '','임금',4),(41,'계약기간 및 업무내용',_binary '','근로계약의 내용',5),(42,'휴가 규정 정보',_binary '','휴가',6),(43,'보험 가입 적용 여부 확인',_binary '\0','산재/고용 외 연금/건강 보험의 가입',7),(44,'업무 의뢰 및 수행하는 사람',_binary '','계약당사자',1),(45,'의뢰하는 업무의 내용',_binary '','의뢰하는 업무의 내용',2),(46,'의뢰하는 업무의 계약기간',_binary '','의뢰하는 업무의 계약기간',3),(47,'용역 대금, 성공보수 및 추가 비용의 지급',_binary '','용역 대금, 성공보수 및 추가 비용의 지급',4),(48,'업무의뢰인(갑)의 권리와 의무',_binary '','업무의뢰인(갑)의 권리와 의무',5),(49,'업무수행인(을)의 의무',_binary '','업무수행인(을)의 의무',6),(50,'업무를 의뢰하는 사람(갑) 상세정보',_binary '','업무를 의뢰하는 사람(갑) 상세정보',7),(51,'업무를 맡은 사람(을) 상세정보',_binary '','업무를 맡은 사람(을) 상세정보',8),(52,'근무일 및 시간 정보(유급휴일x)',_binary '','근무일 및 근로시간',3),(53,'근로기간에 따른 보험적용 여부',_binary '\0','고용보험의 적용',6),(54,'임대차 계약내용 정보',_binary '','임대차계약 내용',2),(55,'보증금 반환 이유 선택',_binary '','보증금의 반환을 요구하는 이유',3),(56,'보증금 지급 기한 및 정보',_binary '','집주인의 이행 사항',4),(57,'추가 요구 정보',_binary '\0','추가사항',5),(58,'계약 당사자 정보(내용증명)',_binary '','세입자 및 집주인',1),(59,'사직서 사업자 정보',_binary '','사업자 정보',1),(60,'사직서 퇴사자 정보',_binary '','퇴사자 정보',2),(61,'사직서 사직 사유내용',_binary '','사직의 내용',3);
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-21 14:26:24
