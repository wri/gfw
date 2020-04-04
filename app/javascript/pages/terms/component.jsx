import React, { PureComponent } from 'react';

import './styles.scss';

class ThankyouPage extends PureComponent {
  render() {
    return (
      <div className="l-terms-page">
        <div className="row">
          <div className="column small-12 medium-10 medium-offset-1">
            <h1>
              <span>Global Forest Watch</span>
              <span>Terms of Service</span>
            </h1>
            <h2>
              <span>World Resources Institute</span>
              <span>10 G Street NE, Suite 800</span>
              <span>Washington, DC 20002</span>
            </h2>
            <p>
              Welcome to the WRI family of environmental data platforms. This
              document lets the user of these Services (“You“, “Your“) know what
              you get when you use our websites, and what We expect in return.
            </p>
            <p>
              The Services available through Resource Watch, Global Forest
              Watch, Forest Watcher, and The Partnership for Resilience and
              Preparedness, and their associated websites, resourcewatch.org,
              globalforestwatch.org, and prepdata.org, (collectively referred to
              as the “Services”) are owned and operated by the World Resources
              Institute (“WRI,” “We,” “Our“ or “Us”). By using the Services, You
              agree to be bound by these Terms of Service and any future updates
              (collectively, the “Terms“).
            </p>
            <ol className="num-list">
              <li>
                <h3>USAGE</h3>
                <p>
                  We provide You with access to these Services in order to
                  promote better management of natural resources for the
                  betterment of all people.
                </p>
                <ol className="alpha-list">
                  <li>
                    Please don’t misuse Our Services. You agree to use the
                    Services and their contents only for lawful purposes and not
                    to defame, harass or threaten any one or to make available
                    any obscene, pornographic or offensive material. You may not
                    use the Services in any manner that could damage or
                    overburden the Services or interfere with any other party’s
                    use of the Services.
                  </li>
                  <li>
                    Your use of the Services does not give You any ownership
                    rights in the intellectual property in the Services or in
                    its contents. Some of the software used to provide the
                    Services may be made available separately under open source
                    licenses.
                  </li>
                  <li>
                    We are constantly trying to improve Our Services. We may
                    change the features and functions of the Services, including
                    APIs, over time. It is Your responsibility to ensure that
                    Your use of the Services is compatible with the current
                    version.
                    {' '}
                  </li>
                </ol>
              </li>
              <li>
                <h3>ACCOUNTS AND API USAGE</h3>
                <ol className="alpha-list">
                  <li>
                    In order to use many of the Services, You must register for
                    an account. WRI reserves the right to reject any account
                    registration request, in its sole discretion.
                    {' '}
                  </li>
                  <li>
                    When You request to open an account in the Global Forest
                    Watch Pro application (pro.globalforestwatch.org), the
                    following conditions must be met: (1) You are applying on
                    behalf of an organization or entity that works with and is
                    actively involved in commodity supply chains and/or their
                    financing; (2) You are authorized to act on behalf of such
                    organization or entity; (3) the application is sent from a
                    valid email from the organization or entity; and (4) no
                    other application or registration for this organization or
                    entity exists. WRI may request additional information in
                    order to confirm these conditions are met.
                  </li>
                  <li>
                    When You use Our application program interfaces (“API(s)”),
                    each request to an API must include one of Your Account‘s
                    unique API keys.
                  </li>
                  <li>
                    Please protect the security of Your Account. You are
                    responsible for Your use of the Services and all activity
                    that occurs under Your Account, including any use of Your
                    Account’s API keys.
                  </li>
                  <li>
                    If You use Our APIs in Your own products, please credit Us.
                    You agree to attribute our APIs in line with our Attribution
                    Requirements, available at
                    [https://resourcewatch.org/api-attribution-requirements].
                  </li>
                  <li>
                    We may cancel or suspend Your access to the Services at any
                    time and for any reason, without notice. Upon cancellation
                    or suspension, Your right to use the Services will end. You
                    will have the right to access to Your Content stored on the
                    Services for a period of fifteen days following cancellation
                    or suspension; thereafter you may not have access to Your
                    Content stored on the Services.
                  </li>
                </ol>
              </li>
              <li>
                <h3>THIRD-PARTY CONTENT</h3>
                <ol className="alpha-list">
                  <li>
                    The Services incorporate content, data, and information from
                    others, including You. While We may review any content, and
                    remove it if We determine it violates the law or Our
                    policies, We do not commit to review all content, and You
                    should not rely on Us to do so.
                  </li>
                  <li>
                    Open data is important to Us and we make considerable effort
                    to make many of the datasets available without restriction
                    through the Services. Nonetheless, each dataset carries its
                    own license and restrictions. You should review the
                    dataset’s metadata to understand these restrictions.
                  </li>
                  <li>
                    You must comply with the licenses of Our datasets. All
                    content displayed on or accessible through the Services is
                    protected by United States copyright laws or their
                    equivalents in other countries.
                  </li>
                </ol>
              </li>
              <li>
                <h3>YOUR CONTENT</h3>
                <ol className="alpha-list">
                  <li>
                    Most of Our Services are designed to help You share or
                    publish Your content. In using Resource Watch, Global Forest
                    Watch, and The Partnership for Resilience and Preparedness,
                    and their associated websites, resourcewatch.org,
                    globalforestwatch.org, and prepdata.org, You may submit
                    data, information, or other content to the Services (“Your
                    Content”). You retain ownership of Your Content.
                  </li>
                  <li>
                    Except where expressly prohibited, You understand that We
                    may use, display, or distribute Your Content even if You
                    stop using the Services. For the sole purpose of enabling
                    Your use of the Services, You grant Us a non-exclusive,
                    worldwide, royalty-free, transferable right and license
                    (with right to sublicense), to use, copy, display,
                    distribute, modify, create derivative works, and store Your
                    Content and to allow others to do so.
                  </li>
                </ol>
              </li>
              <li>
                <h3>
                  FOREST WATCHER CONTENT AND GLOBAL FOREST WATCH PRO ACCOUNTS
                  AND CONTENT
                </h3>
                <ol className="alpha-list">
                  <li>
                    When You submit Your Content to the Forest Watcher mobile
                    application or Forest Watcher website,
                    (forestwatcher.globalforestwatch.org), or Global Forest
                    Watch Pro application (pro.globalforestwatch.org)
                    (“Watcher/Pro Content“), the Watcher/Pro Content is
                    considered confidential information. We will not access, use
                    or disclose the Watcher/Pro Content except as reasonably
                    necessary to provide customer support to You or otherwise
                    expressly authorized by You.
                  </li>
                  <li>
                    For the sole purpose of enabling Your use of the Services,
                    You grant Us a non-exclusive, worldwide, royalty-free,
                    transferable right and license (with right to sublicense),
                    to use, copy, display, create derivative works, and store
                    Watcher/Pro Content.
                  </li>
                  <li>
                    The Services may include functionality to share Watcher/Pro
                    Content with third parties, including those within your
                    organization (“Share Function”). If You use the Share
                    Function to share Watcher/Pro Content, You grant those
                    parties a license to use, copy, display, and store the
                    Watcher/Pro Content. We are not responsible for any
                    disclosure of Watcher/Pro Content resulting from Your use of
                    the Share Function.
                  </li>
                </ol>
              </li>
              <li>
                <h3>DISCLAIMERS AND LIMITATIONS</h3>
                <ol className="alpha-list">
                  <li>
                    YOU AGREE THAT YOUR USE OF THE SERVICES AND ITS CONTENT IS
                    AT YOUR SOLE RISK. THE SERVICES AND CONTENT ARE PROVIDED ON
                    AN “AS IS” BASIS AND WITHOUT WARRANTIES OR REPRESENTATIONS
                    OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST
                    EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                    STATUTORY, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES
                    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
                    AND NON-INFRINGEMENT. ACTUAL CONDITIONS MAY DIFFER FROM MAPS
                    AND INFORMATION PROVIDED BY THE SERVICES. WE DO NOT WARRANT
                    THAT THE CONTENT OR SERVICES WILL BE ERROR FREE, ACCURATE OR
                    WITHOUT INTERRUPTION.
                  </li>
                  <li>
                    WHEN USING THE SERVICES YOU MAY BE EXPOSED TO USER
                    SUBMISSIONS AND OTHER THIRD PARTY CONTENT (“NON-WRI
                    CONTENT“), AND SOME OF THIS CONTENT MAY BE INACCURATE,
                    OFFENSIVE, INDECENT, OR OTHERWISE OBJECTIONABLE. WE DO NOT
                    ENDORSE ANY NON-WRI CONTENT. UNDER NO CIRCUMSTANCES WILL WRI
                    BE LIABLE FOR OR IN CONNECTION WITH THE NON-WRI CONTENT,
                    INCLUDING FOR ANY INACCURACIES, ERRORS, OR OMISSIONS IN ANY
                    NON-WRI CONTENT, ANY INTELLECTUAL PROPERTY INFRINGEMENT WITH
                    REGARD TO ANY NON-WRI CONTENT, OR FOR ANY LOSS OR DAMAGE OF
                    ANY KIND INCURRED AS A RESULT OF THE USE OF ANY NON-WRI
                    CONTENT.
                  </li>
                  <li>
                    UNDER NO CIRCUMSTANCES WILL WE BE LIABLE FOR ANY SPECIAL,
                    INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES
                    (INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR USE
                    OR COST OF COVER) RESULTING FROM YOUR USE OR THE INABILITY
                    TO USE THE SERVICES OR THEIR CONTENTS, EVEN IF WE WERE AWARE
                    OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT WILL WE HAVE
                    ANY LIABILITY TO YOU FOR ALL CLAIMS OR DAMAGES FOR ANY
                    REASON IN EXCESS OF ONE HUNDRED DOLLARS ($100 USD). CERTAIN
                    JURISDICTIONS DO NOT ALLOW EXCLUSIONS OR LIMITATIONS ON
                    IMPLIED WARRANTIES OR LIMITATIONS ON LIABILITY, AND
                    THEREFORE SOME OR ALL OF THE DISCLAIMERS, EXCLUSIONS, OR
                    LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE
                    ADDITIONAL RIGHTS.
                  </li>
                </ol>
              </li>
              <li>
                <h3>DMCA COMPLIANCE</h3>
                <p>
                  If You are a copyright owner or an agent thereof, and believe
                  that any content on the Services infringes Your copyrights,
                  You may send a notice in writing to World Resources Institute
                  Tel: + 1 (202) 729-7600 E-mail: wri-tools@wri.org with the
                  following information:
                </p>
                <ol className="alpha-list">
                  <li>
                    Your signature as a person authorized to act on behalf of
                    the owner of an exclusive right that is allegedly infringed;
                  </li>
                  <li>
                    Identification of the exact location on the Services of
                    copyrighted work claimed to have been infringed, or, if
                    multiple copyrighted works on the Services are covered by a
                    single notification, a representative list of such works as
                    located on the Services;
                  </li>
                  <li>
                    The address, telephone number, and e-mail address of the
                    complaining party;
                  </li>
                  <li>
                    A statement that the complaining party has a good faith
                    belief that use of the material in the manner complained of
                    is not authorized by the copyright owner, its agent, or the
                    law; and
                  </li>
                  <li>
                    A statement that the information in the notification is
                    accurate, and under penalty of perjury, that the complaining
                    party is authorized to act on behalf of the owner of an
                    exclusive right that is allegedly infringed.
                  </li>
                </ol>
              </li>
              <li>
                <h3>ADDITIONAL TERMS</h3>
                <ol className="alpha-list">
                  <li>
                    We reserve the right to modify these Terms at any time. All
                    changes are effective immediately upon posting on the
                    Resource Watch website. You should review these terms
                    regularly for changes. Your continued use of the Services
                    after any such changes constitutes Your binding acceptance
                    of the updated Terms.
                  </li>
                  <li>
                    The laws of the State of Delaware, U.S.A., excluding New
                    York‘s conflict of laws provisions, apply to any dispute
                    about the Services, their content or these Terms. The U.N.
                    Convention on Contracts for the International Sale of Goods
                    doesn‘t apply. If we have a disagreement related to these
                    Terms, or Your or Our performance under them that we cannot
                    resolve between us, then we agree to have them finally
                    resolved in arbitration using either (i) the International
                    Arbitration Rules of the International Dispute Resolution
                    Centre of the American Arbitration Association, if You are
                    located outside of the United States, or (ii) the Commercial
                    Arbitration Rules of the American Arbitration Association,
                    if You are located in the United States.  We agree to follow
                    this paragraph if it differs from those rules.  There will
                    be only one arbitrator if our disagreement involves less
                    than $250,000.  If our disagreement involves more than
                    $250,000, then we each appoint one arbitrator, and those two
                    arbitrators choose a third.  We agree that the arbitrators
                    will not have the power to award either of us any damages
                    that are not consistent with Section 6 (Disclaimers and
                    Limitations) of these Terms. The arbitration will be in
                    Washington, DC, USA, and will be conducted in English.
                    Unless we agree or one of us shows its essential, there will
                    not be any formal discovery in our arbitration.  The
                    arbitrators can award costs and attorney’s fees against one
                    of us, or divide them between us.  We understand that any
                    court with jurisdiction will enforce the decisions from the
                    arbitration and enter judgment on them.
                  </li>
                  <li>
                    If We do not promptly enforce the Terms, We have not given
                    up any other rights or the right to enforce them or other
                    Terms in the future.
                  </li>
                  <li>
                    If any particular provision of these Terms is not
                    enforceable, that doesn‘t affect the enforceability of any
                    other provision of the Terms.
                  </li>
                  <li>
                    These Terms are between You and Us, and no one else can
                    enforce them.
                  </li>
                  <li>
                    These Terms are the entire statement of the agreement
                    between You and Us regarding the Services and their
                    contents.
                  </li>
                </ol>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }
}

export default ThankyouPage;
