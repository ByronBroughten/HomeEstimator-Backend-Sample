import { Box, SxProps, Typography } from "@mui/material";
import { nativeTheme } from "../../theme/nativeTheme";

type Props = { className?: string; sx?: SxProps; text: React.ReactNode };
export function SectionTitle({ className, sx, text }: Props) {
  return (
    <Box className={className} sx={sx}>
      <Typography
        {...{
          fontSize: nativeTheme.fs20,
          color: nativeTheme.primary.main,
          // fontFamily: "Source Sans Pro",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
