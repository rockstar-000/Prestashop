/**
 *  Light Switch @version v0.1.4
 */
$(document).ready(function(){
	
(function () {
  let lightSwitch = document.getElementById('lightSwitch');
  if (!lightSwitch) {
    return;
  }

  /**
   * @function darkmode
   * @summary: changes the theme to 'dark mode' and save settings to local stroage.
   * Basically, replaces/toggles every CSS class that has '-light' class with '-dark'
   */
  function darkMode() {
    document.querySelectorAll('.bg-light').forEach((element) => {
      element.className = element.className.replace(/-light/g, '-dark');
    });

    document.body.classList.add('bg-dark');

    if (document.body.classList.contains('text-dark')) {
      document.body.classList.replace('text-dark', 'text-light');
    } else {
      document.body.classList.add('text-light');
    }

    // Tables
    var tables = document.querySelectorAll('table');
    for (var i = 0; i < tables.length; i++) {
      // add table-dark class to each table
      tables[i].classList.add('table-dark');
    }

    var logo_title = document.querySelectorAll('logo_title');
    for (var i = 0; i < logo_title.length; i++) {
      // add table-dark class to each table
      logo_title[i].classList.add('table-dark');
    }

    var card = document.querySelectorAll('.card');
    for (var i = 0; i < card.length; i++) {
      // add table-dark class to each table
      card[i].classList.add('table-dark');
    }

    var li_journal = document.querySelectorAll('.list-group-item');
    for (var i = 0; i < li_journal.length; i++) {
      // add table-dark class to each table
      li_journal[i].classList.add('table-dark');
    }

    var pricing = document.querySelectorAll('.pricing');
    for (var i = 0; i < pricing.length; i++) {
      // add table-dark class to each table
      pricing[i].classList.add('table-dark');
    }

    var card_header = document.querySelectorAll('.card-header');
    for (var i = 0; i < card_header.length; i++) {
      // add table-dark class to each table
      card_header[i].classList.add('table-dark');
    }

    var sidebar = document.querySelectorAll('.main-sidebar');
    for (var i = 0; i < sidebar.length; i++) {
      // add table-dark class to each table
      sidebar[i].classList.add('table-dark');
    }

    var nav_title = document.querySelectorAll('.nav-title');
    for (var i = 0; i < nav_title.length; i++) {
      // add table-dark class to each table
      nav_title[i].classList.add('table-dark');
    }

    var sect_td = document.querySelectorAll('.sect1_td');
    for (var i = 0; i < sect_td.length; i++) {
      // add table-dark class to each table
      sect_td[i].classList.add('table-dark');
    }

    var sect_td2 = document.querySelectorAll('.sect_td2');
    for (var i = 0; i < sect_td2.length; i++) {
      // add table-dark class to each table
      sect_td2[i].classList.add('table-dark');
    }

    var modal_content = document.querySelectorAll('.modal-content');
    for (var i = 0; i < modal_content.length; i++) {
      // add table-dark class to each table
      modal_content[i].classList.add('table-dark');
    }

    var dropdown_menu = document.querySelectorAll('.dropdown-menu');
    for (var i = 0; i < dropdown_menu.length; i++) {
        dropdown_menu[i].classList.add('table-dark');
    }

    var dropdown_item = document.querySelectorAll('.dropdown-item');
    for (var i = 0; i < dropdown_item.length; i++) {
        dropdown_item[i].classList.add('table-dark');
    }


    var nav_header = document.querySelectorAll('.navbar-bg');
    for (var i = 0; i < nav_header.length; i++) {
        nav_header[i].classList.add('table-dark');
    }

    var section_header = document.querySelectorAll('.section-header');
    for (var i = 0; i < section_header.length; i++) {
        section_header[i].classList.add('table-dark');
    }

    var custom_select = document.querySelectorAll('.custom-select');
    for (var i = 0; i < custom_select.length; i++) {
        custom_select[i].classList.add('table-dark');
    }

    var search = document.querySelectorAll('.form-control-sm');
    for (var i = 0; i < search.length; i++) {
        search[i].classList.add('table-dark');
    }

    var daterangepicker = document.querySelectorAll('.daterangepicker');
    for (var i = 0; i < daterangepicker.length; i++) {
        daterangepicker[i].classList.add('table-dark');
    }

    var form = document.querySelectorAll('.form-control');
    for (var i = 0; i < form.length; i++) {
      // add table-dark class to each table
      form[i].classList.add('table-dark');
    }

    var logo = document.querySelectorAll('.sidebar-brand');
    for (var i = 0; i < logo.length; i++) {
      if (logo[i].classList.contains('side-bar-logo')) {
        logo[i].classList.remove('side-bar-logo');
        logo[i].classList.add('side-bar-logo-black');
      }
    }

    // set light switch input to true
    if (!lightSwitch.checked) {
      lightSwitch.checked = true;
    }
    localStorage.setItem('lightSwitch', 'dark');
  }

  /**
   * @function lightmode
   * @summary: changes the theme to 'light mode' and save settings to local stroage.
   */
  function lightMode() {
    document.querySelectorAll('.bg-dark').forEach((element) => {
      element.className = element.className.replace(/-dark/g, '-light');
    });

    document.body.classList.add('bg-light');

    if (document.body.classList.contains('text-light')) {
      document.body.classList.replace('text-light', 'text-dark');
    } else {
      document.body.classList.add('text-dark');
    }

    // Tables
    var tables = document.querySelectorAll('table');
    for (var i = 0; i < tables.length; i++) {
      if (tables[i].classList.contains('table-dark')) {
        tables[i].classList.remove('table-dark');
      }
    }

    var li_journal = document.querySelectorAll('list-group-item');
    for (var i = 0; i < li_journal.length; i++) {
      if (li_journal[i].classList.contains('table-dark')) {
        li_journal[i].classList.remove('table-dark');
      }
    }

    var sect = document.querySelectorAll('.sect1_td');
    for (var i = 0; i < sect.length; i++) {
      if (sect[i].classList.contains('table-dark')) {
        sect[i].classList.remove('table-dark');
      }
    }

    var sect2 = document.querySelectorAll('.sect_td2');
    for (var i = 0; i < sect2.length; i++) {
      if (sect2[i].classList.contains('table-dark')) {
        sect2[i].classList.remove('table-dark');
      }
    }

    var logo_title = document.querySelectorAll('.logo_title');
    for (var i = 0; i < logo_title.length; i++) {
      if (logo_title[i].classList.contains('table-dark')) {
        logo_title[i].classList.remove('table-dark');
      }
    }

    var modal_content = document.querySelectorAll('.modal-content');
    for (var i = 0; i < modal_content.length; i++) {
      if (modal_content[i].classList.contains('table-dark')) {
        modal_content[i].classList.remove('table-dark');
      }
    }

    var dropdown_menu = document.querySelectorAll('.dropdown-menu');
    for (var i = 0; i < dropdown_menu.length; i++) {
      if (dropdown_menu[i].classList.contains('table-dark')) {
        dropdown_menu[i].classList.remove('table-dark');
      }
    }

    var dropdown_item = document.querySelectorAll('.dropdown-item');
    for (var i = 0; i < dropdown_item.length; i++) {
      if (dropdown_item[i].classList.contains('table-dark')) {
        dropdown_item[i].classList.remove('table-dark');
      }
    }

    var pricing = document.querySelectorAll('.pricing');
    for (var i = 0; i < pricing.length; i++) {
      if (pricing[i].classList.contains('table-dark')) {
        pricing[i].classList.remove('table-dark');
      }
    }

    var custom_select = document.querySelectorAll('.custom-select');
    for (var i = 0; i < custom_select.length; i++) {
      if (custom_select[i].classList.contains('table-dark')) {
        custom_select[i].classList.remove('table-dark');
      }
    }

    var section_header = document.querySelectorAll('.section-header');
    for (var i = 0; i < section_header.length; i++) {
      if (section_header[i].classList.contains('table-dark')) {
        section_header[i].classList.remove('table-dark');
      }
    }

    var nav_header = document.querySelectorAll('.navbar-bg');
    for (var i = 0; i < nav_header.length; i++) {
      if (nav_header[i].classList.contains('table-dark')) {
        nav_header[i].classList.remove('table-dark');
      }
    }

    var card = document.querySelectorAll('.card');
    for (var i = 0; i < card.length; i++) {
      if (card[i].classList.contains('table-dark')) {
        card[i].classList.remove('table-dark');
      }
    }

    var sidebar = document.querySelectorAll('.main-sidebar');
    for (var i = 0; i < sidebar.length; i++) {
      if (sidebar[i].classList.contains('table-dark')) {
        sidebar[i].classList.remove('table-dark');
      }
    }

    var form = document.querySelectorAll('.form-control');
    for (var i = 0; i < form.length; i++) {
      if (form[i].classList.contains('table-dark')) {
        form[i].classList.remove('table-dark');
      }
    }

    var search = document.querySelectorAll('.form-control-sm');
    for (var i = 0; i < search.length; i++) {
      if (search[i].classList.contains('table-dark')) {
        search[i].classList.remove('table-dark');
      }
    }

    var nav_title = document.querySelectorAll('.nav-title');
    for (var i = 0; i < nav_title.length; i++) {
      if (nav_title[i].classList.contains('table-dark')) {
        nav_title[i].classList.remove('table-dark');
      }
    }

    var card_header = document.querySelectorAll('.card-header');
    for (var i = 0; i < card_header.length; i++) {
      if (card_header[i].classList.contains('table-dark')) {
        card_header[i].classList.remove('table-dark');
      }
    }

    var logo = document.querySelectorAll('.sidebar-brand');
    for (var i = 0; i < logo.length; i++) {
      if (logo[i].classList.contains('side-bar-logo-black')) {
        logo[i].classList.remove('side-bar-logo-black');
        logo[i].classList.add('side-bar-logo');
      }
    }


    if (lightSwitch.checked) {
      lightSwitch.checked = false;
    }
    localStorage.setItem('lightSwitch', 'light');
  }

  /**
   * @function onToggleMode
   * @summary: the event handler attached to the switch. calling @darkMode or @lightMode depending on the checked state.
   */
  function onToggleMode() {
    if (lightSwitch.checked) {
      darkMode();
    } else {
      lightMode();
    }
  }

  /**
   * @function getSystemDefaultTheme
   * @summary: get system default theme by media query
   */
  function getSystemDefaultTheme() {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkThemeMq.matches) {
      return 'dark';
    }
    return 'light';
  }

  function setup() {
    var settings = localStorage.getItem('lightSwitch');
    if (settings == null) {
      settings = getSystemDefaultTheme();
    }

    if (settings == 'dark') {
      lightSwitch.checked = true;
    }

    lightSwitch.addEventListener('change', onToggleMode);
    onToggleMode();
  }

  setup();
})();

});