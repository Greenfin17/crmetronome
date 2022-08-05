CREATE DATABASE Metronome
CREATE TABLE Roles
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Name varchar(50)
)
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
	CONSTRAINT FK_Composer_User FOREIGN KEY (AddedBy)
		REFERENCES Users (ID)
);

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

CREATE TABLE dbo.Patterns
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Pattern varchar(500),
	CreatedBy uniqueidentifier NOT NULL	
);

CREATE TABLE dbo.Excerpts
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Composition uniqueidentifier NOT NULL,
	Movement varchar (50),
	Measures varchar (50),
	CreatedBy uniqueidentifier NOT NULL,
	Shared bit,
	Constraint FK_Excerpts_Compositions FOREIGN KEY (Composition)
		REFERENCES dbo.Compositions (ID),
	Constraint FK_Excerpts_Users FOREIGN KEY (CreatedBy)
		REFERENCES dbo.Users (ID)
);

CREATE TABLE Seqments
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Excerpt uniqueidentifier NOT NULL,
	Position int,
	Pattern uniqueidentifier NOT NULL,
	Tempo decimal,
	Repetitions int
	Constraint FK_Segments_Excerpts FOREIGN KEY (Excerpt)
		REFERENCES dbo.Excerpts (ID),
	CONSTRAINT FK_Segments_Patterns FOREIGN KEY (Pattern)
		REFERENCES dbo.Patterns (ID)
);

