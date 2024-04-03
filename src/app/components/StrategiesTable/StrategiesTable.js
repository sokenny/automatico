'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
import styles from './StrategiesTable.module.css';

const StrategiesTable = ({ rows = [] }) => {
  const router = useRouter();
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
        <TableColumn key="id" className={styles.th}>
          id
        </TableColumn>
        <TableColumn key="name" className={styles.th}>
          name
        </TableColumn>
        <TableColumn key="pair" className={styles.th}>
          pair
        </TableColumn>
        <TableColumn key="indicator" className={styles.th}>
          indicator
        </TableColumn>
        <TableColumn key="created_at" className={styles.th}>
          Creation Date
        </TableColumn>
      </TableHeader>
      <TableBody items={rowsOnPage ?? []} loadingContent={<Spinner />}>
        {(item) => (
          <TableRow
            key={item?.id}
            className={styles.row}
            onClick={() => router.push(`/strategy/${item?.id}`)}
          >
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

export default StrategiesTable;
