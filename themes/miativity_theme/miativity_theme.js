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
          "data-theme":"e"
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
          "data-role":"footer"
        }
      }
    }
  };
  return theme;
}

