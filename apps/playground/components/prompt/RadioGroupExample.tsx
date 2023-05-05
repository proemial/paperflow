import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import {Radio, RadioGroup} from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import Divider from "@mui/joy/Divider";
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

export function RadioGroupExample() {
    return (<>

        <Divider />
        <Box sx={{ p: 2 }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography level="body2" textColor="text.primary">
                    Education
                </Typography>
                <IconButton
                    size="sm"
                    variant="plain"
                    color="primary"
                    sx={{ '--IconButton-size': '24px' }}
                >
                    <KeyboardArrowUpRoundedIcon fontSize="small" color="primary" />
                </IconButton>
            </Box>
            <Box sx={{ mt: 2 }}>
                <RadioGroup name="education" defaultValue="any">
                    <Radio label="Any" value="any" size="sm" />
                    <Radio label="High School" value="high-school" size="sm" />
                    <Radio label="College" value="college" size="sm" />
                    <Radio label="Post-graduate" value="post-graduate" size="sm" />
                </RadioGroup>
            </Box>
        </Box>
    </>);
}