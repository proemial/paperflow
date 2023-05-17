import { Diversity2, Science } from '@mui/icons-material';
import { Tooltip } from '@mui/joy';
import GlobalStyles from '@mui/joy/GlobalStyles';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Sheet from '@mui/joy/Sheet';
import Link from 'next/link';

export default function FirstSidebar() {
  return (
    <Sheet
      className="FirstSidebar"
      variant="soft"
      color="primary"
      invertedColors
      sx={{
        position: {
          xs: 'fixed',
          md: 'sticky',
        },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s',
        height: '100dvh',
        width: 'var(--FirstSidebar-width)',
        top: 0,
        p: 1.5,
        py: 3,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      <GlobalStyles
        styles={{
          ':root': {
            '--FirstSidebar-width': '68px',
          },
        }}
      />
      <List sx={{ '--ListItem-radius': '8px', '--List-gap': '12px' }}>
        <ListItem>
          <ListItemButton>
            <Tooltip title="GPT playground">
              <Link href="/">
                <Diversity2 />
              </Link>
            </Tooltip>
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton>
            <Tooltip title="Old playground">
              <Link href="/old-playground">
                <Science />
              </Link>
            </Tooltip>
          </ListItemButton>
        </ListItem>
      </List>
    </Sheet>
  );
}
