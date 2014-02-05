window.localStorage.clear();

/* Specify DrupalGap Mobile Application Settings Here */

/****************************************|
 * Drupal Settings (provided by jDrupal) |
 ****************************************/
 
/* Drupal Paths */
 
// Site Path (do not use a trailing slash)
Drupal.settings.site_path = 'https://www.miativity.com'; // e.g. http://www.example.com

// Default Services Endpoint Path
Drupal.settings.endpoint = 'drupalgap';

// Public Files Directory Path
Drupal.settings.file_public_path = 'sites/default/files';

// The Default Language Code
Drupal.settings.language_default = 'und';

/* Drupal Caching */

// Set to true to enable local storage caching.
Drupal.settings.cache.entity.enabled = true;
Drupal.settings.cache.views.enabled = true;

// Number of seconds before cached copy expires. Set to 0 to cache forever, set
// to 60 for one minute, etc.
// @todo - zero should be no caching!
Drupal.settings.cache.entity.expiration = 1800;
Drupal.settings.cache.views.expiration = 1800;

/*********************|
 * DrupalGap Settings |
 *********************/

/***********************|
 * DrupalGap Appearance |
 ***********************/

// App Title
drupalgap.settings.title = 'Miativity';
 
// App Front Page
drupalgap.settings.front = 'home';

// Theme
drupalgap.settings.theme = 'miativity_theme';

// Logo
drupalgap.settings.logo = 'themes/easystreet3/images/drupalgap.jpg';

// Loader Animations - http://demos.jquerymobile.com/1.4.0/loader/
drupalgap.settings.loader = {
  loading: {
    text: 'Loading...',
    textVisible: true,
    theme: 'b'
  },
  saving: {
    text: 'Saving...',
    textVisible: true,
    theme: 'b'
  },
  deleting: {
    text: 'Deleting...',
    textVisible: true,
    theme: 'b'
  }
};

/*****************************************|
 * Modules - http://drupalgap.org/node/74 |
 *****************************************/

// Contributed Modules - www/app/modules

// E.g., these 2 lines will load the module at www/app/modules/example
//var example_contrib_module = module_object_template('example');
//Drupal.modules.contrib.example = example_contrib_module;
// @todo - make this an easy one liner, e.g. module_load('contrib', 'date', {...});

var date_contrib_module = module_object_template('date');
Drupal.modules.contrib.date = date_contrib_module;

// Custom Modules - www/app/modules/custom

// E.g., these 2 lines will load the module at www/app/modules/custom/example
//var example_custom_module = module_object_template('example');
//Drupal.modules.custom.example = example_custom_module;
// @todo - make this an easy one liner, e.g. module_load('custom', 'my_module', {...});

var miativity_custom_module = module_object_template('miativity');
Drupal.modules.custom.miativity = miativity_custom_module;

/***************************************|
 * Menus - http://drupalgap.org/node/85 |
 ***************************************/
drupalgap.settings.menus = {}; // Do not remove this line.

// User Menu Anonymous
/*drupalgap.settings.menus['user_menu_anonymous'] = {
  links:[]
};*/

// User Menu Authenticated
/*drupalgap.settings.menus['user_menu_authenticated'] = {
  links:[]
};*/

// Main Menu
drupalgap.settings.menus['main_menu'] = {
  links:[
    {
      title:'My Gallery',
      path:'gallery/my',
      options:{
        attributes:{
          'data-icon':'grid'
        }
      }
    },
    {
      title:'Friends',
      path:'gallery/friends',
      options:{
        attributes:{
          'data-icon':'cloud'
        }
      }
    },
    {
      title:'Public',
      path:'gallery/public',
      options:{
        attributes:{
          'data-icon':'eye'
        }
      }
    }
  ]
};

/****************************************|
 * Blocks - http://drupalgap.org/node/83 |
 ****************************************/
drupalgap.settings.blocks = {}; // Do not remove this line.

// Miativity Theme Blocks
drupalgap.settings.blocks.miativity_theme = {
  header: {
    title: { }
  },
  /*sub_header: {
    controls: { }
  },*/
  navigation: {
    main_menu: { },
  },
  content: {
    main: { }
  },
  footer: {
   slogan: { }
  }
};

/****************************************************|
 * Region Menu Links - http://drupalgap.org/node/173 |
 ****************************************************/
drupalgap.settings.menus.regions = {}; // Do not remove this line.

// Header Region Links
drupalgap.settings.menus.regions['header'] = {
  links:[
    /* Home Button */
    {
      title:'Home',
      path:'',
      options:{
        attributes:{
          "data-icon":"home",
          "class":"ui-btn-left"
        }
      },
      pages:{
        value:[''],
        mode:"exclude"
      }
    },
    /* Back Button */
    {
      title:'Back',
      options:{
        attributes:{
          "data-icon":"back",
          "class":"ui-btn-right",
          "onclick":"javascript:drupalgap_back();"
        }
      },
      pages:{
        value:[''],
        mode:"exclude"
      }
    }
    /* Add Art Button */
    /*{
      title:'Art',
      path: 'node/add/art',
      options:{
        attributes:{
          "data-icon":"plus",
          "class":"ui-btn-right"
        }
      },
      pages:{
        value:['gallery/my'],
        mode:"include"
      },
      roles:{
        value:['authenticated user'],
        mode:'include'
      }
    }*/
  ]
};

/*********|
 * Camera |
 **********/
drupalgap.settings.camera = {
  quality: 75
};

/**************|
 * Development |
 **************/

// Debug
//   PhoneGap 3.0.0 and above note, you must install a plugin to see console
//   log messages. See the 'Debug console' section here:
//   http://docs.phonegap.com/en/edge/guide_cli_index.md.html#The%20Command-line%20Interface
Drupal.settings.debug = false; /* Set to true to see console.log debug
                                  information. Set to false when publishing
                                  app! */

/***********************|
 * Performance Settings |
 ***********************/
drupalgap.settings.cache = {}; // Do not remove this line.

// Theme Registry - Set to true to load the page.tpl.html contents from cache.
drupalgap.settings.cache.theme_registry = true;

