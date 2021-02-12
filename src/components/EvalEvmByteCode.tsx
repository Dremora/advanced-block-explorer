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

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };

  const [evmByteCodeValue, setEvmByteCodeValue] = React.useState<
    string | undefined
  >();

  const handleEvmByteCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEvmByteCodeValue((event.target as HTMLInputElement).value);
  };

  return (
    <form noValidate autoComplete="off">
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
      />

      <Box paddingTop={1}>
        <Button variant="outlined" color="primary">
          Run
        </Button>
      </Box>
    </form>
  );
}
