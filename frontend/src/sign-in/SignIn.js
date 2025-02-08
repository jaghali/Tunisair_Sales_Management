import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword';
import AppTheme from '../shared-theme/AppTheme';
import axios from 'axios';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

export default function SignIn(props) {
    const [matricule, setMatricule] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!matricule || !password) {
            setErrorMessage('Both fields are required.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                matricule,
                password,
            });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/dashboard';
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Invalid credentials.');
        }
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Stack direction="column" justifyContent="center" alignItems="center" height="100vh">
                <Card variant="outlined">
                    <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl>
                            <FormLabel htmlFor="matricule">Matricule</FormLabel>
                            <TextField
                                id="matricule"
                                type="text"
                                name="matricule"
                                placeholder="Enter your matricule"
                                required
                                fullWidth
                                value={matricule}
                                onChange={(e) => setMatricule(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                id="password"
                                name="password"
                                placeholder="••••••"
                                type={showPassword ? 'text' : 'password'}
                                required
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                        <FormControlLabel control={<Checkbox />} label="Remember me" />
                        <ForgotPassword open={open} handleClose={() => setOpen(false)} />
                        <Button type="submit" fullWidth variant="contained">
                            Sign in
                        </Button>
                        <Link component="button" type="button" onClick={() => setOpen(true)} variant="body2">
                            Forgot your password?
                        </Link>
                    </Box>
                    <Divider>or</Divider>
                    <Typography textAlign="center">
                        Don&apos;t have an account? <Link href="/register">Sign up</Link>
                    </Typography>
                </Card>
            </Stack>
        </AppTheme>
    );
}
