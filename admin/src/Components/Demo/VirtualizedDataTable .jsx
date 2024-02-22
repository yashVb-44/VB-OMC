// VirtualizedDataTable.js
import React from 'react';
import { AutoSizer, Table, Column } from 'react-virtualized';

const VirtualizedDataTable = ({ data, columns }) => {
    return (
        <AutoSizer>
            {({ height, width }) => (
                <Table
                    headerHeight={30}
                    height={height}
                    rowCount={data.length}
                    rowGetter={({ index }) => data[index]}
                    rowHeight={40} // Adjust the row height as needed
                    width={width}
                    overscanRowCount={10} // Adjust overscan for better performance
                >
                    {columns.map((column) => (
                        <Column
                            key={column.field}
                            dataKey={column.field}
                            label={column.headerName}
                            width={column.width}
                        />
                    ))}
                </Table>
            )}
        </AutoSizer>
    );
};

export default VirtualizedDataTable;
