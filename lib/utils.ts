import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations(locale);

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
    },
  };
};