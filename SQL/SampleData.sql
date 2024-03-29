INSERT INTO Roles (Name) VALUES ('User');
INSERT INTO Roles (Name) VALUES ('Administrator');
INSERT INTO Users (FirstName, LastName, EmailAddress, Role) VALUES ('Art', 'Linkletter', 'al@example.com',
	(SELECT ID FROM Roles WHERE Name = 'User'));

Insert into Composers (First, Last, Middle, Birth, AddedBy, Shared) values ('Ludvig', 'Beethoven', 'Van','1770', 
	(SELECT ID FROM Users WHERE LastName = 'Linkletter'), 1);		
Insert into Composers (First, Last, Birth, AddedBy, Shared) values ('Igor', 'Stravinsky', '1882',
	(SELECT ID FROM Users WHERE LastName = 'Linkletter'), 1);
Insert into Compositions (Title, Composer, AddedBy, Shared)  values ('Rite of Spring', (SELECT ID FROM Composers WHERE Last = 'Stravinsky'),
	(SELECT ID FROM Users WHERE LastName = 'Linkletter'), 1);
Insert into Excerpts (Measures, Composition, CreatedBy, Shared) values ('Letter C to D', (SELECT ID FROM Compositions WHERE TITLE = 'Rite of Spring'),
	(SELECT ID FROM Users WHERE LastName = 'Linkletter'), 1);
Insert into Patterns (BeatPattern, CreatedBy, Shared) values ('3,2', 
	(SELECT ID FROM Users WHERE LastName = 'Linkletter'), 1);
Insert into Patterns (BeatPattern, CreatedBy, Shared) values ('2,3', 
	(SELECT ID FROM Users WHERE LastName = 'Linkletter'), 1);
Insert into Patterns (BeatPattern, CreatedBy, Shared) values ('3,2,3', 
	(SELECT ID FROM Users WHERE LastName = 'Linkletter'), 1);

Insert into Segments (Excerpt, Position, Pattern, Tempo, Repetitions) values 
	('7D091755-63E2-4A38-AD38-E9A27859B28E', '1', 
	(SELECT ID FROM Patterns WHERE BeatPattern = '2,3'), 60, 2);
Insert into Segments (Excerpt, Position, Pattern, Tempo, Repetitions) values 
	('7D091755-63E2-4A38-AD38-E9A27859B28E', '2', 
	(SELECT ID FROM Patterns WHERE BeatPattern = '3,2,3'), 120, 2);


Insert into Segments (Excerpt, Position, Pattern, Tempo, Repetitions) values 
	('B28D70AA-C494-4E5B-9514-524BF5BCFD86', '2', 'B32995CE-E1BB-4D16-A56D-50B6B6940C6E',
	 '120', '2');
