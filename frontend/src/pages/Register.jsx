import React from 'react'
import './Register.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export default function Register() {
  const navigate = useNavigate();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      userType: 'user',
    }
  });

  const onSubmit = async (data) => {
    try {
      // console.log("Submitting form:", data);

      await axios.post("http://localhost:3000/api/auth/register", {
        email: data.email,
        fullName: { // agar data galat bheja to error ata hae bad requeste se naam se 
          firstName: data.firstName,
          lastName: data.lastName
        },
        password: data.password,
        role: data.userType
      }, {
        withCredentials: true
      });

      navigate('/');
    } catch (err) {
      console.log("Error during registration:", err.response.data);
      alert(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card surface">
        <h2 className="register-title">Create your account</h2>
        <p className="text-muted" style={{ marginTop: 'var(--space-1)' }}>
          Join us to get started
        </p>

        <button
          onClick={() => {
            window.location.href = 'http://localhost:3000/api/auth/google';
          }}
          type="button"
          className="btn btn-google"
          aria-label="Continue with Google"
        >
          <span className="btn-google-icon" aria-hidden>G</span>
          Continue with Google
        </button>

        <div className="divider" role="separator" aria-label="or continue with email">
          <span className="divider-line" />
          <span className="divider-text">or</span>
          <span className="divider-line" />
        </div>

        <form className="register-form stack" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}
          </div>

          {/* First & Last Name */}
          <div className="field-row">
            <div className="field-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                placeholder="Jane"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && <p className="error">{errors.firstName.message}</p>}
            </div>

            <div className="field-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && <p className="error">{errors.lastName.message}</p>}
            </div>
          </div>

          {/* Account Type */}
          <fieldset className="field-group fieldset-radio">
            <legend className="legend">Account type</legend>
            <div className="radio-row">
              <label className="radio-option">
                <input
                  type="radio"
                  value="user"
                  {...register('userType')}
                />
                <span>User</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="artist"
                  {...register('userType')}
                />
                <span>Artist</span>
              </label>
            </div>
          </fieldset>

          {/* Password */}
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}
            <p className="hint text-muted">Minimum 8 characters.</p>
          </div>

          <button type="submit" className="btn btn-primary" aria-label="Create account">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
