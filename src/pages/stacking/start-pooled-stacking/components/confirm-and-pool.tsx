import validate from 'bitcoin-address-validation';
import { useFormikContext } from 'formik';
import { useState } from 'react';

import { Action, Step } from '../../components/stacking-form-step';
import { StackingUserConfirm } from '../../components/stacking-user-confirm';
import { EditingFormValues } from '../types';
import { Pox2Contract } from '../types-preset-pools';
import { HandleAllowContractCallerArgs } from '../utils-allow-contract-caller';
import { DelegatedStackingTerms } from './delegated-stacking-terms';
import { PoolContractAllow } from './pool-contract-allow';
import { pools } from './preset-pools';

interface Props {
  isLoading: boolean;
  requiresAllowContractCaller: boolean;
  allowContractCallerTxId: string | undefined;
  handleFirstSubmit: (val: HandleAllowContractCallerArgs) => Promise<void>;
}
export function ConfirmAndSubmit({
  isLoading,
  requiresAllowContractCaller,
  allowContractCallerTxId,
  handleFirstSubmit,
}: Props) {
  const [hasUserConfirmed, setHasUserConfirmed] = useState(false);
  const f = useFormikContext<EditingFormValues>();
  return (
    <Step title="Confirm and pool">
      <DelegatedStackingTerms mt="loose" />
      <StackingUserConfirm onChange={useConfirmed => setHasUserConfirmed(useConfirmed)} />
      {requiresAllowContractCaller && f.values.poolName && (
        <PoolContractAllow
          poolName={f.values.poolName}
          handleSubmit={async (poxWrapperContract: Pox2Contract) => {
            await handleFirstSubmit({
              poxWrapperContract,
              onFinish: () => Promise.resolve(),
            });
          }}
        />
      )}
      <Action
        type="submit"
        isLoading={isLoading}
        isDisabled={!hasUserConfirmed || (requiresAllowContractCaller && !allowContractCallerTxId)}
      >
        Confirm and start pooling
      </Action>
    </Step>
  );
}
