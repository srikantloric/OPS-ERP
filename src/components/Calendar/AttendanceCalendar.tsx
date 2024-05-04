import Calendar from "react-calendar";
import "./AttendanceCalendar.css";
import "react-calendar/dist/Calendar.css";
import {
  RemoveCircleOutline,
  RemoveOutlined,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { StudentSatus } from "types/attendance";

const AttendanceCalendar: React.FC<StudentSatus> = ({
  absentDates,
  presentDates,
  halfDayDates,
  notMarkedDates,
  futureDates,
  onChange,
  onDateChange,
}) => {
  const [date, setDate] = useState(new Date());

  const reducedPresentDates = useMemo(
    () => reduceDatesByOneDay(presentDates),
    [presentDates]
  );
  const reducedHalfDates = useMemo(
    () => reduceDatesByOneDay(halfDayDates),
    [halfDayDates]
  );
  const reducedAbsentDates = useMemo(
    () => reduceDatesByOneDay(absentDates),
    [absentDates]
  );
  const reducedNotMarkedDates = useMemo(
    () => reduceDatesByOneDay(notMarkedDates),
    [notMarkedDates]
  );
  const reducedFutureDates = useMemo(
    () => reduceDatesByOneDay(futureDates),
    [futureDates]
  );

  useEffect(() => {
    const currentDate = new Date();
    localStorage.setItem("activeStartDate", currentDate.toDateString());
    console.log("activeStartDate child", currentDate);
  }, []);

  function reduceDatesByOneDay(dates: string[]) {
    return dates.map((dateString) => {
      const date = new Date(dateString);
      date.setDate(date.getDate() - 1);
      return date.toISOString().slice(0, 10);
    });
  }

  function getAttendanceStatus(date: Date) {
    const dateString = date.toISOString().slice(0, 10);
    // const currentDate = new Date().toISOString().slice(0, 10);

    if (
      reducedPresentDates.includes(dateString) &&
      !halfDayDates.includes(dateString)
    ) {
      return "present";
    }
    if (reducedHalfDates.includes(dateString)) {
      return "halfDay";
    }
    if (reducedAbsentDates.includes(dateString)) {
      return "absent";
    }
    if (reducedNotMarkedDates.includes(dateString)) {
      return "attendanceNotMarked";
    }
    if (reducedFutureDates.includes(dateString)) {
      return "futureDate";
    }
    return null;
  }

  function tileContent({ date, view }: { date: Date; view: string }) {
    if (view !== "month") return null;
    const status = getAttendanceStatus(date);
    switch (status) {
      case "present":
        return (
          <div className="present-marker">
            <p>Present</p>
          </div>
        );
      case "absent":
        return (
          <div className="absent-marker">
             <p>Absent</p>
          </div>
        );
      case "halfDay":
        return (
          <div>
            <RemoveCircleOutline />
          </div>
        );
      case "futureDate":
        return (
          <div style={{ color: "gray" }}>
            <RemoveOutlined />
          </div>
        );
      default:
        return null;
    }
  }
  function tileClassName({ date, view }: { date: Date; view: string }) {
    if (view !== "month") return null;
    const classes = ["tile-day"];
    if (date.toDateString() === new Date().toDateString()) {
      classes.push("today");
    }
    if (getAttendanceStatus(date) === "attendanceNotMarked") {
      classes.push("attendance-not-marked");
    }
    return classes.join(" ");
  }



  const handleActiveStartDateChange: ({
    action,
    activeStartDate,
    value,
    view,
  }: any) => void = ({ activeStartDate }) => {
    console.log("Active start date changed:", activeStartDate);
    // localStorage.setItem("activeStartDate", activeStartDate);
  };

  const handleDateChange: (value: any) => void = (newDate) => {
    // Handle the selected date here
    console.log("Selected date:", newDate?.toDateString());
    setDate(newDate); // Update state with the new selected date if needed
  };

  return (
    <div className="day-tile-wrapper">
      <Calendar     
      onChange={handleDateChange}
      value={date}
      tileContent={tileContent}
      tileClassName={tileClassName}
      className="calender-body" 
      calendarType="gregory"
          onActiveStartDateChange={handleActiveStartDateChange}
       />
    </div>
  );
};

export default AttendanceCalendar;
