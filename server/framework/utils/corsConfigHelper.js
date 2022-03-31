/**
 * Returns security config for CORS, for now all requests are supported across domains
 * Never use this for non-educational purposes!
 *
 * @author Pim Meijer
 */

const errorCodes = require("./httpErrorCodes")

function corsConfigHelper(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers"
    );

    //some more complex requests will do an "OPTIONS" request first
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "HEAD, PUT, POST, PATCH, DELETE, GET");
        return res.status(errorCodes.HTTP_OK_CODE).json({});
    }

    //call next to continue the request flow -
    next();
}

module.exports = corsConfigHelper;