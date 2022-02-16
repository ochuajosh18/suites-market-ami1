import React from 'react';
import { CSVLink } from 'react-csv';

import { makeStyles, useTheme, Theme, createStyles, } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField'
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import LastPageIcon from '@material-ui/icons/LastPage';
import Search from '@material-ui/icons/Search';

// utils
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import findIndex from 'lodash/findIndex';
import orderBy from 'lodash/orderBy';
import flatMap from 'lodash/flatMap';

type Sortable = 'ASC' | 'DESC' | null; // 'asc' | 'desc' | undefined

interface Column {
    title: string;
    field: string;
    cellStyle?: any; 
    headerStyle?: any;
}

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

interface ReportTableInterface {
    columns: Array<Column>;
    title: string;
    data: Array<{ [property: string]: string }>;
    csvRef: React.Ref<CSVLink>;
    dataSourceKey: string; // internal logic only 
}

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  }),
);

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
        maxHeight: 'calc(100vh - 400px)'
    },
});

const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;
  
    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    )
}

export default (props: ReportTableInterface) => {
    const classes = useStyles2();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState('');
    const [activeSorts, setActiveSorts] = React.useState<Array<{ field: string, order: Sortable }>>([]); // [{ field: 'tfo_id', order: 'ASC' }, { field: 'product_number', order: 'ASC' }]
    // do search
    let tableData = props.data; // manipulable props.data ( from datasource )
    if (search) { // search is your search string
        tableData = filter(props.data, (row) =>  JSON.stringify(row).toLowerCase().indexOf(search.toLowerCase()) > -1); // filter loops through a collection, uses flag
    }

    // do sort
    tableData = orderBy(tableData, 
        flatMap(activeSorts, 
            (sort) => sort.field), 
            flatMap(activeSorts, 
                (sort) => (sort.order === null || sort.order === 'ASC') ? 'asc' : 'desc'
            )
        )

    // use effect
    React.useEffect(() => {
        if (props.data.length === 0) {
            setSearch('');
        }
    }, [props.data, props.columns])// hard checking for when to rerender (only change when data or column changed)
  
    // utils
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, tableData.length - page * rowsPerPage);
  
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearch(e.target.value);
    }
    
    const handleSort = (field: string) => {
        const fieldSortIndex = findIndex(activeSorts, { field });
        if (fieldSortIndex > -1) {
            // sort already exist
            const activeSort = activeSorts[fieldSortIndex];
            let copiedSorts = activeSorts;
            const newSortData = { 
                ...activeSort,
                order: (activeSort.order === null ? 'ASC' : activeSort.order === 'DESC' ? null : 'DESC') as Sortable
            }
            // do manip of sorts
            if (newSortData.order === null) {
                // remove from sorts
                copiedSorts.splice(fieldSortIndex, 1);
            }
            else {
                // update sort
                copiedSorts[fieldSortIndex] = newSortData;
            }
            setActiveSorts([...copiedSorts]);
        }
        else {
            // sort does not exist
            // push sort
            setActiveSorts([...activeSorts, {
                field,
                order: 'ASC'
            }]);
        }
    }
    
    return (
        <Box>
            <Box style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Box style={{ fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>{props.title}</Box>
                <Box style={{ position: 'relative' }}>
                    <Box style={{ position: 'absolute', left: 12, top: 0, bottom: 0, display: 'flex', alignItems: 'center' }}>
                            <Search htmlColor="#4D89F5" />
                    </Box>
                    <TextField 
                        style={{
                            border: '1px solid #E5E5E5',
                            borderRadius: 5,
                            padding: '6px 6px 5px 16px'
                        }}
                        value={search}
                        onChange={handleSearch}
                    />
                </Box>
            </Box>
            {typeof props.columns !== 'undefined' && props.data.length > 0 ? 
                <Box>
                    <CSVLink
                        headers={map(props.columns, (col) => ({ label: col.title, key: col.field }))}
                        data={tableData} 
                        ref={props.csvRef} 
                        style={{ display: 'none' }} 
                        target="_blank" 
                        filename={`${props.dataSourceKey.toLowerCase()}_${new Date().getTime().toString()}.csv`} 
                    />
                    <TableContainer className={classes.table}>
                        <Table aria-label="custom pagination table" stickyHeader={true}>
                            <TableHead>
                                <TableRow key="report-header">
                                    {props.columns.map((column) => {
                                        const sortVisible = find(activeSorts, { field: column.field });
                                        return (
                                            <TableCell 
                                                component="th" 
                                                scope="row" 
                                                key={column.title} 
                                                style={{ ...column.headerStyle, backgroundColor: '#FFF', cursor: 'pointer' }}
                                                onClick={() => handleSort(column.field)}
                                            >
                                                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                    <Box style={{ display: 'flex', position: 'relative' }}>
                                                        {column.title}
                                                        <Box style={{ position: 'absolute', right: -8, padding: '0 8px', boxSizing: 'border-box', top: 0, bottom: 0 }}>
                                                            <Box style={{ position: 'relative', bottom: 3 }}>
                                                                {((sortVisible && (sortVisible.order === 'ASC')) || !sortVisible) && <ArrowDropUpIcon style={{ position: 'absolute', width: '0.75em' }} />}
                                                            </Box>
                                                            <Box style={{ position: 'relative', top: 3 }}>
                                                            {((sortVisible && (sortVisible.order === 'DESC')) || !sortVisible) && <ArrowDropDownIcon style={{ position: 'absolute', width: '0.75em' }} />}
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                ? tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // uses sorted, filtered data for rendering
                                : tableData // no sorting no filtering as is
                                ).map((row, index) => ( // maps all row object into Component <TableRow />
                                    <TableRow key={`row-${index}`}>
                                        {props.columns.map((column, colIndex) => ( // maps row properties into a <TableCell />
                                            <TableCell key={`row-${index}-${row[column.field]}-${colIndex}`} component="td" scope="row" style={column.cellStyle}>
                                                {row[column.field]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                                {emptyRows > 0 && (
                                    <TableRow key="empty-row" style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={props.columns.length} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            component="div"
                            count={tableData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </Box>
                </Box>
            :
                <Box style={{ height: 'calc(100vh - 360px)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: 44, color: '#EDEDED' }}>
                    No Data
                </Box>
            }
            
        </Box>
    );
  }