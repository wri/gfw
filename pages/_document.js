/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

import { mediaStyles } from '@worldresources/gfw-components';

const isProduction = process.env.NEXT_PUBLIC_FEATURE_ENV === 'production';

export default class MyDocument extends Document {
  render() {
    const spriteContent = sprite.stringify();
    const googleTagManagerScripts = {};

    if (isProduction) {
      googleTagManagerScripts.head = (
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NXXKNZL');
          `,
          }}
        />
      );
      googleTagManagerScripts.body = (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NXXKNZL" height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
      );
    } else {
      // staging scripts
      googleTagManagerScripts.head = (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&gtm_auth=n0mLnIj300jJ14M3bNz2sQ&gtm_preview=env-26&gtm_cookies_win=x';f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NXXKNZL');
            `,
          }}
        />
      );
      googleTagManagerScripts.body = (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NXXKNZL&gtm_auth=n0mLnIj300jJ14M3bNz2sQ&gtm_preview=env-26&gtm_cookies_win=x" height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
      );
    }

    return (
      <Html lang="en">
        <Head>
          <style
            type="text/css"
            dangerouslySetInnerHTML={{ __html: mediaStyles }}
          />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          <meta
            name="google-site-verification"
            content="xx82D6cZ40Hvf-TT9jkhfsVi11yIeShPcK0zcc7m7ak"
          />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/favicon/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />

          <script
            type="text/javascript"
            src="/scripts/transifex.js"
            rel="preconnect"
          />
          <script
            type="text/javascript"
            src="//cdn.transifex.com/live.js"
            rel="preconnect"
          />
          {/* Google Tag Manager */}
          {googleTagManagerScripts.head}
          {/* End Google Tag Manager */}
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          {googleTagManagerScripts.body}
          {/* End Google Tag Manager (noscript) */}
          <div dangerouslySetInnerHTML={{ __html: spriteContent }} />
          <main id="maincontent">
            <Main />
          </main>
          <NextScript />
        </body>
      </Html>
    );
  }
}
