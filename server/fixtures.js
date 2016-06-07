if (Posts.find().count() === 0) {
    Posts.insert({
        title: 'Introducing Telescope',
        url: 'http://sachagreif.com/introducing-telescope/',
        flagged: false,
        _id: "JimVon"
    });

    Posts.insert({
        title: 'Meteor',
        url: 'http://meteor.com',
        flagged: false,
        _id: "SteveJobs"
    });

    Posts.insert({
        title: 'The Meteor Book',
        url: 'http://themeteorbook.com',
        flagged: false,
        _id: "ElonMusk"
    });

    Posts.insert({
        title: 'google',
        url: 'http://www.google.com',
        flagged: false,
        _id: "BillGates"
    });

    Posts.insert({
        title: 'the pirate bay',
        url: 'http://thepiratebay.vg',
        flagged: true,
        _id: "Obama"
    });
}