/**
 * The date at which the provided burn block height is reached. If the block has already been mined, the date is the date at which it was mined. If it has not yet been mined, the date is an estimation.
 */
export async function burnHeight(height: number, currentBurnBlockHeight: number) {
  // Approx algo,
  // Get current block height (param?)
  // Get desired block height time: param
  // IF desired < current
  if (height < currentBurnBlockHeight) {
    // TODO
  }
  /* const currentBurnBlockHeight = 0; */
  /* return { */
  /*   isExact: true, */
  /*   date: new Date(), */
  /* }; */
}

export function firstCycleStart() {}
export function lastCycleEnd() {}
export function cycleStart(id: string) {}
export function cycleEnd(id: string) {}
