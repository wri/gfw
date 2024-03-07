/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import sprite from 'svg-sprite-loader/runtime/sprite.build';
import { mediaStyles } from '@worldresources/gfw-components';
import { staging, production } from '../newrelic/script';

const newrelic = require('newrelic');

const isProduction = process.env.NEXT_PUBLIC_FEATURE_ENV === 'production';
const newRelicScript = isProduction ? production : staging;

export default class MyDocument extends Document {
  /**
   * https://newrelic.com/blog/how-to-relic/nextjs-monitor-application-data
   */
  static async getInitialProps(context) {
    const initialProps = await Document.getInitialProps(context);

    const browserTimingHeader = newrelic.getBrowserTimingHeader({
      hasToRemoveScriptWrapper: true,
    });

    return {
      ...initialProps,
      browserTimingHeader,
    };
  }

  render() {
    const spriteContent = sprite.stringify();

    return (
      <Html lang="en">
        <Head>
          <script src="https://cmp.osano.com/AzyfddTRtqi1560Dk/bbd879ba-792b-4caf-9a92-a17b920706f7/osano.js" />
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

          {/* New Relic Browser Agent */}
          <script dangerouslySetInnerHTML={{ __html: newRelicScript }} />
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
          {isProduction && (
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
          )}
          {/* End Google Tag Manager */}

          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: this.props.browserTimingHeader,
            }}
          />

          {/* Osano Cookie preference drawer link */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              var elements = document.getElementsByClassName("osano-cookie-preference-link");

              var showOsanaDialog = function(e) {
                e.preventDefault();
                Osano.cm.showDrawer('osano-cm-dom-info-dialog-open');
              };

              for (var i = 0; i < elements.length; i++) {
                elements[i].addEventListener('click', showOsanaDialog, false);
              }
              `,
            }}
          />
          {/* END Osano Cookie preference drawer link */}
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          {isProduction && (
            <noscript
              dangerouslySetInnerHTML={{
                __html: `
                  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NXXKNZL" height="0" width="0" style="display:none;visibility:hidden"></iframe>
                `,
              }}
            />
          )}
          {/* End Google Tag Manager (noscript) */}
          <div dangerouslySetInnerHTML={{ __html: spriteContent }} />
          <main id="maincontent">
            <Main />
          </main>
          <a
            href=""
            className="osano-cookie-preference-link"
            title="Manage privacy and cookie preferences"
          >
            Cookie Preferences
          </a>
          <NextScript />
        </body>
      </Html>
    );
  }
}
