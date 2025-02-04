import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Table as TableMaterial,
  TableRow,
} from "@mui/material";
import * as _ from "lodash-es";

type Header = {
  label: string;
  children?: Header[];
  colspan?: number;
  rowspan?: number;
};

type Props = {
  headers: Header[];
  columns: (string | number | null | undefined)[][];
  onClickRow?: (row: (string | number | null | undefined)[]) => void;
};

export default function Table({ columns, headers, onClickRow }: Props) {
  const maxLength = Math.max(...columns.map((column) => column.length));
  const headerLevels = calculateHeaderLevels(headers);

  function calculateHeaderLevels(
    headers: Header[],
    headerLevels: Header[][] = [],
    level: number = 0
  ): Header[][] {
    if (!headerLevels[level]) headerLevels[level] = [];

    for (const header of headers) {
      headerLevels[level].push(header);
      if (header.children) {
        calculateHeaderLevels(header.children, headerLevels, level + 1);
      }
      header.colspan =
        _.sumBy(header.children, "colspan") || (header.colspan ?? 1);
    }

    return headerLevels;
  }

  return (
    <TableContainer component={Paper} elevation={5}>
      <TableMaterial>
        <TableHead>
          {headerLevels.map((row, index) => (
            <TableRow
              key={index}
              sx={(theme) => ({
                backgroundColor: theme.palette.common.black,
              })}
            >
              {row.map((header, index) => (
                <TableCell
                  key={index}
                  colSpan={header.colspan}
                  rowSpan={header.rowspan}
                  align="center" // Alinhamento centralizado
                  sx={(theme) => ({
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 16,
                    "&:nth-last-child(n+2)": {
                      borderRight: "1px solid",
                      borderColor: theme.palette.grey[700],
                    },
                  })}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {Array.from({ length: maxLength }).map((_, index) => (
            <TableRow
              key={index}
              sx={[
                {
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
                !!onClickRow && {
                  "&:active": {
                    backgroundColor: "grey.600",
                  },
                  cursor: "pointer",
                },
              ]}
              onClick={
                onClickRow &&
                (() => onClickRow(columns.map((column) => column[index])))
              }
            >
              {columns.map((column, i) => (
                <TableCell key={i} align="center"> 
                  {column[index]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMaterial>
    </TableContainer>
  );
}
