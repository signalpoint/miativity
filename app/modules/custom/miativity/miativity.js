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
      title = 'Miativity - ' + title;
    }
    content = '<h4>' + title + '</h4>';
  }
  else if (delta == 'controls') {
    var welcome = '&nbsp;';
    if (drupalgap_path_get() == drupalgap.settings.front) {
      welcome += 'Galleries';
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
      // Redirect the node edit form submission to the user's gallery.
      form.action = 'gallery/my';
    }
    else if (form_id == 'user_login_form') {
      form.suffix +=
        theme('button_link', {
            text: 'Create an Account',
            path: 'user/register'
        });
    }
    else if (form_id == 'user_register_form') {
      form.suffix +=
        theme('button_link', {
            text: 'Login to Existing Account',
            path: 'user/login'
        });
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
    content.login = {
      theme: 'button_link',
      text: 'Login',
      path: 'user/login',
      options: {
        attributes: {
          'data-icon': 'lock'
        }
      }
    };
    content.join = {
      theme: 'button_link',
      text: 'Join',
      path: 'user/register',
      options: {
        attributes: {
          'data-theme': 'b',
          'data-icon': 'plus'
        }
      }
    };
    content.website = {
      markup: '<p style="text-align: center;">Or stop by <strong>miativity.com</strong> to learn more.</p>'
    };
  }
  else { // Authenticated users.
    content.welcome = {
      markup: '<p style="text-align: center;">Hi, <strong>' + Drupal.user.name + '</strong></p>'
    };
    content.upload_art = {
      theme:'button_link',
      text:'Upload Art',
      path:'node/add/art',
      attributes:{
        'data-theme': 'b',
        'data-icon':'plus'
      }
    };
    content.logout = {
      theme: 'button_link',
      text: 'Logout',
      path: 'user/logout',
      options: {
        transition: 'none',
        attributes: {
          'data-icon': 'delete'
        }
      }
    };
    content.website = {
      markup: '<p>Please visit <strong>miativity.com</strong> for more functionality like creating friends, collections, private messaging, and more.</p>'
    };
  }
  return content;
}

/**
 *
 */
function miativity_gallery_page(gallery) {
  try {
    var content = {};
    if (Drupal.user.uid == 0) {
      // Anonymous user...
      if (gallery != 'public') {
        var welcome_message = 'Login to share and view your art.';
        if (gallery == 'friends') {
          welcome_message = 'Sorry, no art from friends was found! You can make friend requests and send private messages at <strong>miativity.com</strong>'
        }
        content.welcome = {
          markup: '<p style="text-align: center;">' + welcome_message + '</p>'
        };
        content.login = {
          theme: 'button_link',
          text: 'Login',
          path: 'user/login',
          options: {
            attributes: {
              'data-icon': 'lock'
            }
          }
        };
        content.join = {
          theme: 'button_link',
          text: 'Join',
          path: 'user/register',
          options: {
            attributes: {
              'data-theme': 'b',
              'data-icon': 'plus'
            }
          }
        };
      }
    }
    else {
      // AUthenticated user...
      if (gallery == 'my') {
        content.add_art = {
          text: 'Upload Art',
          path: 'node/add/art',
          theme: 'button_link',
          options: {
            attributes: {
              'data-icon': 'plus',
              'data-theme': 'c'
            }
          }
        };
      }
    }
    // Hide the gallery only when an anonymous user is looking at the
    // 'my gallery' or 'friends' gallery pages.
    var show_gallery = true;
    if (Drupal.user.uid == 0 && (gallery == 'my' || gallery == 'friends')) {
      show_gallery = false;
    }
    if (show_gallery) {
      content.gallery = {
        theme: 'view',
        path: miativity_gallery_path(gallery),
        row_callback: 'miativity_gallery_page_row',
        empty_callback: 'miativity_gallery_page_empty',
        attributes: {
          id: 'views-view-' + gallery
        }
      };
    }
    return content;
  }
  catch (error) { console.log('miativity_gallery_page - ' + error); }
}

/**
 *
 */
function miativity_gallery_page_empty(view) {
  try {
    var html = '';
    switch (view.name) {
      case 'gallery': // My Gallery
        html += '<p>Sorry, no art was found!</p>';
        break;
      case 'friends': // Friends Gallery
        html += '<p>Sorry, no art from friends was found! You can make friend requests and send private messages at <strong>miativity.com</strong></p>';
        html += theme('button_link', {
            text: 'View Public Gallery',
            path: 'gallery/public'
        });
        break;
    }
    return html;
  }
  catch (error) { console.log('miativity_gallery_page_empty - ' + error); }
}

/**
 *
 */
function miativity_gallery_page_row(view, row) {
  try {
    var title = '<h2>' + row.field_art_title + '</h2>';
    var author = '';
    if (row.field_country) { author = '<p>' + row.field_country + '</p>'; }
    var image = theme('image', {
        path: row.field_art_image
    });
    var link = l(image, row.original, {
      InAppBrowser: true
    });
    return title + author + link;
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

/**
 * Implements hook_services_request_postprocess_alter().
 */
function miativity_services_request_pre_postprocess_alter(options, result) {
  try {
    // Remove the 'My Gallery' page from the DOM and the corresponding Views
    // Datasource result from local storage.
    if (options.service == 'node' && options.resource == 'create') {
      drupalgap_remove_page_from_dom(drupalgap_get_page_id('gallery/my'), { force: true });
      window.localStorage.removeItem(miativity_gallery_path('my') + '&page=0');
    }
  }
  catch (error) {
    console.log('miativity_services_request_postprocess_alter - ' + error);
  }
}

