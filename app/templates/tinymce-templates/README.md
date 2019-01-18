TinyMCE Theme Templates
================================================

Use this template to add theme fragments that can be added through tinymce

Setup:
--------------

On Control Panel -> TinyMCE -> Toolbar -> custom plugins add:

{{{
    template|+plone+static/components/tinymce-builded/js/tinymce/plugins/template
}}}

Define templates:

{{{
    [
    {
        "title": "Template example",
        "url": "++theme++SITENAME.sitetheme/tinymce-templates/template.html",
        "description": "Title with two columns"
    },
    {
        "title": "Template example2",
        "url": "++theme++SITENAME.sitetheme/tinymce-templates/template2.html",
        "description": "Title with three columns."
    }
]
}}}
