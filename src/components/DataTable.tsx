import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T = any> {
  id: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: number;
  render?: (row: T) => React.ReactNode;
  format?: (value: any) => string;
}

export interface DataTableAction<T = any> {
  icon: React.ReactNode;
  tooltip: string;
  onClick: (row: T) => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  show?: (row: T) => boolean;
}

interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey?: string;
  selectable?: boolean;
  actions?: DataTableAction<T>[];
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey = 'id',
  selectable = false,
  actions = [],
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleSort = (columnId: string) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = new Set(data.map((row) => row[rowKey]));
      setSelected(newSelected);
    } else {
      setSelected(new Set());
    }
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const isSelected = (id: string) => selected.has(id);
  const numSelected = selected.size;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < data.length}
                    checked={data.length > 0 && numSelected === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  style={{ width: column.width }}
                  sortDirection={sortBy === column.id ? sortDirection : false}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortDirection : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {column.label}
                      </Typography>
                    </TableSortLabel>
                  ) : (
                    <Typography variant="body2" fontWeight={600}>
                      {column.label}
                    </Typography>
                  )}
                </TableCell>
              ))}
              {actions.length > 0 && (
                <TableCell align="right" style={{ width: 120 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Actions
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const rowId = row[rowKey];
                const isItemSelected = isSelected(rowId);

                return (
                  <TableRow
                    key={rowId}
                    hover
                    onClick={() => onRowClick?.(row)}
                    selected={isItemSelected}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRow(rowId);
                          }}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render
                          ? column.render(row)
                          : column.format
                          ? column.format(row[column.id])
                          : row[column.id]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          {actions.map((action, index) => {
                            if (action.show && !action.show(row)) return null;

                            return (
                              <Tooltip key={index} title={action.tooltip} arrow>
                                <IconButton
                                  size="small"
                                  color={action.color || 'default'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row);
                                  }}
                                >
                                  {action.icon}
                                </IconButton>
                              </Tooltip>
                            );
                          })}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={pageSizeOptions}
      />
    </Paper>
  );
}
