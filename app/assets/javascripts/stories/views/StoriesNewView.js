define(
  [
    'Class',
    'jquery',
    'backbone',
    'mps',
    'handlebars',
    'jquery_fileupload',
    'backbone.syphon',
    'moment',
    'underscore',
    'validate',
    'stories/models/StoryModel',
    'stories/models/MediaModel',
    'models/UserModel',
    'stories/views/LatestStoriesView',
    'text!stories/templates/storiesNew.handlebars'
  ],
  (
    Class,
    $,
    Backbone,
    mps,
    Handlebars,
    jquery_fileupload,
    BackboneSyphon,
    moment,
    _,
    validate,
    Story,
    Media,
    User,
    LatestStoriesView,
    tpl
  ) => {
    const MAP_CONFIG = {
      zoom: 3,
      minZoom: 3,
      maxZoom: 20,
      center: new google.maps.LatLng(15, 27),
      mapTypeId: google.maps.MapTypeId.HYBRID,
      backgroundColor: '#99b3cc',
      disableDefaultUI: true
    };

    const BASE_URL = 'https://gfw2stories.s3.amazonaws.com/uploads/';

    const constraints = {
      title: {
        presence: {
          message: 'Please enter a title for your story'
        }
      },
      geojson: {
        presence: {
          message: 'Please enter a location for your story'
        }
      },
      email: {
        email: {
          message: 'Please enter a correct email'
        }
      }
    };

    const StoriesNewView = Backbone.View.extend({
      el: '.layout-content',

      template: Handlebars.compile(tpl),

      events: {
        'click #controlZoomIn': '_zoomIn',
        'click #controlZoomOut': '_zoomOut',
        'click #autoLocate': '_autoLocate',
        'input #video': 'videoInput',
        'dragenter .sortable': 'dragenter',
        'dragstart .sortable': 'dragstart',
        'click #submit': 'submit',
        'click .upload_picture': 'showFileSelector',
        'change #hideUser': 'onChangeHideUser'
      },

      initialize(params) {
        this.sourceDrag = undefined;
        this.errors = null;
        this.user = new User();
        this.id = (params && params.id) || null;
        this.router = params.router;
        this.alreadyLoggedIn = params.alreadyLoggedIn;

        if (this.alreadyLoggedIn) {
          this.user.fetch().then(
            () => {
              this.initStory();
            }
          );
        } else {
          this.renderPlaceHolder();
        }
      },

      cache() {
        this.$form = $('#new_story');
        this.$personalInfo = $('#field-personal-info');
      },

      initStory() {
        if (this.id) {
          this.story = new Story({
            id: this.id,
            edit: true
          });
          this.story.fetch().done(
            (res) => {
              this.render(res);
              this.renderMedia();
              this.cache();
            }
          );
        } else {
          this.story = new Story();
          this.render();
          this.cache();
        }
        this.setListeners();
      },

      setListeners() {
        $(document).on('keyup keypress', 'input, textarea', (e) => {
          const charCode = e.which ? e.which : e.keyCode;
          if (charCode === 13) {
            e.preventDefault();
            return false;
          }
        });
      },

      videoInput(e) {
        if ($(e.target).val().length == 0) {
          const removable = document.getElementById('videothumbnail');
          if (removable) {
            removable.parentNode.removeChild(removable);
          }
        } else {
          const media = new Media({
            embedUrl: $(e.target).val()
          });
          this.story.addMedia(media);
          this._addVideoThumbnail(media);
        }
      },

      _getVideoID(url) {
        // template: http://img.youtube.com/vi/<video-id-here>/default.jpg

        if (url.length) {
          const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
          const match = url.match(regExp);
          if (match && match[2].length == 11) {
            mps.publish('Notification/close');
            return `http://img.youtube.com/vi/${match[2]}/default.jpg`;
          }
          mps.publish('Notification/open', [
            'notif-not-a-correct-youtube-link'
          ]);
          return null;
        }
        return null;
      },

      _addVideoThumbnail(media) {
        let vidID = this._getVideoID(media.attributes.embedUrl),
          $thumb = $('#videothumbnail');

        if ($thumb.length > 0) {
          if (vidID) {
            $thumb
              .find('.inner_box')
              .css('background-image', `url(${vidID})`);
            $thumb.data('orderid', media.attributes.embedUrl);
          } else {
            const videos = this.story.get('media').filter((model) => !!model.get('embedUrl'));
            this.story.get('media').remove(videos);

            $thumb.fadeOut(250, () => {
              $thumb.remove();
            });
          }
        } else if (vidID) {
          $('.thumbnails').append(
            `<li class="sortable thumbnail" draggable="true" id="videothumbnail" data-orderid="${
              media.attributes.embedUrl
            }"><div class="inner_box" style=" background-image: url(${
              vidID
            });"></div><a href="#" class="destroy"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shape-close"></use></svg></a></li>`
          );
          $thumb = $('#videothumbnail');
          $thumb.find('.destroy').on(
            'click',
            (e) => {
              e.preventDefault();

              const confirmation = confirm('Are you sure?');

              if (confirmation === true) {
                const videos = this.story.get('media').filter((model) => !!model.get('embedUrl'));
                this.story.get('media').remove(videos);

                $('#video').val('');
                $thumb.fadeOut(250, () => {
                  $thumb.remove();
                });
              }
            }
          );
        }

        this.oldUrl = media.attributes.embedUrl;
      },

      _addImageThumbnail(media) {
        const $thumb = $(
          `<li class="sortable thumbnail" draggable="true" data-orderid="${
            media.attributes.previewUrl
          }" ><div class="inner_box" style=" background-image: url(${
            BASE_URL
          }${media.attributes.previewUrl
          });"></div><a href="#" class="destroy"><svg><use xlink:href="#shape-close"></use></svg></a></li>`
        );

        $('.thumbnails').append($thumb);

        $thumb.find('.destroy').on(
          'click',
          (e) => {
            e.preventDefault();

            const confirmation = confirm('Are you sure?');

            if (confirmation == true) {
              const image = this.story.get('media').filter((model) => model.get('previewUrl') == $thumb.data('orderid'));
              this.story.get('media').remove(image);

              $thumb.fadeOut(250, () => {
                $thumb.remove();
              });
            }
          }
        );
      },

      showFileSelector(event) {
        event.preventDefault();
        this.$('#fileupload').click();
      },

      renderFileUploader() {
        const that = this;

        let remainingFiles = 0;
        $('#fileupload')
          .fileupload({
            url: '/media/upload',
            dataType: 'json',
            autoUpload: true,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            maxFileSize: 4000000, // 4 MB
            // Enable image resizing, except for Android and Opera,
            // which actually support image resizing, but fail to
            // send Blob objects via XHR requests:
            disableImageResize: /Android(?!.*Chrome)|Opera/.test(
              window.navigator.userAgent
            ),
            previewMaxWidth: 132,
            previewMaxHeight: 76,
            previewCrop: true,
            timeout: 3600000
          })

          .on('fileuploadadd', (e, data) => {
            data.context = $('<div/>').appendTo('#files');

            remainingFiles += _.size(data.files);
            _.each(data.files, (file) => {
              if (file && file.size > 4000000) {
                mps.publish('Notification/open', ['notification-limit-exceed']);
              } else {
                const filename = that.prettifyFilename(file.name);
                const $thumbnail = $(
                  `<li class='thumbnail preview' data-name='${
                    filename
                  }' ><div class='filename'>${
                    file.name
                  }</div><div class='spinner'><svg><use xlink:href='#shape-spinner'></use></svg></div></li>`
                );
                $('.thumbnails').append($thumbnail);
                $thumbnail.fadeIn(250);

                const $submitButton = $("form input[type='submit']");
                $submitButton.addClass('disabled');
                $submitButton.attr('disabled', 'disabled');
                $submitButton.val('Please wait...');
              }
            });
          })

          .on('fileuploaddone', (e, data) => {
            const files = [data.result];

            _.each(files, (file) => {
              remainingFiles -= 1;

              const media = new Media({
                previewUrl: file.basename
              });

              that.story.addMedia(media);

              const url = file.url.replace('https', 'http');
              const $thumb = $(
                `<li class="sortable thumbnail" draggable="true" data-orderid="${
                  file.basename
                }" ><div class="inner_box" style=" background-image: url(${
                  url
                });"></div><a href="#" class="destroy"><svg><use xlink:href="#shape-close"></use></svg></a></li>`
              );

              const filename = that.prettifyFilename(file.basename).substring(45);

              // Remove the preview image
              $(`.thumbnail[data-name='${filename}']`).fadeOut(
                250,
                function () {
                  $(this).remove();

                  $('.thumbnails').append($thumb);
                  $thumb.fadeIn(250);
                }
              );

              $thumb.find('.destroy').on(
                'click',
                function (e) {
                  e.preventDefault();

                  const confirmation = confirm('Are you sure?');

                  if (confirmation == true) {
                    const image = this.story.get('media').filter((model) => model.get('previewUrl') == $thumb.data('orderid'));
                    this.story.get('media').remove(image);

                    $thumb.fadeOut(250, () => {
                      $thumb.remove();
                    });
                  }
                }.bind(that)
              );
            });

            if (remainingFiles <= 0) {
              const $submitButton = $("form input[type='submit']");
              $submitButton.val('Submit story');
              $submitButton.removeClass('disabled');
              $submitButton.attr('disabled', false);
            }

            ga('send', 'event', 'Stories', 'New story', 'submit');
          })

          .on('fileuploadfail', (e, data) => {
            mps.publish('Notification/open', [
              'notification-upload-error-server'
            ]);
            const $submitButton = $("form input[type='submit']");
            $submitButton.val('Submit story');
            $submitButton.removeClass('disabled');
            $submitButton.attr('disabled', false);
          });
      },

      zoomToStory() {
        const pos = new google.maps.LatLng(
          this.story.get('lat'),
          this.story.get('lng')
        );
        this.map.panTo(pos);
        this.map.setZoom(18);
      },

      setStoryLocationToCenter() {
        const center = this.map.getCenter();
        this.story.set('geojson', {
          type: 'Point',
          coordinates: [center.lng(), center.lat()]
        });
        this.story.set('lat', center.lat(), { silent: true });
        this.story.set('lng', center.lng(), { silent: true });
      },

      renderMap() {
        const $searchInput = $('.map-search-input');

        // Load map
        this.map = new google.maps.Map($('#map')[0], MAP_CONFIG);

        // Listen to map loaded
        google.maps.event.addListenerOnce(
          this.map,
          'idle',
          () => {
            if (this.story.hasLocation()) {
              this.zoomToStory();
            } else {
              this._autoLocate();
            }
          }
        );

        // Set autocomplete search input
        this.autocomplete = new google.maps.places.Autocomplete(
          $searchInput[0],
          { types: ['geocode'] }
        );
        // Listen to selected areas (search)
        google.maps.event.addListener(
          this.autocomplete,
          'place_changed',
          () => {
            const place = this.autocomplete.getPlace();
            if (place && place.geometry && place.geometry.viewport) {
              this.map.fitBounds(place.geometry.viewport);
            }
            if (
              place &&
              place.geometry &&
              place.geometry.location &&
              !place.geometry.viewport
            ) {
              const index = [];
              for (const x in place.geometry.location) {
                index.push(x);
              }
              this.map.setCenter(
                new google.maps.LatLng(
                  place.geometry.location[index[0]],
                  place.geometry.location[index[1]]
                )
              );
            }
          }
        );

        google.maps.event.addDomListener($searchInput[0], 'keydown', (
          e
        ) => {
          if (e.keyCode == 13) {
            e.preventDefault();
          }
        });

        google.maps.event.addListener(
          this.map,
          'zoom_changed',
          this.setStoryLocationToCenter.bind(this)
        );
        google.maps.event.addListener(
          this.map,
          'dragend',
          this.setStoryLocationToCenter.bind(this)
        );
      },

      _autoLocate(e) {
        const $autoLocate = this.$('#autoLocate');
        $autoLocate.addClass('active');

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              $autoLocate.removeClass('active');
              let lat = position.coords.latitude,
                lng = position.coords.longitude;
              this.story.set('geojson', {
                type: 'Point',
                coordinates: [lng, lat]
              });
              this.story.set('lat', lat, { silent: true });
              this.story.set('lng', lng, { silent: true });
              this.zoomToStory();
            },

            () => {
              $autoLocate.removeClass('active');
              mps.publish('Notification/open', [
                'notification-enable-location'
              ]);
            }
          );
        } else {
          $autoLocate.removeClass('active');
        }
      },

      isbefore(a, b) {
        if (a.parentNode == b.parentNode) {
          for (let cur = a; cur; cur = cur.previousSibling) {
            if (cur === b) {
              return true;
            }
          }
        }
        return false;
      },

      dragenter(e) {
        let target = e.target;
        if (!target.classList.contains('sortable')) {
          // check we're dropping the element in a proper draggable element
          target = target.closest('.sortable');
        }

        if (this.isbefore(this.sourceDrag, target)) {
          target.parentNode.insertBefore(this.sourceDrag, target);
        } else {
          target.parentNode.insertBefore(this.sourceDrag, target.nextSibling);
        }

        const orderedArray = _.map(this.$('.sortable'), (sort) => $(sort).data('orderid'));

        this.story.get('media').move(orderedArray);
      },

      dragstart(e) {
        this.sourceDrag = e.target;
        (e.originalEvent || e).dataTransfer.effectAllowed = 'move';
      },

      // ZOOM
      _zoomIn() {
        this.map.setZoom(this.map.getZoom() + 1);
      },
      _zoomOut() {
        this.map.setZoom(this.map.getZoom() - 1);
      },

      prettifyFilename(filename) {
        const file = filename.substring(0, filename.length - 4);
        return file.toLowerCase().replace(/ /g, '_');
      },

      submit(event) {
        event.preventDefault();

        const attributesFromForm = Backbone.Syphon.serialize(
          this.$('form#new_story')
        );
        // As long as the checkbox is for just the oposite
        attributesFromForm.hideUser = !attributesFromForm.hideUser;

        // Remove 'media' because we want to set it from the model
        // I don't know why this serializing is returning 'media { image: "" }'
        if (attributesFromForm.media) {
          delete attributesFromForm.media;
        }

        this.story.set(
          _.extend({ visible: true }, this.story.toJSON(), attributesFromForm)
        );

        if (this.validate()) {
          this.story.save().then(
            (story) => {
              const id = story.data.id;
              this.router.navigateTo(`stories/${id}`, {
                newStory: !this.id
              });
            }
          );
        } else {
          this.updateForm();
          mps.publish('Notification/open', ['story-new-form-error']);
          $(document).scrollTop(0);
        }
      },

      validate(e) {
        e && e.preventDefault();
        const attributes = this.story.toJSON();

        // Validate form, if is valid the response will be undefined
        this.errors = validate(attributes, constraints);
        return !this.errors;
      },

      render() {
        const story = this.story.toJSON();

        this.$el.html(
          this.template({
            user: this.user.toJSON(),
            story: this.story.toJSON(),
            edition: this.id,
            alreadyLoggedIn: this.alreadyLoggedIn,
            formatted_date: moment(this.story.date).format('YYYY-MM-DD'),
            hideUser: story.hideUser === false
          })
        );

        this.renderMap();
        this.renderFileUploader();

        const latestStoriesView = new LatestStoriesView();
        this.$('#latestStories').html(latestStoriesView.render().el);

        $('#submitAStory').addClass('current');
        document.title = 'Submit a story | Global Forest Watch';

        return this;
      },

      renderPlaceHolder() {
        this.$el.html(
          this.template({
            alreadyLoggedIn: this.alreadyLoggedIn,
            apiHost: window.gfw.config.GFW_API_AUTH
          })
        );
        return this;
      },

      renderMedia() {
        const mediaList = this.story.get('media');

        _.each(
          mediaList.models,
          (media) => {
            if (media.attributes.embedUrl) {
              this._addVideoThumbnail(media);
            }
            if (media.attributes.previewUrl) {
              this._addImageThumbnail(media);
            }
          }
        );
      },

      updateForm() {
        this.$form.find('input, textarea, select').removeClass('-error');
        this.$form.find('label').removeClass('-error');
        for (const key in this.errors) {
          const $input = this.$form.find(`#${key}`);
          const $label = this.$form.find(`label[for=${key}]`);
          $input.addClass('-error');
          $label.addClass('-error');
        }
      },

      /**
       * UI EVENTS
       */
      onChangeHideUser(e) {
        const is_checked = $(e.currentTarget).is(':checked');
        this.$personalInfo.toggleClass('-hidden', !is_checked);
      }
    });

    return StoriesNewView;
  }
);
