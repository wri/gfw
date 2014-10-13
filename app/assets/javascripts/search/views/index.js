gfw.ui.view.SearchIndex = cdb.core.View.extend({
  el: document.body,

  events : {
    'keyup #search' : '_search'
  },

  initialize: function() {
    this.url = '/search/'
  },

  _search : function(e){
    var searchText = $(e.currentTarget).val(),
        val = $.trim(searchText).replace(/ +/g, ' ').toLowerCase();

    if (e.keyCode == 13 && searchText.length > 1) {
      window.location = this.url+decodeURIComponent(searchText).replace(/ +/g, '-').toLowerCase();
    };      
  
  }
});