const { connection } = require('./connector');
const { data } = require('./data');

var exports = module.exports = {};

exports.totalRec = async (req, res) => {
    try {
        const result = await connection.aggregate([
            {$group: {_id: "total", recovered: {$sum: "$recovered"}}}
        ])
        res.send({data: result});
    }
    catch(err) {
        res.send(err.message)
    }
}

exports.totalAct = async (req, res) => {
    try {
        const result = await connection.aggregate([
            {$group: {_id:"total", Active:{
                $sum: {
                    $subtract: ["$infected", "$recovered"]
                }
            }}}
        ])
        res.send({data: result})
    }
    catch(err) {
        res.send(err.message)
    }
}

exports.totalDeaths = async (req, res) => {
    try {
        const result = await connection.aggregate([
            {$group: {_id: "total", death: {$sum: "$death"}}}
        ])
        res.send({data: result})
    }
    catch (err) {
        res.send(err.message)
    }
}

exports.hotspots = async (req, res) => {
    try{
        const result = await connection.aggregate([
            {
              $addFields:{
                rate : {
                  $round : [
                      {
                        $divide : [
                            {
                            $subtract : ["$infected" , "$recovered"],
                            },"$infected"
                          ],
                      },
                      5,
                    ],
                }
              }
            },
            {
              $match : {rate : {$gt : 0.1}},
            },
            {
              $project : {
                _id : 0,
                state : 1,
                rate : 1
              }
            }
            ])
        res.send({data: result});
    }catch(err){
        res.send(err.message)
    }
}

exports.healthy = async (req, res) => {
    try{
        const result = await connection.aggregate([
            {
                $addFields : {
                    mortality : {
                        $round : [
                            {
                                $divide : [
                                    "$death" , "$infected"
                                ]
                            } , 5
                        ]
                    }
                }
            },{
                $match : {
                    mortality : {$lt : 0.05}
                }
            },{
                $project : {
                    _id : 0,
                    state : 1,
                    mortality : 1
                }
            }
        ])
        res.send({data: result});
    }catch(err){
        res.send(err.message)
    }
}