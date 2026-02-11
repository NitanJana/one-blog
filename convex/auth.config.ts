const CLERK_DOMAIN = process.env.CLERK_JWT_ISSUER_DOMAIN || '';

export default {
  providers: [
    {
      domain: CLERK_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
