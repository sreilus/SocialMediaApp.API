const router = require('express').Router();
const UniversityProgram = require('../model/UniversityProgram');
const fs = require('fs')

function turkcesiralama(a, b){
    var atitle = a.name;
    var btitle = b.name;
    var alfabe = "AaBbCcÇçDdEeFfGgĞğHhIıİiJjKkLlMmNnOoÖöPpQqRrSsŞşTtUuÜüVvWwXxYyZz0123456789";
    if (atitle.length === 0 || btitle.length === 0) {
        return atitle.length - btitle.length;
    }
    for(var i=0;i<atitle.length && i<btitle.length;i++){
        var ai = alfabe.indexOf(atitle[i]);
        var bi = alfabe.indexOf(btitle[i]);
        if (ai !== bi) {
            return ai - bi;
        }
    }
} 

const saveUniversity = async (name) => {
    const university = new UniversityProgram({
        name: name
    });
    await university.save();
}

router.get('/', async (req, res) => {
    console.log('girdiUni')
    // fs.readFile('D:\\Bolumler.txt', (err, data) => {
    //     if (err) throw err;

    //     let lines =data.toString().split('\n');
    //     for (let line = 0; line < lines.length; line++) {
    //         console.log(lines[line]);
    //         saveUniversity(lines[line]);
    //     }
    // })

    
});

router.get('/programs',async (req,res)=>{
    UniversityProgram.find({},"name", function(err, programs) {
        programs.sort(turkcesiralama);
        res.send(programs);  
      });
});

module.exports = router;