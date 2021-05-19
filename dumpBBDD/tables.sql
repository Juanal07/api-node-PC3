-- --------------------------------------------------------
-- Host:                         2.139.176.212
-- Versión del servidor:         10.4.17-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para prsoftlusion
CREATE DATABASE IF NOT EXISTS `prsoftlusion` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `prsoftlusion`;

-- Volcando estructura para tabla prsoftlusion.community
CREATE TABLE IF NOT EXISTS `community` (
  `idComunity` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `admin` int(11) NOT NULL,
  `description` varchar(255) NOT NULL DEFAULT '',
  `limitMembers` smallint(6) DEFAULT NULL,
  `idMunicipality` int(11) NOT NULL,
  PRIMARY KEY (`idComunity`),
  KEY `admin` (`admin`),
  KEY `idMunicipality` (`idMunicipality`),
  CONSTRAINT `FK_admin` FOREIGN KEY (`admin`) REFERENCES `user` (`idUser`),
  CONSTRAINT `FK_municipality_community` FOREIGN KEY (`idMunicipality`) REFERENCES `municipality` (`idMunicipality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.log
CREATE TABLE IF NOT EXISTS `log` (
  `idLog` int(11) NOT NULL AUTO_INCREMENT,
  `login` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `logout` datetime DEFAULT NULL,
  `idUser` int(11) NOT NULL,
  PRIMARY KEY (`idLog`),
  KEY `idUser` (`idUser`),
  CONSTRAINT `FK_log_user` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.medicalcenter
CREATE TABLE IF NOT EXISTS `medicalcenter` (
  `idMedicalCenter` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `type` varchar(150) NOT NULL,
  `address` varchar(255) NOT NULL,
  `idMunicipality` int(11) NOT NULL,
  PRIMARY KEY (`idMedicalCenter`),
  KEY `idMunicipality` (`idMunicipality`),
  CONSTRAINT `FK_municipality_medical` FOREIGN KEY (`idMunicipality`) REFERENCES `municipality` (`idMunicipality`)
) ENGINE=InnoDB AUTO_INCREMENT=14353 DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.message
CREATE TABLE IF NOT EXISTS `message` (
  `idMsg` int(11) NOT NULL AUTO_INCREMENT,
  `text` varchar(100) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `idUser` int(11) NOT NULL,
  `idCommunity` int(11) NOT NULL,
  PRIMARY KEY (`idMsg`),
  KEY `idCommunity` (`idCommunity`),
  KEY `idUser` (`idUser`) USING BTREE,
  CONSTRAINT `FK_community_mesage` FOREIGN KEY (`idCommunity`) REFERENCES `community` (`idComunity`),
  CONSTRAINT `FK_user_message` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.municipality
CREATE TABLE IF NOT EXISTS `municipality` (
  `idMunicipality` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `shield` varchar(255) NOT NULL,
  `region` varchar(100) DEFAULT NULL,
  `province` varchar(100) NOT NULL,
  `ccaa` varchar(100) NOT NULL,
  `population` int(11) DEFAULT NULL,
  `surface` float DEFAULT NULL,
  `altitude` float DEFAULT NULL,
  `density` float DEFAULT NULL,
  PRIMARY KEY (`idMunicipality`)
) ENGINE=InnoDB AUTO_INCREMENT=8890 DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.search
CREATE TABLE IF NOT EXISTS `search` (
  `idSearch` int(11) NOT NULL AUTO_INCREMENT,
  `idMunicipality` int(11) NOT NULL,
  `media` float DEFAULT NULL,
  `nRestaurants` int(11) DEFAULT NULL,
  `unpopulated` tinyint(4) DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `expDate` datetime DEFAULT NULL,
  `searcher` int(11) DEFAULT NULL,
  PRIMARY KEY (`idSearch`),
  KEY `idMunicipality` (`idMunicipality`),
  KEY `searcher` (`searcher`),
  CONSTRAINT `FK_municipality_search` FOREIGN KEY (`idMunicipality`) REFERENCES `municipality` (`idMunicipality`),
  CONSTRAINT `FK_user_search` FOREIGN KEY (`searcher`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.station
CREATE TABLE IF NOT EXISTS `station` (
  `code` int(11) NOT NULL AUTO_INCREMENT,
  `cercanias` tinyint(4) NOT NULL DEFAULT 0,
  `feve` tinyint(4) NOT NULL DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '',
  `address` varchar(255) NOT NULL DEFAULT '',
  `idMunicipality` int(11) NOT NULL,
  PRIMARY KEY (`code`),
  KEY `idMunicipality` (`idMunicipality`),
  CONSTRAINT `FK_municipality_station` FOREIGN KEY (`idMunicipality`) REFERENCES `municipality` (`idMunicipality`)
) ENGINE=InnoDB AUTO_INCREMENT=2340 DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.supermarket
CREATE TABLE IF NOT EXISTS `supermarket` (
  `idSupermarket` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL,
  `distance` float NOT NULL,
  `idSearch` int(11) NOT NULL,
  PRIMARY KEY (`idSupermarket`),
  KEY `idSearch` (`idSearch`) USING BTREE,
  CONSTRAINT `FK_supermarket_search` FOREIGN KEY (`idSearch`) REFERENCES `search` (`idSearch`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.user
CREATE TABLE IF NOT EXISTS `user` (
  `idUser` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `dateSignIn` datetime NOT NULL DEFAULT current_timestamp(),
  `idCommunity` int(11) DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  UNIQUE KEY `email_unique` (`email`),
  KEY `idCommunity` (`idCommunity`),
  CONSTRAINT `FK_idcom_user` FOREIGN KEY (`idCommunity`) REFERENCES `community` (`idComunity`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla prsoftlusion.user-community
CREATE TABLE IF NOT EXISTS `user-community` (
  `idHistorical` int(11) NOT NULL AUTO_INCREMENT,
  `dateInit` datetime NOT NULL,
  `dateFinal` datetime DEFAULT NULL,
  `idUser` int(11) NOT NULL,
  `idCommunity` int(11) NOT NULL,
  PRIMARY KEY (`idHistorical`) USING BTREE,
  KEY `idUser` (`idUser`),
  KEY `idCommunity` (`idCommunity`),
  CONSTRAINT `FK_idCommunity_historical` FOREIGN KEY (`idCommunity`) REFERENCES `community` (`idComunity`),
  CONSTRAINT `FK_idUser_historical` FOREIGN KEY (`idUser`) REFERENCES `user` (`idUser`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- La exportación de datos fue deseleccionada.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
