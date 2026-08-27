type PageMeta = {
  title: string
  description: string
}

const pageMetaMap: Record<string, PageMeta> = {
  '/': {
    title: 'Healthra | Care that connects',
    description:
      'Book appointments, consult doctors online, view medical history, and manage prescriptions — all in one secure place.',
  },
  '/services': {
    title: 'Services | Healthra',
    description: 'Explore all healthcare services offered on Healthra.',
  },
  '/doctors': {
    title: 'Doctors | Healthra',
    description: 'Find and consult expert doctors on Healthra.',
  },
  '/hospitals': {
    title: 'Hospitals | Healthra',
    description: 'Browse partner hospitals on Healthra.',
  },
  '/about': {
    title: 'About Us | Healthra',
    description: 'Learn more about Healthra.',
  },
  '/pricing': {
    title: 'Pricing | Healthra',
    description: 'View Healthra pricing plans.',
  },
  '/contact': {
    title: 'Contact | Healthra',
    description: 'Get in touch with the Healthra team.',
  },
  '/login': {
    title: 'Log In | Healthra',
    description: 'Log in to your Healthra account.',
  },
  '/book-appointment': {
    title: 'Book Appointment | Healthra',
    description: 'Schedule your appointment with a Healthra doctor.',
  },
  '/my-bookings': {
    title: 'My Bookings | Healthra',
    description: 'View your upcoming and past appointments.',
  },
}

export const getPageMeta = (pathname: string): PageMeta =>
  pageMetaMap[pathname] ?? {
    title: 'Healthra',
    description: 'Care that connects.',
  }
