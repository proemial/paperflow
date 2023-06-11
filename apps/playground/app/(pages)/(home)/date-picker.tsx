import { DateRange } from "@mui/icons-material";
import { IngestionCounts } from "data/storage/v1/ingestion-models";
import { useRouter } from "next/navigation";
import React from "react";
import dayjs from 'dayjs';
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css"

export function IngestionDatePicker({ date, dates }: { date?: string, dates?: string[] }) {
  const router = useRouter();
  const [highlightDates, setHighlightDates] = React.useState<{ [key: string]: Date[] }[]>([]);

  React.useEffect(() => {
    (async () => {
      if(dates) {
        setHighlightDates([
          { "react-datepicker__day--highlighted-custom-1": dates.map(d => dayjs(d, "YYYY-MM-DD").toDate()) },
          // { "react-datepicker__day--highlighted-custom-2": json.filter(d => d.count === 0).map(d => dayjs(d.date, "YYYY-MM-DD").toDate()) }
        ]);
      }
    })();
  }, [dates, setHighlightDates]);

  const ExampleCustomInput = React.forwardRef<HTMLButtonElement, { value?: any, onClick?: any }>(({ onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      <DateRange />
    </button>
  ));
  ExampleCustomInput.displayName = "ExampleCustomInput";

  const handleCustomInputClick = (dateSelected: Date) => {
    router.push(`/on/${dayjs(dateSelected).format("YYYY-MM-DD")}`);
  };

  return (
    <div style={{ width: 40 }}>
      <DatePicker
        selected={dayjs(date, "YYYY-MM-DD").toDate()}
        onChange={handleCustomInputClick}
        highlightDates={highlightDates}
        customInput={<ExampleCustomInput />}
      />
    </div>
  );
}
