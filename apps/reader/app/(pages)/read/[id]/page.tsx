import { PaperflowCard } from "@/app/components/paperflow-card/card";
import { IngestionDao } from "data/db/ingestion-dao";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/shadcn-ui/Accordion";

export default async function ReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await IngestionDao.getByIdFromRedis(params.id);

  return (
    <div className="md:flex">
      <div className="m-2">
        <PaperflowCard {...data} />
      </div>
      <div className="max-sm:mt-2 md:border-l md:ml-2 md:h-[100dvh] md:w-full">
        <div className="flex justify-between border-zinc-300 max-sm:border-y md:border-b p-4">
          <div>Stats</div>
          <div className="flex gap-3">
            <div>💬 12</div>
            <div>♺ 38</div>
            <div>♡ 203</div>
            <div>▥ 19,4K</div>
          </div>
        </div>
        <div>
          <Accordion type="single" collapsible defaultValue="summary">
            <AccordionItem value="summary" className="px-4 py2">
              <AccordionTrigger>Summary</AccordionTrigger>
              <AccordionContent>{data.abstract}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="qa" className="px-4 py2">
              <AccordionTrigger>Ask a question</AccordionTrigger>
              <AccordionContent>...</AccordionContent>
            </AccordionItem>
            <AccordionItem value="related" className="px-4 py2">
              <AccordionTrigger>Related research</AccordionTrigger>
              <AccordionContent>...</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
