const Layout = {
    site_root_url : "https://yostlabs.net/",

    navbar_logo : "img/logo_23_wide.svg",
    arrow_icon : "img/arrow.svg",

    categories : {
        live_demos : { 
            slides : [
                { 
                    image : "img/software/momul.jpg",
                    link_to : "https://yostlabs.net/momul/",
                    markdown :`
# Momul

A light chess-like strategy game.
                    `
                },
                { 
                    image : "img/software/enso.jpg",
                    link_to : "https://yostlabs.net/enso-zen-garden/",
                    markdown :`
# Enso

A virtual zen garden that changes with the seasons.
                    `
                },
                { 
                    image : "img/software/yostos.jpg",
                    link_to : "https://yostlabs.net/yostos/",
                    markdown :`
# YostOS

A programmable virtual operating system written in TypeScript.
                    `
                },
            ],
        },
        crafts : {
            slides : [
                {
                    image : "img/jewlery/bracelet.jpg",
                },
                {
                    image : "img/jewlery/ring.jpg",
                },
                {
                    image : "img/woodworking/sunshine_tiles_v1.jpg",
                },
                {
                    image : "img/woodworking/sunshine_tiles_v2.jpg",
                },
                {
                    image : "img/woodworking/oak_serving_tray_v1.jpg",
                },
                {
                    image : "img/woodworking/oak_serving_tray_v2.jpg",
                },
                {
                    image : "img/woodworking/incense_holders.jpg",
                },
                {
                    image : "img/woodworking/coffee_table.jpg",
                },
                {
                    image : "img/woodworking/chair.jpg",
                },
            ],
        },
        about : { 
            markdown : `
![Profile Picture](img/profile.svg)

# About Me

*Daniel Yost | Westfield, NJ | <a href="https://github.com/danstuff" target="_blank">github.com/danstuff</a> | <a href="https://www.linkedin.com/in/danyost23" target="_blank">linkedin.com/in/danyost23</a>*

I'm a programmer, designer, and woodworker based in New Jersey. In my spare time, I run yostlabs to share miscellaneous creations with the world. 

Thanks for having a look around.
`,
        },
    },
};

export { Layout };
