import { FormEvent, useState } from "react";
import { useMutation } from "react-query";

export const useEval = (blockHash: string, txIndex: number) => {
  const [state, setState] = useState({
    gasTimestamp: 0,
    code: "",
    credit: 10000,
  });

  const mutation = useMutation((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return fetch("/api/inject-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gasTimestamp: state.gasTimestamp,
        code: state.code,
        credit: state.credit,
        blockHash,
        txIndex,
      }),
    }).then((data) => data.json());
  });

  const setGasTimestamp = (gasTimestamp: number) =>
    setState({ ...state, gasTimestamp });

  const setCode = (code: string) => setState({ ...state, code });
  const setCredit = (credit: number) => setState({ ...state, credit });

  return {
    gasTimestamp: state.gasTimestamp,
    code: state.code,
    credit: state.credit,
    setGasTimestamp,
    setCode,
    setCredit,
    onSubmit: mutation.mutate,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data: JSON.stringify(mutation.data, null, 2),
  };
};
