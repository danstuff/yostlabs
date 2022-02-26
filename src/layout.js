const Layout = {
    pages : [
        {
            name : 'index',
            slides : [
                { 
                    src : "img_demos/enso.jpg",
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
                    
                }
            ]
        },

        {
            name : 'demo',
            slides : [
                {
                    src : "img_demos/enso.jpg",
                    href : "http://enso.yostlabs.net",
                    label : "Enso Virtual Zen Garden"
                },

                {
                    src : "img_demos/yostos.jpg",
                    href : "http://os.yostlabs.net",
                    label : "YostOS - A Virtual Typescript OS"
                }
            ]
        },

        {
            name : 'about',
            markdown : `
# Daniel Yost

*Poughkeepsie, NY | [danyost23@gmail.com](mailto:danyost23@gmail.com) | [github.com/danstuff](https://github.com/danstuff)*

I'm a self-motivated maker, designer, and programmer who specializes in building secure, high-performance libraries and applications that work across multiple platforms. In my spare time, I run YostLabs to share my creations with the world.

[View R‌ésum‌é](/resume)`
        }
    ]
}

export default Layout;
