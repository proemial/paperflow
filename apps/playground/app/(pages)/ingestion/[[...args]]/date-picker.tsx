import { DateRange } from "@mui/icons-material";
import { IngestionCounts } from "data/db/ingestion-dao";
import { useRouter } from "next/navigation";
import React from "react";
import dayjs from 'dayjs';
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css"

export function IngestionDatePicker({ date }: { date?: string }) {
  const router = useRouter();
  const [highlightDates, setHighlightDates] = React.useState<{ [key: string]: Date[] }[]>([]);

  React.useEffect(() => {
    (async () => {
      const res = await fetch(`/api/db/ingestion/get-counts/x`);
      const json: IngestionCounts[] = await res.json();

      setHighlightDates([
        { "react-datepicker__day--highlighted-custom-1": json.filter(d => d.count > 0).map(d => dayjs(d.date, "YYYY-MM-DD").toDate()) },
        { "react-datepicker__day--highlighted-custom-2": json.filter(d => d.count === 0).map(d => dayjs(d.date, "YYYY-MM-DD").toDate()) }
      ]);
    })();
  }, [setHighlightDates]);

  const ExampleCustomInput = React.forwardRef<HTMLButtonElement, { value?: any, onClick?: any }>(({ onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      <DateRange />
    </button>
  ));
  ExampleCustomInput.displayName = "ExampleCustomInput";

  const handleCustomInputClick = (dateSelected: Date) => {
    router.push(`/ingestion/${dayjs(dateSelected).format("YYYY-MM-DD")}`);
  };

  console.log(date, 'highlightDates', highlightDates);


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
