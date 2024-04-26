import { Grid } from "@mui/joy";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
// import RoundIconCard from "components/Card/RoundIconCard";
import DailyAttendance from "components/AttendanceReport/DailyAttendanceReport";
import AttendanceRegisterReport from "components/AttendanceReport/AttendanceRegister";

interface Indexdata {
    column1: string;
    column2: string;
    buttonText: string;
    clickHandler: () => void;
}


function AttendanceIndex() {

    const handleDailyAttendance = async () => {
        const pdfRes2 = await DailyAttendance();
        const window1 =
            "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";

        window.open(pdfRes2, "_blank", window1);
    };

    const handleAttendanceRegister = async () => {
        const res = await AttendanceRegisterReport();
        const window2 =
            "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";

        window.open(res, "_blank", window2);
    };


    const rowData: Indexdata[] = [
        { column1: '1', column2: 'Daily Attendance Report', buttonText: 'Button 1', clickHandler: () => handleDailyAttendance() },
        { column1: '2', column2: 'Attendance Register', buttonText: 'Button 2', clickHandler: () => handleAttendanceRegister() },
    ];

    return (
        <>
            <Grid container spacing={2} marginTop={2}>
                <Paper
                    sx={{
                        padding: "8px",
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S No.</TableCell>
                                    <TableCell>Report Title</TableCell>
                                    <TableCell>Report Links</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.column1}</TableCell>
                                        <TableCell>{row.column2}</TableCell>
                                        <TableCell>
                                            <Button variant="contained" color="primary" onClick={row.clickHandler}>{row.buttonText}</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>
        </>
    )
}

export default AttendanceIndex;
