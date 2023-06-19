import { arxivCategories } from 'data/adapters/arxiv/arxiv.models';
import { Add, PlayArrow, Remove } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  Input,
  List,
  Option,
  Select,
  Table,
} from '@mui/joy';
import Box from '@mui/joy/Box';
import * as Accordion from '@radix-ui/react-accordion';
import { FieldArray, FieldHookConfig, Formik, useField } from 'formik';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import * as yup from 'yup';
import { AccordionContent, AccordionHeader } from '@/components/JoyAccordion';
import { GptInput } from '@/state/promptInputState';
// import Checkbox from '@mui/joy/Checkbox';
import Switch from '@mui/joy/Switch';

type Props = {
  initialValues: GptInput;
  onSubmit: (values: GptInput) => void;
  disabled: boolean;
};

export function PromptForm({ initialValues, onSubmit }: Props) {
  const validationSchema = yup.object({
    category: yup.object().required(),
    count: yup.number().min(1).max(10).required(),
    gpt4: yup.boolean(),
    messages: yup
      .array()
      .min(1)
      .max(10)
      .of(
        yup.object({
          role: yup.string().required(),
          content: yup.string().required(),
        }),
      ),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(props) => (
        <form onSubmit={props.handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <List
              variant="outlined"
              component={Accordion.Root}
              type="multiple"
              sx={{
                borderRadius: 'xs',
                '--ListDivider-gap': '0px',
                '--focus-outline-offset': '-2px',
              }}
            >
              <Accordion.Item value="item-1">
                <AccordionHeader isFirst>
                  <b>
                    {props.values.count}x {props.values.category.title}
                  </b>
                  :{' '}
                  <i>
                    &quot;
                    {props.values.messages.length > 0 &&
                      props.values.messages[props.values.messages.length - 1]
                        .content}
                    &quot;
                  </i>
                </AccordionHeader>
                <AccordionContent>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      gap: 1,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Autocomplete
                      sx={{ flex: 0.9 }}
                      id="category"
                      name="category"
                      placeholder="Arxiv categories"
                      options={arxivCategories}
                      value={props.values.category}
                      groupBy={(option) => option.category}
                      getOptionLabel={(option) => option.title}
                      onChange={(event, value) => {
                        props.setFieldValue('category', value);
                      }}
                      error={!!props.errors.category}
                    />
                    <Box
                      sx={{
                        flex: 0.1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        justifyContent: 'flex-end',
                      }}
                    >
                      GPT-4:
                      <Switch
                        id="gpt4"
                        onChange={props.handleChange}
                        checked={props.values.gpt4}
                      />
                      {/* <Checkbox
                        id="gpt4"
                        defaultChecked={props.values.gpt4}
                        onChange={props.handleChange}
                        error={!!props.errors.gpt4}
                      /> */}
                      Count:
                      <Input
                        type="number"
                        id="count"
                        value={props.values.count}
                        onChange={props.handleChange}
                        error={!!props.errors.count}
                        slotProps={{
                          input: {
                            min: 1,
                            max: 10,
                            step: 1,
                          },
                        }}
                      />
                      <Button
                        disabled={!props.isValid}
                        type="submit"
                        loadingPosition="end"
                        endDecorator={<PlayArrow />}
                        variant="outlined"
                        color="neutral"
                        sx={{ width: 96 }}
                      >
                        GO
                      </Button>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    {props.errors.messages && (
                      <div style={{ color: 'red' }}>Missing prompt message</div>
                    )}
                    <Table>
                      <tbody>
                        {/* @ts-ignore */}
                        <FieldArray name="messages">
                          {(arrayHelpers) => (
                            <>
                              {props.values.messages.map((message, index) => {
                                return (
                                  <tr key={index}>
                                    <td style={{ width: 140 }}>
                                      <FormikSelect
                                        name={`messages.${index}.role`}
                                        defaultValue={message.role}
                                      />
                                    </td>
                                    <td>
                                      <FormikInput
                                        name={`messages.${index}.content`}
                                        defaultValue={message.content}
                                        style={{ fontStyle: 'italic' }}
                                      />
                                    </td>
                                    <td style={{ width: 70 }}>
                                      <Button
                                        type="button"
                                        variant="outlined"
                                        color="neutral"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        <Remove />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr>
                                <td colSpan={2}>
                                  Roles: <b>&quot;User&quot;:</b> You or whoever
                                  is chatting/asking questions to chat gpt,{' '}
                                  <b>&quot;Assistant&quot;:</b> Open AI(chat
                                  gpt) server - who is replying to
                                  your(&quot;user&quot; role) questions,{' '}
                                  <b>&quot;System&quot;:</b> The system
                                  developer who can give some internal
                                  instructions for the conversation. developers
                                  can provide option for user input also which
                                  depends on the system requirements.
                                </td>
                                <td
                                  style={{
                                    textAlign: 'right',
                                    paddingRight: 4,
                                  }}
                                >
                                  <Button
                                    type="button"
                                    variant="outlined"
                                    color="neutral"
                                    onClick={() =>
                                      arrayHelpers.push({
                                        role: ChatCompletionRequestMessageRoleEnum.System,
                                        content: '',
                                      })
                                    }
                                  >
                                    <Add />
                                  </Button>
                                </td>
                              </tr>
                            </>
                          )}
                        </FieldArray>
                      </tbody>
                    </Table>
                  </Box>
                </AccordionContent>
              </Accordion.Item>
            </List>
          </Box>
        </form>
      )}
    </Formik>
  );
}

const FormikInput = (props: FieldHookConfig<string>) => {
  const [field] = useField(props);

  return <Input {...field} placeholder={props.placeholder} type={props.type} />;
};

const FormikSelect = (props: FieldHookConfig<string>) => {
  const [field, meta, helpers] = useField(props);

  return (
    <Select
      {...field}
      placeholder={props.placeholder}
      onChange={(e, value) => helpers.setValue(value || '')}
    >
      <Option value="system">System</Option>
      <Option value="assistant">Assistant</Option>
      <Option value="user">User</Option>
    </Select>
  );
};
