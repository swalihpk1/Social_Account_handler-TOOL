import { Box, Button, Container, TextField, Stack, ThemeProvider, Typography } from "@mui/material";
import theme from "./theme";


const Login = () => {
    // const steps = ['Step 1', 'Step 2'];



    return (
        <Container
            component="main"
            maxWidth={false}
            disableGutters
            sx={{
                background: 'linear-gradient(90deg, #43528C, #203170)',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                position: 'fixed',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
            }}
        >
            <Stack
                sx={{
                    m: 5,
                    border: '2px solid white',
                    borderRadius: 2,
                    width: '85%',
                    height: '85%',
                    flexDirection: 'row',
                    boxSizing: 'border-box',
                }}
            >
                <Box
                    sx={{
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItem: 'center'
                    }}
                >
                    <img src="LoginImage.jpg" alt="" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '10px' }} />
                </Box>
                <Stack
                    sx={{
                        width: '50%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end', // Align content to bottom
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '20px',
                    }}
                >


                    <Typography variant="h6" color='whitesmoke'>
                        Step 1 of 2
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                        <Box sx={{ width: '100px', height: '4px', backgroundColor: '#57D7FF'}} />
                        <Box sx={{ width: '100px', height: '4px', backgroundColor: 'whitesmoke' }} />
                    </Stack>
                  
                    <ThemeProvider theme={theme}>
                       
                        <Box
                            sx={{
                                width: '100%', // Set width to 100% for responsiveness
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                margin: 'auto',
                            }}
                        >
                           
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2, width: '70%' }}
                            />
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2, width: '70%' }}
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2, width: '70%' }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, width: '70%' }}
                            // onClick={handleNext}
                            >
                                Next
                            </Button>
                        </Box>
                    </ThemeProvider>
                </Stack>

            </Stack>
        </Container>

    );
};

export default Login;