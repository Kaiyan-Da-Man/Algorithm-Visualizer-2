const fs = require("fs-extra");
fs.move("docs/browser", "docs", (err) => {
	if (err) return console.error(err);
});
