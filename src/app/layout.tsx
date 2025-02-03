import './globals.css'
import styles from './page.module.css'

// Please note that you will also need to create an icon for your app.
// An option is to use a website to generate those easily.
// For example https://www.pwabuilder.com/imageGenerator. The generated icons then need to be put into the ./public/icons folder.

// Now we need to link our manifest.json file to our Next.js app.

export const metadata = {
  title: ' WebPush Tutorial',
  description: 'Native Apps Are Dead - WebPush on iOS with Next.js!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000" />
      </head>
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  )
}
