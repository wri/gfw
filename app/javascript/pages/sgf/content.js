import React, { PureComponent } from 'react';

class SGFContent extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <section className="m-section -padding">
          <div className="l-inner">
            <div className="introduction">
              <p className="_light">
                The Small Grants Fund seeks to promote uptake of Global Forest
                Watch by civil society organizations to use in their research,
                advocacy, and fieldwork. The fund provides grants between
                US$10,000 and US$40,000 and technical support to civil society
                organizations for project implementation. Additionally, grant
                recipients have the opportunity to form part of a unique network
                of environmental organizations, working around the globe towards
                objectives like increasing women’s participation in land use
                decision-making in Indonesia, protecting jaguars in Nicaragua,
                mapping mangroves in Madagascar, monitoring the impact of
                mega-dam projects in Brazil, and more.
              </p>
              <div className="logo-container">
                <div className="logo-img small-grants-fund" />
              </div>
            </div>
          </div>
        </section>
        <section
          className="m-section -big-padding"
          style={{
            backgroundImage:
              'url("/assets/static-pages/small-grants-fund/SGF_slider01.png")'
          }}
        >
          <div className="l-inner">
            <header>
              <h2 className="section-title _light _color-white _text-center">
                Small Grants Fund projects include:
              </h2>
            </header>
            <div id="SFGSliderView" className="m-lory-slider">
              <div className="slider js_slider">
                <div className="frame js_frame">
                  <ul className="slides js_slides">
                    <li className="js_slide">
                      <div className="m-card -big-padding">
                        <h3 className="card-title">
                          Forest management, monitoring and law enforcement
                        </h3>
                        <p className="card-description">
                          Use GFW’s near real-time alerts to monitor
                          deforestation, notify authorities, target ranger
                          patrols, or guide legal investigations.
                        </p>
                      </div>
                    </li>
                    <li className="js_slide">
                      <div className="m-card -big-padding">
                        <h3 className="card-title">Advocacy / Campaigning</h3>
                        <p className="card-description">
                          Use GFW data to generate evidence to campaign against
                          illegal deforestation, land grabbing, and enviromental
                          injustice.
                        </p>
                      </div>
                    </li>
                    <li className="js_slide">
                      <div className="m-card -big-padding">
                        <h3 className="card-title">
                          Journalism and Storytelling
                        </h3>
                        <p className="card-description">
                          Raise public awareness about the threats to
                          forest-dependent communities by publishing stories or
                          training local journalist using GFW data.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="slider-arrows js_slide_navigation">
                <ul>
                  <li className="item -arrow -left" data-direction="left">
                    <svg>
                      <use xlinkHref="#icon-arrowleft" />
                    </svg>
                  </li>
                  <li className="item -arrow -right" data-direction="right">
                    <svg>
                      <use xlinkHref="#icon-arrowright" />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
            <p className="copyright _color-white">
              <strong>Photo credit:</strong> African Conservation Foundation
            </p>
          </div>
        </section>
        <section className="m-section -padding">
          <div className="l-inner">
            <header>
              <h2 className="section-title _light">How to apply</h2>
            </header>
            <p>
              The Small Grants Fund application period is now closed. For
              questions about the Small Grants Fund, or to sign up to be
              notified when the application period opens, please write to{' '}
              <a href="mailto:gfwfund@wri.org">gfwfund@wri.org</a>.
            </p>
          </div>
        </section>
        <section
          className="m-section -big-padding"
          style={{
            backgroundImage:
              'url("/assets/static-pages/small-grants-fund/SGF_slider02.png")'
          }}
        >
          <div className="l-inner">
            <header>
              <h2 className="section-title _light _color-white _text-center">
                Meet the Grantees
              </h2>
            </header>
            <p className="section-description _light _color-white _text-center">
              To date, there have been over 30 projects in almost as many
              countries!
            </p>
            <div id="GrantesForestSliderView" className="m-lory-slider">
              <div className="slider js_slider">
                <div className="frame js_frame">
                  <ul className="slides js_slides">
                    <li className="js_slide">
                      <div className="m-card _align-vertically-flex">
                        <a href="http://blog.globalforestwatch.org/gfw-community/announcing-the-2016-recipients-of-the-small-grants-fund.html">
                          <h3 className="card-title">
                            Announcing the 2016 Recipients
                          </h3>
                        </a>
                      </div>
                    </li>
                    <li className="js_slide">
                      <div className="m-card _align-vertically-flex">
                        <a
                          targe="_blank"
                          target="_blank"
                          href="https://gfw.maps.arcgis.com/apps/MapJournal/index.html?appid=4c3a290ba73e46139fcc40d387a8d17d"
                        >
                          <h3 className="card-title">
                            Visit the story map of 2015 projects
                          </h3>
                        </a>
                      </div>
                    </li>
                    <li className="js_slide">
                      <div className="m-card _align-vertically-flex">
                        <a
                          target="_blank"
                          href="https://gfw.maps.arcgis.com/apps/MapJournal/index.html?appid=0a56f3905f88466b93ed5696ef6fde81"
                        >
                          <h3 className="card-title">
                            Visit the story map of 2014 projects
                          </h3>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="slider-arrows js_slide_navigation">
                <ul>
                  <li className="item -arrow -left" data-direction="left">
                    <svg>
                      <use xlinkHref="#icon-arrowleft" />
                    </svg>
                  </li>
                  <li className="item -arrow -right" data-direction="right">
                    <svg>
                      <use xlinkHref="#icon-arrowright" />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="m-section -padding">
          <div className="l-inner">
            <div className="m-card">
              <h2 className="card-title">Resources and support</h2>
              <ul className="link-list">
                <li>
                  <a
                    target="_blank"
                    href="https://www.youtube.com/watch?v=RtcrS7dmhcI"
                  >
                    How to apply
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.youtube.com/watch?v=uHt1FqaSPwQ"
                  >
                    Stories from the Field: 2015 projects
                  </a>
                </li>
              </ul>
              <hr />
              <a href="/howto" className="card-title-subtitle _bold _uppercase">
                how to portal
              </a>
              <p className="card-description">
                Visit the How To page for video tutorials and step by step
                instructions for how to visualize global and country data,
                analyze forest change, subscribe to alerts, submit stories and
                more.
              </p>
            </div>
          </div>
        </section>
        <section className="m-section -padding -no-border">
          <div className="l-inner">
            <header>
              <h2 className="section-title _light">
                You may find this interesting
              </h2>
            </header>
          </div>
          <div className="l-inner">
            <div className="m-grid -no-padding">
              <div className="m-card -interesting -three-column">
                <div className="card-image">
                  <a href="/developers-corner/">
                    <div
                      className="background"
                      style={{
                        backgroundImage:
                          'url("/assets/static-pages/small-grants-fund/home-slider-1.png")'
                      }}
                    />
                  </a>
                </div>
                <h3 className="card-title">
                  <a href="/developers-corner/">Map Builder</a>
                </h3>
                <p className="card-description">
                  Create your own version of Global Forest Watch, featuring a
                  specific location or type of data
                </p>
              </div>
              <div className="m-card -interesting -three-column">
                <div className="card-image">
                  <a href="/stories/new">
                    <div
                      className="background"
                      style={{
                        backgroundImage:
                          'url("/assets/static-pages//small-grants-fund/gfw-interactive-map.png")'
                      }}
                    />
                  </a>
                </div>
                <h3 className="card-title">
                  <a href="/stories/new">Submit a Story</a>
                </h3>
                <p className="card-description">
                  Share your story about issues affecting forests, forest
                  communities, and how you use GFW to monitor and protect
                  forests with the GFW community
                </p>
              </div>
              <div className="m-card -interesting -three-column">
                <div className="card-image">
                  <a href="/contribute-data/">
                    <div
                      className="background"
                      style={{
                        backgroundImage:
                          'url("/assets/static-pages/small-grants-fund/contribute-data.png")'
                      }}
                    />
                  </a>
                </div>
                <h3 className="card-title">
                  <a href="/contribute-data/">Contribute data</a>
                </h3>
                <p className="card-description">
                  Share your data with the GFW community by adding it to the GFW
                  Interactive Map
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default SGFContent;
