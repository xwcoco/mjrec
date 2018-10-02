'use strict'
const friendsData = require('./friendsData');
const gamesData = require('./gamesData');

exports.apiIndex = function (app) {
   app.get('/api/getFriends', function(req, res) {
     friendsData.readFriendsList(res);
  });
   app.post('/api/addFriend',function (req,res) {
    friendsData.addFriend(req,res);
   });
  app.post('/api/deleteFriend',function (req,res) {
    friendsData.deleteFriend(req,res);
  });
  app.get('/api/getGames',function (req,res) {
    gamesData.readGamesList(res);
  })
  app.post('/api/addGame',function (req,res) {
    gamesData.addGame(req,res);
  })
  app.post('/api/deleteGame',function (req,res) {
    gamesData.deleteGame(req,res);
  })
  app.post('/api/getGameDetail',function (req,res) {
    gamesData.getGameDetail(req,res);
  })

  app.post('/api/getPersonGames',function (req,res) {
    friendsData.getPersonGames(req,res);
  })

  app.post('/api/getPersonSummery',function (req,res) {
    gamesData.getPersonSummery(req,res);
  })

  app.post('/api/login',function (req,res) {
    friendsData.loginUser(req,res);
  })

  app.post('/api/getPersonMonthGame',function (req,res) {
    gamesData.getPersonMonthGame(req,res);
  })
  app.post('/api/getPersonMonthDetailGame',function (req,res) {
    gamesData.getPersonMonthDetailGame(req,res);
  })

  app.post('/api/getGamesLimit',function (req,res) {
    gamesData.readGamesListByLimit(req,res);
  })







}
