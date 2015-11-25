var passport = require("passport");
var Article = require("../../models/article");
var Comment = require("../../models/comment");
var User = require("../../models/user");
var Evernote = require('evernote').Evernote;
var enml = require('enml-js');

function getAllArticle(req,res){
  Article.find({}).populate('author').exec(function(err,articles){
    res.status(200).json({articles})
  })
}

function getOneArticle(req,res){
  Article.findOne({_id: req.params.article_id},function(err,article){
    if (err) throw err;
    Comment.find({article: req.params.article_id}).populate('by_user').sort({_id:-1}).exec(function(err,comments){
      if (err) throw err;
      res.status(200).json({article: article, time: article._id.getTimestamp(), comments: comments})
    })
  })
}

function deleteOneArticle(req,res){
  Article.findOne({_id: req.params.article_id},function(err,article){
    if (err) throw err;
    article.remove(function(err, deletedArticle){
      if (err) throw err;

      res.status(200).json({message:'successfully deleted'})
    })
  })
}

function postArticle(req,res){
  var newArticle = new Article();
  newArticle.title = req.body.title;
  newArticle.contentHTML = req.body.article;
  newArticle.tag = [req.body.tag];
  newArticle.author = req.user._id
  newArticle.save(function(err,article){
    if (err) throw err;

    res.status(200).json({message: 'successfully posted', redirect_id: req.user._id})
  })
}

function getUserDashboard(req,res){
  User.findById(req.params.user_id,function(err,user){
    Article.find({author:req.params.user_id},function(err,articles){
      res.status(200).json({articles: articles, user_id: req.params.user_id, user: user})
    })
  })
}

function postComment(req,res){
  var newComment = new Comment();
  newComment.content = req.body.comment.content;

  newComment.by_user = req.user._id;
  newComment.article = req.body.comment.article;

  User.findOne({_id: newComment.by_user},function(err,user){
    if (err) throw err;

    newComment.save(function(err, comment){
      if (err) throw err;

      res.status(200).json({ comment: comment, user: user })
    })
  })
}

function getOneNote(req,res){
  var client = new Evernote.Client({token: req.user.evernote.access_token});
  var noteStore = client.getNoteStore();

  noteStore.getNoteContent(req.params.guid,function(err,note){
    var noteHtml = enml.HTMLOfENML(note)
    res.status(200).json({noteHtml})
  })
}

module.exports = {
  getAllArticle:  getAllArticle,
  getOneArticle: getOneArticle,
  deleteOneArticle: deleteOneArticle,
  postArticle: postArticle,
  getUserDashboard: getUserDashboard,
  postComment: postComment,
  getOneNote: getOneNote
}