/**
 * This class contains ExpressJS routes specific for uploading a file. This is an example to use.
 * this file is automatically loaded in app.js
 * multer is used for parsing formdata
 * @author Pim Meijer
 */

class UploadFileRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #multer = require("multer");
    #app

    /**
     * @param app - ExpressJS instance(web application) we get passed automatically via app.js
     * Important: always make sure there is an app parameter in your constructor!
     */
    constructor(app) {
        this.#app = app;
        this.#uploadFile()
    }

    /**
     * Example route for uploading files
     * @private
     */
    #uploadFile() {
        this.#app.post("/upload", this.#multer().single("sampleFile"), (req, res) => {

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: "No files were uploaded."});
            }

            //get file by key "sampleFile", defined in front-end
            const sampleFile = req.files.sampleFile;

            //TODO: you should make file name dynamic otherwise it will overwrite each time :)
            sampleFile.mv(wwwrootPath + "/uploads/test.jpg", (err) => {
                if (err) {
                    console.log(err)
                    return res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: err});
                }

                return res.status(this.#errorCodes.HTTP_OK_CODE).json("File successfully uploaded!");

            });
        });
    }
}

module.exports = UploadFileRoute