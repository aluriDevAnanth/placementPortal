import React, { useMemo } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';

const ExpectedCompanyTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: '#',
        accessor: (row, i) => i + 1,
      },
      {
        Header: 'Expected Company Name',
        accessor: 'name',
      },
      {
        Header: 'Type Of Company',
        accessor: 'category',
      },
      {
        Header: 'Eligible Branch',
        accessor: 'eligibleBranch',
      },
      {
        Header: 'Expected Date',
        accessor: 'dateofvisit',
      },
    ],
    [] // Empty dependency array for useMemo
  );

  const tableInstance = useTable({ columns, data }, useFilters, useSortBy);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <table {...getTableProps()} className='table table-striped table-hovered table-hover table-bordered'  >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr className='text-center' {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' 🔽'
                      : ' 🔼'
                    : ''}
                </span>
                <div>{column.canFilter ? column.render('Filter') : null}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr className='text-center' {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>
                  {cell.column.render === 'Cell' ? cell.render('Cell') : cell.value}
                </td>
              ))}
            </tr>
          );
        })}

      </tbody>
    </table>
  );
};

export default ExpectedCompanyTable;
