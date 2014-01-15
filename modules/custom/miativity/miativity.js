/**
 * Implements hook_install().
 */
function miativity_install() {
  try {
    var css_file_path =
      drupalgap_get_path('module', 'miativity') + '/miativity.css';
    drupalgap_add_css(css_file_path);
  }
  catch (error) { console.log('miativity_install - ' + error); }
}

/**
 * Implements hook_block_info().
 */
function miativity_block_info() {
  var blocks = {
    slogan:{
      delta:'slogan',
      module:'miativity'
    },
    controls:{
      delta:'controls',
      module:'miativity'
    }
  };
  return blocks;
}

/**
 * Implements hook_block_view().
 */
function miativity_block_view(delta) {
  var content = '';
  if (delta == 'slogan') {
    var title = 'My Creativity. Shared.';
    if (drupalgap_path_get() != drupalgap.settings.front) {
      title = 'Miativity';
    }
    content = '<h4>' + title + '</h4>';
  }
  else if (delta == 'controls') {
    var welcome = '&nbsp;';
    if (Drupal.user.uid != 0) {
      welcome = Drupal.user.name; 
    }
    content = '<h4>' + welcome + '</h4>';
  }
  return content;
}

/**
 * Implements hook_form_alter().
 */
function miativity_form_alter(form, form_state, form_id) {
  try {
    if (form_id == 'node_edit' && form.elements.type.default_value == 'art') {
      // The site is using Automatic node titles, disable access to the default
      // title field and make it optional.
      form.elements.title.access = false;
      form.elements.title.required = false;
      // Disable access to other fields not needed.
      form.elements.field_contest_entry.access = false;
      form.elements.field_place_finish.access = false;
      form.elements.field_addthis.access = false;
    }
  }
  catch (error) { drupalgap_error(error); }
}

/**
 * Implements hook_menu().
 */
function miativity_menu() {
  var items = {
    home:{
      title:'Miativity',
      page_callback:'miativity_home_page'
    },
    'gallery/%': {
      title:'Gallery',
      page_callback:'miativity_gallery_page',
      page_arguments: [1]
    }
  };
  return items;
}

function miativity_home_page() {
  var content = {};
  if (Drupal.user.uid == 0) { // Anonymous users.
    var logo_path = drupalgap_get_path('module', 'miativity') +
      '/images/art-owl-trans-color.png';
    var logo = theme('image', {
      path: logo_path
    });
    content.logo = {
      markup: '<center>' + logo + '</center>'
    };
    content.intro = {
      markup:'<p style="text-align: center;">Share your art in a gallery, create art collections, and more!</p>'
    };
    content.public_gallery = {
      theme:'button_link',
      text:'View Public Gallery',
      path:'gallery/public',
      attributes:{'data-icon':'eye'}
    };
  }
  else { // Authenticated users.
    content.upload_art = {
      theme:'button_link',
      text:'Upload Art',
      path:'node/add/art',
      attributes:{'data-icon':'plus'}
    };
  }
  
  if (Drupal.user.uid != 0) {
    content.logout = {
      theme: 'button_link',
      text: 'Logout',
      path: 'user/logout',
      attributes: { 'data-icon': 'delete' }
    };
  }
  return content;
}

/**
 *
 */
function miativity_gallery_page(gallery) {
  try {
    var content = {
      gallery: {
        theme: 'view',
        path: miativity_gallery_path(gallery),
        row_callback: 'miativity_gallery_page_row',
        empty_callback: 'miativity_gallery_page_empty'
      }
    };
    return content;
  }
  catch (error) { console.log('miativity_gallery_page - ' + error); }
}

/**
 *
 */
function miativity_gallery_page_empty(variables) {
  try {
    console.log('miativity_gallery_page_empty');
    dpm(variables);
    return "Sorry, nothing found.";
  }
  catch (error) { console.log('miativity_gallery_page_empty - ' + error); }
}

/**
 *
 */
function miativity_gallery_page_row(row) {
  try {
    var title = '<h2>' + row.field_art_title + '</h2>';
    var image = theme('image', {
        path: row.field_art_image
    });
    var link = l(image, row.original, {
      InAppBrowser: true
    });
    dpm(link);
    return title + link;
  }
  catch (error) { console.log('miativity_gallery_page_row - ' + error); }
}

/**
 *
 */
function miativity_gallery_path(gallery) {
  try {
    var path = 'drupalgap/gallery';
    switch (gallery) {
      case 'public':
        path += '/' + gallery
        break;
      case 'friends':
        path += '/' + gallery + '/' + Drupal.user.uid;
        break;
      case 'my':
        path += '/' + Drupal.user.uid;
        break;
    }
    return path;
  }
  catch (error) { console.log('miativity_gallery_path - ' + error); }
}

