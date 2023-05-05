import Typography from "@mui/joy/Typography";
import {Button} from "@mui/joy";
import Box from "@mui/joy/Box";

export function ClearFiltersExample() {
    return (<Box
        sx={{
            p: 2,
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}
    >
        <Typography
            fontSize="xs2"
            textColor="text.tertiary"
            textTransform="uppercase"
            letterSpacing="md"
            fontWeight="lg"
        >
            Filter by
        </Typography>
        <Button size="sm" variant="plain" sx={{ fontSize: 'xs', px: 1 }}>
            Clear filters
        </Button>
    </Box>);
}