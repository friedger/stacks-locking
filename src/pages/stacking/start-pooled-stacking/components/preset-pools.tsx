import { IconEdit } from "@tabler/icons-react";
import {
  PoolName,
  Pool,
  PoxContract,
  PayoutMethod,
} from "../types-preset-pools";
import { IndefiniteStackingIcon } from "./indefinite-stacking-icon";

export const pools: Pool[] = [
  {
    name: PoolName.FastPool,
    description:
      "Friedger Autonomous Self-service Trust Pool allows to manage all pool operations automatically." +
      "You can increase the locking amount for the next cycle. Locked STX will unlock 1 day after the end of the cycle.",
    duration: 1,
    website: "https://pool.friedger.de",
    payoutMethod: PayoutMethod.STX,
    poolAddress: "ST000000000000000000002AMW42H.fp-delegation",
    poxContract: PoxContract.fpDelegation,
    icon: <IndefiniteStackingIcon />,
    allowCustomRewardAddress: false,
  },
  {
    name: PoolName.PlanBetter,
    description: "",
    duration: 1,
    website: "https://planbetter.org",
    payoutMethod: PayoutMethod.BTC,
    poolAddress: "ST000000000000000000002AMW42H",
    poxContract: PoxContract.poxDelegation,
    icon: <IndefiniteStackingIcon />,
    allowCustomRewardAddress: false,
  },
  {
    name: PoolName.Xverse,
    description: "",
    duration: 1,
    website: "https://www.xverse.app/",
    payoutMethod: PayoutMethod.BTC,
    poolAddress: "ST000000000000000000002AMW42H",
    poxContract: PoxContract.poxDelegation,
    icon: <IndefiniteStackingIcon />,
    allowCustomRewardAddress: true,
  },
];

export const customPool: {
  name: PoolName;
  description: string;
  icon: JSX.Element;
} = {
  name: PoolName.CustomPool,
  description:
    "Enter the STX address of the pool with which you’d like to Stack without your STX leaving your wallet.",
  icon: <IconEdit />,
};
