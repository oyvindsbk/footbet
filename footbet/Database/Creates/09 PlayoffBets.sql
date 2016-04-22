SET ANSI_NULLS OFF

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[PlayoffBets](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Result] [int] NULL,
	[HomeTeam] [int] NOT NULL,
	[AwayTeam] [int] NOT NULL,
	[GameType] [int] NOT NULL,
	[HomeGoals] [int] NULL,
	[AwayGoals] [int] NULL,
	[UserBetId] int NULL FOREIGN KEY REFERENCES UserBets(Id),
	[GameId] int NOT NULL FOREIGN KEY REFERENCES Games(Id)
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
)

GO

SET ANSI_PADDING OFF
GO
