Template.predictionItem.onCreated( function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
    editFormOpen: false,
    commentFormOpen: false,
    });
});

Template.predictionItem.helpers({
    ownPrediction: function() {
        return this.userId === Meteor.userId();
    },
    canDelete: function() {
        return this.userId === Meteor.userId() && this.commentsCount === 0;
    },
    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        //console.log('post_item: { href: ' + a.href + ', hostname: ' + a.hostname + '}');
        return a.hostname;
    },
    commentsCount: function() {
        return this.commentsCount;
    },
    upvotedClass: function() {
        var userId = Meteor.userId();
        if (userId && !_.include(this.upvoters, userId)) {
            return 'btn-primary upvotable';
        } else {
            return 'disabled';
        }
    },
    navigateText: function() {
        var currentRouteName = Router.current().route.getName();

        if (currentRouteName === 'predictionPage' || currentRouteName === 'commentChain' || currentRouteName === 'commentThread')
            return 'Back';
        return 'Discuss';
    },
    needEdit: function() {
        const instance = Template.instance();
        var closeEditForm = Session.get('predictionItemCloseEditForm');
        if (closeEditForm && instance.state.get('editFormOpen')) {
            instance.state.set('editFormOpen', false);
            Session.set('predictionItemCloseEditForm', false);
        }
        return instance.state.get('editFormOpen');
    }
});

Template.predictionItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvotePost', this._id);
    },
    'click .next-path': function(e, instance) {
        e.preventDefault();

        var currentRouteName = Router.current().route.getName();
        console.log('jimvon currentRouteName: ' + currentRouteName);

        var lastPredictionsListPath = Session.get('lastPredictionsListPath');
        console.log('jimvon Session.lastPredictionsListPath: ' + lastPredictionsListPath);

        if (lastPredictionsListPath && lastPredictionsListPath !== '') {
            if (currentRouteName === 'predictionPage') {
                Router.go(lastPredictionsListPath);
                return;
            } else {
                Router.go(Router.routes.predictionPage.path({ _id: this._id }));
                return;
            }
        }

        var nextPath = '';
        if (Meteor.userId() && Meteor.userId() !== '') {
            if (currentRouteName === 'predictionPage') {
                if (Meteor.user().userContext && Meteor.user().userContext.lastPredictionsListPath !== '')
                    nextPath = Meteor.user().userContext.lastPredictionsListPath;
                else
                    nextPath = '/';
            } else
                nextPath = Router.routes.predictionPage.path({ _id: this._id });
        } else {
            if (currentRouteName === 'predictionPage') {
                    nextPath = '/';
            } else
                nextPath = Router.routes.predictionPage.path({ _id: this._id });
        }

        Router.go(nextPath);
    },
    'click .edit-toggle': function(e, instance) {
        instance.state.set('editFormOpen', !instance.state.get('editFormOpen'));
        e.preventDefault();
    },
    'click .delete-prediction': function(e, instance) {
        e.preventDefault();

        if (instance.data.userId != Meteor.userId()) {
            throwError('invalid user, delete denied!');
            return;
        } else if (instance.data.commentsCount !== 0) {
            throwError('can not delete a prediction that have children, delete denied!');
            return;
        }

        if (confirm("Delete this prediction?")) {
            var currentPredictionId = instance.data._id;
            Posts.remove(currentPredictionId);
            //Router.go('home');
        }
    }
});