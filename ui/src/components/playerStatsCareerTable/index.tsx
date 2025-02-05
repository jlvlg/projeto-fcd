import { useQuery } from "@apollo/client";
import { Card } from "@mui/material";
import Table from "components/table";
import { transpose } from "components/teamTables";
import { GET_PLAYER_STATS } from "queries/getPlaterStats";
import { Game } from "types/Types";

type PlayerStatsTableProps = {
  teamId: number;
  playerId: number;
  season: string; 
};

export const PlayerStatsTable = ({ teamId, playerId, season }: PlayerStatsTableProps) => {
  const { data, loading, error } = useQuery(GET_PLAYER_STATS, {
    variables: { teamId, playerId, season },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const player = data?.teams[0]?.players[0];
  if (!player) return <p>No data available</p>;

  const currentSeasonStats = player.stats[0] || {};
  const totalGamesCurrentSeason = currentSeasonStats?.gamesPlayed || 0;

  const totalMinutesPlayedCurrentSeason = player.games.reduce(
    (acc: number, game: Game) => acc + (game.minutesPlayed || 0),
    0
  );

  const meanMinutesPlayedCurrentSeason =
    totalGamesCurrentSeason > 0 ? totalMinutesPlayedCurrentSeason / totalGamesCurrentSeason : 0;

  const careerStats = player.stats[1] || {};
  const totalGamesCareer = careerStats?.gamesPlayed || 0;
  const totalPointsCareer = careerStats?.score || 0;
  const totalAssistsCareer = careerStats?.assists || 0;
  const totalReboundsCareer = careerStats?.rebounds || 0;

  const meanMinutesPlayedCareer =
    totalGamesCareer > 0 ? careerStats?.minutesPlayed / totalGamesCareer : 0;

  const headers = [
    { label: "Estatísticas" },
    { label: "Total de Jogos" },
    { label: "Média de Pontos" },
    { label: "Média de Assistências" },
    { label: "Média de Rebotes" },
    { label: "Média de Minutos em Quadra" },
  ];

  const currentSeasonRow = [
    "Temporada Atual",
    totalGamesCurrentSeason,
    totalGamesCurrentSeason > 0 ? (currentSeasonStats?.score / totalGamesCurrentSeason).toFixed(2) : "0.00",
    totalGamesCurrentSeason > 0 ? (currentSeasonStats?.assists / totalGamesCurrentSeason).toFixed(2) : "0.00",
    totalGamesCurrentSeason > 0 ? (currentSeasonStats?.rebounds / totalGamesCurrentSeason).toFixed(2) : "0.00",
    meanMinutesPlayedCurrentSeason.toFixed(2),
  ];

  const careerRow = [
    "Carreira",
    totalGamesCareer,
    totalGamesCareer > 0 ? (careerStats?.score / totalGamesCareer).toFixed(2) : "0.00",
    careerStats?.meanAssists?.toFixed(2) || "0.00",
    careerStats?.meanRebounds?.toFixed(2) || "0.00",
    meanMinutesPlayedCareer.toFixed(2),
  ];

  const rows = [currentSeasonRow, careerRow];

  const careerTotalsHeaders = [
    { label: "Estatísticas de Carreira" },
    { label: "Total de Pontos" },
    { label: "Total de Assistências" },
    { label: "Total de Rebotes" },
  ];

  const careerTotalsRow = [
    "Carreira",
    totalPointsCareer,
    totalAssistsCareer,
    totalReboundsCareer,
  ];

  return (
    <>
    <Card sx={{ padding: 3, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Table
        headers={headers.map((header) => ({ label: header.label }))}
        columns={transpose(rows.map((row) => row))}
        />
    </Card>
    <Card sx={{ padding: 3, backgroundColor: "#1e1e1e", marginBottom: 3 }}>
        <Table
        headers={careerTotalsHeaders.map((header) => ({ label: header.label }))}
        columns={transpose([careerTotalsRow])}
        />
    </Card>
    </>
  );
};
