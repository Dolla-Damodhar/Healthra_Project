import { Box } from '@mui/material'
import { Hero } from './Hero'
import { Services } from './Services'
import { HowItWorks } from './HowItWorks'
import { TrustedHospitals } from './TrustedHospitals'
import { FeatureBanner } from './FeatureBanner'

export const Home = () => (
  <Box>
    <Hero />
    <Services />
    <HowItWorks />
    <TrustedHospitals />
    <FeatureBanner />
  </Box>
)
