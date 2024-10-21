--CREATE DATABASE Metronome

IF EXISTS (SELECT * FROM Information_schema.TABLES WHERE TABLE_NAME = 'Excerpts') DELETE from Excerpts;
IF EXISTS (SELECT * FROM Information_schema.TABLES WHERE TABLE_NAME = 'Segments') DELETE from Segments;
IF EXISTS (SELECT * FROM Information_schema.TABLES WHERE TABLE_NAME = 'Patterns') DELETE from Patterns;
IF EXISTS (SELECT * FROM Information_schema.TABLES WHERE TABLE_NAME = 'Compositions') DELETE from Compositions;
IF EXISTS (SELECT * FROM Information_schema.TABLES WHERE TABLE_NAME = 'Composers') DELETE from Composers;
IF EXISTS (SELECT * FROM Information_schema.TABLES WHERE TABLE_NAME = 'Users') DELETE from Users;
IF EXISTS (SELECT * FROM Information_schema.TABLES WHERE TABLE_NAME = 'Roles') DELETE from Roles;


ALTER TABLE dbo.Excerpts
	DROP CONSTRAINT FK_Excerpts_Compositions;
ALTER TABLE dbo.Excerpts
	DROP CONSTRAINT FK_Excerpts_Users;

ALTER TABLE dbo.Segments
	DROP CONSTRAINT FK_Segments_Excerpts;
ALTER TABLE dbo.Segments
	DROP CONSTRAINT FK_Segments_Patterns;

ALTER TABLE dbo.Patterns
	DROP CONSTRAINT FK_Patterns_Users

ALTER TABLE dbo.Compositions
	DROP CONSTRAINT FK_Compositions_Composers
ALTER TABLE dbo.Compositions
	DROP CONSTRAINT FK_Compositions_Users

ALTER TABLE dbo.Composers
	DROP CONSTRAINT FK_Composers_Users

ALTER TABLE dbo.Users
	DROP CONSTRAINT FK_Users_Roles
	
DROP TABLE IF EXISTS dbo.Roles
CREATE TABLE Roles
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Name varchar(50)
)

DROP TABLE IF EXISTS dbo.Users
CREATE TABLE dbo.Users
(
	Id uniqueidentifier NOT NULL Primary Key default(newid()),
	FireBaseUID varchar(100),
	FirstName varchar(50),
	LastName varchar(50) NOT NULL,
	EmailAddress varchar(100),
	ProfilePicURL varchar(500),
	Shared bit,
	Role uniqueidentifier NOT NULL
	CONSTRAINT FK_Users_Roles FOREIGN KEY (Role)
		REFERENCES Roles (ID)
);

DROP TABLE IF EXISTS dbo.Composers
CREATE TABLE dbo.Composers
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	AddedBy uniqueidentifier NOT NULL,
	Shared bit NOT NULL,
	First varchar(50),
	Last varchar(50) NOT NULL,
	Middle varchar (50),
	Birth date,
	Death date
	CONSTRAINT FK_Composers_Users FOREIGN KEY (AddedBy)
		REFERENCES Users (ID)
);

DROP TABLE IF EXISTS dbo.Compositions
CREATE TABLE dbo.Compositions
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Title varchar(100),
	Catalog varchar (20),
	Composer uniqueidentifier NOT NULL,
	AddedBy uniqueidentifier NOT NULL,
	Shared bit,
	CONSTRAINT FK_Compositions_Composers FOREIGN KEY (Composer)
	REFERENCES Composers (ID),
	CONSTRAINT FK_Compositions_Users FOREIGN KEY (AddedBy)
		REFERENCES Users (ID)
);

DROP TABLE IF EXISTS dbo.Patterns
CREATE TABLE dbo.Patterns
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	CreatedBy uniqueidentifier NOT NULL,
	Shared bit,
	BeatPattern varchar(500),
	CONSTRAINT FK_Patterns_Users FOREIGN KEY (CreatedBy)
		REFERENCES dbo.Users (ID)
	
);

DROP TABLE IF EXISTS dbo.Excerpts
CREATE TABLE dbo.Excerpts
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Composition uniqueidentifier NOT NULL,
	Movement varchar (50),
	Measures varchar (50),
	CreatedBy uniqueidentifier NOT NULL,
	Shared bit,
	CONSTRAINT FK_Excerpts_Compositions FOREIGN KEY (Composition)
		REFERENCES dbo.Compositions (ID),
	CONSTRAINT FK_Excerpts_Users FOREIGN KEY (CreatedBy)
		REFERENCES dbo.Users (ID)
);

DROP TABLE IF EXISTS dbo.Segments
CREATE TABLE dbo.Segments
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Excerpt uniqueidentifier NOT NULL,
	Position int,
	Pattern uniqueidentifier NOT NULL,
	Unit int,
	Tempo int,
	Repetitions int
	Constraint FK_Segments_Excerpts FOREIGN KEY (Excerpt)
		REFERENCES dbo.Excerpts (ID),
	CONSTRAINT FK_Segments_Patterns FOREIGN KEY (Pattern)
		REFERENCES dbo.Patterns (ID)
);

