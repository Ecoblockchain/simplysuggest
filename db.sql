-- MySQL dump 10.13  Distrib 5.6.31, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: simplysuggest
-- ------------------------------------------------------
-- Server version	5.6.31-0ubuntu0.15.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `communities`
--

DROP TABLE IF EXISTS `communities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `communities` (
  `com_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `password` varchar(200) NOT NULL,
  `email` varchar(200) NOT NULL,
  PRIMARY KEY (`com_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `communities`
--

LOCK TABLES `communities` WRITE;
/*!40000 ALTER TABLE `communities` DISABLE KEYS */;
INSERT INTO `communities` VALUES (2,'Sukhi\'s Board','7cec6e','803d3bf9b38bc4320cdb493df683c82858ccc1f829ad4de6b698a4b4a5f28d1a81f1fbce1e7042aa39465f81ae7e635c877d9619cb9d996bfb3148e3b18b9ac7','sukeshmasih@hotmail.co.uk'),(3,'Photo','dfd0fb','02f23b209a5525038c52970b60cea99c7f09bb7a29afeca045863b5be718b1377eb46919ef495a8df9af2efd625761644d418969e82957890b79d43b5f6d23c8','wylie.donovan6@gmail.com'),(5,'test1','f9c47e','ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff','11wyliec@thecherwellschool.org'),(6,'Caspar\'s Board','60bec0','fe5d4589e7227ac5ef1ae88e56726dcec5e931d10fa116bd4944c53a9e560d6d4397a3841c61934b5b6c8aec1347af73b2e0afefbff5d106aa41a315af8530b4','casparwylie@gmail.com'),(7,'SimplySuggest','385693','c959a1665998038c6be4ab40f1c3121614062d3d6e9cd23f44d45e6f798d038f2d24f734c2e410a0440efc5a52e4a531c66ac4a9c7a99f07488ae2f15dc2e8bf','hello@simplysuggest.it'),(8,'The cherwell school','8eb904','ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff','testemil@test.com');
/*!40000 ALTER TABLE `communities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `com_code` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `liked` int(11) NOT NULL,
  PRIMARY KEY (`note_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (5,'31aa1f','Anonymous','this is a erskine suggetion  ...drunk.',0),(6,'7cec6e','Anonymous','this website is good\n',1),(7,'7cec6e','Anonymous','i like this websiteeeeeeeeeeeeeeeeee\n',1),(8,'7cec6e','Anonymous','this website is still in progress',1),(9,'7cec6e','Anonymous','CRazzzzzzzzzzassssssassyyyyyyyyyyYYYYYYYYYYYYyyy',1),(10,'dfd0fb','Anonymous','Could tutorials be longer?',0),(11,'60bec0','11wyliec@thecherwellschool.org','this is a testthis is a testthis is a test',0),(12,'60bec0','Anonymous','one more testone more testone more testone more test',0),(13,'7cec6e','Anonymous','hjjkjkjjknj nknk;l',0),(14,'8eb904','Anonymous','i think that you should make school not happen...at all.',0);
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `static_content`
--

DROP TABLE IF EXISTS `static_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `static_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `static_content`
--

LOCK TABLES `static_content` WRITE;
/*!40000 ALTER TABLE `static_content` DISABLE KEYS */;
INSERT INTO `static_content` VALUES (1,'help','<b>Starting a Board</b><br>\nA board is a collection of suggestions. In other words it is like a virtual suggestion box. If you would like to start a new board for your community, idea, event, etc simply go to the \"Start New Board\" tab and enter the relevant details. Afterwards, you will be given a code. This is the code used to identify the board when someone wants to submit a suggestion, so make sure to share it with your desired suggesters.<br><br>\n\n<b>Submitting a Suggestion</b><br>\nTo submit a suggestion, go to the home page and enter the board code (to identify which board to send it to), your email (this is in order to get a response via email, however you can leave it blank if you would prefer to be anonymous), and finally your suggestion! \n'),(2,'about','<b>SimplySuggest</b> is a new simple way to receive suggestions, and send suggestions effortlessly. It is a virtual suggestion box with none of the physical efforts, which results in much more activity! It can be used for anything which has room for improvement - which is everything. From a community, a product or event to just a simple idea, you can make a board for anything. <br><br>\n\n\nFor any questions please contact <i><b>hello@simplysuggest.it</b></i>, and for any suggestions, please submit them to our board at <b>385693<b>!<br><br> By <b>Caspar Wylie</b> & <b>Sukhi Masih</b><br><br>');
/*!40000 ALTER TABLE `static_content` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-08-25 15:30:17
