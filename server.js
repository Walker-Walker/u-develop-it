const db = require('./db/database');
const inputCheck = require("./utils/inputCheck");

const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

//Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

 //Create a Candidate
 const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
 VALUES (?,?,?,?)`;
const params = [1, "Ronald", "Firbank", 1];
//ES5 function, not arrow function, to use this
db.run(sql, params, function (err, result) {
if (err) {
console.log(err);
}
console.log(result, this.lastID);
});

// PUT Request Api Route for Updating information
app.put('/api/candidate/:id', (req, res) => {
  const errors = inputCheck(req.body, 'party_id');
  
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
  const params = [req.body.party_id, req.params.id];

  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }

    res.json({
      message: 'success',
      data: req.body,
      changes: this.changes
    });
  });
});



// Default response for any other request (Not Found) Catch all
app.use((req, res) => {
  res.status(404).end();
});

//Start Server after DB connection
//Connection function will start Express.js server on port 3001
db.on("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
