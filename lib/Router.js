Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
    waitOn: function() {
        if (Meteor.userId() && Meteor.userId() !== '') {
            console.log('jimvon subscribe userContext!');
            Meteor.subscribe('Meteor.users.userContext', Meteor.userId());
        }
        return Meteor.subscribe('notifications');
    }
});

TopicsListController = RouteController.extend({
    template: 'topicsList',
    increment: 5,
    topicsLimit: function() {
        return parseInt(this.params.topicsLimit) || this.increment;
    },
    findOptions: function() {
        return { sort: this.sort, limit: this.topicsLimit() };
    },
    subscriptions: function() {
        this.topicsSub = Meteor.subscribe('topics', this.findOptions());
    },
    topics: function() {
        return Posts.find({ postType: 0 }, this.findOptions());
    },
    data: function() {
        /* In order to trace user context data, we use Session to store it. but if user refreshes a page, the Session
             will be reset, all context will be lost. so we use a costom user.userContext to persistantly store
             user context data. 
             there are another case: user is not logged in, we have no user and its userContext to store the context
             data. in this case, we can only just route to '/'.
        */
        var currentPath = Router.current().url;
        console.log('jimvon currentPath: ' + currentPath + ', id: ' + Meteor.userId());
        Session.set('lastTopicsListPath', currentPath);
        if (Meteor.userId() && Meteor.userId() !== '') {
            console.log('jimvon update lastTopicsListPath: ' + currentPath);
            Meteor.users.update(Meteor.userId(), {$set: {userContext: { lastTopicsListPath: currentPath }}});
        }

        var hasMore = this.topics().count() === this.topicsLimit();
        return {
            topics: this.topics(),
            ready: this.topicsSub.ready,
            nextRouterPath: hasMore ? this.nextPath() : null
        };
    }
});

NewTopicsController = TopicsListController.extend({
    sort: { submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.newTopics.path({ topicsLimit: this.topicsLimit() + this.increment });
    }
});

HotTopicsController = TopicsListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.hotTopics.path({ topicsLimit: this.topicsLimit() + this.increment });
    }
});

FavoriteTopicsController = TopicsListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.favoriteTopics.path({ topicsLimit: this.topicsLimit() + this.increment });
    }
});

Router.route('/', { name: 'home', controller: NewTopicsController });
Router.route('/newTopics/:topicsLimit?', { name: 'newTopics' });
Router.route('/hotTopics/:topicsLimit?', { name: 'hotTopics' });
Router.route('/favoriteTopics/:topicsLimit?', { name: 'favoriteTopics' });

Router.route('/topics/:_id', {
    name: 'topicPage',
    waitOn: function() {
        return [
            Meteor.subscribe('singleTopic', this.params._id),
            Meteor.subscribe('postComments', this.params._id)
        ];
    },
    data: function() {
        var post = Posts.findOne(this.params._id);
        //if (post.postType !== 0)
            //throw new Meteor.Error('posts-error', 'topic with a wrong posttype!');
        return post;
    }
});

CommentChainController = RouteController.extend({
    template: 'commentChain',
    subscriptions: function() {
        //this.singleCommentSub = Meteor.subscribe('singleComment', this.params._id);
        this.commentChainSub = Meteor.subscribe('commentsTree', this.params._id);
        this.commentPostSub = Meteor.subscribe('commentPost', this.params._id);
    },
    data: function() {
        return {
            chainComment: Comments.findOne(this.params._id),
        }
    }
});
Router.route('/commentChain/:_id?', { name: 'commentChain' });

CommentThreadController = RouteController.extend({
    template: 'commentThread',
    subscriptions: function() {
        this.commentThreadSub = Meteor.subscribe('commentsTree', this.params._id);
        this.commentPostSub = Meteor.subscribe('commentPost', this.params._id);
    },
    data: function() {
        return {
            threadComment: Comments.findOne(this.params._id),
        }
    }
});
Router.route('/posts/commentThread/:_id?', { name: 'commentThread' });

var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
            this.render(this.loadingTemplate);
        } else {
            this.render('accessDenied');
        }
    } else {
        this.next();
    }
}

Router.onBeforeAction('dataNotFound', { only: 'topicPage' });
Router.onBeforeAction(requireLogin, { only: 'topicSubmit' });

/* for debates */
DebatesListController = RouteController.extend({
    template: 'debatesList',
    increment: 5,
    debatesLimit: function() {
        return parseInt(this.params.debatesLimit) || this.increment;
    },
    findOptions: function() {
        return { sort: this.sort, limit: this.debatesLimit() };
    },
    subscriptions: function() {
        this.debatesSub = Meteor.subscribe('debates', this.findOptions());
    },
    debates: function() {
        return Posts.find({ postType: 1 }, this.findOptions());
    },
    data: function() {
        /* In order to trace user context data, we use Session to store it. but if user refreshes a page, the Session
             will be reset, all context will be lost. so we use a costom user.userContext to persistantly store
             user context data. 
             there are another case: user is not logged in, we have no user and its userContext to store the context
             data. in this case, we can only just route to '/'.
        */
        var currentPath = Router.current().url;
        console.log('jimvon currentPath: ' + currentPath + ', id: ' + Meteor.userId());
        Session.set('lastDebatesListPath', currentPath);
        if (Meteor.userId() && Meteor.userId() !== '') {
            console.log('jimvon update lastDebatesListPath: ' + currentPath);
            Meteor.users.update(Meteor.userId(), {$set: {userContext: { lastDebatesListPath: currentPath }}});
        }

        var hasMore = this.debates().count() === this.debatesLimit();
        return {
            debates: this.debates(),
            ready: this.debatesSub.ready,
            nextRouterPath: hasMore ? this.nextPath() : null
        };
    }
});

NewDebatesController = DebatesListController.extend({
    sort: { submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.newDebates.path({ debatesLimit: this.debatesLimit() + this.increment });
    }
});

HotDebatesController = DebatesListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.hotDebates.path({ debatesLimit: this.debatesLimit() + this.increment });
    }
});

FavoriteDebatesController = DebatesListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.favoriteDebates.path({ debatesLimit: this.debatesLimit() + this.increment });
    }
});

Router.route('/newDebates/:debatesLimit?', { name: 'newDebates' });
Router.route('/hotDebates/:debatesLimit?', { name: 'hotDebates' });
Router.route('/favoriteDebates/:debatesLimit?', { name: 'favoriteDebates' });

Router.route('/debates/:_id', {
    name: 'debatePage',
    waitOn: function() {
        return [
            Meteor.subscribe('singleDebate', this.params._id),
            Meteor.subscribe('postComments', this.params._id)
        ];
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});


/* for predictions */
PredictionsListController = RouteController.extend({
    template: 'predictionsList',
    increment: 5,
    predictionsLimit: function() {
        return parseInt(this.params.predictionsLimit) || this.increment;
    },
    findOptions: function() {
        return { sort: this.sort, limit: this.predictionsLimit() };
    },
    subscriptions: function() {
        this.predictionsSub = Meteor.subscribe('predictions', this.findOptions());
    },
    predictions: function() {
        return Posts.find({ postType: 2 }, this.findOptions());
    },
    data: function() {
        /* In order to trace user context data, we use Session to store it. but if user refreshes a page, the Session
             will be reset, all context will be lost. so we use a costom user.userContext to persistantly store
             user context data. 
             there are another case: user is not logged in, we have no user and its userContext to store the context
             data. in this case, we can only just route to '/'.
        */
        var currentPath = Router.current().url;
        console.log('jimvon currentPath: ' + currentPath + ', id: ' + Meteor.userId());
        Session.set('lastPredictionsListPath', currentPath);
        if (Meteor.userId() && Meteor.userId() !== '') {
            console.log('jimvon update lastPredictionsListPath: ' + currentPath);
            Meteor.users.update(Meteor.userId(), {$set: {userContext: { lastPredictionsListPath: currentPath }}});
        }

        var hasMore = this.predictions().count() === this.predictionsLimit();
        return {
            predictions: this.predictions(),
            ready: this.predictionsSub.ready,
            nextRouterPath: hasMore ? this.nextPath() : null
        };
    }
});

NewPredictionsController = PredictionsListController.extend({
    sort: { submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.newPredictions.path({ predictionsLimit: this.predictionsLimit() + this.increment });
    }
});

HotPredictionsController = PredictionsListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.hotPredictions.path({ predictionsLimit: this.predictionsLimit() + this.increment });
    }
});

FavoritePredictionsController = PredictionsListController.extend({
    sort: { votes: -1, submitted: -1, _id: -1 },
    nextPath: function() {
        return Router.routes.favoritePredictions.path({ predictionsLimit: this.predictionsLimit() + this.increment });
    }
});

Router.route('/newPredictions/:predictionsLimit?', { name: 'newPredictions' });
Router.route('/hotPredictions/:predictionsLimit?', { name: 'hotPredictions' });
Router.route('/favoritePredictions/:predictionsLimit?', { name: 'favoritePredictions' });

Router.route('/predictions/:_id', {
    name: 'predictionPage',
    waitOn: function() {
        return [
            Meteor.subscribe('singlePrediction', this.params._id),
            Meteor.subscribe('postComments', this.params._id)
        ];
    },
    data: function() {
        return Posts.findOne(this.params._id);
    }
});