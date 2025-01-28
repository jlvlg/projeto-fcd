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

type Header = { label: string; children?: Header[]; colspan?: number };

type Props = {
  headers: Header[];
  columns: (string | number | null | undefined)[][];
};

export default function Table({ columns, headers }: Props) {
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
    <TableContainer component={Paper} variant="outlined">
      <TableMaterial>
        <TableHead>
          {headerLevels.map((row, index) => (
            <TableRow key={index}>
              {row.map((header, index) => (
                <TableCell key={index} colSpan={header.colspan}>
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {Array.from({ length: maxLength }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((column, i) => (
                <TableCell key={i}>{column[index]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableMaterial>
    </TableContainer>
  );
}
