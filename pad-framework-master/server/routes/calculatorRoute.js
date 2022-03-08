class calculatorRoute {
    #errorCodes = require("../framework/utils/httpErrorCodes")
    #app

    constructor(app) {
        this.#app = app;

        this.#getCalculator();
    }

    #getCalculator() {
        this.#app.get("/calculator/:operator/:firstNumber/:secondNumber", async (req, res) => {
            try {
                let calculationOperator;
                let result;

                if (req.params.operator === "plus") {
                    calculationOperator = "+";
                    result = parseInt(req.params.firstNumber) + parseInt(req.params.secondNumber);
                } else if (req.params.operator === "min") {
                    calculationOperator = "-";
                    result = parseInt(req.params.firstNumber) - parseInt(req.params.secondNumber);
                }

                res.status(this.#errorCodes.HTTP_OK_CODE).json([
                    "Calculator",
                    "Operator: " + calculationOperator,
                    "First number: " + req.params.firstNumber,
                    "Second number: " + req.params.secondNumber,
                    "Calculation: " +
                    req.params.firstNumber + " " + calculationOperator + " " + req.params.secondNumber + " = " + result
                ]);
            } catch (e) {
                res.status(this.#errorCodes.BAD_REQUEST_CODE).json({reason: e})
            }
        })
    }
}

module.exports = calculatorRoute
