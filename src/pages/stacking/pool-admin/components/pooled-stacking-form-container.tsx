import { validateStacksAddress } from '@stacks/transactions';
import { useFormikContext } from 'formik';
import { PooledStackerFormValues } from 'src/types/stacking';

import { StackingForUserFormContainer } from '../../components/stacking-for-user-form-container';
import { StackingFormChild, StackingFormContainer } from '../../components/stacking-form-container';

export function PooledStackingFormContainer({
  children,
}: {
  children: StackingFormChild | StackingFormChild[];
}) {
  const { values } = useFormikContext<PooledStackerFormValues>();
  const address = values.stacker;
  const isValidStacker = validateStacksAddress(address);

  return (
    <>
      {isValidStacker ? (
        <StackingForUserFormContainer address={address}>{children}</StackingForUserFormContainer>
      ) : (
        <StackingFormContainer>{children}</StackingFormContainer>
      )}
    </>
  );
}
