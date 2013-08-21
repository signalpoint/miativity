/**
 * Implements hook_block_info().
 */
function miativity_block_info() {
  var blocks = {
    slogan:{
      delta:'slogan',
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
    content = '<h4>My Creativity. Shared.</h4>';
  }
  return content;
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
      page_callback:'miativity_public_gallery_page'
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
  if (drupalgap.user.uid == 0) { // Anonymous users.
    content.intro = {
      markup:'<p>Share your art in a gallery, create art collections, and more!</p>'
    };  
  }
  else { // Authenticated users.
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

function miativity_public_gallery_page() {
  return 'gallery!';
}

function miativity_my_gallery_page() {
  var content = {
    create_content:{
      theme:'button_link',
      text:'Create content',
      path:'node/add',
      attributes:{'data-icon':'add'}
    },
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
    path:'drupalgap/gallery/' + drupalgap.user.uid,
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

