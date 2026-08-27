import { Box, Container, Typography } from '@mui/material'
import { colors } from '../../theme'

export const TrustedHospitals = () => (
  <Box sx={{ py: { xs: 5, md: 6 } }}>
    <Container maxWidth="xl">
      <Typography
        variant="overline"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: colors.primary.main,
          fontWeight: 700,
          letterSpacing: 1.5,
        }}
      >
        TRUSTED BY LEADING HOSPITALS
      </Typography>
    </Container>
  </Box>
)
