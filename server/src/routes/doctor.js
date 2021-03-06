const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const errorHelper = require('./../utils/error');

const authMiddleware = (req, res, next) => {
  const password = req.headers.authorization;
  console.log(password);
  if (password != 'qwertyuiop') {
    return next(errorHelper('unauth', 401, []));
  }
  next();
};

const jwtAuth = require('./../middleware/auth');

const {
  request,
  getRequests,
  approveRequest,
  disapproveRequest,
  addAppointment,
  getDoctors,
  getAppointments,
} = require('../controllers/doctor');

router.post(
  '/request',
  [
    body('name')
      .isLength({ min: 3 })
      .withMessage('Name should be at least 3 characters long'),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
      .toLowerCase(),
    body('phone')
      .isNumeric()
      .isLength({ min: 10, max: 10 })
      .withMessage('Please enter a valid phone number'),
    body('address')
      .isLength({ min: 10 })
      .withMessage('Please enter a valid address, at least 10 characters'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be of at least 8 characters'),
    body('confPassword').custom((value, { req }) => {
      if (value != req.body.password) {
        throw new Error('Passwords do not match');
      } else {
        return true;
      }
    }),
  ],
  request
);

router.get('/requests', getRequests);

router.post('/approve', authMiddleware, approveRequest);

router.post('/disapprove', authMiddleware, disapproveRequest);

router.get('/get', getDoctors);

router.post('/add', jwtAuth, addAppointment);

router.get('/appointments', jwtAuth, getAppointments);

module.exports = router;
