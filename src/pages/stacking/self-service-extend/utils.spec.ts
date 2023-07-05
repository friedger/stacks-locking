import { PoxInfo } from '@stacks/stacking';
import { describe, expect, test } from 'vitest';

import { nextExtendWindow } from './utils';

describe(nextExtendWindow.name, () => {
  describe('it calculates windows for mainnet', () => {
    const poxInfo = {
      reward_cycle_length: 2100,
      prepare_phase_block_length: 100,
      first_burnchain_block_height: 666050,
    } as PoxInfo;

    test('at the start of the cycle', () => {
      const result = nextExtendWindow(666050, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1051);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-100);
    });
    test('100 blocks into the cycle', () => {
      const result = nextExtendWindow(666050 + 100, poxInfo);
      expect(result.tooEarly).toBeTruthy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(951);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-200);
    });

    test('at half into the cycle', () => {
      const result = nextExtendWindow(666050 + 1050, poxInfo);
      expect(result.tooEarly).toBeTruthy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-1150);
    });

    test('after half into the cycle', () => {
      const result = nextExtendWindow(666050 + 1050 + 1, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeFalsy();
      expect(result.extendWindow.blocksUntilStart).toEqual(2100);
      expect(result.extendWindow.blocksUntilEnd).toEqual(949);
    });

    test('before stacking deadline', () => {
      const result = nextExtendWindow(666050 + 2000 - 1, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeFalsy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1152);
      expect(result.extendWindow.blocksUntilEnd).toEqual(1);
    });

    test('at stacking deadline', () => {
      const result = nextExtendWindow(666050 + 2000, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1151);
      expect(result.extendWindow.blocksUntilEnd).toEqual(0);
    });

    test('at stacking deadline', () => {
      const result = nextExtendWindow(666050 + 2099, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1052);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-99);
    });

    test('at next cycle', () => {
      const result = nextExtendWindow(666050 + 2100, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1051);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-100);
    });
  });

  describe('it calculates windows for testnet', () => {
    const poxInfo = {
      reward_cycle_length: 1050,
      prepare_phase_block_length: 50,
      first_burnchain_block_height: 2000000,
    } as PoxInfo;

    test('at the start of the cycle', () => {
      const result = nextExtendWindow(2000000, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(526);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-50);
    });
    test('100 blocks into the cycle', () => {
      const result = nextExtendWindow(2000000 + 100, poxInfo);
      expect(result.tooEarly).toBeTruthy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(426);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-150);
    });

    test('at half into the cycle', () => {
      const result = nextExtendWindow(2000000 + 525, poxInfo);
      expect(result.tooEarly).toBeTruthy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-575);
    });

    test('after half into the cycle', () => {
      const result = nextExtendWindow(2000000 + 525 + 1, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeFalsy();
      expect(result.extendWindow.blocksUntilStart).toEqual(1050);
      expect(result.extendWindow.blocksUntilEnd).toEqual(474);
    });

    test('before stacking deadline', () => {
      const result = nextExtendWindow(2000000 + 1000 - 1, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeFalsy();
      expect(result.extendWindow.blocksUntilStart).toEqual(577);
      expect(result.extendWindow.blocksUntilEnd).toEqual(1);
    });

    test('at stacking deadline', () => {
      const result = nextExtendWindow(2000000 + 1000, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(576);
      expect(result.extendWindow.blocksUntilEnd).toEqual(0);
    });

    test('at stacking deadline', () => {
      const result = nextExtendWindow(2000000 + 1049, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(527);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-49);
    });

    test('at next cycle', () => {
      const result = nextExtendWindow(2000000 + 1050, poxInfo);
      expect(result.tooEarly).toBeFalsy();
      expect(result.tooLate).toBeTruthy();
      expect(result.extendWindow.blocksUntilStart).toEqual(526);
      expect(result.extendWindow.blocksUntilEnd).toEqual(-50);
    });
  });
});
