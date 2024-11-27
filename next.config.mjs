import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'utfs.io']
  },
};

export default withNextIntl(nextConfig);