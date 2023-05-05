import { atomFamily } from "recoil";
import { PromptInput } from "@/components/prompt/PromptForm";

export const promptInputState = atomFamily<PromptInput | undefined, string>({
  key: 'promptInputState',
  default: undefined,
});