var express = require('express');
var apiRouter = express.Router();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require("passport");
var apiController = require('../controllers/api/article');

apiRouter.route('/api/articles')
  .get(apiController.getAllArticle)

apiRouter.route('/api/article')
  .get(authenticatedUser,apiController.getNewArticle)
  .post(authenticatedUser,apiController.postArticle)

apiRouter.route('/api/article/:article_id')
  .get(apiController.getOneArticle)
  .put(apiController.updateArticle)
  .delete(apiController.deleteOneArticle)

apiRouter.route('/api/article/:article_id/edit')
  .get(apiController.getOneArticle)

apiRouter.route('/api/user/:user_id')
  .get(apiController.getUserDashboard)

apiRouter.route('/api/comment')
  .post(commentable, apiController.postComment)

apiRouter.route('/api/comment/:commend_id')
  .delete(apiController.deleteComment)

apiRouter.route('/api/notebooks')
  .get(authenticatedUser, apiController.getNotebookList)

apiRouter.route('/api/notebooks/:guid')
  .get(authenticatedUser, apiController.getNotesMeta)

apiRouter.route('/api/guid/:guid')
  .get(authenticatedUser, apiController.getOneNote)

function authenticatedUser(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

function commentable(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(400).json({message: 'cannot leave comment'})
}
module.exports = apiRouter