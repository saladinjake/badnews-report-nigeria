import pool from '../models/database';

const validNameRegex = /^[A-Za-z]{3,30}$/;
const othernamesRegex = /^[a-zA-Z]'?([a-zA-Z]|\.| |-){3,}$/;
const usernameRegex = /^[A-Za-z0-9]{3,20}$/;
const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /^[A-Za-z0-9]{6,}$/;
const phoneNumberRegex = /^(\+?234|0)?[789]\d{9}$/;

export default class ValidateUsers {
  static checkIfUserExists(request, response, next) {
    const {
      email
    } = request.body;

    pool.query('SELECT * FROM users WHERE email = $1', [email])
      .then((result) => {
        const userExists = result.rows[0];
        if (userExists) {
          return response.status(409).json({
            status: 409,
            error: 'Email already exists'
          });
        }
        return next();
      }).catch(err => response.status(400).json({
        status: 400,
        error: 'Email or Username must be unique'
      }));
  }

  static validateSignUp(request, response, next) {
    const {
      firstname,
      lastname,
      othernames,
      username,
      email,
      phoneNumber,
      password
    } = request.body;
    if (!(firstname && firstname.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter your firstname'
      });
    }
    if (!validNameRegex.test(firstname)) {
      return response.status(422).json({
        status: 422,
        error: 'firstname must be between 3 and 30 characters only'
      });
    }
    if (!(lastname && lastname.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter your lastname'
      });
    }
    if (!validNameRegex.test(lastname)) {
      return response.status(422).json({
        status: 422,
        error: 'lastname must be between 3 and 30 characters only'
      });
    }

    if (!(othernames && othernames.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter your othernames'
      });
    }

    if (!othernamesRegex.test(othernames)) {
      return response.status(422).json({
        status: 422,
        error: 'othernames must be a minimum of 3 charcaters'
      });
    }

    if (!(username && username.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter your username'
      });
    }

    if (!usernameRegex.test(username)) {
      return response.status(422).json({
        status: 422,
        error: 'username must contain between 3 and 30 alphanumeric characters only'
      });
    }
    if (!(email && email.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter your email'
      });
    }

    if (!emailRegex.test(email)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter a valid email'
      });
    }

    if (!(phoneNumber && phoneNumber.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter your phone number'
      });
    }

    if (!phoneNumberRegex.test(phoneNumber)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter a valid phone number'
      });
    }

    if (!(password && password.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'Please enter your password'
      });
    }

    if (!passwordRegex.test(password)) {
      return response.status(422).json({
        status: 422,
        error: 'Password must be a minimum of 6 alphanumeric characters'
      });
    }


    return next();
  }

  static validateLogin(request, response, next) {
    const {
      email,
      password
    } = request.body;
    if (!(email && email.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'email is required'
      });
    }
    if (!(password && password.trim().length)) {
      return response.status(422).json({
        status: 422,
        error: 'password is required'
      });
    }
    return next();
  }
}