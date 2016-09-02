if (Posts.find().count() === 0) {
    var now = new Date().getTime();

    // create two users
    var tomId = Meteor.users.insert({
        profile: { name: 'Tom Coleman' }
    });
    var tom = Meteor.users.findOne(tomId);
    var sachaId = Meteor.users.insert({
        profile: { name: 'Sacha Greif' }
    });
    var sacha = Meteor.users.findOne(sachaId);

    var telescopeId = Posts.insert({
        title: 'Introducing Telescope',
        userId: sacha._id,
        author: sacha.profile.name,
        url: 'http://sachagreif.com/introducing-telescope/',
        submitted: new Date(now - 7 * 3600 * 1000),
        commentsCount: 14,
        upvoters: [],
        votes: 0
    });

    Comments.insert({
        chainHeadId: '',
        parentId: '',
        postType: 0, // topic, debate, prediction and bet
        postId: telescopeId,
        side: 0, // left or right
        childCount: 0,
        childTotal: 0,
        userId: tom._id,
        author: tom.profile.name,
        submitted: new Date(now - 5 * 3600 * 1000),
        body: 'What is Telescope?'
    });

    var telescopeComHeadId = Comments.insert({
        chainHeadId: '',
        parentId: '',
        postType: 0,
        postId: telescopeId,
        side: 0,
        childCount: 3,
        childTotal: 12,
        userId: tom._id,
        author: tom.profile.name,
        submitted: new Date(now - 5 * 3600 * 1000),
        body: 'Interesting project Sacha, can I get involved?'
    });

    var telescopeComId1_1 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComHeadId,
        postType: 0,
        postId: telescopeId,
        side: 1,
        childCount: 3,
        childTotal: 3,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'sure! you can get involved at anytime!'
    });

    var telescopeComId1_2 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComHeadId,
        postType: 0,
        postId: telescopeId,
        side: 1,
        childCount: 3,
        childTotal: 6,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'if you are interested in this project, you can visit our website and learn more!'
    });

    var telescopeComId1_3 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComHeadId,
        postType: 0,
        postId: telescopeId,
        side: 1,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'You sure can Tom!'
    });

    var telescopeComId1_1_1 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_1,
        postType: 0,
        postId: telescopeId,
        side: 0,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'are you sure? at anytime!'
    });

    var telescopeComId1_1_2 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_1,
        postType: 0,
        postId: telescopeId,
        side: 0,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'but i can not get involed right now!'
    });

    var telescopeComId1_1_3 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_1,
        postType: 0,
        postId: telescopeId,
        side: 0,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'me to! can not get involved!'
    });

    var telescopeComId1_2_1 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_2,
        postType: 0,
        postId: telescopeId,
        side: 0,
        childCount: 3,
        childTotal: 3,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'yes, I am interested!'
    });

    var telescopeComId1_2_2 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_2,
        postType: 0,
        postId: telescopeId,
        side: 0,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'I am interested, too, but I can not access your website!'
    });

    var telescopeComId1_2_3 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_2,
        postType: 0,
        postId: telescopeId,
        side: 0,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'can you givet me the website address?'
    });

    var telescopeComId1_2_1_1 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_2_1,
        postType: 0,
        postId: telescopeId,
        side: 1,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'get interested is not enough!'
    });

    var telescopeComId1_2_1_2 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_2_1,
        postType: 0,
        postId: telescopeId,
        side: 1,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'you should dig deep!'
    });

    var telescopeComId1_2_1_3 = Comments.insert({
        chainHeadId: telescopeComHeadId,
        parentId: telescopeComId1_2_1,
        postType: 0,
        postId: telescopeId,
        side: 1,
        childCount: 0,
        childTotal: 0,
        userId: sacha._id,
        author: sacha.profile.name,
        submitted: new Date(now - 3 * 3600 * 1000),
        body: 'and turn your interest to action!'
    });

    Posts.insert({
        title: 'Meteor',
        userId: tom._id,
        author: tom.profile.name,
        url: 'http://meteor.com',
        submitted: new Date(now - 10 * 3600 * 1000),
        commentsCount: 0,
        upvoters: [],
        votes: 0
    });

    Posts.insert({
        title: 'The Meteor Book',
        userId: tom._id,
        author: tom.profile.name,
        url: 'http://themeteorbook.com',
        submitted: new Date(now - 12 * 3600 * 1000),
        commentsCount: 0,
        upvoters: [],
        votes: 0
    });

    for (var i = 0; i < 10; i++) {
        Posts.insert({
            title: 'Test post #' + i,
            author: sacha.profile.name,
            userId: sacha._id,
            url: 'http://google.com/?q=test-' + i,
            submitted: new Date(now - i * 3600 * 1000),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });
    }

    for (var i = 0; i < 10; i++) {
        Debates.insert({
            title: 'Test debate #' + i,
            author: sacha.profile.name,
            userId: sacha._id,
            url: 'http://google.com/?q=test-' + i,
            submitted: new Date(now - i * 3600 * 1000),
            commentsCount: 0,
            upvoters: [],
            votes: 0
        });
    }
}