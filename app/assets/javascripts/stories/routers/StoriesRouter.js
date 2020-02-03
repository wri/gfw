define(
  [
    'jquery',
    'backbone',
    'views/NotificationsView',
    'models/UserModel',
    'stories/views/StoriesIndexView',
    'stories/views/StoriesListView',
    'stories/views/StoriesNewView',
    'stories/views/StoriesShowView',
    'connect/views/LoginView'
  ],
  function(
    $,
    Backbone,
    NotificationsView,
    User,
    StoriesIndexView,
    StoriesListView,
    StoriesNewView,
    StoriesShowView,
    LoginView
  ) {
    var StoriesRouter = Backbone.Router.extend({
      status: new (Backbone.Model.extend({
        params: null
      }))(),

      el: $('.layout-content'),

      routes: {
        stories: 'listStories',
        'stories/crowdsourcedstories': 'listStories',
        'stories/new': 'newStory',
        'stories/edit/:id': 'editStory',
        'stories/:id': 'showStory',
        '*path': 'show404'
      },

      initialize: function() {
        new NotificationsView();
      },

      navigateTo: function(route, params) {
        window.scrollTo(0, 0);
        this.setParams(params);
        this.navigate(route, {
          trigger: true
        });
      },

      setParams: function(params) {
        this.status.set({
          params
        });
      },

      clearParams: function() {
        this.status.set({
          params: null
        });
      },

      index: function() {
        new StoriesIndexView({
          el: '.layout-content'
        });
      },

      listStories: function() {
        var storiesList = new StoriesListView({
          el: '.layout-content'
        });
      },

      checkLoggedIn: function() {
        this.user = new User();
        return this.user.fetch();
      },

      newStory: function() {
        this.checkLoggedIn()
          .then(
            function() {
              new StoriesNewView({
                router: this,
                alreadyLoggedIn: true
              });
            }
          )

          .fail(
            function() {
              new StoriesNewView({
                router: this,
                alreadyLoggedIn: false
              });
            }
          );
      },

      showStory: function(storyId) {
        if (this.storyView) {
          this.storyView.remove();
        }
        this.storyView = new StoriesShowView({
          el: '.layout-content',
          id: storyId,
          opts: _.clone(this.status.attributes.params)
        });
        this.clearParams();
      },

      editStory: function(storyId) {
        this.checkLoggedIn()
          .then(
            function() {
              var editStoryView = new StoriesNewView({
                id: storyId,
                alreadyLoggedIn: true,
                router: this
              });
            }
          )

          .fail(
            function() {
              var loginView = new LoginView({
                message: 'Please log in to edit a story.'
              });
              this.el.html(loginView.render().el);
            }
          );
      },

      show404: function() {
        window.location = '/404';
      }
    });

    return StoriesRouter;
  }
);