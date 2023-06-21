import { useEffect } from 'react';

import { StackingClient } from '@stacks/stacking';
import { useFormikContext } from 'formik';
import { PooledStackerFormValues } from 'src/types/stacking';

import { useGetAccountExtendedBalancesWithClientQuery } from '@components/stacking-client-provider/stacking-client-provider';
import { useStacksNetwork } from '@hooks/use-stacks-network';

import { useDelegationStatusForUserQuery } from '../pooled-stacking-info/use-delegation-status-query';
import { StackingFormChild, StackingFormContainer } from './stacking-form-container';

export function StackingForUserFormContainer({
  address,
  children,
}: {
  address: string;
  children: StackingFormChild | StackingFormChild[];
}) {
  const { setFieldValue } = useFormikContext<PooledStackerFormValues>();
  const { network } = useStacksNetwork();
  const client = new StackingClient(address, network);
  const getAccountExtendedBalancesQuery = useGetAccountExtendedBalancesWithClientQuery(client);
  const getDelegationStatusQuery = useDelegationStatusForUserQuery({
    client,
    address,
    network,
  });

  useEffect(() => {
    if (!getDelegationStatusQuery.data || !getAccountExtendedBalancesQuery.data) {
      return;
    }
    setFieldValue('lockedAmount', getAccountExtendedBalancesQuery.data.stx.locked);
    setFieldValue('totalAmount', getAccountExtendedBalancesQuery.data.stx.balance);
    setFieldValue('delegated', getDelegationStatusQuery.data.delegated);

    if (getDelegationStatusQuery.data.delegated) {
      setFieldValue('delegatedAmount', getDelegationStatusQuery.data.details.amount_micro_stx);
      setFieldValue('delegatedTo', getDelegationStatusQuery.data.details.delegated_to);
    } else {
      setFieldValue('delegatedAmount', 0n);
      setFieldValue('delegatedTo', '');
    }
  }, [setFieldValue, getAccountExtendedBalancesQuery.data, getDelegationStatusQuery.data]);

  return <StackingFormContainer>{children}</StackingFormContainer>;
}
