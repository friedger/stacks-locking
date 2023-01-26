import { UI_IMPOSED_MAX_STACKING_AMOUNT_USTX } from '@constants/app';
import { toHumanReadableStx, stxToMicroStx } from '@utils/unit-convert';

export function createAmountText(amountStx: string | number | bigint) {
  if (amountStx === '') return toHumanReadableStx(0);

  const amountMicroStx = stxToMicroStx(amountStx);
  if (amountMicroStx.isNaN() || amountMicroStx.gt(UI_IMPOSED_MAX_STACKING_AMOUNT_USTX)) return '—';

  return toHumanReadableStx(amountMicroStx);
}
