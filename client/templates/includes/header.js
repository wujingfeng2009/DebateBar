Template.header.onCreated( function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
        subNavbarOpen: false,
    });
});

Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName().indexOf(name) >= 0;
    });
    return active && 'active';
  },
  needSubNavbar: function() {

    //const instance = Template.instance();
    //var subNavbarOpen = instance.state.get('subNavbarOpen');

    var currentRouteName = Router.current().route.getName();
    console.log('jimvon currentRouteName: ' + currentRouteName);

    if (currentRouteName.indexOf('Topics') >= 0
        || currentRouteName.indexOf('Debates') >= 0
        || currentRouteName.indexOf('Predictions') >= 0
        || currentRouteName.indexOf('Bets') >= 0
        || currentRouteName.indexOf('home') >= 0)
        return true;

    return false;
  },
  pathForNew: function() {
    var currentRouteName = Router.current().route.getName();

    if (currentRouteName.indexOf('Topics') >= 0 || currentRouteName.indexOf('home') >= 0)
        return Router.routes.newTopics.path({ postsLimit: 5});
    else if (currentRouteName.indexOf('Debates') >= 0)
        return Router.routes.newDebates.path({ debatesLimit: 5});
    else if (currentRouteName.indexOf('Predictions') >= 0)
        return Router.routes.newPredictions.path({ predictionsLimit: 5});
    else if (currentRouteName.indexOf('Bets') >= 0)
        return Router.routes.newBets.path({ betsLimit: 5});

    return '#';
  },
  pathForHot: function() {
    var currentRouteName = Router.current().route.getName();

    if (currentRouteName.indexOf('Topics') >= 0 || currentRouteName.indexOf('home') >= 0)
        return Router.routes.hotTopics.path({ postsLimit: 5});
    else if (currentRouteName.indexOf('Debates') >= 0)
        return Router.routes.hotDebates.path({ debatesLimit: 5});
    else if (currentRouteName.indexOf('Predictions') >= 0)
        return Router.routes.hotPredictions.path({ predictionsLimit: 5});
    else if (currentRouteName.indexOf('Bets') >= 0)
        return Router.routes.hotBets.path({ betsLimit: 5});

    return '#';
  },
  pathForFavorite: function() {
    var currentRouteName = Router.current().route.getName();

    if (currentRouteName.indexOf('Topics') >= 0 || currentRouteName.indexOf('home') >= 0)
        return Router.routes.favoriteTopics.path({ postsLimit: 5});
    else if (currentRouteName.indexOf('Debates') >= 0)
        return Router.routes.favoriteDebates.path({ debatesLimit: 5});
    else if (currentRouteName.indexOf('Predictions') >= 0)
        return Router.routes.favoritePredictions.path({ predictionsLimit: 5});
    else if (currentRouteName.indexOf('Bets') >= 0)
        return Router.routes.favoriteBets.path({ betsLimit: 5});

    return '#';
  }
});

/*
Template.header.events({
    'click .new-path': function(e, instance) {
        instance.state.set('subNavbarOpen', true);
        e.preventDefault();

        Router.go(nextPath);
    },
});
*/