const Layout = {
    navbar_logo : "img/logo_23_wide.svg",
    categories : {
        software : { 
            slides : [
                { 
                    image: "img/software/momul.jpg",
                    link_to: "https://yostlabs.net/momul/",
                },
                { 
                    image: "img/software/enso.jpg",
                    link_to: "https://yostlabs.net/enso/",
                },
                { 
                    image: "img/software/yostos.jpg",
                    link_to: "https://yostlabs.net/yostos/",
                },
            ],
        },
        jewlery : {
            slides : [
                {
                    image: "img/jewlery/ring_to_fean.jpg",
                },
                {
                    image: "img/jewlery/band_of_fatherhood.jpg",
                },
            ],
        },
        woodworking : {
            slides : [
                {
                    image: "img/woodworking/sunshine_tiles_v1.jpg",
                },
                {
                    image: "img/woodworking/sunshine_tiles_v2.jpg",
                },
                {
                    image: "img/woodworking/oak_serving_tray_v1.jpg",
                },
                {
                    image: "img/woodworking/oak_serving_tray_v2.jpg",
                },
                {
                    image: "img/woodworking/incense_holders.jpg",
                },
                {
                    image: "img/woodworking/coffee_table.jpg",
                }
            ],
        },
        about : { 
            markdown : `
![Profile Picture](img/profile.svg)

# About Me

*Daniel Yost | Troy, NY | [github.com/danstuff](https://github.com/danstuff) | [linkedin.com/in/danyost23](https://www.linkedin.com/in/danyost23)/*

I'm a programmer, designer, and woodworker based in upstate NY. I currently work as a tools engineer at [Velan Studios](https://www.velanstudios.com/). In my spare time, I run yostlabs to share miscellaneous creations with the world. 

Thanks for having a look around.
`,
        },
    },
};

export { Layout };
