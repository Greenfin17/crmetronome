Insert into Composers (First, Last, Middle) values ('Ludvig', 'Beethoven', 'Van');
Insert into Composers (First, Last, Birth) values ('Stravinsky', 'Igor', '1882');
Insert into Compositions (Title, Composer)  values ('Rite of Spring', '1FBF533A-7E69-4375-9093-9C701C479F7F');
Insert into Excerpts (Measures, Composition) values ('Letter C to D', '9AF2A5E0-655B-486D-AAB7-9FB1B184348D');
Insert into Patterns (Pattern) values ('3,2');
Insert into Patterns (Pattern) values ('2,3');
Insert into Patterns (Pattern) values ('2,3,2');

Insert into Segments (Excerpt, Position, Pattern, Tempo, Repetitions) values 
	('B28D70AA-C494-4E5B-9514-524BF5BCFD86', '1', 'B7EFBEE8-FDFD-4244-857C-31B92812C012',
	 '60', '2');
Insert into Segments (Excerpt, Position, Pattern, Tempo, Repetitions) values 
	('B28D70AA-C494-4E5B-9514-524BF5BCFD86', '2', 'B32995CE-E1BB-4D16-A56D-50B6B6940C6E',
	 '120', '2');
