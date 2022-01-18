"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCursorOrCurrentPageArgNotGivenTogether = void 0;
var ErrorString;
(function (ErrorString) {
    ErrorString["CursorOrCurrentPageArgNotGivenTogether"] = "Cursor and CurrentPage argument should be given together.";
})(ErrorString || (ErrorString = {}));
const ErrorCursorOrCurrentPageArgNotGivenTogether = () => new Error(ErrorString.CursorOrCurrentPageArgNotGivenTogether);
exports.ErrorCursorOrCurrentPageArgNotGivenTogether = ErrorCursorOrCurrentPageArgNotGivenTogether;
//# sourceMappingURL=pageError.js.map