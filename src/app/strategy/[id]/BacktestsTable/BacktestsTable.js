'use client';

import React from 'react';
import Link from 'next/link';
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
  Tooltip,
} from '@nextui-org/react';
import Delete from '../../../icons/Delete/Delete';
import Eye from '../../../icons/Eye/Eye';
import styles from './BacktestsTable.module.css';

const BacktestsTable = ({ rows = [] }) => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;
  const pages = rows.length ? Math.ceil(rows.length / rowsPerPage) : 0;

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
        <TableColumn key="id" className={styles.th}>
          Backtest
        </TableColumn>
        <TableColumn key="period_start_at" className={styles.th}>
          From
        </TableColumn>
        <TableColumn key="period_end_at" className={styles.th}>
          To
        </TableColumn>
        <TableColumn key="initial_balance" className={styles.th}>
          Initial Balance
        </TableColumn>
        <TableColumn key="end_balance" className={styles.th}>
          End Balance
        </TableColumn>
        <TableColumn key="roi" className={styles.th}>
          Roi
        </TableColumn>
        <TableColumn key="actions" className={styles.th}>
          Actions
        </TableColumn>
      </TableHeader>
      <TableBody items={rows ?? []} loadingContent={<Spinner />}>
        {(item) => (
          <TableRow key={item?.name}>
            {(columnKey) => {
              if (columnKey === 'actions') {
                return (
                  <TableCell>
                    <div className="relative flex items-center gap-2">
                      <Tooltip
                        content="Details"
                        closeDelay={0}
                        className={styles.actionTooltip}
                      >
                        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                          <Link href={`/backtest/${item.id}`}>
                            <Eye />
                          </Link>
                        </span>
                      </Tooltip>
                      <Tooltip
                        color="danger"
                        content="Delete"
                        closeDelay={0}
                        className={styles.actionTooltip}
                      >
                        <span className="text-lg text-danger cursor-pointer active:opacity-50">
                          <Delete />
                        </span>
                      </Tooltip>
                    </div>
                  </TableCell>
                );
              }
              return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default BacktestsTable;
