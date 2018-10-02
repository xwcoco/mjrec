const AppDAO = require('./dao');
const PostApiBase = require('./PostApiBase');


exports.readGamesList = function (res) {
  const db = new AppDAO();
  db.all('select * from games order by gamedate desc')
    .then((rows) => {
      res.json({data: rows});

    });
};

getWinItem = function (items) {
  let maxItem = items[0];
  items.forEach((gamedata) => {
    if (parseInt(gamedata.score) > parseInt(maxItem.score)) {
      maxItem = gamedata;
    }
  });
  return maxItem.name + " " + maxItem.score;
}

getLostItem = function (items) {
  let maxItem = items[0];
  items.forEach((gamedata) => {
    if (parseInt(gamedata.score) < parseInt(maxItem.score)) {
      maxItem = gamedata;

    }
  });
  return maxItem.name + " " + maxItem.score;
}

exports.addGame = function (req, res) {

  const t = new PostApiBase(req, res);

  t.run(function (para) {
    let db = new AppDAO();

    if (para.id == -1) {
      db.all('select max(id) as id from games')
        .then((rows) => {
          let rec = rows[0];
          let id = 0;
          if (rec.id != null) {
            id = parseInt(rec.id);
          }
          console.log("add game");
          console.log(rec);
          console.log(id);

          id = id + 1;

          let maxItem = getWinItem(para.users);
          let minItem = getLostItem(para.users);

          db.all('insert into games (id,gamedate,win,lost) values (?,?,?,?)', [id, para.date, maxItem, minItem])
            .then((rows) => {

              para.users.forEach((item) => {
                console.log(item);
                db.all('insert into gamelist (id,userid,name,score) values (?,?,?,?)', [id, item.userid, item.name, item.score]);
              });

              res.json({error: 0, msg: '结果保存成功'});
            });
        });
    }

  });

};

exports.deleteGame = function (req, res) {
  const t = new PostApiBase(req, res);

  t.run(function (para) {
    let db = new AppDAO();
    let id = para.id;
    db.all('delete from gamelist where id = ?', [id]);
    db.all('delete from games where id = ?', [id]).then((rows) => {
      res.json({error: 0, msg: '记录删除成功'});
    })
  });
}

exports.getGameDetail = function (req, res) {
  const t = new PostApiBase(req, res);

  t.run(function (para) {
    let db = new AppDAO();
    let id = para.id;
    db.all('select * from gamelist where id = ?', [id]).then((rows) => {
      res.json({error: 0, data: rows});
    }), err => {
      res.json({error: 1, data: err});
    }
  });

}

exports.getPersonSummery = function (req, res) {
  const t = new PostApiBase(req, res);

  t.run(function (para) {
    let db = new AppDAO();
    let id = para.id;
    let sql = 'SELECT *\n' +
      'FROM   ((SELECT SUM ([score]) AS [score]\n' +
      '         FROM   [gamelist]\n' +
      '         WHERE  [userid] = ?)\n' +
      '        INNER JOIN (SELECT COUNT (*) AS [allnum]\n' +
      '         FROM   [gamelist]\n' +
      '         WHERE  [gamelist].[userid] = ?))\n' +
      '       INNER JOIN (SELECT COUNT (*) AS [win]\n' +
      '        FROM   [gamelist]\n' +
      '        WHERE  [gamelist].[userid] = ?\n' +
      '               AND [gamelist].[score] > 0);';

    let retObj = {};
    retObj.all_score = 0;
    db.all(sql, [id, id, id]).then((rows) => {
      let rec = rows[0];
      if (rec.score != null) {
        retObj.all_score = rec.score;
      }
      retObj.all_num = rec.allnum;
      retObj.all_winnum = rec.win;

      sql = 'SELECT *\n' +
        'FROM   ((SELECT SUM ([a].[score]) AS [score]\n' +
        '         FROM   [gamelist] [a],\n' +
        '                [games] [b]\n' +
        '         WHERE  [a].[id] = [b].[id]\n' +
        '                AND [b].[gamedate] >= DATE (\'now\', \'start of month\')\n' +
        '                AND [a].[userid] = ?)\n' +
        '        INNER JOIN (SELECT COUNT (*) AS [allnum]\n' +
        '         FROM   [gamelist] [a],\n' +
        '                [games] [b]\n' +
        '         WHERE  [a].[id] = [b].[id]\n' +
        '                AND [b].[gamedate] >= DATE (\'now\', \'start of month\')\n' +
        '                AND [a].[userid] = ?))\n' +
        '       INNER JOIN (SELECT COUNT (*) AS [win]\n' +
        '        FROM   [gamelist] [a],\n' +
        '               [games] [b]\n' +
        '        WHERE  [a].[id] = [b].[id]\n' +
        '               AND [b].[gamedate] >= DATE (\'now\', \'start of month\')\n' +
        '               AND [a].[userid] = ?\n' +
        '               AND [a].[score] > 0);';

      db.all(sql, [id, id, id]).then((rows) => {
        let rec = rows[0];
        if (rec.score != null) {
          retObj.mon_score = rec.score;
        } else {
          retObj.mon_score = 0;
        }
        retObj.mon_num = rec.allnum;
        retObj.mon_winnum = rec.win;

        sql = 'SELECT *\n' +
          'FROM   ((SELECT SUM ([a].[score]) AS [score]\n' +
          '         FROM   [gamelist] [a],\n' +
          '                [games] [b]\n' +
          '         WHERE  [a].[id] = [b].[id]\n' +
          '                AND [b].[gamedate] >= DATE (\'now\', \'start of month\', \'-1 months\')\n' +
          '                AND [b].[gamedate] < DATE (\'now\', \'start of month\')\n' +
          '                AND [a].[userid] = ?)\n' +
          '        INNER JOIN (SELECT COUNT (*) AS [allnum]\n' +
          '         FROM   [gamelist] [a],\n' +
          '                [games] [b]\n' +
          '         WHERE  [a].[id] = [b].[id]\n' +
          '                AND [b].[gamedate] >= DATE (\'now\', \'start of month\', \'-1 months\')\n' +
          '                AND [b].[gamedate] < DATE (\'now\', \'start of month\')\n' +
          '                AND [a].[userid] = ?))\n' +
          '       INNER JOIN (SELECT COUNT (*) AS [win]\n' +
          '        FROM   [gamelist] [a],\n' +
          '               [games] [b]\n' +
          '        WHERE  [a].[id] = [b].[id]\n' +
          '               AND [b].[gamedate] >= DATE (\'now\', \'start of month\', \'-1 months\')\n' +
          '               AND [b].[gamedate] < DATE (\'now\', \'start of month\')\n' +
          '               AND [a].[userid] = ?\n' +
          '               AND [a].[score] > 0)';

        db.all(sql, [id, id, id]).then((rows) => {
          let rec = rows[0];
          if (rec.score != null) {
            retObj.lastmon_score = rec.score;
          } else {
            retObj.lastmon_score = 0;
          }
          retObj.lastmon_num = rec.allnum;
          retObj.lastmon_winnum = rec.win;

          res.json({error: 0, data: retObj});
        })
      })
    });
  });

}

exports.getPersonMonthGame = function (req, res) {
  const t = new PostApiBase(req, res);

  t.run(function (para) {
    let db = new AppDAO();
    let id = para.id;

    let sql = 'SELECT DISTINCT \n' +
      '                (STRFTIME (\'%Y年%m月\', [a].[gamedate])) AS [gamedate], \n' +
      '                (STRFTIME (\'%Y\', [a].[gamedate])) AS [gyear], \n' +
      '                (STRFTIME (\'%m\', [a].[gamedate])) AS [gmonth]\n' +
      'FROM   [games] [a],\n' +
      '       [gamelist] [b]\n' +
      'WHERE  [a].[id] = [b].[id]\n' +
      '       AND [b].[userid] = ?\n' +
      'ORDER  BY [a].[gamedate] desc;\n';

    let ret = [];

    db.all(sql, [id]).then((rows) => {

      let myPromises = [];

      let foreachfun = function (item) {
        return new Promise((resolve, reject) => {
          console.log("promise log");
          console.log(item);
          let tmpsql = 'select \n' +
            'sum(a.score) as score\n' +
            ' \n' +
            'from gamelist a,games b\n' +
            'where a.id = b.id\n' +
            'and b.gamedate >= date(\'' +
            item.gyear + '-'+item.gmonth+ '-01\') and b.gamedate < date(\'' +
            item.gyear + '-'+item.gmonth+'-01\',\'+1 months\') \n' +
            'and a.userid = ?\n';

          let tmpdb = new AppDAO();

          tmpdb.all(tmpsql, [id]).then((datas) => {
            let obj = {};
            obj.yearmonth = item.gamedate;
            obj.year = item.gyear;
            obj.month = item.gmonth;
            obj.score = datas[0].score;
            ret.push(obj);
            resolve({obj})
          }, err => {
            reject(err);
          });
        });
      };

      rows.forEach((item) => {
        let tmpPromise = foreachfun(item);
        myPromises.push(tmpPromise);
      });


      Promise.all(myPromises).then(result => {

        let index = 0;
        ret.forEach((item) => {
          item.id = index;
          index = index + 1;
        })
        res.json({error: 0, data: ret});
      });
    });

  })
}

exports.getPersonMonthDetailGame = function (req, res) {
  const t = new PostApiBase(req, res);

  t.run(function (para) {
    let db = new AppDAO();

    let sql = 'select \n' +
      'a.id,a.score,b.gamedate\n' +
      ' \n' +
      'from gamelist a,games b\n' +
      'where a.id = b.id\n' +
      'and b.gamedate >= date(\'' +
      para.year + '-'+para.month + '-01\') and b.gamedate < date(\'' +
      para.year + '-'+para.month + '-01\',\'+1 months\') \n' +
      'and a.userid = ?\n' +
      'order by b.gamedate desc\n';

    console.log(sql);

    db.all(sql,[para.userid]).then((rows) => {
      res.json({error:0,data:rows});
    },err => {
      res.json({error:1,data:err});
    })
  });
}


exports.readGamesListByLimit = function (req,res) {
  const t = new PostApiBase(req, res);

  t.run(function (para) {
    const db = new AppDAO();
    db.all('select * from games order by gamedate desc limit ? offset ?',[para.limit,para.offset])
      .then((rows) => {
        res.json({data: rows});
      });
  });
};
