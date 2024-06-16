import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const ConnectedBTN = styled(Button)(({ }) => ({
    width: "90%",
    padding: '5px',
    paddingLeft: '10px',
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 2,
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
    textTransform: 'none',
}));