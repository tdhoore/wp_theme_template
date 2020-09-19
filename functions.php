<?php

function scripts()
{
    // include the css file
    $cssFilePath = glob(get_template_directory() . '/css/main.min.*');
    $cssFileURI = get_template_directory_uri() . '/css/' . basename($cssFilePath[0]);
    wp_enqueue_style('site_main_css', $cssFileURI);

    // include the javascript file
    $jsFilePath = glob(get_template_directory() . '/js/script.min.*.js');
    $jsFileURI = get_template_directory_uri() . '/js/' . basename($jsFilePath[0]);

    wp_enqueue_script('site_main_js', $jsFileURI, null, null, true);
}

add_action('wp_enqueue_scripts', 'scripts');
