
import { AccordionContent, AccordionHeader } from "@/components/JoyAccordion";
import { List } from "@mui/joy";
import * as Accordion from "@radix-ui/react-accordion";
import { Categorised } from "./main";

export function UnprocessedPapers({ cats }: { cats: Categorised }) {
  return (<>
    {cats &&
      <List
        component={Accordion.Root}
        type="multiple"
        sx={{ "--ListDivider-gap": "0px", border: '1px solid lightgrey', borderRadius: 8, marginLeft: 1, marginRight: 1, marginTop: 2, marginBottom: 2 }}
      >
        <Accordion.Item value="item-1">
          <AccordionHeader isFirst>
            Unprocessed papers
          </AccordionHeader>
          <AccordionContent>
            {Object.keys(cats).filter(catKey => cats[catKey].processed.length === 0).sort().map(catKey => (
              <div key={catKey}>
                <b>{catKey}:</b> {cats[catKey].unprocessed.map(paper => paper.parsed.id).join(', ')}
              </div>
            ))}
          </AccordionContent>
        </Accordion.Item>
      </List>
    }
  </>)
}
