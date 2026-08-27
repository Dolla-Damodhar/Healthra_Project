import { Box, Container, Grid, Stack, Typography } from '@mui/material'
import {
  Lock as LockIcon,
  VerifiedUser as VerifiedUserIcon,
  SupportAgent as SupportAgentIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material'
import { colors } from '../../theme'

const features = [
  {
    icon: LockIcon,
    title: 'Secure & Private',
    description: 'Your data is 100% secure and confidential.',
  },
  {
    icon: VerifiedUserIcon,
    title: 'Verified Doctors',
    description: 'Consult with certified and experienced specialists.',
  },
  {
    icon: SupportAgentIcon,
    title: '24/7 Support',
    description: "We're here for you anytime you need.",
  },
  {
    icon: FavoriteIcon,
    title: 'Affordable Care',
    description: 'Quality healthcare that fits your budget.',
  },
]

export const FeatureBanner = () => (
  <Box
    sx={{
      backgroundImage: colors.gradient.banner,
      py: { xs: 5, md: 6 },
    }}
  >
    <Container maxWidth="xl">
      <Grid container spacing={4}>
        {features.map((feature) => (
          <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <feature.icon sx={{ color: '#fff', fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {feature.description}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Container>
  </Box>
)
