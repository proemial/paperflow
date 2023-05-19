"use client";
import { ParsedArxivItem } from "@/app/api/flow/prompt/route";
import { WithTextAndUsage } from "@/app/api/openai/gpt3/route";
import { AccordionContent, AccordionHeader } from "@/components/JoyAccordion";
import { InfoOutlined } from "@mui/icons-material";
import { Card, CircularProgress, Link, List, Tooltip } from "@mui/joy";
import Box from "@mui/joy/Box";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import * as Accordion from "@radix-ui/react-accordion";
import React from "react";

export function PromptOutputCard({ arxivOutput, modelOutput }: { arxivOutput: ParsedArxivItem, modelOutput?: WithTextAndUsage }) {
  return (
    <Card variant="outlined" sx={{ maxWidth: 320 }}>
      <CardOverflow sx={{ p: 0 }}>
        <List
          variant="outlined"
          component={Accordion.Root}
          type="multiple"
          sx={{
            borderRadius: "xs",
            "--ListDivider-gap": "0px",
            "--focus-outline-offset": "-2px",
          }}
        >
          <Accordion.Item value="item-1">
            <AccordionHeader isFirst>
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {`ABSTRACT: ${arxivOutput.contentSnippet}`}
              </div>
            </AccordionHeader>
            <AccordionContent>
              {arxivOutput.contentSnippet}
            </AccordionContent>
          </Accordion.Item>
        </List>
      </CardOverflow>
      <Typography level="h2" sx={{ fontSize: 'md', mt: 2 }}>
        <Link href={arxivOutput.link} target="_blank" color="neutral">{arxivOutput.title}</Link>
      </Typography>
      <Typography level="body2" sx={{ mt: 2, mb: 2 }}>
        {!modelOutput &&
          <Box sx={{ display: "flex", justifyContent: 'center' }}>
            <CircularProgress variant="solid" />
          </Box>
        }
        <WithTags text={modelOutput?.text} />
      </Typography>
      <Divider />
      <CardOverflow
        variant="soft"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 1.5,
          px: 'var(--Card-padding)',
          bgcolor: 'background.level1',
        }}
      >
        <Typography level="body3" sx={{
          fontWeight: 'md',
          color: 'text.secondary',
        }}>
          <div dangerouslySetInnerHTML={{ __html: arxivOutput.authors.join(", ") }} />
        </Typography>
        {modelOutput &&
          <Tooltip title={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 320,
                justifyContent: 'center',
                p: 1,
              }}
            >
              <div>Prompt tokens: {modelOutput.usage?.prompt_tokens}</div>
              <div>Completion tokens: {modelOutput.usage?.completion_tokens}</div>
              <div style={{ fontWeight: 'bold' }}>Total tokens: {modelOutput.usage?.total_tokens}</div>
            </Box>
          } variant="outlined">
            <InfoOutlined />
          </Tooltip>
        }
      </CardOverflow>
    </Card>
  );
}

function WithTags({ text }: { text?: string }) {
  if (!text) return null;

  const output = splitOnHash(text);

  return (<>
    {output.map((segment, i) => {
      if (segment.startsWith('#')) {
        return <span key={i}><Link sx={{ color: 'blue' }} key={i} href={`https://twitter.com/hashtag/${segment.replace('#', '').trim()}`} target="_blank" color="neutral">{segment}</Link> </span>
      } else {
        return <span key={i}>{segment}</span>
      }
    })}
  </>);
}

// https://twitter.com/hashtag/ClimateAction
function splitOnHash(text?: string) {
  const output: string[] = [];

  let str = '';
  text?.split(' ').forEach(word => {
    if (!word.startsWith('#')) {
      str += word + ' ';
    } else {
      if (str.length > 0) {
        output.push(str);
        str = '';
      }
      output.push(word + ' ');
    }
  });

  return output;
}
