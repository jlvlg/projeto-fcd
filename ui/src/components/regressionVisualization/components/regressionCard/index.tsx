import { Box, Card, Typography } from "@mui/material";
import { AiResult } from "__generated__/graphql";
import ConfusionMatrix from "components/charts/ConfusionMatrix";
import * as _ from "lodash-es";

type Props = { airesult: AiResult & { x: number; label: string } };

export default function RegressionCard({ airesult }: Props) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: 2,
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h6">
          Probabilidade {airesult.label} ({_.round(airesult.x, 2)})
        </Typography>
        <Typography variant="h1">{Math.round(airesult.y * 100)}%</Typography>
      </Box>
      <ConfusionMatrix
        truePositives={airesult.truePositive}
        trueNegatives={airesult.trueNegative}
        falsePositives={airesult.falsePositive}
        falseNegatives={airesult.falseNegative}
      />
    </Card>
  );
}
