Template.postEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        console.log('posts submit, currentPostId: ' + currentPostId + ', postProperties: {url: ' + postProperties.url + ', title: ' + postProperties.title + '}');
/*
        Posts.update(currentPostId, {$set: postProperties }, function(error) {
            if (error) {
                // 向用户显示错误信息
                return throwError(error.reason);
            } else {
                Router.go('postPage', { _id: currentPostId });
            }
        });
*/
        Meteor.call('postUpdate', currentPostId, postProperties, function(error, result) {
            // 显示错误信息并退出
            if (error)
                return throwError(error.reason);
            // 显示结果，跳转页面
            if (result.postIdNotExists)
                throwError('current PostId[' + currentPostId +  '] does not exist!');
            else if (result.updateNotAllowed) {
                throwError('current user is not allowed to update current post[' + currentPostId +  ']!');
            }

            Router.go('postsList');
        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            if (this.userId != Meteor.userId()) {
              throwError('invalid user, delete denied!');
              return;
            }

            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('postsList');
        }
    }
});