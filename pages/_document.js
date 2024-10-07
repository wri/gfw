/* eslint-disable react/no-danger */
import React from 'react';
import Document, { Html, Main, NextScript, Head } from 'next/document';
import sprite from 'svg-sprite-loader/runtime/sprite.build';
import { mediaStyles } from '@worldresources/gfw-components';
import { staging, production } from '../newrelic/script';

const newrelic = require('newrelic');

const isProduction = process.env.NEXT_PUBLIC_FEATURE_ENV === 'production';
const isOsanoEnabled = process.env.NEXT_PUBLIC_OSANO_ENABLED === 'true';
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
          {isOsanoEnabled && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent','default',{
                    'ad_storage':'denied',
                    'analytics_storage':'denied',
                    'ad_user_data':'denied',
                    'ad_personalization':'denied',
                    'personalization_storage':'denied',
                    'functionality_storage':'granted',
                    'security_storage':'granted',
                    'wait_for_update': 500
                  });
                  gtag("set", "ads_data_redaction", true);
                `,
              }}
            />
          )}
          {isOsanoEnabled && (
            <script src="https://cmp.osano.com/AzyfddTRtqi1560Dk/9ed60354-c199-4e89-92c8-047b83aa65a3/osano.js" />
          )}
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

          {/* Start VWO Async SmartCode */}
          <link
            rel="preconnect"
            href="https://dev.visualwebsiteoptimizer.com"
          />
          <script
            id="vwoCode"
            dangerouslySetInnerHTML={{
              __html: `
                window._vwo_code || (function() {
                  var account_id=862680,
                  version=2.1,
                  settings_tolerance=2000,
                  hide_element='body',
                  hide_element_style = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important',
                  /* DO NOT EDIT BELOW THIS LINE */
                  f=false,w=window,d=document,v=d.querySelector('#vwoCode'),cK='_vwo_'+account_id+'_settings',cc={};try{var c=JSON.parse(localStorage.getItem('_vwo_'+account_id+'_config'));cc=c&&typeof c==='object'?c:{}}catch(e){}var stT=cc.stT==='session'?w.sessionStorage:w.localStorage;code={use_existing_jquery:function(){return typeof use_existing_jquery!=='undefined'?use_existing_jquery:undefined},library_tolerance:function(){return typeof library_tolerance!=='undefined'?library_tolerance:undefined},settings_tolerance:function(){return cc.sT||settings_tolerance},hide_element_style:function(){return'{'+(cc.hES||hide_element_style)+'}'},hide_element:function(){if(performance.getEntriesByName('first-contentful-paint')[0]){return''}return typeof cc.hE==='string'?cc.hE:hide_element},getVersion:function(){return version},finish:function(e){if(!f){f=true;var t=d.getElementById('_vis_opt_path_hides');if(t)t.parentNode.removeChild(t);if(e)(new Image).src='https://dev.visualwebsiteoptimizer.com/ee.gif?a='+account_id+e}},finished:function(){return f},addScript:function(e){var t=d.createElement('script');t.type='text/javascript';if(e.src){t.src=e.src}else{t.text=e.text}d.getElementsByTagName('head')[0].appendChild(t)},load:function(e,t){var i=this.getSettings(),n=d.createElement('script'),r=this;t=t||{};if(i){n.textContent=i;d.getElementsByTagName('head')[0].appendChild(n);if(!w.VWO||VWO.caE){stT.removeItem(cK);r.load(e)}}else{var o=new XMLHttpRequest;o.open('GET',e,true);o.withCredentials=!t.dSC;o.responseType=t.responseType||'text';o.onload=function(){if(t.onloadCb){return t.onloadCb(o,e)}if(o.status===200){_vwo_code.addScript({text:o.responseText})}else{_vwo_code.finish('&e=loading_failure:'+e)}};o.onerror=function(){if(t.onerrorCb){return t.onerrorCb(e)}_vwo_code.finish('&e=loading_failure:'+e)};o.send()}},getSettings:function(){try{var e=stT.getItem(cK);if(!e){return}e=JSON.parse(e);if(Date.now()>e.e){stT.removeItem(cK);return}return e.s}catch(e){return}},init:function(){if(d.URL.indexOf('__vwo_disable__')>-1)return;var e=this.settings_tolerance();w._vwo_settings_timer=setTimeout(function(){_vwo_code.finish();stT.removeItem(cK)},e);var t;if(this.hide_element()!=='body'){t=d.createElement('style');var i=this.hide_element(),n=i?i+this.hide_element_style():'',r=d.getElementsByTagName('head')[0];t.setAttribute('id','_vis_opt_path_hides');v&&t.setAttribute('nonce',v.nonce);t.setAttribute('type','text/css');if(t.styleSheet)t.styleSheet.cssText=n;else t.appendChild(d.createTextNode(n));r.appendChild(t)}else{t=d.getElementsByTagName('head')[0];var n=d.createElement('div');n.style.cssText='z-index: 2147483647 !important;position: fixed !important;left: 0 !important;top: 0 !important;width: 100% !important;height: 100% !important;background: white !important;';n.setAttribute('id','_vis_opt_path_hides');n.classList.add('_vis_hide_layer');t.parentNode.insertBefore(n,t.nextSibling)}var o='https://dev.visualwebsiteoptimizer.com/j.php?a='+account_id+'&u='+encodeURIComponent(d.URL)+'&vn='+version;if(w.location.search.indexOf('_vwo_xhr')!==-1){this.addScript({src:o})}else{this.load(o+'&x=true')}}};w._vwo_code=code;code.init();})();
              `,
            }}
          />
          {/* End VWO Async SmartCode */}
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
          {isOsanoEnabled && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  document.addEventListener('DOMContentLoaded', function(event) {
                    setTimeout(() => {
                      document.getElementsByClassName('osano-cm-window__widget osano-cm-widget osano-cm-widget--position_right')[0].style.display = 'none';
                    }, 100);
                  });
                `,
              }}
            />
          )}
          <NextScript />
        </body>
      </Html>
    );
  }
}
