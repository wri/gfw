export default {
  "plugins": [],
  "themes": [],
  "customFields": {},
  "themeConfig": {
    "disableDarkMode": true,
    "navbar": {
      "title": "Documentation",
      "logo": {
        "alt": "GFW",
        "src": "img/gfw.png"
      },
      "links": [
        {
          "to": "docs/doc1",
          "activeBasePath": "docs",
          "label": "Docs",
          "position": "left"
        },
        {
          "href": "https://github.com/Vizzuality/gfw",
          "label": "GitHub",
          "position": "right"
        }
      ]
    },
    "footer": {
      "style": "light",
      "links": [
        {
          "title": "Docs",
          "items": [
            {
              "label": "Style Guide",
              "to": "docs/doc1"
            },
            {
              "label": "Second Doc",
              "to": "docs/doc2"
            }
          ]
        },
        {
          "title": "Community",
          "items": [
            {
              "label": "Feedback",
              "href": "https://github.com/Vizzuality/gfw/issues"
            },
            {
              "label": "Contact",
              "href": "mailto:"
            }
          ]
        },
        {
          "title": "Social",
          "items": [
            {
              "label": "Blog",
              "to": "https://blog.globalforestwatch.org"
            },
            {
              "label": "GitHub",
              "href": "https://github.com/Vizzuality/gfw"
            }
          ]
        }
      ],
      "copyright": "Copyright © 2020 My Project, Inc. Built with Docusaurus."
    }
  },
  "title": "Documentation | Global Forest Watch",
  "tagline": "Forest Monitoring",
  "url": "https://docs.globalforestwatch.org/",
  "baseUrl": "/",
  "favicon": "img/favicon.ico",
  "organizationName": "vizzuality",
  "projectName": "gfw",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "sidebarPath": "/Users/edbrett/Workspace/gfw/packages/docs/sidebars.js",
          "editUrl": "https://github.com/facebook/docusaurus/edit/master/website/"
        },
        "theme": {
          "customCss": "/Users/edbrett/Workspace/gfw/packages/docs/src/css/custom.css"
        }
      }
    ]
  ]
};