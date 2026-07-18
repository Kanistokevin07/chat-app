"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
