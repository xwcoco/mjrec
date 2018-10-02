const AppDAO = require('./dao');
const querystring = require('querystring');
const PostApiBase = require('./PostApiBase');

exports.readFriendsList = function (res) {
  let db = new AppDAO();

  let sql = 'SELECT \n' +
    '       [a].[id], \n' +
    '       [a].[name], \n' +
    '       [c].[score]\n' +
    'FROM   [users] [a]\n' +
    '       INNER JOIN (SELECT \n' +
    '               [b].[userid], \n' +
    '               SUM ([score]) AS [score]\n' +
    '        FROM   [gamelist] [b]\n' +
    '        GROUP  BY [b].[userid]) c ON [a].[id] = [c].[userid]\n' +
    'ORDER  BY [a].[id];';

  db.all(sql)
    .then((rows) => {
      res.json({ data: rows });

    });
};

exports.addFriend = function (req, res) {
  var body = '';
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {

    console.log(body);
    let data = JSON.parse(body);

    var db = new AppDAO();


    if (data.id == -1) {
      db.all('select max(id) as id from users')
        .then((rows) => {
          let rec = rows[0];
          let id = parseInt(rec.id);
          id = id + 1;

          db.all('insert into users (id,name,score) values (?,?,0)', [id, data.name])
            .then((rows) => {
              console.log(rows);
              res.json({ error: 0, msg: '朋友增加成功' });
            });
        });
    }
    else {

      db.all('update users set name = ? where id = ?', [data.name, data.id])
        .then((rows) => {
          res.json({ error: 0, msg: '姓名修改成功' });
        });
    }
  });
};

exports.deleteFriend = function (req, res) {
  var body = '';
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {

    console.log(body);
    let data = JSON.parse(body);

    const db = new AppDAO();

    db.all('delete from users where id = ?', [data.id])
      .then(response => {

        res.json({ error: 0, msg: '朋友删除成功' });
      }),err =>{
      res.json({ error: 2, msg: err });
    };

  });
};

exports.getPersonGames = function (req,res) {
  const t = new PostApiBase(req,res);

  t.run(function(para) {
    let db = new AppDAO();
    let id = para.id;

    let sql = 'SELECT \n' +
      '       [a].[id], \n' +
      '       [a].[name], \n' +
      '       [a].[score], \n' +
      '       [c].[gamedate]\n' +
      'FROM   [gamelist] [a]\n' +
      '       INNER JOIN (SELECT \n' +
      '               [b].[id], \n' +
      '               [b].[gamedate]\n' +
      '        FROM   [games] [b]) c ON [a].[id] = [c].[id]\n' +
      'WHERE  [a].[userid] = ?\n' +
      'ORDER  BY [c].[gamedate] desc;'

    db.all(sql,[id]).then((rows) => {
      res.json({ error: 0, data: rows });
    })
  });
}

exports.loginUser = function (req,res) {
  const t = new PostApiBase(req,res);

  t.run(function(para) {
    if ((para.username == 'xuwei') && (para.password=="xxh080418")) {
      res.json({error: 0});
    } else {
      res.json({error: 1});
    }
  });

}
