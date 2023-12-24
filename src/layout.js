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

Momul is an abstract strategy game inspired by chess. It's designed to be easy to learn and play. 

You play as the hexagonal pieces. Your objective is to capture the circular goal in the top right, whilst defending your own hexagonal goal in the bottom left.

Each piece moves as a rook would in chess: horizontally or vertically, but not diagonally. After selecting a piece, you can either move or click on the adjacent diagonals to drop in a piece from your reserves. 

---

![Profile Picture](img/profile.svg)

# About Me

*Daniel Yost | Troy, NY | [github.com/danstuff](https://github.com/danstuff)*

I'm a tools engineer at [Velan Studios](https://www.velanstudios.com/). In my spare time, I run yostlabs to share miscellaneous creations with the world. 

Thanks for having a look around.
`,
        },
    ],
};

export { Layout };
