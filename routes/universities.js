const router = require('express').Router();
const University = require('../model/University');


var alfabe = "AaBbCcÇçDdEeFfGgĞğHhIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvWwXxYyZz0123456789";
function turkcesiralama(a, b) {
    if (a.length === 0 || b.length === 0) {
        return a.length - b.length;
    }
    for (var i = 0; i < a.length; i++) {
        var ai = alfabe.indexOf(a.substring(i, i + 1));
        var bi = alfabe.indexOf(b.substring(i, i + 1));
        if (ai !== bi) {
            return ai - bi;
        }
    }
}
var pluginArrayArg = new Array();

saveUniversity =async (name)=>{
    const university = new University({
        name: name
    });
   await university.save();
}

router.get('/',async (req, res) => {
    
    University.find({}, function(err, users) {
       
    
        res.send(users);  
      });

});

module.exports = router;