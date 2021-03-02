const testMapper= require('../dataMapper/testmapper')

const testController = {

getOne : (req,res)=>{
    const id = req.body.id
    const result = testMapper.findOne(id)
    res.json(result);
}
};

module.exports = testController;