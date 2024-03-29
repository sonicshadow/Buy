/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here.
    // For complete reference see:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config
    config.toolbar = [
	    { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
	    { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
	    //{ name: 'editing', groups: ['find', 'selection', 'spellchecker'], items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
	    { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
	    //'/',
	    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
	    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
	    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
	    { name: 'insert', items: [ 'cyimage', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
	    //'/',
	    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
	    { name: 'colors', items: ['TextColor', 'BGColor'] },
	    { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
	    { name: 'others', items: ['-'] },
    ];
    // The toolbar groups arrangement, optimized for two toolbar rows.
    config.toolbarGroups = [
		{ name: 'clipboard', groups: ['clipboard', 'undo'] },
		{ name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document', groups: ['mode', 'document', 'doctools'] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
		{ name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
    ];
    // Remove some buttons provided by the standard plugins, which are
    // not needed in the Standard(s) toolbar.
    config.removeButtons = 'Underline,Subscript,Superscript,Styles,Format,Blockquote,Anchor';

    // Set the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';
    config.extraPlugins = 'justify,autogrow,cyimage';
    // Simplify the dialog windows.
    config.removeDialogTabs = 'image:advanced;link:advanced';
    //config.filebrowserImageUploadUrl = comm.action("ForCkEditor", "Uploader", { command: "QuickUpload", type: "Images" });
    //config.filebrowserImageBrowseUrl = "";
    //config.filebrowserBrowseUrl = '';
    //config.filebrowserUploadUrl = '';
    config.allowedContent = true;
    config.autoGrow_onStartup = true;
    config.autoGrow_minHeight = 300;
    config.resize_enabled = false;
};
