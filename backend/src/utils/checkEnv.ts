export function checkRequiredEnvVars(): void {
  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:');
    missingEnvVars.forEach((envVar) => {
      console.error(`- ${envVar}`);
    });
    console.error('Please check your .env file');
  }
} 