module.exports = {
  title: 'Documentation | Global Forest Watch',
  tagline: 'Forest Monitoring',
  url: 'https://docs.globalforestwatch.org/',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'vizzuality', // Usually your GitHub org/user name.
  projectName: 'gfw', // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
    navbar: {
      title: 'Documentation',
      logo: {
        alt: 'GFW',
        src: 'img/gfw.png'
      },
      links: [
        {
          to: 'docs/doc1',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left'
        },
        {
          href: 'https://github.com/Vizzuality/gfw',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Feedback',
              href: 'https://github.com/Vizzuality/gfw/issues',
            },
            {
              label: 'Contact',
              href: 'mailto:',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'Blog',
              to: 'https://blog.globalforestwatch.org',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Vizzuality/gfw',
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
