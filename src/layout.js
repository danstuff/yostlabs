const DemoSlides = [
    {
        src : "img_demos/yostos.jpg",
        href : "https://yostlabs.net/os",
        label : "YostOS - A Virtual Typescript OS"
    },

    {
        src : "img_demos/marpo.png",
        href : "https://yostlabs.net/marpo",
        label : "Marist Parking Overview"
    },


    {
        src : "img_demos/enso.jpg",
        href : "https://yostlabs.net/enso",
        label : "Enso - Virtual Zen Garden"
    }
]

const Layout = {
    pages : [
        {
            name : 'index',
            slides : DemoSlides, 

            markdown : `
# Welcome to YostLabs

Live software demos created by Daniel Yost.`
        },
        {
            name : 'demo',
            slides : DemoSlides
        },

        {
            name : 'about',
            markdown : `
# Daniel Yost

*Poughkeepsie, NY | [danyost23@gmail.com](mailto:danyost23@gmail.com) | [github.com/danstuff](https://github.com/danstuff)*

I'm a self-motivated maker, designer, and programmer who specializes in building secure, high-performance libraries and applications that work across multiple platforms. In my spare time, I run YostLabs to share my creations with the world.

[View R‌ésum‌é](/Daniel_Yost_Resume_2022.pdf)

`
        }
    ]
}

export default Layout;
