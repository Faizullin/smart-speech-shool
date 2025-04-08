import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../../redux/store/reducers/authSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import PrimaryButton from './PrimaryButton';
import TextInput from './TextInput';
import InputError from './InputError';
import InputLabel from '../../InputLabel';
import { ILoginProps } from '../../../models/IAuthUser';
import { FormattedMessage, useIntl } from 'react-intl';

export interface ILoginFormProps {}

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { errors, loading } = useAppSelector(state => state.auth);
  const [data, setData] = React.useState<ILoginProps>({
    email: '',
    password: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData(state => ({
      ...state,
      [name]: value,
    } as Pick<ILoginProps, keyof ILoginProps>));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginUser(data)).then(response => {
      if (response.type === loginUser.fulfilled.toString()) {
        navigate('/article');
      }
    });
  };

  return (
      <div className="bg-white  max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner mb-4">
            <div className="mb-4">
              <InputLabel
                htmlFor="email"
                value={intl.formatMessage({ id: 'app.auth.email.label' })}
              />
              <TextInput
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                autoComplete="email"
                isFocused={true}
                onChange={handleInputChange}
              />
              <InputError message={errors.email} className="mt-2" />
            </div>
            <div>
              <InputLabel
                htmlFor="password"
                value={intl.formatMessage({ id: 'app.auth.password.label' })}
              />
              <TextInput
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full"
                autoComplete="current-password"
                onChange={handleInputChange}
              />
              <InputError message={errors.password} className="mt-2" />
            </div>
          </div>

          <PrimaryButton className="w-full font-semibold py-2 rounded mb-2 transition" processing={loading}>
            <FormattedMessage id="app.auth.login.submit.label" />
          </PrimaryButton>

          <PrimaryButton
            onClick={() => {navigate("/face_id/login")}}
            className="font-semibold py-2 rounded mb-4 transition"
          >
            <FormattedMessage id="app.auth.login.via_face_id.label" />
          </PrimaryButton>

          <div className="flex justify-between mt-2 text-sm text-blue-700 font-semibold">
            <Link to="/auth/register">
              <FormattedMessage id="app.auth.login.create_account.label" />
            </Link>
            <Link to="/auth/forgot_password">
              <FormattedMessage id="app.auth.login.forgot_password.label" />
            </Link>
          </div>

          <InputError message={errors.detail} className="my-4" />
        </form>
      </div>
  );
}
