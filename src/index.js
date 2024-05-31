import { Layout } from "./layout.js";
import $ from "jquery";
import * as DOMPurify from 'dompurify';
import * as marked from 'marked';
import { transform } from "typescript";

const INITIAL_FADE_MS = 500;
const FADE_MS = 100;

// Append a generic element to the document.
// $root - the parent element to append to.
// type - the type of element, "img", "div", etc.
// args - the properties of the element, "id", "class", etc.
function addElement($root, type, args) {
    var $e = $("<"+type+">", args);
    $root.append($e);
    return $e;
}

// Append an image to the document.
// $root - the parent element to append to.
// src - the path to the image file.
// link_to - (Optional) a URL to treat the image as a link.
function addImage($root, src, link_to) {
    if (link_to) {
        var $a = addElement($root, "a", { "href" : link_to });
        addElement($a, "img", { "src" : src });
        return $a
    }
    else {
        return addElement($root, "img", { "src" : src });
    }
}

// Append a div of a specific class to the document.
// $root - the parent element to append to.
// css_class - the CSS class the div should use to determine its appearance.
function addDiv($root, css_class) {
    return addElement($root, "div", { "class" : css_class });
}

// Add text content to the given div.
// $div - the div to add text to.
// text - the string of text to add.
function addText($div, text) {
    $div.append(text);
}

// Parse the provided markdown string and append it to the document.
// $root - the parent element to append to.
// markdown - the string of markdown to parse and append.
function addMarkdown($root, markdown) {
    $root.append(DOMPurify.sanitize(marked.parse(markdown)));
}

// Iterate over each category in Layout and call a function on it.
// category_callback - the function to call for each category.
function forEachCategory(category_callback) {
    for (var i in Layout.categories) {
        category_callback(i, Layout.categories[i]);
    }
}

// Build a list of slides for a category.
// $root - the parent element to append to.
// slides - the list of slides. Each slide requires an "image" and may also have a "link_to" URL.
function composeSlides($root, slides) {
    
    /* Add left and right arrows. */
    var $left_arrow = addDiv($root, "slide_arrow");
    addImage($left_arrow, Layout.arrow_icon);
    $left_arrow.css({ "left" : "0", "transform" : "scaleX(-1)" });

    var $right_arrow = addDiv($root, "slide_arrow");
    addImage($right_arrow, Layout.arrow_icon);
    $right_arrow.css({ "right" : "0" })


    /* Create a div for each slide. */
    var $slides = [];
    for (var i in slides) {
        var slide = slides[i];

        var $slide = addDiv($root, "slide");
        addImage($slide, 
            slide.image,
            slide.link_to ? slide.link_to : Layout.site_root_url + slide.image);
        
        if (slide.markdown) {
            addMarkdown($slide, slide.markdown);
        }

        if (i > 0) {
            $slide.css({ "display" : "none", "z-index" : "-1" });
        }

        $slides.push($slide);
    }

    /* Cause clicking the side of each slide to animate + replace it with another. 
    ** Clicking on the left side of the image slides right,
    ** and clicking on the right slides left. */

    function _slideIn($slide, direction) {
        /* Slide in FROM the given direction. */
        var w = $slide.width();
        $slide
            .show(0)
            .css({ 
                "translate" : direction == "left" ? -w+"px": (2*w)+"px",
                "opacity" : "0.0",
                "z-index" : "0",
            })
            .animate({ "translate" : "0px", "opacity" : "1.0" }, 400, "linear");
    }

    function _slideOut($slide, direction) {
        /* Slide out TO the given direction. */
        var w = $slide.width();
        $slide
            .animate({ 
                "translate": direction == "left" ? -w+"px": (2*w)+"px",
                "opacity": "0.0",
                "z-index" : "-1",
            }, 400, "linear")
            .hide(0);
    }
    
    function _loop(i) {
        return (i + $slides.length) % $slides.length;
    }

    $left_arrow.on("click", (e) => {
        for (var key in $slides) {
            var i = Number(key);
            if ($slides[i].is(":visible")) {
                _slideOut($slides[i], "right");
                _slideIn($slides[_loop(i-1)], "left");        
                break;
            }
        }
    });
        
    $right_arrow.on("click", (e) => {
        for (var key in $slides) {
            var i = Number(key);
            if ($slides[i].is(":visible")) {
                _slideOut($slides[i], "left");
                _slideIn($slides[_loop(i+1)], "right");
                break;
            }
        }   
    });
}

// Build the header of the website.
// $root - the parent element to append to.
function composeHeader($root) {
    var $header = addDiv($root, "navbar");
    addImage($header, Layout.navbar_logo);

    var $items = addDiv($header, "navbar_items");
    forEachCategory((category_name, _) => {

        var $item = addDiv($items, "navbar_item");
        addText($item, category_name.replace("_", " "));

        $item.on("click", () => {
            $(".category").fadeOut(FADE_MS);

            setTimeout(() => {
                $("." + category_name).fadeIn(FADE_MS);
            }, FADE_MS);
        });
    });

    addElement($header, "hr")
}

// Entry point. Build the entire webpage.
// $root - the parent element to append to.
function composePage($root) {
    composeHeader($root);

    var $page = addDiv($root, "page");

    /* Add content for each category. */
    var first = true;
    forEachCategory((name, category) => {
        var $category = addDiv($page, "category " + name);

        if (category.script && category.script.startup) {
            category.script.startup($category);
        }

        if (category.slides) {
            composeSlides($category, category.slides);
        }

        if (category.markdown) {
            addMarkdown($category, category.markdown);
        } 

        $category.css({ "display": "none"});
        if (first) {
            $category.fadeIn(INITIAL_FADE_MS);
            first = false;
        }
    });

    /* Add footer. */
    if (Layout.footer) {
        var $footer = addDiv($page, "footer");
        for (var i in Layout.footer.links) {
            var link = Layout.footer.links[i];
            var $footer_section = addElement($footer, "a", { "href" : link.link_to });
        
            if (link.icon) {
                addImage($footer_section, link.icon);
            }

            if (link.text) {
                addText($footer_section, link.text);
            }
        }
        if (Layout.footer.copy_notice) {
            addText(addDiv($footer, "copy_notice"), Layout.footer.copy_notice);            
        }
    }
}

composePage($("#root"));

