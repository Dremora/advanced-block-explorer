import { Box, Button } from "@material-ui/core";
import { Radio, TextField } from "@material-ui/core";
import FormControl, { FormControlProps } from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import styled from "styled-components";

const StyledFormControl = styled(FormControl)<FormControlProps>`
  & .MuiFormGroup-root {
    flex-direction: row;
  }
`;

export function EvalEvmByteCode() {
  const [radioValue, setRadioValue] = React.useState("before");

  const handleRadioChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRadioValue((event.target as HTMLInputElement).value);
    },
    [setRadioValue]
  );

  const [evmByteCodeValue, setEvmByteCodeValue] = React.useState<
    string | undefined
  >();

  const handleEvmByteCodeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEvmByteCodeValue((event.target as HTMLInputElement).value);
    },
    [setEvmByteCodeValue]
  );

  const [codeValue, setCodeValue] = React.useState<string | undefined>();

  const handleCodeValue = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCodeValue((event.target as HTMLInputElement).value);
    },
    [setCodeValue]
  );

  return (
    <form
      noValidate
      autoComplete="off"
      id="eval-evm-byte-form"
      onSubmit={() => {
        console.log("submit");
      }}
    >
      <StyledFormControl>
        <FormLabel component="legend">Gas value</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={radioValue}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="before" control={<Radio />} label="Before" />
          <FormControlLabel value="after" control={<Radio />} label="After" />
        </RadioGroup>
      </StyledFormControl>

      <TextField
        id="evm-code"
        label="EVM Code in Hex"
        multiline
        fullWidth
        size="medium"
        variant="filled"
        value={evmByteCodeValue}
        onChange={handleEvmByteCodeChange}
        rows={10}
      />

      <Box paddingTop={2} />

      <TextField
        id="evm-code-2"
        label="Code"
        fullWidth
        size="medium"
        variant="filled"
        value={codeValue}
        onChange={handleCodeValue}
      />

      <Box paddingTop={1}>
        <Button
          variant="outlined"
          color="primary"
          type="submit"
          form="eval-evm-byte-form"
        >
          Run
        </Button>
      </Box>
    </form>
  );
}
