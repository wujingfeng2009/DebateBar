validateTopic = function(post) {
    var errors = {};

    if (!post.title)
        errors.title = "请填写标题";
    if (!post.url)
        errors.url = "请填写 URL";

    return errors;
}