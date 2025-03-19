exports.badRequest = (err, req, res, next) => {
  // 400 errors
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};

exports.miscErrors = (err, req, res, next) => {
  // 404 errors
  if (err === "Article does not exist" || err.code === "22003") {
    res.status(404).send({ msg: "Article does not exist" });
  } else if (err.code === "23503" && err.detail.includes("article_id")) {
    res.status(404).send({ msg: "Article does not exist" });
  } else if (err.code === "23503" && err.detail.includes("author")) {
    res.status(404).send({ msg: "Username does not exist" });
  } else if (err.status === 404 && err.msg === "Invalid Input") {
    res.status(err.status).send({ msg: err.msg });
  } else if (err === "User not found") {
    res.status(404).send({ msg: "User not found" });
  } else if (err === "Comment not found") {
    res.status(404).send({ msg: "Comment not found" });
  } else if (err.code === "23503" && err.detail.includes("topic")) {
    res.status(404).send({ msg: "Topic not found" });
  } else next(err);
};

exports.custErrors = (err, req, res, next) => {
  // custom error & 500 error handler
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    console.log(err, "<------ err");
    res.status(500).send({ msg: "Server Error!" });
  }
};
