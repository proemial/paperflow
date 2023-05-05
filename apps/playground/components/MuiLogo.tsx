import * as React from 'react';
import AspectRatio, {AspectRatioProps} from '@mui/joy/AspectRatio';
import {SmartToySharp} from "@mui/icons-material";

export default function MuiLogo({ sx, ...props }: AspectRatioProps) {
  return (
    <AspectRatio
      ratio="1"
      variant="plain"
      {...props}
      sx={[
        {
          width: 36,
          borderRadius: 'sm',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <div>
          <SmartToySharp />
      </div>
    </AspectRatio>
  );
}
