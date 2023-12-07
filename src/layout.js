const Layout = {
  navbar_logo : "img/logo_23_wide.svg",
  categories : [
    { 
      name : "games",
      markdown : "# Games",
      tiles : [
        {
          title : "Enso",
          desc : "An Online Interactive Zen Garden",
          year : "2021",
          image : "img/tiles/enso.png",
          href : "https://yostlabs.net/enso",
        },
        {
          title : "Space Crusade",
          desc : "A Crunchy Arcade Shooter",
          year : "2016",
          image : "img/tiles/space_crusade.png",
          href : "https://yostlabs.net/spacecrusade",
        },
        {
          title : "Cacophone",
          desc : "An Audiovisual Pendulum Toy",
          year : "2016",
          image : "img/tiles/cacophone.png",
          href : "https://yostlabs.net/cacophone",
        },
      ],
    },
    { 
      name : "woodwork",
      markdown : "# Woodwork",
      tiles : [
        // TODO
      ],
    },
    { 
      name : "about",
      markdown : `
# About Daniel Yost

*Troy, NY | [danyost23@gmail.com](mailto:danyost23@gmail.com) | [github.com/danstuff](https://github.com/danstuff)*

I'm a tools engineer at [Velan Studios](https://www.velanstudios.com/). In my spare time, I run yostlabs to share miscellaneous creations with the world. Thanks for having a look around.

![Profile Picture](img/icons/profile.svg)
`,
    },
  ],
  modal : {
    markdown : `
[![%title%](%image%)](%href%)

## %title% (%year%)

*%desc%*
`,
    cta_markdown : "[Play Now](%href%)",
    close_icon : "img/icons/close.svg", 
  }
};

export { Layout };
