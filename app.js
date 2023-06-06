//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const Article = mongoose.model('Article', articleSchema);
app.route('/articles')
  .get(async (req, res) => {
    await Article.find({}).then((err, articles) => {
      if (err) res.send(err);
      res.send(articles)
    })
  })
  .post(async (req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    await newArticle.save().then(err => {
      if (err) res.send(err);
    });
  })
  .delete(async (req, res) => {
    await Article.deleteMany().then(err => {
      res.send(err);
    });
  });

app.route('/articles/:articleName')
  .get(async (req, res) => {
    await Article.findOne({title: req.params.articleName}).then(article => {
      res.send(article);
    })
  })
  .put(async (req, res) => {
    await Article.updateOne({title: req.params.articleName}, {title: req.body.title, content: req.body.content}, {overwrite: true}).then(err => {
      if(!err) res.send("Article updated successfully!");
    });
  })
  .patch(async (req, res) => {
await Article.updateOne({title: req.params.articleName}, {$set: req.body}).then(err => {
      if(!err) res.send("Article updated successfully!");
    });
  })
  .delete(async (req, res) => {
    await Article.deleteOne({title: req.params.articleName}).then(err => {
      if (!err) res.send("Article deleted successfully!");
    })
  })

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
