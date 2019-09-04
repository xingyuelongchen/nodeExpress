module.exports = function (req, res, config) {
    config.db((err, d) => {
        d.collection('test').find({}).toArray((err, doc) => {
            console.log(doc)
        })
    })
    res.send('asdsfdfsdfaf')
}