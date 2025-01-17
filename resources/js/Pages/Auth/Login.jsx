import { useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Iconify } from '@/Template/Components/iconify';
import { AuthLayout } from '@/Layouts/auth';
import { Head, useForm } from '@inertiajs/react';
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout>
            <Head title="Log in" />
            <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
                <Typography variant="h5">Iniciar sesión</Typography>
                <Typography variant="body2" color="text.secondary">
                    Ingresar sus credenciales
                </Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="flex-end">
                <form onSubmit={submit}>
                    <TextField
                        fullWidth
                        name="email"
                        label="Email"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3 }}
                        value={data.email}
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="new-email" // Evita autocompletar
                        error={!!errors.email}
                        helperText={errors.email}
                    />

                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        InputLabelProps={{ shrink: true }}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 3 }}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password" // Evita autocompletar
                        error={!!errors.password}
                        helperText={errors.password}
                    />

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        color="inherit"
                        variant="contained"
                        onClick={submit}
                        disabled={processing}
                    >
                        Iniciar sesión
                    </LoadingButton>
                </form>
            </Box>

            {status && (
                <>
                    <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
                        <Typography
                            variant="overline"
                            sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
                        >
                            Importante
                        </Typography>
                    </Divider>
                    <Typography
                            variant="overline"
                            sx={{ color: 'red', fontWeight: 'fontWeightMedium' }}
                        >
                            {status}
                    </Typography>
                </>
            )}
        </AuthLayout>
    );
}
