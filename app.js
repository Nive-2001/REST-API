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

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);
//////////////////////////////////////////Articles route//////////////////////////
app.route("/articles").get(function(req, res) {
        Article.find({}, function(err, foundarticle) {
            if (!err) {
                res.send(foundarticle);
            } else {
                res.send(err);
            }

        });
    })
    .post(function(req, res) {


        const newarticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newarticle.save(function(err) {
            if (!err) {
                res.send("succesfully added new article");
            } else {
                res.send(err);
            }
        });

    })
    .delete(function(req, res) {
        Article.deleteMany(function(err) {
            if (!err) {
                res.send("successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

/////////////////////////////////////////////////////////articles/:userId/////////

app.route("/articles/:articleTitle")
    .get(function(req, res) {
        Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was not found");
            }
        })
    })
    .put(function(req, res) {
        Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true },
            function(err) {
                if (err) {
                    res.send(req.body.title);
                } else {
                    res.send("successfully updaed article.");
                }
            }
        );
    })
    .patch(function(req, res) {


        Article.update({ title: req.params.articleTitle }, { $set: req.body }, function(err) {
            if (!err) {
                res.send("sucess");
            } else {
                res.send(err);
            }
        });
    })
    .delete(function(req, res) {
        Article.deleteOne({ title: req.params.articleTitle }, function(err) {
            if (!err) {
                res.send("succesfully deleted the article");
            } else {
                res.send("error occured");
            }
        })
    });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});