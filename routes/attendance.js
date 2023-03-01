const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});
// CLEARDB_DATABASE_URL: mysql://b0df48975a9c51:fdd76b05@us-cdbr-east-06.cleardb.net/heroku_3c4710e5697185a?reconnect=true
//JAWSDB_WHITE_URL:     mysql://j3arytr0j7mljqe2:j9p3r86yd49a53wh@en1ehf30yom7txe7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com:3306/p3vxnuwcemhdhu3s

console.log(process.env.host);

router.get("/allattendance", (req, res) => {
  const sql = "SELECT * FROM attendance";
  db.query(sql, (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

router.get("/employeeattendance/:id", (req, res) => {
  console.log("query: " + req.query.name);
  // console.log("params: " + req.params.id);
  const { id: employee_id } = req.params;

  const sql = `SELECT employees.name, employees.employee_id, clock_events.clock_in_time, clock_events.clock_out_time, clock_events.date, TIMESTAMPDIFF(SECOND, clock_events.clock_in_time, clock_events.clock_out_time) AS seconds_different
      FROM employees
      JOIN clock_events ON employees.employee_id = clock_events.employee_id
      WHERE employees.employee_id = ${employee_id}
      ORDER BY clock_in_time DESC`;
  db.query(sql, (err, data) => {
    console.log("Called");
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

router.post("/newuser", (req, res) => {
  const { employee_name, employee_id, employee_email, employee_role } =
    req.body;
  const sql =
    "INSERT INTO `employees` (`employee_name`, `employee_id`, `employee_email`, `employee_role`) VALUES (?)";
  const values = [employee_name, employee_id, employee_email, employee_role];

  db.query(sql, [values], (err, data) => {
    if (err) {
      return res.json(err);
    } else {
      return res.json(data);
    }
  });
});

router.post("/newclockinrecord", (req, res) => {
  const { employee_id } = req.body;
  // const q = "SELECT * FROM attendance";
  const checkIDSql = `SELECT name FROM employees
  WHERE employee_id = ${employee_id}`;
  db.query(checkIDSql, (err, name) => {
    if (err) {
      console.error(err);
      return;
    }
    if (name.length === 0) {
      return res.status(422).json({ error: "No employee found" });
    }
    const getSql = `SELECT clock_events.employee_id, clock_events.clock_in_status, clock_events.clock_in_time, employees.name
    FROM clock_events
    JOIN employees ON clock_events.employee_id = employees.employee_id
    WHERE clock_events.clock_out_status = 0 AND clock_events.employee_id = ?
    ORDER BY clock_in_time DESC
    LIMIT 1`;

    db.query(getSql, [employee_id], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(data);

      if (result.length === 1) {
        // console.log("The user has not clocked out yet");
        return res.status(422).json({ error: "You hadn't clocked out yet" });
      }
      // const getNameSql = `SELECT employees.name
      //   FROM employees
      //   WHERE employee_id = ?`;

      // db.query(getNameSql, [employee_id], (err, name) => {
      //   if (err) {
      //     return res.json(err);
      //   }
      const postSql =
        "INSERT INTO `clock_events` (`employee_id`, `clock_in_status`) VALUES (?)";
      const values = [employee_id, 1];
      console.log(result);

      db.query(postSql, [values], (err, data) => {
        if (err) {
          return res.json(err);
        } else {
          return res.json({ name: name, data: data });
        }
      });
      // });
    });
  });
});

router.put("/newclockoutrecord", (req, res) => {
  const { employee_id } = req.body;
  const checkIDSql = `SELECT name FROM employees
  WHERE employee_id = ${employee_id}`;
  db.query(checkIDSql, (err, name) => {
    if (err) {
      console.error(err);
      return;
    }
    if (name.length === 0) {
      return res.status(422).json({ error: "No employee found" });
    }
    const getSql = `SELECT clock_events.employee_id, clock_events.clock_in_status, clock_events.clock_in_time, employees.name
FROM clock_events
JOIN employees ON clock_events.employee_id = employees.employee_id
WHERE clock_events.clock_out_status = 0 AND clock_events.employee_id = ?
ORDER BY clock_in_time DESC
LIMIT 1`;

    db.query(getSql, [employee_id], (err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      // console.log(data);

      if (result.length === 0) {
        console.log("The user has not clocked in yet");
        return res.status(422).json({ error: "You hadn't clocked in yet" });
      }
      console.log(result);
      const putSql = `UPDATE clock_events SET clock_out_status = 1 WHERE ( employee_id = ? ) ORDER BY clock_in_time DESC
    LIMIT 1`;
      // console.log(req.body);

      db.query(putSql, [employee_id], (err, data) => {
        if (err) {
          return res.json(err);
        } else {
          return res.json({ name: name, data: data });
        }
      });
    });
  });

  // const sql = `UPDATE clock_events SET clock_out_status = 1 WHERE ( employee_id = ${employee_id})`;
  // // const values = [employee_id];

  // console.log(req.body);
  // console.log(typeof employee_id.toString());

  // db.query(sql, (err, data) => {
  //   if (err) {
  //     return res.json(err);
  //   } else {
  //     return res.json(data);
  //   }
  // });
});

module.exports = router;
