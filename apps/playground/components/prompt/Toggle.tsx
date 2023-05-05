import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

export function Toggle({open, setOpen}: {open: boolean, setOpen: (open: boolean) => void}) {
    const handleClick = () => {
        setOpen(!open);
    }

    return (<>
        {open
            ? <KeyboardArrowDownRoundedIcon onClick={handleClick} fontSize="small" color="primary" />
            : <KeyboardArrowUpRoundedIcon onClick={handleClick} fontSize="small" color="primary" />
        }
    </>);
}