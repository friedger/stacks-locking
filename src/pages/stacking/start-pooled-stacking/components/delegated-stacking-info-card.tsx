import { createAmountText } from '../../utils/create-amount-text';
import { EditingFormValues } from '../types';
import { Hr } from '@components/hr';
import {
  InfoCardGroup as Group,
  InfoCard,
  InfoCardLabel as Label,
  InfoCardRow as Row,
  InfoCardSection as Section,
  InfoCardValue as Value,
} from '@components/info-card';
import { useGetPoxInfoQuery } from '@components/stacking-client-provider/stacking-client-provider';
import { Box, FlexProps } from '@stacks/ui';
import { cyclesToBurnChainHeight } from '@utils/calculate-burn-height';
import { formatCycles } from '@utils/stacking';
import { truncateMiddle } from '@utils/tx-utils';
import { useFormikContext } from 'formik';
import { pools } from './preset-pools';
import { PoolingAmountInfo } from './pooling-amount-info';
import { ExternalLink } from '@components/external-link';
import { makeExplorerTxLink } from '@utils/external-links';
import { useNetwork } from '@components/network-provider';

export function PoolingInfoCard(props: FlexProps) {
  const f = useFormikContext<EditingFormValues>();
  const poxInfoQuery = useGetPoxInfoQuery();
  const { networkName } = useNetwork();

  const amount = f.values.amount;
  const delegationType = f.values.delegationDurationType;
  const poolName = f.values.poolName;
  const pool = poolName ? pools[poolName] : undefined;
  const poolStxAddress = pool?.poolAddress || f.values.poolAddress;
  const poxWrapperContract = pool?.poxContract || poxInfoQuery.data?.contract_id;
  const durationInCycles =
    f.values.delegationDurationType === 'limited' ? f.values.numberOfCycles : null;

  const burnHeight =
    durationInCycles && poxInfoQuery.data
      ? cyclesToBurnChainHeight({
          cycles: durationInCycles,
          rewardCycleLength: poxInfoQuery.data.reward_cycle_length,
          currentCycleId: poxInfoQuery.data.current_cycle.id,
          firstBurnchainBlockHeight: poxInfoQuery.data.first_burnchain_block_height,
        })
      : null;
  const amountText = createAmountText(amount);

  return (
    <>
      <InfoCard {...props}>
        <Box mx={['loose', 'extra-loose']} sx={{}}>
          <PoolingAmountInfo title="You'll pool up to" amountText={amountText} />

          <Hr />

          <Group mt="base-loose" mb="extra-loose">
            <Section>
              <Row>
                <Label explainer="How long you want to delegate to the pool. This is not necessarily the locking duration. However, the locking period cannot be longer than the delegation duration.">
                  Duration
                </Label>
                <Value>
                  {!delegationType && '—'}
                  {delegationType === 'limited' && formatCycles(durationInCycles ?? 0)}
                  {delegationType === 'indefinite' && 'Indefinite'}
                </Value>
              </Row>
            </Section>

            <Section>
              <Row>
                <Label explainer="How you want to delegate to the pool. This is not necessarily the locking duration. However, the locking period cannot be longer than the delegation duration.">
                  Type
                </Label>
                <Value>
                  {delegationType === null && '—'}
                  {delegationType === 'limited' && 'Limited permission'}
                  {delegationType === 'indefinite' && 'Indefinite'}
                </Value>
              </Row>

              {burnHeight && (
                <Row>
                  <Label>Burn height</Label>
                  <Value>{burnHeight}</Value>
                </Row>
              )}
            </Section>

            <Section>
              <Row>
                <Label explainer="This address is provided to you by your chosen pool for Stacking delegation specifically.">
                  Pool address
                </Label>
                <Value>{poolStxAddress ? truncateMiddle(poolStxAddress) : '—'}</Value>
              </Row>
              <Row>
                <Label>Contract</Label>
                <Value>
                  {poxWrapperContract && (
                    <ExternalLink href={makeExplorerTxLink(poxWrapperContract, networkName)}>
                      {truncateMiddle(poxWrapperContract)}
                    </ExternalLink>
                  )}
                </Value>
              </Row>
            </Section>
          </Group>
        </Box>
      </InfoCard>
    </>
  );
}
