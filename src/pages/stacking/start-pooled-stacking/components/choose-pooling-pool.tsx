import { ExternalLink } from "@components/external-link";
import { Text, Stack } from "@stacks/ui";
import { useField } from "formik";
import { Description, Step } from "../../components/stacking-form-step";
import { PoolName, Pool } from "../types-preset-pools";
import { PoolSelectItem } from "./pool-select-item";
import { customPool, pools } from "./preset-pools";

interface ChoosePoolingPoolProps {
  onPoolChange: (val: PoolName) => void;
  handleAllowContractCallerSubmit(val: PoolName): void;
}
export function ChoosePoolingPool({
  onPoolChange,
  handleAllowContractCallerSubmit,
}: ChoosePoolingPoolProps) {
  const [fieldPoolName, , helpersPoolName] = useField("poolName");
  const onChange = (poolName: PoolName) => {
    helpersPoolName.setValue(poolName);
    onPoolChange(poolName);
  };
  return (
    <Step title="Pool">
      <Description>
        <Text>
          Select a pool to start stacking or{" "}
          <ExternalLink href="https://www.stacks.co/learn/stacking">
            discover others on stacks.co.
          </ExternalLink>
        </Text>
      </Description>

      <Stack spacing="base" mt="extra-loose">
        {pools.map((p: Pool, index: number) => (
          <PoolSelectItem
            name={p.name}
            icon={p.icon}
            description={p.description}
            key={index}
            activePoolName={fieldPoolName.value}
            onChange={onChange}
            handleAllowContractCallerSubmit={handleAllowContractCallerSubmit}
          />
        ))}
        <PoolSelectItem
          name={customPool.name}
          icon={customPool.icon}
          description={customPool.description}
          activePoolName={fieldPoolName.value}
          onChange={onChange}
        />
      </Stack>
    </Step>
  );
}
