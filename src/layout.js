const Layout = {
    pages : [
        {
            name : 'index',
            slides : [
                { 
                    src : "img_demos/yostos.jpg",
                    href : "demo",
                    label : "Live Demos" 
                },

                { 
                    src : "img_wood/Oak Serving Trays/0.jpg",
                    href : "wood",
                    label : "Custom Woodwork" 
                }
            ], 

            markdown : `
# Welcome to YostLabs

Live software demos and woodworking, all created by Daniel Yost.`
        },

        {
            name : 'wood',
            slides : [
                {
                    src : "img_wood/Sunshine Tiles/0.jpg",
                    label : "Sunshine Tiles" 
                },

                {
                    src : "img_wood/Rustic Coffee Table/0.jpg",
                    label : "Rustic Coffee Table" 
                },

                {
                    src : "img_wood/Incense Holders/0.jpg",
                    label : "Incense Holders" 
                },

                {
                    src : "img_wood/Oak Serving Trays/0.jpg",
                    label : "Oak Serving Trays" 
                },

                {
                    src : "img_wood/Skyline/0.jpg",
                    label : "Skyline" 
                },

                {
                    src : "img_wood/Modern End Table/0.jpg",
                    label : "Modern End Table" 
                },

                {
                    src : "img_wood/Driftwood Long Box/0.jpg",
                    label : "Driftwood Long Box" 
                },

                {
                    src : "img_wood/Ruler/0.jpg",
                    label : "Ruler" 
                }

            ]
        },

        {
            name : 'demo',
            slides : [
                {
                    src : "img_demos/yostos.jpg",
                    href : "http://os.yostlabs.net",
                    label : "YostOS - A Virtual Typescript OS"
                },

                {
                    src : "img_demos/marpo.png",
                    href : "http://marpo.yostlabs.net",
                    label : "Marist Parking Overview"
                },


                {
                    src : "img_demos/enso.jpg",
                    href : "http://enso.yostlabs.net",
                    label : "Enso Virtual Zen Garden"
                }
            ]
        },

        {
            name : 'about',
            markdown : `
# Daniel Yost

*Poughkeepsie, NY | [danyost23@gmail.com](mailto:danyost23@gmail.com) | [github.com/danstuff](https://github.com/danstuff)*

I'm a self-motivated maker, designer, and programmer who specializes in building secure, high-performance libraries and applications that work across multiple platforms. In my spare time, I run YostLabs to share my creations with the world.

[View R‌ésum‌é](/Daniel_Yost_Resume_2022.pdf)`
        }
    ]
}

export default Layout;
