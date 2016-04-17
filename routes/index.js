exports.index = function (req, res) {
    req.session.puzzle = req.session.puzzle || req.app.get('puzzle');
    res.render('index', {
        title: 'Mastermind',
        max: 0,
        size: 5,
        dim: 9
    });
};

exports.play = function (req, res) {
    var newGame = function () {
    var i, data = [],
        puzzle = req.session.puzzle;

    if(puzzle.size == 0)
        puzzle.size = 5;

    if(puzzle.dim == 0)
        puzzle.dim = 5;

    for (i = 0; i < puzzle.size; i += 1) {
            data.push(Math.floor(Math.random() * puzzle.dim));
        }

    req.session.puzzle.data = data;
    console.log("Drawn: " + data);
    req.session.game = { "whiteDot" : 0, "blackDot" : 0, "attempts" : 0};

    return {
        "retMsg": "Game Started!",
        "retSize": puzzle.size
    };
};

    req.session.puzzle.size = 5;
    req.session.puzzle.dim = 9;
    req.session.puzzle.max = 0;
   
    if (req.params[2]) 
        req.session.puzzle.size = req.params[2];
    if (req.params[4]) 
        req.session.puzzle.dim = req.params[4];
    if (req.params[6]) 
        req.session.puzzle.max = req.params[6];
    

    res.json(newGame());
};

exports.mark = function (req, res) {
    var markAnswer = function () {
        var move = req.params[0].split('/');
        move = move.slice(0, move.length - 1);
        console.log(move);
        
        req.session.game.attempts = req.session.game.attempts + 1;
        var score = " ",
            win = false, fail = false, whiteDot = 0, blackDot = 0;
        
        var data = req.session.puzzle.data;
  
        var _ = require("underscore");
        var ileS = _.countBy(move, (num) => num);
        var ileG = _.countBy(data, (num) => num);
        var blackDot = _.size(_.filter(_.zip(move, data), (a) => parseInt(a[0]) === a[1] ));
        var min = _.map(_.map(ileS, (val, key) => (val < ileG[key] ? val : ileG[key])),(val, key) => (val === undefined ? 0 : val));
        var whiteDot = _.reduce(min, (memo, num) => memo + num, 0) - blackDot;
        
        console.log(blackDot, whiteDot);
        
        var victory = "CONGRATUALTIONS, WE GOT A WINNER!",
            loose = "YOU LOOSE, TRY AGAIN";
         
        if(blackDot == req.session.puzzle.size){
            score = victory;
            win = true;
        }
        else if(req.session.game.attempts >= req.session.puzzle.max && req.session.puzzle.max != 0){
            score = loose;
            fail = true;
        }
           

        req.session.game.blackDot = blackDot;
        req.session.game.whiteDot = whiteDot;
        
        return {
            "retVal": { "dots": { "whiteDot": whiteDot, "blackDot": blackDot },"attempts" : req.session.game.attempts, "win": win,  'fail' : fail},
            "retMsg": score
        };
    };

 res.json(markAnswer());
};


