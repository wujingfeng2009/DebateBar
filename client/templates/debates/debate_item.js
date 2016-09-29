Template.debateItem.onCreated( function () {
    this.state = new ReactiveDict();
    this.state.setDefault({
    editFormOpen: false,
    commentFormOpen: false,
    });
});

Template.debateItem.helpers({
    needEdit: function() {
        if (this.commentsCount > 0)
            return false;
        return this.userId === Meteor.userId();
    },
    showEditForm: function() {
        const instance = Template.instance();
        var closeEditForm = Session.get('debateItemCloseEditForm');
        if (closeEditForm && instance.state.get('editFormOpen')) {
            instance.state.set('editFormOpen', false);
            Session.set('debateItemCloseEditForm', false);
        }
        return instance.state.get('editFormOpen');
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
    hasUrl: function() {
        if (this.url && this.url != '')
            return true;
        return false;
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

        if (currentRouteName === 'debatePage' || currentRouteName === 'commentChain' || currentRouteName === 'commentThread')
            return 'Back';
        return 'Debate';
    },
    positiveCount: function() {
        return this.positiveCount;
    },
    positiveStyles: function() {
        var total = this.positiveCount + this.negativeCount;
        if (total === 0)
            return 'width:' +  '50%; ' + 'background-color: rgba(0, 0, 0, 0);' + 'border-left: 1px solid blue; border-top: 1px solid blue; border-bottom: 1px solid blue;';

        var percentage = this.positiveCount * 100 / total;
        percentage = percentage.toFixed(0);
        console.log('jimvon in positiveStyles, positiveCount: ' + this.positiveCount + '. negativeCount: ' + this.negativeCount + '. percentage: ' + percentage);
        if (percentage === 0) {
            return 'width:' +  '3%; ' + 'background-color: purple;' + 'border: 1px solid purple;';
        }

        if (percentage >= 97)
            percentage = 97;
        if (percentage <= 3)
            percentage = 3;
        console.log('jimvon in positiveStyles, percentage: ' + percentage);
        return 'width:' + percentage + '%'  + '; border-left: 1px solid blue; border-top: 1px solid blue;  border-bottom: 1px solid blue;';
    },
    negativeCount: function() {
        return this.negativeCount;
    },
    negativeStyles: function() {
        var total = this.positiveCount + this.negativeCount;
        if (total === 0)
            return 'width:' +  '50%; ' + 'background-color: rgba(0, 0, 0, 0);' + 'border-right: 1px solid purple; border-top: 1px solid purple; border-bottom: 1px solid purple;';

        var percentage =  this.positiveCount * 100 / total;
        percentage = percentage.toFixed(0);
        console.log('jimvon in negativeStyles, positiveCount: ' + this.positiveCount + '. negativeCount: ' + this.negativeCount + '. percentage: ' + percentage);

        percentage = 100 - percentage; // calculate negative percentage from positive one directly.
        if (percentage === 0 ) {
            return 'width:' +  '3%; ' + 'background-color: blue;' + 'border: 1px solid blue;';
        }
        if (percentage >= 97)
            percentage = 97;
        if (percentage <= 3)
            percentage = 3;
        console.log('jimvon in negativeStyles, percentage: ' + percentage);
        return 'width:' + percentage + '%'  + '; border-right: 1px solid purple; border-top: 1px solid purple;  border-bottom: 1px solid purple;';
    },
});

Template.debateItem.events({
    'click .upvotable': function(e) {
        e.preventDefault();
        Meteor.call('upvotePost', this._id);
    },
    'click .next-path': function(e, instance) {
        e.preventDefault();

        var currentRouteName = Router.current().route.getName();
        console.log('jimvon currentRouteName: ' + currentRouteName);

        var lastDebatesListPath = Session.get('lastDebatesListPath');
        console.log('jimvon Session.lastDebatesListPath: ' + lastDebatesListPath);

        if (lastDebatesListPath && lastDebatesListPath !== '') {
            if (currentRouteName === 'debatePage') {
                Router.go(lastDebatesListPath);
                return;
            } else {
                Router.go(Router.routes.debatePage.path({ _id: this._id }));
                return;
            }
        }

        var nextPath = '';
        if (Meteor.userId() && Meteor.userId() !== '') {
            if (currentRouteName === 'debatePage') {
                if (Meteor.user().userContext && Meteor.user().userContext.lastDebatesListPath !== '')
                    nextPath = Meteor.user().userContext.lastDebatesListPath;
                else
                    nextPath = '/';
            } else
                nextPath = Router.routes.debatePage.path({ _id: this._id });
        } else {
            if (currentRouteName === 'debatePage') {
                    nextPath = '/';
            } else
                nextPath = Router.routes.debatePage.path({ _id: this._id });
        }

        Router.go(nextPath);
    },
    'click .edit-toggle': function(e, instance) {
        instance.state.set('editFormOpen', !instance.state.get('editFormOpen'));
        e.preventDefault();
    },
    'click .delete-debate': function(e, instance) {
        e.preventDefault();

        if (instance.data.userId != Meteor.userId()) {
            throwError('invalid user, delete denied!');
            return;
        } else if (instance.data.commentsCount !== 0) {
            throwError('can not delete a debate that have children, delete denied!');
            return;
        }

        if (confirm("Delete this debate?")) {
            var currentDebateId = instance.data._id;
            Posts.remove(currentDebateId);
            //Router.go('home');
        }
    }
});

/*
Template.debateItem.onRendered(function() {
    var positivePercentage = this.find('[name=positive-percentage]');
    var positiveCount = parseInt(this.data.positiveCount);
    if (isNaN(positiveCount)) {
        console.log('NaN value');
        return;
    }
    positivePercentage.innerHTML = '%' + positiveCount;
    console.log('jimvon in debateItem, positivePercentage: ' + positivePercentage.innerHTML);

    var negativePercentage = this.find('[name=negative-percentage]');
    var negativeCount = parseInt(this.data.negativeCount);
    if (isNaN(negativeCount)) {
        console.log('null value');
        return;
    }
    negativePercentage.innerText = '%' + this.data.negativeCount;
    console.log('jimvon in debateItem, negativePercentage: ' + negativePercentage.innerHTML);
});
*/