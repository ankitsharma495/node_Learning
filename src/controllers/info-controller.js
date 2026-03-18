const info = (req,res)=>{
    return res.json({
        success: true,
        message : 'api is working',
        error: {},
        data: {}
    })
}

module.exports = {
    info
}