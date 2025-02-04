import { CircularProgress, Typography } from "@mui/material";
import Table from "components/table";
import { transpose } from "components/teamTables";
import { useTeamDetails } from "hooks/useTeamDetails";

export default function GamesTable({selectedSeason}:{selectedSeason: number}){

    const { data, loading, error } = useTeamDetails();
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Erro ao carregar dados.</Typography>;
    
    const team = data?.teams?.[0] ?? null;

    const TABLE_HEADERS = [
        ["Jogos", "Data", "Adversário", "Resultado", "Local", "Placar"],
      ];
  
    const filteredGames = team?.games?.filter(game => {
        if (selectedSeason === 2) return true;
        const seasonYear = new Date(game.date).getFullYear();
        return (selectedSeason === 0 && seasonYear === 2023) || (selectedSeason === 1 && seasonYear === 2024);
      }) ?? [];
    

    const games = filteredGames.map((game) => [ 
        "Jogos", 
        new Date(game.date).toLocaleDateString("pt-BR"),
        game.opponent.full_name, 
        game.result === "W" ? "Vitória" : "Derrota",
        game.location === "home" ? "Casa" : "Fora",
        `${game.teamScore} - ${game.opponentScore}`
      ]) ?? [["Sem jogos disponíveis"]];

    return(
        <Table
        headers={TABLE_HEADERS[0].slice(1).map((h) => ({ label: h }))} 
        columns={transpose(games.map(row => row.slice(1)))} 
        />
    )
}