import { Metadata } from 'next'
import React from 'react'

type Props = {
  params: { username: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const username = params.username

  return {
    title: `Send an anonymous message to @${username}`,
    description: `Send an anonymous, secret message to @${username} on Verity. Your identity stays completely hidden!`,
    openGraph: {
      title: `Send a secret message to @${username} 🤫`,
      description: `Send an anonymous message to @${username} on Verity. They won't know who sent it!`,
      url: `https://verity-app.com/u/${username}`,
      siteName: 'Verity',
      images: [
        {
          url: 'https://verity-app.com/og-image.png', // Fallback generic image or dynamic edge function image
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Send a secret message to @${username} 🤫`,
      description: `Send an anonymous message to @${username} on Verity. They won't know who sent it!`,
    },
  }
}

export default function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
