import { db } from "../connectMySQL.js";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id=?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {

    const q = "SELECT * FROM users WHERE (BINARY email = ? OR BINARY username = ?) AND id != ?";
    db.query(q, [req.body[0].email, req.body[0].username, req.body[1].id], (err, data) => {
      if (err) return res.json(err);
      if (data.length) return res.status(409).json("Такий користувач вже існує!")
    
      const values = [
        req.body[0].username,
        req.body[0].email,
        req.body[0].pref
      ];
    
      const q = `UPDATE users SET username = '${values[0]}', email = '${values[1]}', pref = '${values[2]}' WHERE id = '${req.body[1].id}';`;
  
      db.query(q, (err) => {
        if (err) console.log(err);
        return res.status(200).json("Дані користувача змінено!");
      });
    });
}