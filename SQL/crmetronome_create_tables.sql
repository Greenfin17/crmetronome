CREATE TABLE dbo.Composers
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	First varchar(50),
	Last varchar(50) NOT NULL,
	Middle varchar (50),
	Birth date,
	Death date
);

CREATE TABLE dbo.Compositions
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Title varchar(100),
	Composer uniqueidentifier NOT NULL
	Constraint FK_Compositions_Composers FOREIGN KEY (Composer)
	REFERENCES dbo.Composers (ID)	
);

CREATE TABLE dbo.Patterns
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Pattern varchar(500)
);

CREATE TABLE dbo.Excerpts
(
	ID uniqueidentifier NOT NULL Primary Key default(newid()),
	Composition uniqueidentifier NOT NULL,
	Movement varchar (50),
	Measures varchar
	Constraint FK_Excerpts_Compositions FOREIGN KEY (Composition)
		REFERENCES dbo.Compositions (ID)
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
	Constraint FK_Segments_Patterns FOREIGN KEY (Pattern)
		REFERENCES dbo.Patterns (ID)
);

