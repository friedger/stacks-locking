import { figmaTheme, palette } from '@constants/figma-theme';
import { Box } from '@stacks/ui';

export function Hero() {
  return (
    <Box padding="12px">
      <Box
        backgroundColor={palette.gray900}
        borderRadius="12px"
        px={['12px', '34px', '60px', '88px']}
        py={['12px', '34px', '60px', '88px']}
        maxWidth="1200px"
        margin="auto"
        mt="48px"
        backgroundImage={['inherit', 'inherit', `url("welcome.png")`, `url("welcome.png")`]}
        backgroundRepeat="no-repeat"
        backgroundPosition="right"
        backgroundSize="auto 100%"
      >
        <Box maxWidth={['100%', '100%', '60%', `calc(100% - 500px)`]}>
          <Box fontSize="40px" weight={500} color={figmaTheme.textOnPrimary} pb="24px">
            What is Stacking?
          </Box>
          {/* <img src="welcome.png" /> */}
          <Box fontSize="20px" color={figmaTheme.textOnPrimary} pb="24px">
            By stacking, you temporarily lock up your tokens in order to provide valuable
            information to Stacks&apos; consensus mechanism. In return, you are eligible to receive
            rewards in the form of BTC
          </Box>
          <Box fontSize="16px" color={figmaTheme.textSubdued}>
            If you meet the protocol minimum, you can Stack your STX independently by directly
            interacting with the protocol. You also have the option to delegate your STX to a
            stacking pool provider.
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
