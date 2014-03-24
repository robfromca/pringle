
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.mingle = function(req, res) {
    res.render('index', {title: 'Mingle'} );
}
