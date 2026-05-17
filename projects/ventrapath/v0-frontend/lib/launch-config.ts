export const launchConfig = {
  prelaunchMode: process.env.NEXT_PUBLIC_PRELAUNCH_MODE === 'true',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
}

export function isStripeClientConfigured() {
  return launchConfig.stripePublishableKey.startsWith('pk_')
}
