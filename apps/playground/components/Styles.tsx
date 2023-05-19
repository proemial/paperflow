import useScript from "@/utils/useScript";
import useAutoColorScheme from "./useAutoColorScheme";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import * as React from "react";

export default function Styles() {
  const status = useScript(`https://unpkg.com/feather-icons`);
  useAutoColorScheme();

  useEnhancedEffect(() => {
    // Feather icon setup: https://github.com/feathericons/feather#4-replace
    // @ts-ignore
    if (typeof feather !== "undefined") {
      // @ts-ignore
      feather.replace();
    }
  }, [status]);

  return (<>
    <GlobalStyles styles={{
      "[data-feather], .feather": {
        color: "var(--Icon-color)",
        margin: "var(--Icon-margin)",
        fontSize: "var(--Icon-fontSize, 20px)",
        width: "1em",
        height: "1em"
      }
    }} />
    <CssBaseline />
  </>);
}