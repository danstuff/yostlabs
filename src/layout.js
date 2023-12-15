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
![Board Picture](img/momul_board.svg)

# About Momul

Momul is an abstract strategy game inspired by chess, but designed to be significantly easier to learn and play.

---

![Profile Picture](img/profile.svg)

# About Me

*Daniel Yost | Troy, NY | [github.com/danstuff](https://github.com/danstuff)*

I'm a tools engineer at [Velan Studios](https://www.velanstudios.com/). In my spare time, I run yostlabs to share miscellaneous creations with the world. Thanks for having a look around.
`,
        },
    ],
};

export { Layout };
