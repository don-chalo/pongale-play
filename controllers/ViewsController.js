module.exports = {
    index: function(req, res) {
        res.render('init', { title: 'AudioApp' });
    },
    help: function(req, res) {
        res.render('help');
    },
    metadata: function(req, res){
        res.render('metadata');
    },
    range: function(req, res){
        res.render('range');
    }
}
