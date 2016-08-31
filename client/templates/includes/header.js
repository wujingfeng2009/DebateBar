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

    if (currentRouteName === 'newPosts' || currentRouteName === 'bestPosts'
        || currentRouteName === 'favoritePosts' || currentRouteName === 'home') {
        return true;
    } else {
        return false;
    }
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