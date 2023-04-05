import packageJson from '../package.json';

export const MICROBLOCKS_ENABLED = true;

export const IS_BROWSER = typeof document !== 'undefined';

export const DEFAULT_V2_INFO_ENDPOINT = '/v2/info';

export const APP_DETAILS = {
  name: 'Stacking',
  icon: `${window.location.origin}/logo.svg`,
};

export const X_API_KEY = '';

export const DEFAULT_MAINNET_SERVER = 'https://api.hiro.so';

export const DEFAULT_TESTNET_SERVER = 'https://api.testnet.hiro.so';

export const DEFAULT_DEVNET_SERVER = 'http://localhost:3999';

export const VERSION = packageJson.version;
