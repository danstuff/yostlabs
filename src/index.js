import { Layout } from "./layout.js";
import $ from "jquery";
import * as DOMPurify from 'dompurify';
import * as marked from 'marked';

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
function addImage($root, src) {
    return addElement($root, "img", { "src" : src });
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

// Find all occurences in a text string of each %key% in fields,
// and replace them with the values of each corresponding field in fields.
// text - the text string to replace values in.
// fields - the list of key-value pairs to find and replace in the text.
function findReplace(text, fields) {
    var keys = Object.keys(fields);
    var values = Object.values(fields);
    for (var i in keys) {
        text = text.replaceAll("%" + keys[i] + "%", values[i]);
    }
    return text;
}

// Iterate over each category in Layout and call a function on it.
// category_callback - the function to call for each category.
function forEachCategory(category_callback) {
    for (var i in Layout.categories) {
        category_callback(i, Layout.categories[i]);
    }
}

// Build the header of the website.
// $root - the parent element to append to.
function composeHeader($root) {
    var $header = addDiv($root, "navbar");
    addImage($header, Layout.navbar_logo);

    var $items = addDiv($header, "navbar_items");
    forEachCategory((i, category) => {

        var $item = addDiv($items, "navbar_item");
        addText($item, category.name);

        $item.click(() => {
            $(".category").fadeOut(FADE_MS);

            setTimeout(() => {
                $("." + category.name).fadeIn(FADE_MS);
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

    // Add content for each category.
    forEachCategory((i, category) => {
        var $category = addDiv($page, "category " + category.name);

        if (category.markdown) {
            addMarkdown($category, category.markdown);
        } 

        if (category.script) {
            category.script.startup($category);
        }

        $category.css({ display: "none"});
        if (i == 0) {
            $category.fadeIn(INITIAL_FADE_MS);
        }
    });
}

composePage($("#root"));

