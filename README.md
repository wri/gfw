# What is Global Forest Watch?

[Global Forest Watch](http://www.globalforestwatch.org/) (GFW) is a
dynamic online forest monitoring and alert system that empowers people
everywhere to better manage forests. This repository contains the GFW web app.

![Global forest watch map](public/preview.jpg?raw=true "Title")

# Developing

The GFW web app rides on [Next.js](https://nextjs.org/) with [Redux](https://redux.js.org/).

## Installing the app

Clone the GFW repo:

```bash
$ git clone https://github.com/Vizzuality/gfw.git
```

Install the dependancies

```bash
$ brew install yarn
$ yarn install
```

And now start the development server:

```bash
$ yarn start
```

The app should now be accessible on [http://0.0.0.0:3000](http://0.0.0.0:3000).

## Deployment

We follow a [Gitflow Worklow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) for development and deployment. Our `master` branch goes to production, `develop` goes to `master`. We also have a staging branch which is detached from the workflow that can be used to merge multiple branches for deployment to the staging site. Additionally you can deploy `develop` or feature branches to staging if desired.

![gitflow workflow](https://www.atlassian.com/dam/jcr:b5259cce-6245-49f2-b89b-9871f9ee3fa4/03%20(2).svg)

## Releases

We are using github releases to record changes to the app. To help us manage this we are using [Zeit Releases](https://github.com/zeit/release), an npm package for handling github releases, tagging commits (major, minor, patch), and automating semantic release logs. For a more detailed explanation of semantic changelogs see [this post](https://semver.org/).

#### Managing commits for a release

When developing, you can tag your commits as follows: `fix some excellent bug (patch)` where `patch` can be `(major/minor/patch/ignore)`. This commit title will automatically be grouped into the correct section for the release. Otherwise you will be prompted during the release to assign (or ignore) each of your commits. You will have to do this for every commit so don't forget to squash!

So how do you make a release on GFW?

1. Checkout master and merge in develop (not compulsory but advised for consistency).
2. Run `npx release [type]` where type can be `major`, `minor`, `patch`, or `pre` (see [zeit docs](https://github.com/zeit/release) for more details).
3. Follow the prompts to manage commits.
4. You will be taken to github draft release editor with all your commits grouped and ready to go.
5. Enter your title and include any extra info you want.
6. Publish!

## Layers

Map layers, somewhat unsurprisingly, are an important part of GFW. As
such, the config and code supporting them can be a bit complex. Check
out the [layer documentation](docs/layers) for more information. If the
component you're working on isn't in there, please write some
documentation when you're done! 💞

### BrowserStack

We use [BrowserStack](https://www.browserstack.com) to find and fix cross-browser issues.

<a href="https://www.browserstack.com"><img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" height="70" /></a>

# RW API Documentation for GFW

Map layers and relevent datasets are stored in the [RW-API](http://api.resourcewatch.org/) and the `globalforestwatch.org/map` utilises the [layer-manager](https://github.com/Vizzuality/layer-manager) to render them.

The schema used to style these layers, their legends, and define their interactions are specific to the *Global Forest Watch* platform.

When creating or modifying layers/datasets for GFW, follow the schema and syntax outlined in the [API Documentation](./docs/API_Documentation.md) markdown file.

To view GFW-specific layers and datasets use the following endpoint:

https://api.resourcewatch.org/v1/dataset?app=gfw&includes=layer,vocabulary,metadata&page[size]=200

# License

The MIT License (MIT)

Copyright (c) 2015 Vizzuality

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
