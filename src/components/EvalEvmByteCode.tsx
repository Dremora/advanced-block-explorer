import { Box, Button, Divider } from "@material-ui/core";
import { Radio, TextField } from "@material-ui/core";
import FormControl, { FormControlProps } from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import styled from "styled-components";

import { Heading3 } from "src/components/Heading";
import { useEval } from "src/hooks/useEval";

import { GasRange } from "./TransactionTree";

const StyledFormControl = styled(FormControl)<FormControlProps>`
  & .MuiFormGroup-root {
    flex-direction: row;
  }
`;

const ResultWrapper = styled.div`
  display: flex;
  overflow: scroll;
  max-height: 250px;
`;

type Props = {
  gasRange: GasRange;
  transactionIndex: number;
};

export function EvalEvmByteCode({ gasRange, transactionIndex }: Props) {
  const evalData = useEval(transactionIndex, gasRange[0]);

  const handleCreditChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      evalData.setCredit(parseInt((event.target as HTMLInputElement).value));
    },
    [evalData]
  );

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    evalData.setGasTimestamp(
      parseInt((event.target as HTMLInputElement).value)
    );
  };

  const handleEvmByteCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    evalData.setCode((event.target as HTMLInputElement).value);
  };

  return (
    <form
      noValidate
      autoComplete="off"
      id="eval-evm-byte-form"
      onSubmit={evalData.onSubmit}
    >
      <StyledFormControl>
        <FormLabel component="legend">Gas value</FormLabel>
        <RadioGroup
          name="gender1"
          value={evalData.gasTimestamp.toString()}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value={gasRange[0].toString()}
            control={<Radio />}
            label={`Before: ${gasRange[0]}`}
          />
          <FormControlLabel
            value={gasRange[1].toString()}
            control={<Radio />}
            label={`After: ${gasRange[1]}`}
          />
        </RadioGroup>
      </StyledFormControl>

      <TextField
        id="evm-code"
        label="EVM Code in Hex"
        multiline
        fullWidth
        size="medium"
        variant="filled"
        value={evalData.code}
        onChange={handleEvmByteCodeChange}
        rows={10}
      />

      <Box paddingTop={2} />

      <TextField
        id="evm-code-2"
        label="Credit"
        fullWidth
        size="medium"
        variant="filled"
        value={evalData.credit}
        onChange={handleCreditChange}
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

      {evalData.data && (
        <>
          <Box paddingTop={1} />
          <Divider />
          <Box paddingTop={1} />

          <Heading3>Result</Heading3>

          <ResultWrapper>
            <pre>{evalData.data}</pre>
          </ResultWrapper>
        </>
      )}
    </form>
  );
}
