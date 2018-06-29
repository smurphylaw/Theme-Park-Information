-- Data Definiton Queries for the Theme Parks
--
--
-- Table structure for table `land`
--

CREATE TABLE `land` (
  `landID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY(`landID`)
) ENGINE=InnoDB;

--
-- Table structure for table `character`
--

CREATE TABLE `character` (
  `characterID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `startTime` time DEFAULT '08:00:00',
  `endTime` time DEFAULT '21:00:00',
  PRIMARY KEY(`characterID`)
) ENGINE=InnoDB;

--
-- Table structure for table `attraction`
--

CREATE TABLE `attraction` (
  `attractionID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY(`attractionID`)
) ENGINE=InnoDB;

--
-- Table structure for table `dining`
--

CREATE TABLE `dining` (
  `diningID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `service` varchar(20) NOT NULL,
  `cuisine` varchar(50),
  PRIMARY KEY(`diningID`)
) ENGINE=InnoDB;

--
-- Table structure for table `park`
--

CREATE TABLE `park` (
  `parkID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(100),
  `country` varchar(50) NOT NULL,
  PRIMARY KEY (`parkID`)
) ENGINE=InnoDB;

--
-- Table structure for table `park_land`
--

CREATE TABLE `park_land` (
  `parkID` int(11) NOT NULL DEFAULT '0',
  `landID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY(`parkID`, `landID`)
) ENGINE=InnoDB;

--
-- Table structure for table `park_character`
--

CREATE TABLE `park_character` (
  `parkID` int(11) NOT NULL DEFAULT '0',
  `characterID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY(`parkID`, `characterID`)
) ENGINE=InnoDB;

--
-- Table structure for table `park_attraction`
--

CREATE TABLE `park_attraction` (
  `parkID` int(11) NOT NULL DEFAULT '0',
  `attractionID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY(`parkID`, `attractionID`)
) ENGINE=InnoDB;

--
-- Table structure for table `park_dining`
--

CREATE TABLE `park_dining` (
  `parkID` int(11) NOT NULL DEFAULT '0',
  `diningID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY(`parkID`, `diningID`)
) ENGINE=InnoDB;

--
-- Dumping data for table `land`
--

INSERT INTO `land` (`name`) VALUES
('Ghost Town'),
('Fantasyland'),
('Jurassic Park');

--
-- Dumping data for table `character`
--

INSERT INTO `character` (`name`, `startTime`, `endTime`) VALUES
('Goofy', NULL, NULL),
('Mickey Mouse', NULL, NULL),
('Shrek', '100000', '124500');

--
-- Dumping data for table `attraction`
--

INSERT INTO `attraction` (`name`, `type`) VALUES
('Pteranodon Flyers', 'Kids Ride'),
('GhostRider', 'Thrill Ride'),
('Big Thunder Mountain', 'Thrill Ride');


--
-- Dumping data for table `dining`
--

INSERT INTO `dining` (`name`, `service`, `cuisine`) VALUES
('Hogs Head', 'Table Service', 'American'),
('Be Our Guest', 'Table Service', 'French'),
('Boardwalk Barbeque', 'Quick Service', 'Tex-Mex');

--
-- Dumping data for table `park`
--

INSERT INTO `park` (`name`, `city`, `state`, `country`) VALUES
('Magic Kingdom', 'Orlando', 'Florida', 'USA'),
('Universal Studios', 'Orlando', 'Florida', 'USA'),
('Knotts Berry Farm', 'Anaheim', 'California', 'USA'),

--
-- Dumping data for table `park_land`
--

INSERT INTO `park_land` (`parkID`, `landID`) VALUES
(3, 1),
(1, 2),
(2, 3);

--
-- Dumping data for table `park_character`
--

INSERT INTO `park_character` (`parkID`, `characterID`) VALUES
(1, 1),
(1, 2),
(2, 3);

--
-- Dumping data for table `park_attraction`
--

INSERT INTO `park_attraction` (`parkID`, `attractionID`) VALUES
(2, 1),
(3, 2),
(1, 3);

--
-- Dumping data for table `park_dining`
--

INSERT INTO `park_dining` (`parkID`, `diningID`) VALUES
(2, 1),
(1, 2),
(3, 3);
