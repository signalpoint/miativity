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
    public_gallery:{
      title:'Public Gallery',
      page_callback:'miativity_public_gallery_page',
      pageshow: 'miativity_public_gallery_pageshow'
    },
    my_gallery:{
      title:'My Gallery',
      page_callback:'miativity_my_gallery_page',
      pageshow:'miativity_my_gallery_pageshow'
    },
    friends_gallery:{
      title:'Friends Gallery',
      page_callback:'miativity_friends_gallery_page'
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
  }
  else { // Authenticated users.
    /*content.create_content = {
      theme:'button_link',
      text:'Create content',
      path:'node/add',
      attributes:{'data-icon':'add'}
    };*/
    content.upload_art = {
      theme:'button_link',
      text:'Upload Art',
      path:'node/add/art',
      attributes:{'data-icon':'add'}
    };
    content.my_gallery = {
      theme:'button_link',
      text:'My Gallery',
      path:'my_gallery'
    };
    content.friends_gallery = {
      theme:'button_link',
      text:'Friends Gallery',
      path:'friends_gallery'
    };
  }
  content.public_gallery = {
    theme:'button_link',
    text:'View Public Gallery',
    path:'public_gallery'
  };
  return content;
}

var miativity_public_gallery_page_number = 0;
function miativity_public_gallery_page() {
  try {
    var onclick = "miativity_public_gallery_pager_click(this)";
    var pager_prev =
      l('&laquo;', null, {
          attributes: {
            'class': 'pager pager_prev',
            'onclick': onclick
          }
        }
      );
    var pager_next =
      l('&raquo;', null, {
          attributes: {
            'class': 'pager pager_next',
            'onclick': onclick
          }
        }
      );
    var content = {
      public_gallery_container: {
        markup: '<div id="public_gallery_container">' +
          '<h2></h2>' +
          pager_prev +
          '<img src="" />' +
          pager_next +
        '</div>'
      }
    };
    return content;
  }
  catch (error) { console.log('miativity_public_gallery_page - ' + error); }
}

/**
 *
 */
function miativity_public_gallery_pageshow() {
  try {
    var path = 'drupalgap/public-gallery';
    if (miativity_public_gallery_page_number != 0) {
      path += '&page=' + miativity_public_gallery_page_number;
    }
    views_datasource_get_view_result(path, {
        success: function(result) {
          if (result.nodes.length == 0) { return; }
          var node = result.nodes[0].node;
          miativity_public_gallery_render_art(node);
        }
    });
  }
  catch (error) { console.log('miativity_public_gallery_pageshow - ' + error); }
}


/**
 *
 */
function miativity_public_gallery_render_art(node) {
  try {
    $('#public_gallery_container h2').html(node.field_art_title);
    $('#public_gallery_container img').attr('src', node.field_art_image);
  }
  catch (error) {
    console.log('miativity_public_gallery_render_art - ' + error);
  }
}

/**
 *
 */
function miativity_public_gallery_pager_click(pager) {
  try {
    if ($(pager).hasClass('pager_prev')) {
      alert('prev');
    }
    else {
      alert('next');
    }
  }
  catch (error) {
    console.log('miativity_public_gallery_pager_click - ' + error);
  }
}

/**
 *
 */
function miativity_public_gallery_pager_click(pager) {
  try {
    if ($(pager).hasClass('pager_prev')) {
      miativity_public_gallery_page_change(-1);
    }
    else {
      miativity_public_gallery_page_change(1);
    }
  }
  catch (error) {
    console.log('miativity_public_gallery_pager_click - ' + error);
  }
}

/**
 *
 */
function miativity_public_gallery_page_change(direction) {
  try {
    var page = miativity_public_gallery_page_number + direction;
    if (page < 0) { return; }
    miativity_public_gallery_page_number += direction;
    miativity_public_gallery_pageshow();
  }
  catch (error) {
    console.log('miativity_public_gallery_page_change - ' + error);
  }
}

function miativity_my_gallery_page() {
  var content = {
    gallery_listing:{
      theme:'jqm_item_list',
      title:'Gallery List',
      items:[],
      attributes:{'id':'gallery_listing_items'},
    }
  };
  return content;
}

function miativity_my_gallery_pageshow() {
  drupalgap.views_datasource.call({
    path:'drupalgap/gallery/' + Drupal.user.uid,
    success:function(data){
      if (data.nodes.length > 0) {
        var items = [];
        $.each(data.nodes, function(index, object){
            var items = [];
            $.each(data.nodes, function(index, object){
                var node = object.node;
                items.push(l(node.field_art_title, 'node/' + node.nid));
            });
            drupalgap_item_list_populate("#gallery_listing_items", items);
        });
      }
      else {
        var items = [];
        items.push('Your Gallery is Empty!');
        drupalgap_item_list_populate("#gallery_listing_items", items);
      }
    },
  });
}

function miativity_friends_gallery_page() {
  return 'friends gallery!';
}

