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
  (
    $,
    Backbone,
    NotificationsView,
    User,
    StoriesIndexView,
    StoriesListView,
    StoriesNewView,
    StoriesShowView,
    LoginView
  ) => {
    const StoriesRouter = Backbone.Router.extend({
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

      initialize() {
        new NotificationsView();
      },

      navigateTo(route, params) {
        window.scrollTo(0, 0);
        this.setParams(params);
        this.navigate(route, {
          trigger: true
        });
      },

      setParams(params) {
        this.status.set({
          params
        });
      },

      clearParams() {
        this.status.set({
          params: null
        });
      },

      index() {
        new StoriesIndexView({
          el: '.layout-content'
        });
      },

      listStories() {
        const storiesList = new StoriesListView({
          el: '.layout-content'
        });
      },

      checkLoggedIn() {
        this.user = new User();
        return this.user.fetch();
      },

      newStory() {
        this.checkLoggedIn()
          .then(
            () => {
              new StoriesNewView({
                router: this,
                alreadyLoggedIn: true
              });
            }
          )

          .fail(
            () => {
              new StoriesNewView({
                router: this,
                alreadyLoggedIn: false
              });
            }
          );
      },

      showStory(storyId) {
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

      editStory(storyId) {
        this.checkLoggedIn()
          .then(
            () => {
              const editStoryView = new StoriesNewView({
                id: storyId,
                alreadyLoggedIn: true,
                router: this
              });
            }
          )

          .fail(
            () => {
              const loginView = new LoginView({
                message: 'Please log in to edit a story.'
              });
              this.el.html(loginView.render().el);
            }
          );
      },

      show404() {
        window.location = '/404';
      }
    });

    return StoriesRouter;
  }
);
