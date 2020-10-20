import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import sprite from 'svg-sprite-loader/runtime/sprite.build';

import { mediaStyles } from 'gfw-components';

export default class MyDocument extends Document {
  render() {
    const spriteContent = sprite.stringify();

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
            name="google-translate-customization"
            content="95a31ce28e08eaf2-a31ff49177f3ed6f-g9553d70b9ef10300-15"
          />
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
            src="/scripts/hotjar.js"
            async
            rel="preconnect"
          />
          <script
            type="text/javascript"
            src="//script.crazyegg.com/pages/scripts/0027/6897.js"
            async
            rel="preconnect"
          />
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
        </Head>
        <body>
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
