"use client";

import { CssVarsProvider } from "@mui/joy/styles";
import * as React from "react";
import Header from "@/components/Header";
import FirstSidebar from "@/components/FirstSidebar";
import Box from "@mui/joy/Box";
import Styles from "@/components/Styles";
import { RecoilRoot } from "recoil";
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <RecoilRoot>
      <Analytics />
      <CssVarsProvider>
        <html lang="en">
          <body>
            <Styles />
            <Box sx={{ display: "flex", minHeight: "100dvh" }}>
              <Header />
              <FirstSidebar />
              <Box
                component="main"
                className="MainContent"
                sx={(theme) => ({
                  px: { xs: 2, md: 6 },
                  pt: {
                    xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
                    sm: `calc(${theme.spacing(2)} + var(--Header-height))`,
                    md: 3
                  },
                  pb: { xs: 2, sm: 2, md: 3 },
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                  height: "100%",
                  gap: 1
                })}
              >
                {children}
              </Box>
            </Box>
          </body>
        </html>
      </CssVarsProvider>
    </RecoilRoot>
  );
}
