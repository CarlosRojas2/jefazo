import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
// import { RouterLink } from 'src/routes/components';
import { stylesMode } from '@/Theme/styles';
import { Logo } from '@/Template/Components/logo';
import { Main } from './main';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';

// ----------------------------------------------------------------------

export function AuthLayout({ sx, children, header }) {
    const layoutQuery = 'md';
    return (
        <LayoutSection
            /** **************************************
            * Header
            *************************************** */
            headerSection={
                <HeaderSection
                    layoutQuery={layoutQuery}
                    slotProps={{
                        container: { maxWidth: false },
                        toolbar: { sx: { bgcolor: 'transparent', backdropFilter: 'unset' } },
                    }}
                    sx={{
                        position: { [layoutQuery]: 'fixed' },
                        ...header?.sx,
                    }}
                    slots={{
                        topArea: (
                            <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                                This is an info Alert.
                            </Alert>
                        ),
                        // leftArea: <Logo />,
                        // rightArea: (
                        //     <Link
                        //         href="#"
                        //         color="inherit"
                        //         sx={{ typography: 'subtitle2' }}
                        //     >
                        //         Need help?
                        //     </Link>
                        // ),
                    }}
                />
            }
        /** **************************************
        * Footer
        *************************************** */
        footerSection={null}
        /** **************************************
        * Style
        *************************************** */
        cssVars={{ '--layout-auth-content-width': '420px' }}
        sx={{
            '&::before': {
            width: 1,
            height: 1,
            zIndex: -1,
            content: "''",
            opacity: 0.24,
            position: 'fixed',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundImage: `url(storage/assets/background/overlay.jpg)`,
            [stylesMode.dark]: { opacity: 0.08 },
            },
            ...sx,
        }}
        >
        <Main layoutQuery={layoutQuery}>{children}</Main>
        </LayoutSection>
    );
}
