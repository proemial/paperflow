import { PaperflowCard } from "@/app/components/paperflow-card/card";
import { PapersDao } from "data/storage/papers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/shadcn-ui/Accordion";
import { RelatedResearch } from "./related";
import Spinner from "@/app/components/spinner";
import { Suspense } from "react";

export default async function ReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const paper = await PapersDao.getArXivAtomPaper(params.id);

  return (
    <div className="lg:flex">
      <div className="flex-1">
        <div className="m-2 lg:m-4">
          {/* @ts-expect-error Server Component */}
          <PaperflowCard id={params.id} useLink />
        </div>
        <div className="border-t max-lg:hidden p-4 mt-4">
          {paper?.parsed.abstract}
        </div>
      </div>
      <div className="max-md:mt-2 lg:border-l lg:h-[100dvh] lg:w-full lg:max-w-[420px]">
        <div className="flex justify-between max-md:border-y lg:border-b p-4">
          <div>Stats</div>
          <div className="flex gap-3">
            <div>💬 12</div>
            <div>♺ 38</div>
            <div>♡ 203</div>
            <div>▥ 19,4K</div>
          </div>
        </div>
        <div>
          <Accordion type="single" collapsible defaultValue="related">
            <AccordionItem value="summary" className="px-4 py2 lg:hidden">
              <AccordionTrigger>Summary</AccordionTrigger>
              <AccordionContent>{paper?.parsed.abstract}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="qa" className="px-4 py2">
              <AccordionTrigger>Ask a question</AccordionTrigger>
              <AccordionContent>...</AccordionContent>
            </AccordionItem>
            <AccordionItem value="related" className="px-4 py2">
              <AccordionTrigger>Related research</AccordionTrigger>
              <AccordionContent>
                <Suspense fallback={<Spinner />}>
                  {/* @ts-expect-error Server Component */}
                  <RelatedResearch id={params.id} category={paper?.parsed.category} />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
