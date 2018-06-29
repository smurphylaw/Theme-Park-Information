-- Data Manipulation Queries for the Theme Parks

-- GET (SELECT)

-- Get list of all Parks
SELECT parkID, name, city, state, country FROM park
ORDER BY name

-- Get a single park information (for update form)
SELECT parkID, name, city, state, country FROM park
WHERE parkID = [parkID]

-- Get list of all Lands (land.html)
-- Same query to populate list of lands in park_land
SELECT landID, name FROM land
ORDER BY name

-- Get a single land information (for update form)
SELECT landID, name FROM land
WHERE landID = [landID]

-- Get list of all Characters
SELECT characterID, name, startTime, endTime FROM `character`
ORDER BY name

-- Get a single character information (for update form)
SELECT characterID, name, startTime, endTime FROM `character`
WHERE characterID = [characterID]

-- Get list of all Attractions
SELECT attractionID, name, type FROM attraction
ORDER BY name

-- Get a single attraction information (for update form)
SELECT attractionID, name, type FROM attraction
WHERE attractionID = [attractionID]

-- Get list of all Dining
SELECT diningID, name, service, cuisine FROM dining
ORDER BY name

-- Get a single dining service information (for update form)
SELECT diningID, name, service, cuisine FROM dining
WHERE diningID = [diningID]

-- Get all Park IDs and Names to populate the Park dropdown
SELECT parkID, name FROM park
ORDER BY name

-- Get list of all Characters to populate the Character MultiSelect
SELECT characterID, name FROM `character`
ORDER BY name

-- Get list of all Attraction to populate the Attraction MultiSelect
SELECT attractionID, name FROM attraction
ORDER BY name

-- Get list of all Dining to populate the Dining Dropdown
SELECT diningID, name FROM dining
ORDER BY name

-- Get list of specific theme lands within specific
-- Park location by park ID and land ID
SELECT l.name AS land_name, p.name AS park_name, pl.parkID AS pl_parkID, pl.landID AS pl_landID FROM park_land pl 
INNER JOIN land l ON l.landID = pl.landID 
INNER JOIN park p ON p.parkID = pl.parkID 
WHERE p.parkID = [pl_parkID]
	AND l.landID = [pl_landID]
ORDER BY land_name

-- Get list of all theme lands that is located 
-- in any Park
SELECT l.name AS land_name, p.name AS park_name, pl.parkID AS pl_parkID, pl.landID AS pl_landID FROM park_land pl 
INNER JOIN land l ON l.landID = pl.landID 
INNER JOIN park p ON p.parkID = pl.parkID 
ORDER BY land_name

-- Get list of all theme lands for a specific Park
SELECT pl.landID AS pl_landID, pl.parkID AS pl_parkID, l.name AS land_name FROM land l 
INNER JOIN park_land pl ON pl.landID = l.landID 
INNER JOIN park p ON p.parkID = pl.parkID 
WHERE p.parkID = [pl_parkID] 
ORDER BY l.name

-- Get list of all characters that is located 
-- in any Park
SELECT c.name AS c_name, p.name AS park_name, pc.parkID AS pc_parkID, pc.characterID AS pc_characterID FROM park_character pc 
INNER JOIN `character` AS c ON c.characterID = pc.characterID 
INNER JOIN park p ON p.parkID = pc.parkID 
ORDER BY c_name

-- Get list of all characters for a specific Park
SELECT pc.characterID AS pc_characterID, pc.parkID AS pc_parkID, c.name AS c_name FROM `character` c 
INNER JOIN park_character pc ON pc.characterID = c.characterID 
INNER JOIN park p ON p.parkID = pc.parkID 
WHERE p.parkID = [pc_parkID] 
ORDER BY c_name

-- Get all parks for a specific character (Filter)
SELECT c.name AS c_name, p.name AS park_name, pc.parkID AS pc_parkID, pc.characterID AS pc_characterID FROM park_character pc 
INNER JOIN `character` AS c ON c.characterID = pc.characterID 
INNER JOIN park p ON p.parkID = pc.parkID WHERE c.characterID = [pc.characterID] 
ORDER BY c_name

-- Get list of characters with selected as first
SELECT characterID, name FROM `character` 
ORDER BY characterID = [characterID] DESC, name

-- Get list of all attractions that is located 
-- in any Park
SELECT a.name AS a_name, p.name AS park_name, pa.parkID AS pa_parkID, pa.attractionID AS pa_attractionID FROM park_attraction pa 
INNER JOIN attraction a ON a.attractionID = pa.attractionID 
INNER JOIN park p ON p.parkID = pa.parkID 
ORDER BY a_name

-- Get list of all attractions for a specific Park
SELECT pa.attractionID AS pa_attractionID, pa.parkID AS pa_parkID, a.name AS a_name FROM attraction a 
INNER JOIN park_attraction pa ON pa.attractionID = a.attractionID 
INNER JOIN park p ON p.parkID = pa.parkID 
WHERE p.parkID = [pa_parkID] 
ORDER BY a_name

-- Get list of all dining services that is located 
-- in any Park
SELECT d.name AS d_name, p.name AS park_name, pd.parkID AS pd_parkID, pd.diningID AS pd_diningID FROM park_dining pd 
INNER JOIN dining d ON d.diningID = pd.diningID 
INNER JOIN park p ON p.parkID = pd.parkID 
ORDER BY d_name

-- Get the park location with dining ID
SELECT pd.diningID AS pd_diningID, pd.parkID AS pd_parkID, d.name AS d_name FROM dining d 
INNER JOIN park_dining pd ON pd.diningID = d.diningID 
INNER JOIN park p ON p.parkID = pd.parkID 
WHERE d.diningID = [pd.diningID]

-- Get specific dining service for specific park
SELECT d.name AS d_name, p.name AS park_name, pd.parkID AS pd_parkID, pd.diningID AS pd_diningID FROM park_dining pd 
INNER JOIN dining d ON d.diningID = [pd_diningID] 
INNER JOIN park p ON p.parkID = [pd_parkID] 
ORDER BY d_name

-- Filter Park by Character
SELECT c.name AS c_name, p.name AS park_name, pc.parkID AS pc_parkID, pc.characterID AS pc_characterID FROM park_character pc 
INNER JOIN `character` AS c ON c.characterID = pc.characterID 
INNER JOIN park p ON p.parkID = pc.parkID 
WHERE c.characterID = [c.characterID] 
ORDER BY c_name

-- INSERT 

-- Add a new park 
INSERT INTO park (name, city, state, country)
VALUES([name], [city], [state], [country])

-- Add a new land 
INSERT INTO land (name)
VALUES([land])

-- Add a new character 
INSERT INTO `character` (name, startTime, endTime)
VALUES([name], [startTime], [endTime])

-- Add a new attraction 
INSERT INTO attraction (name, type)
VALUES([name], [type])

-- Add a new dining 
INSERT INTO dining (name, service, cuisine)
VALUES([name], [service], [cuisine])

-- Add new theme land to a park
INSERT INTO park_land (parkID, lid)
VALUES([parkID], [lid])

-- Add new character to a park
INSERT INTO park_character (parkID, characterID)
VALUES([parkID], [characterID])

-- Add new attraction to a 
INSERT INTO park_attraction (parkID, attractionID)
VALUES([parkID], [attractionID])

-- Add new dining service to a park
INSERT INTO park_dining (parkID, diningID)
VALUES([parkID], [diningID])

-- UPDATE

-- Update park information
UPDATE park SET name = [name], city = [city], state = [state], country = [country]
WHERE parkID = [parkID]

-- Update land information
UPDATE land SET name = [name]
WHERE landID = [landID]

-- Update character information
UPDATE `character` SET name = [name], startTime = [startTime], endTime = [endTime]
WHERE characterID = [characterID]

-- Update attraction information
UPDATE attraction SET name = [name], type = [type]
WHERE attractionID = [attractionID]

-- Update dining information
UPDATE dining SET name = [name], service = [service], cuisine = [cuisine]
WHERE diningID = [diningID]

-- Update theme land with park location
UPDATE park_land SET landID = [landID]
WHERE parkID = [parkID]

-- Update character with park location
UPDATE park_character SET characterID = [characterID]
WHERE parkID = [parkID]

-- Update attraction with park location
UPDATE park_attraction SET attractionID = [attractionID]
WHERE parkID = [parkID]

-- Update park location for dining service
UPDATE park_dining 
SET parkID = [parkID], diningID = [diningID] 
WHERE parkID = [oldParkID] 
    AND diningID = [diningID]


-- DELETE

-- Delete park
DELETE FROM park
WHERE parkID = [parkID]

-- Delete land
DELETE FROM land
WHERE landID = [landID]

-- Delete character
DELETE FROM `character`
WHERE characterID = [characterID]

-- Delete attraction
DELETE FROM attraction
WHERE attractionID = [attractionID]

-- Delete dining
DELETE FROM dining
WHERE diningID = [diningID]

-- Disassociate a theme land from park
DELETE FROM park_land
WHERE parkID = [parkID]
  AND landID = [landID]

-- Disassociate a character from park
DELETE FROM park_character
WHERE parkID = [parkID]
  AND characterID = [characterID]

-- Disassociate an attraction from park
DELETE FROM park_attraction
WHERE parkID = [parkID]
  AND attractionID = [attractionID]

-- Disassociate a dining service from park
DELETE FROM park_dining
WHERE parkID = [parkID]
  AND diningID = [diningID]

