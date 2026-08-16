import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

export const DataTable = <T,>({
  rows,
  columns,
  emptyMessage = 'No records match the current filters.',
  getRowKey,
  onRowClick
}: {
  rows: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  getRowKey: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
}) => {
  if (!rows.length) {
    return (
      <Paper className="empty-panel">
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} className="data-table">
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.key}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              hover
              key={getRowKey(row, index)}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'clickable-row' : undefined}
            >
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
