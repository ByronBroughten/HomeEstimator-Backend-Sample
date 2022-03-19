import { Box } from "@material-ui/core";
import React, { ChangeEvent, ReactNode } from "react";

export type StandardProps = { className?: string; children?: React.ReactNode };
export type StandardBtnProps = StandardProps & { onClick?: () => void };
export type StandardSelectProps = StandardProps & {
  name: string;
  value: string;
  onChange:
    | ((
        event: ChangeEvent<{
          name?: string | undefined;
          value: unknown;
        }>,
        child: ReactNode
      ) => void)
    | undefined;
  className?: string;
};
