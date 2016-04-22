use TestDatabase
BEGIN TRANSACTION

ALTER TABLE PlayoffBets 
Add BetId int


INSERT INTO Bets (HomeGoals, AwayGoals,Result,UserBetId,GameId)
SELECT HomeGoals, AwayGoals,Result,UserBetId,GameId
FROM PlayoffBets

UPDATE PlayoffBets SET BetId = Bets.Id  from PlayoffBets join Bets on (Bets.UserBetId = PlayoffBets.UserBetId AND Bets.GameId = PlayoffBets.GameId)

DROP INDEX [IX_UserBetId] ON [dbo].[PlayoffBets] WITH ( ONLINE = OFF )
ALTER TABLE [dbo].[PlayoffBets] DROP CONSTRAINT [FK_dbo.PlayoffBets_dbo.UserBets_UserBetId]

ALTER TABLE PlayoffBets
DROP COLUMN HomeGoals, AwayGoals,Result,GameId, UserBetId

--ALTER TABLE [dbo].[PlayoffGameDetails] DROP CONSTRAINT [PK__PlayoffG__3214EC0749C3F6B7]
--ALTER TABLE PlayoffGameDetails DROP COLUMN Id

--ALTER TABLE PlayoffGameDetails ADD CONSTRAINT PK_GameId PRIMARY KEY (GameId)


ROLLBACK TRANSACTION  