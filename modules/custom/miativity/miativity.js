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
      pageshow: 'miativity_gallery_pageshow',
      page_arguments: [1]
    },
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
        markup: '<input type="hidden" id="miativity_gallery" value=""/>'
      },
      pager: {
        theme: 'pager',
        path: miativity_gallery_path(gallery)
      },
      public_gallery_container: {
        markup: '<div id="' + gallery + '_gallery_container" class="miativity_gallery_container">' +
          '<h2></h2>' +
          '<a class="gallery_original"><img src="" /></a>' +
        '</div>'
      }
    };
    return content;
  }
  catch (error) { console.log('miativity_gallery_page - ' + error); }
}

var miativity_gallery_page_numbers = {
  public: 0,
  friends: 0,
  my: 0
};

/**
 *
 */
function miativity_gallery_pageshow(gallery) {
  try {
    var path = miativity_gallery_path(gallery);
    if (miativity_gallery_page_numbers[gallery] != 0) {
      path += '&page=' + miativity_gallery_page_numbers[gallery];
    }
    views_datasource_get_view_result(path, {
        success: function(result) {
          console.log(path);
          dpm(result);
          if (result.nodes.length == 0) { return; }
          var node = result.nodes[0].node;
          miativity_gallery_render_art(gallery, node);
        }
    });
  }
  catch (error) { console.log('miativity_gallery_pageshow - ' + error); }
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
 *
 */
function miativity_gallery_render_art(gallery, node) {
  try {
    $('#miativity_gallery').val(gallery);
    var id = '#' + gallery + '_gallery_container';
    $(id + ' h2').html(node.field_art_title);
    $(id + ' img').attr('src', node.field_art_image);
    var onclick =
      'javascript:window.open("' + node.original  + '", "_blank", "location=yes");';
    $(id + ' a.gallery_original').attr('onclick', onclick);
  }
  catch (error) {
    console.log('miativity_gallery_render_art - ' + error);
  }
}

/**
 *
 */
function miativity_gallery_pager_click(pager) {
  try {
    var gallery = $('#miativity_gallery').val();
    $(pager).removeClass('ui-btn-active');
    if ($(pager).hasClass('pager_prev')) {
      miativity_gallery_page_change(gallery, -1);
    }
    else {
      miativity_gallery_page_change(gallery, 1);
    }
  }
  catch (error) {
    console.log('miativity_gallery_pager_click - ' + error);
  }
}

/**
 *
 */
function miativity_gallery_page_change(gallery, direction) {
  try {
    var page = miativity_gallery_page_numbers[gallery] + direction;
    if (page < 0) { return; }
    miativity_gallery_page_numbers[gallery] += direction;
    miativity_gallery_pageshow(gallery);
  }
  catch (error) {
    console.log('miativity_gallery_page_change - ' + error);
  }
}

