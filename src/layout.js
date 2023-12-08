import * as momul from "./momul.js";

const Layout = {
    navbar_logo : "img/logo_23_wide.svg",
    categories : [
        { 
            name : "momul",
            script : momul,
        },
        { 
            name : "about",
            markdown : `
![Profile Picture](img/icons/profile.svg)

# About Daniel Yost

*Troy, NY | [danyost23@gmail.com](mailto:danyost23@gmail.com) | [github.com/danstuff](https://github.com/danstuff)*

I'm a tools engineer at [Velan Studios](https://www.velanstudios.com/). In my spare time, I run yostlabs to share miscellaneous creations with the world. Thanks for having a look around.
`,
        },
    ],
};

export { Layout };
