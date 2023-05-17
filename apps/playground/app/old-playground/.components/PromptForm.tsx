import Box from "@mui/joy/Box";
import { Autocomplete, Button, Input, List, Select, Slider, Textarea } from "@mui/joy";
import Option from "@mui/joy/Option";
import { arxivCategories } from "@/utils/arxivCategories";
import { useFormik } from "formik";
import * as yup from "yup";
import * as Accordion from "@radix-ui/react-accordion";
import { AccordionContent, AccordionHeader } from "@/components/JoyAccordion";
import { PlayArrow } from "@mui/icons-material";
import { Md5 } from "ts-md5";
import { DavinciInput } from "@/state/promptInputState";

type Props = {
  initialValues: DavinciInput,
  onSubmit: (values: DavinciInput) => void,
  disabled: boolean
};

function useIsDirty(initialValues: DavinciInput, formValues: DavinciInput) {
  return Md5.hashStr(JSON.stringify(initialValues)) !== Md5.hashStr(JSON.stringify(formValues));
}

export function PromptForm({ initialValues, onSubmit, disabled }: Props) {
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: yup.object({
      category: yup.object().required(),
      count: yup.number().min(1).max(10).required(),
      model: yup.string().required(),
      temperature: yup.number().min(0).max(1).required(),
      maxTokens: yup.number().min(0).max(500).required(),
      prompt: yup.string().required(),
      role: yup.string().required()
    }),
    onSubmit: onSubmit
  });
  const isDirty = useIsDirty(initialValues, formik.values);
  const isChat = formik.values.model === "gpt-3.5-turbo";

  return (<form onSubmit={formik.handleSubmit}>
    <Box sx={{ display: "flex", gap: 2 }}>
      <List
        variant="outlined"
        component={Accordion.Root}
        type="multiple"
        sx={{
          borderRadius: "xs",
          "--ListDivider-gap": "0px",
          "--focus-outline-offset": "-2px"
        }}
      >
        <Accordion.Item value="item-1">
          <AccordionHeader isFirst>
            {formik.values.category && `${formik.values.category.title}, `} {formik.values.model},
            {!isChat && <span> temp: {formik.values.temperature}, max-tokens: {formik.values.maxTokens}</span>}
            {isChat && <span> role: {formik.values.role}</span>}
          </AccordionHeader>
          <AccordionContent>
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <Autocomplete
                sx={{ flex: 0.9 }}
                id="category"
                name="category"
                placeholder="Arxiv categories"
                options={arxivCategories}
                value={formik.values.category}
                groupBy={(option) => option.category}
                getOptionLabel={(option) => option.title}
                // onChange={formik.handleChange}
                onChange={(event, value) => {
                  formik.setFieldValue("category", value);
                }}
                error={!!formik.errors.category}
              />
              <Box sx={{ flex: 0.1, display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                Count:
                <Input
                  type="number"
                  id="count"
                  value={formik.values.count}
                  onChange={formik.handleChange}
                  error={!!formik.errors.count}
                  slotProps={{
                    input: {
                      min: 1,
                      max: 10,
                      step: 1
                    }
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Select
                value={formik.values.model}
                placeholder="Model"
                // onChange={formik.handleChange}
                onChange={(event, value) => {
                  formik.setFieldValue("model", value);
                }}
              >
                <Option value="text-davinci-003">text-davinci-003</Option>
                <Option value="gpt-3.5-turbo">gpt-3.5-turbo</Option>
              </Select>
            </Box>
            {!isChat &&
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 1 }}>
                  Temperature:
                  <Slider
                    valueLabelFormat={(value) => `Temperature: ${value}`}
                    value={formik.values.temperature}
                    marks={[
                      { value: 0, label: "0" },
                      { value: 0.1, label: formik.values.temperature === 0.1 && "0.1" },
                      { value: 0.2, label: formik.values.temperature === 0.2 && "0.2" },
                      { value: 0.3, label: formik.values.temperature === 0.3 && "0.3" },
                      { value: 0.4, label: formik.values.temperature === 0.4 && "0.4" },
                      { value: 0.5, label: formik.values.temperature === 0.5 && "0.5" },
                      { value: 0.6, label: formik.values.temperature === 0.6 && "0.6" },
                      { value: 0.7, label: formik.values.temperature === 0.7 && "0.7" },
                      { value: 0.8, label: formik.values.temperature === 0.8 && "0.8" },
                      { value: 0.9, label: formik.values.temperature === 0.9 && "0.9" },
                      { value: 1, label: "1" }
                    ]}
                    step={0.1}
                    min={0}
                    max={1}
                    // onChange={formik.handleChange}
                    onChange={(event, value) => {
                      formik.setFieldValue("temperature", value);
                    }}
                  />
                </Box>
                <Box sx={{ flex: 0.3, display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                  Max. tokens:
                  <Input
                    type="number"
                    id="maxTokens"
                    value={formik.values.maxTokens}
                    onChange={formik.handleChange}
                    error={!!formik.errors.maxTokens}
                    slotProps={{
                      input: {
                        min: 10,
                        max: 500,
                        step: 10
                      }
                    }}
                  />
                </Box>
              </Box>
            }
            {isChat &&
              <Box sx={{ mt: 2 }}>
                <Textarea
                  sx={{ fontStyle: "italic" }}
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  error={!!formik.errors.role}
                  minRows={2}
                />
              </Box>
            }
          </AccordionContent>
        </Accordion.Item>
      </List>
      <Button
        loading={disabled}
        type="submit"
        loadingPosition="end"
        endDecorator={<PlayArrow />}
        variant="outlined"
        color="neutral"
        sx={{ width: 96 }}
        disabled={!formik.isValid || !isDirty}
      >
        GO
      </Button>
    </Box>

    <Box sx={{ mt: 2 }}>
      <Textarea
        sx={{ fontStyle: "italic" }}
        name="prompt"
        value={formik.values.prompt}
        onChange={formik.handleChange}
        error={!!formik.errors.prompt}
        minRows={2}
      />
    </Box>
  </form>);
}
