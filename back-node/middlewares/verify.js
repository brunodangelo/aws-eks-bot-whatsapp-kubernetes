  import jwt from "jsonwebtoken";
  export const verifyToken = async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).send('Unauhtorized Request 1 ');
      }
      let token = req.headers.authorization.split(' ')[1];
      if (token === 'null') {
        return res.status(401).send('Unauhtorized Request 2');
      }
  
      const payload = await jwt.verify(token, 'secretkey');
      if (!payload) {
        return res.status(401).send('Unauhtorized Request 3');
      }
      req.userId = payload._id;
      next();
    } catch(e) {
      console.log(e)
      return res.status(401).send('Unauhtorized Request 4');
    }
  }