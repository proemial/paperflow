"use client";
import { IngestionIndex } from "@/app/api/v2/ingestion/[[...args]]/route";
import { CircularProgress } from "@mui/joy";
import React from "react";
import { IngestionDatePicker } from "./date-picker";
import { ProcessedPapers } from "./processed-papers";

export default function Main({ args }: { args?: string }) {
  const data = useIngestionIndex(args);

  return (
    <div style={{
      width: '100%',
    }}>
      <div>
        {data?.date &&
          <h1 style={{ display: 'flex', gap: 16, marginBottom: 0 }}>
            {data?.date}
            <IngestionDatePicker date={data?.date} dates={data?.dates} />
          </h1>
        }
        {!data?.index &&
          <CircularProgress variant="solid" />
        }
        <ProcessedPapers index={data?.index || {}} />
      </div>
    </div>
  );
}

function useIngestionIndex(inputDate?: string) {
  const [ingestionIndex, setIngestionIndex] = React.useState<IngestionIndex>();

  React.useEffect(() => {
    (async () => {
      const res = await fetch(`/api/v2/ingestion/${inputDate || ''}`);
      const json = await res.json();

      setIngestionIndex(json);
    })();
  }, [inputDate]);

  return ingestionIndex;
}
