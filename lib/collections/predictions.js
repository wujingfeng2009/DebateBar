validatePrediction = function(prediction) {
    var errors = {};

    if (!prediction.title)
        errors.title = "请填写标题";
    if (!prediction.url)
        errors.url = "请填写 URL";

    return errors;
}