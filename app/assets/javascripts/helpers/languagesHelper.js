define([], function() {

  var DEFAULT_LANGUAGE = 'en';

  /**
  * List of the key languages of the platform
  */

  var languageList = {
    en: 'English',
    zh: '中文',
    fr: 'Français',
    id: 'Bahasa Indonesia',
    pt_BR: 'Português',
    es_MX: 'Español'
  };

  var languagesHelper = {

    /**
     * Returns the list of key languages
     * @returns {Object} key languages list
     */
    getList: function() {
      return languageList;
    },

    /**
     * Returns a list of the key languages
     * with the selected option passed by param
     * @param {string} selected language
     * @returns {Array} list of languages with selection
     */
    getListSelected: function(selectedLanguage) {
      var langList = [];

      for (var lang in languageList) {
        langList.push({
          key: lang,
          name: languageList[lang],
          selected: lang === selectedLanguage ? 'selected' : ''
        });
      }
      return langList;
    },

    /**
     * Returns the current language from Transifex
     * @returns {string} language selected
     */
    getTransifexLanguage: function() {
      var lang = DEFAULT_LANGUAGE;
      if (window.Transifex) {
        lang = window.Transifex.live.getSelectedLanguageCode();
      }
      return lang;
    }
  }
  return languagesHelper;

});
