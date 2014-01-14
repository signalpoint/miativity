/**
 * Implements DrupalGap's template_info() hook.
 */
function miativity_theme_info() {
  var theme = {
    name:"miativity_theme",
    regions:{
      header:{
        attributes:{
          "data-role":"header"
        }
      },
      sub_header:{
        attributes:{
          "data-role":"header",
          "data-theme":"b"
        }
      },
      navigation:{
        attributes:{
          "data-role":"navbar"
        }
      },
      content:{
        attributes:{
          "data-role":"content"
        }
      },
      footer:{
        attributes:{
          "data-role":"footer",
          "data-theme":"c"
        }
      }
    }
  };
  return theme;
}

/**
 * Themes a pager next link.
 * @param {Object} variables
 * @return {String}
 */
function miativity_theme_pager_next(variables) {
  try {
    var html;
    variables.text = 'NEXT &raquo;';
    variables.attributes.class += ' pager_next';
    variables.attributes.onclick = 'miativity_gallery_pager_click(this)';
    html = theme_pager_link(variables);
    return html;
  }
  catch (error) { console.log('miativity_theme_pager_next - ' + error); }
}

/**
 * Themes a pager previous link.
 * @param {Object} variables
 * @return {String}
 */
function miativity_theme_pager_previous(variables) {
  try {
    var html;
    variables.text = '&laquo; PREVIOUS';
    variables.attributes.class += ' pager_prev';
    variables.attributes.onclick = 'miativity_gallery_pager_click(this)';
    html = theme_pager_link(variables);
    return html;
  }
  catch (error) { console.log('miativity_theme_pager_previous - ' + error); }
}

