// GET /authors
// En otro controlador ya que es ajeno al ámbito de la aplicación
exports.authors = function(req, res) {
   res.render('authors', {autor: 'Magdalena Báscones Carrillo', foto: '<img src="/images//mhada.png" alt="autor" height="90" width="70">', errors: []});
 };