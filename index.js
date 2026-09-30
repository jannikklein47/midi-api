const express = require("express");
const { exec } = require("child_process");

// receive post request on /pc with a query as number
const app = express();
app.get("/pc", (req, res) => {
  const n = Number(req.query.n).toString(16).padStart(2, "0");

  const command = `aseqsend -p 14:0 "C0 ${n}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`success`);
  });

  res.send("ok");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
