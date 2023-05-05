import {Chip, ChipDelete} from "@mui/joy";
import Box from "@mui/joy/Box";

export function ChipExample() {
    return (
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip
                variant="soft"
                size="sm"
                endDecorator={<ChipDelete variant="soft" />}
                sx={{ '--Chip-radius': (theme) => theme.vars.radius.sm }}
            >
                UI designer
            </Chip>
        </Box>
    );
}