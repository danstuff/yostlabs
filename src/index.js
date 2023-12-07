import { Layout } from "./layout.js";
import $ from "jquery";
import * as DOMPurify from 'dompurify';
import * as marked from 'marked';

const MODAL_FADE_MS = 250;
const AUTO_SCROLL_MS = 500;

// Append a generic element to the document.
// $root - the parent element to append to.
// type - the type of element, "img", "div", etc.
// args - the properties of the element, "id", "class", etc.
function addElement($root, type, args) {
  var $e = $("<"+type+">", args);
  $root.append($e);
  return $e;
}

// Append an empty div with the given ID to the document. Used for navigation.
// $root - the parent element to append to.
// id - the identifier for this marker.
function addMarker($root, id) {
  return addElement($root, "div", { "id" : id, "class" : "marker" })
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
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#" + category.name).offset().top
      }, AUTO_SCROLL_MS);
    });
  });

  addElement($header, "hr", {});
}

function composeModal($root, fields) {
  var $modal_background = addDiv($root, "modal_background");
  var $modal = addDiv($modal_background, "modal");

  var $modal_close = addDiv($modal, "modal_close");
  addImage($modal_close, Layout.modal.close_icon);

  $modal_close.click(() => {
    $modal_background.fadeOut(MODAL_FADE_MS);
  });
  
  var $modal_content = addDiv($modal, "modal_content");
  addMarkdown($modal_content, findReplace(Layout.modal.markdown, fields));
  
  if (fields.href) {
    addMarkdown($modal_content, findReplace(Layout.modal.cta_markdown, fields));
  }

  return $modal_background;
}

// Entry point. Build the entire webpage.
// $root - the parent element to append to.
function composePage($root) {
  composeHeader($root);

  var $page = addDiv($root, "page");

  // Add a marker, content, and tiles/modals for each category
  forEachCategory((i, category) => {
    var $category = addDiv($page, "category " + category.name);
    addMarker($category, category.name);

    if (category.markdown) {
      addMarkdown($category, category.markdown);
    } 

    if (category.tiles) {
      var $tiles = addDiv($category, category.name + " tiles");

      for (var j in category.tiles) {
        var tile = category.tiles[j];

        var $tile = addDiv($tiles, category.name + " tile");
        addImage($tile, tile.image);
        
        composeModal($tiles, tile);

        $tile.click(() => {
          $(event.target).next().fadeIn(MODAL_FADE_MS);
        })
      }
    }
  });

  // Close any open modals on ESC
  $(document).keyup((e) => {
    if (e.key == "Escape") {
      $(".modal_background").fadeOut(MODAL_FADE_MS);
    }
  });
}

composePage($("#root"));

