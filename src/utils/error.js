export default  async (req,res,next,behavior) => {
    try {
        await behavior(req,res,next)
    } catch (error) {
            //res.send(error)
    }
}