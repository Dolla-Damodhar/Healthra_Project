import { Box, Container, Typography } from '@mui/material'
import { InfoOutlined as InfoIcon } from '@mui/icons-material'
import { useColorMode } from '../../context/ColorModeContext'
import { colors, glassSx } from '../../theme'

type ComingSoonProps = {
  pageName: string
}

export const ComingSoon = ({ pageName }: ComingSoonProps) => {
  const { mode } = useColorMode()

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 240px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 6,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.light.blobA} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.light.blobB} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            ...glassSx(mode, true),
            borderRadius: 5,
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: 'rgba(76, 111, 245, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
            }}
          >
            <InfoIcon sx={{ color: colors.primary.main, fontSize: 32 }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {pageName}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
            {pageName} page will be updated soon.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

