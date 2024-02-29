'use client';

import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  getKeyValue,
} from '@nextui-org/react';
import styles from './OperationsTable.module.css';

const OperationsTable = ({ rows = [] }) => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = rows.length ? Math.ceil(rows.length / rowsPerPage) : 0;

  const rowsOnPage = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  return (
    <Table
      className={styles.table}
      bottomContent={
        pages > 1 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
              size="sm"
            />
          </div>
        ) : null
      }
    >
      <TableHeader className={styles.tableHeader}>
        <TableColumn key="type" className={styles.th}>
          type
        </TableColumn>
        <TableColumn key="amount" className={styles.th}>
          usdt
        </TableColumn>
        <TableColumn key="pnl" className={styles.th}>
          pnl
        </TableColumn>
        <TableColumn key="quantity" className={styles.th}>
          asset qty.
        </TableColumn>
        <TableColumn key="open_price" className={styles.th}>
          entry
        </TableColumn>
        <TableColumn key="exit_price" className={styles.th}>
          exit
        </TableColumn>
        <TableColumn key="open_time" className={styles.th}>
          open time
        </TableColumn>
        <TableColumn key="close_time" className={styles.th}>
          close time
        </TableColumn>
      </TableHeader>
      <TableBody items={rowsOnPage ?? []} loadingContent={<Spinner />}>
        {(item) => (
          <TableRow key={item?.id}>
            {(columnKey) => (
              <TableCell className={styles.td}>
                {getKeyValue(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default OperationsTable;
